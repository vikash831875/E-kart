import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock, Truck, XCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

const statusMeta = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  processing: { label: "Processing", color: "bg-blue-100 text-blue-800" },
  shipped: { label: "Shipped", color: "bg-indigo-100 text-indigo-800" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

const paymentMeta = {
  paid: { label: "Paid", color: "bg-green-100 text-green-800" },
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  failed: { label: "Failed", color: "bg-red-100 text-red-800" },
};

const renderStatusIcon = (status) => {
  if (status === "delivered") return <CheckCircle className="h-5 w-5" />;
  if (status === "shipped") return <Truck className="h-5 w-5" />;
  if (status === "processing") return <Clock className="h-5 w-5" />;
  if (status === "cancelled") return <XCircle className="h-5 w-5" />;
  return <Clock className="h-5 w-5" />;
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusSelection, setStatusSelection] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    setError("");

    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get(`http://localhost:8000/api/v1/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data.success) {
        setOrder(res.data.order);
        setStatusSelection(res.data.order.status);
      } else {
        setError(res.data.message || "Order not found.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load order details. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  const updateStatus = async () => {
    if (!statusSelection || !order) return;
    setUpdating(true);

    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.put(
        `http://localhost:8000/api/v1/order/${orderId}/status`,
        { status: statusSelection },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="py-20 min-h-screen bg-gray-100" style={{ paddingLeft: 350 }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Order Detail</h1>
            <p className="text-gray-600">Review and manage the selected order.</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="h-8 w-1/3 rounded bg-gray-200" />
            <div className="h-64 rounded bg-gray-200" />
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
        ) : order ? (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="mt-3 text-xl font-semibold">#{order._id.slice(-8).toUpperCase()}</p>
                <p className="mt-2 text-sm text-gray-500">Created {new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Customer</p>
                <p className="mt-3 text-lg font-semibold">{order.userId?.firstName} {order.userId?.lastName}</p>
                <p className="text-sm text-gray-500">{order.userId?.email}</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Total</p>
                <p className="mt-3 text-3xl font-semibold">₹{order.totalPrice.toFixed(2)}</p>
                <p className="mt-2 text-sm text-gray-500">{order.items.length} items</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <span className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${paymentMeta[order.paymentStatus]?.color || "bg-gray-100 text-gray-800"}`}>
                      <CreditCard className="h-4 w-4" /> {paymentMeta[order.paymentStatus]?.label || order.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Status</p>
                    <span className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${statusMeta[order.status]?.color || "bg-gray-100 text-gray-800"}`}>
                      {renderStatusIcon(order.status)} {statusMeta[order.status]?.label || order.status}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Shipping Address</p>
                    <p className="mt-2 text-gray-900">{order.shippingAddress.fullName}</p>
                    <p className="text-sm text-gray-600">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                    <p className="text-sm text-gray-600">{order.shippingAddress.state} {order.shippingAddress.zip}</p>
                    <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="mt-2 text-gray-700">{order.shippingAddress.email}</p>
                    <p className="text-gray-700">{order.shippingAddress.phone}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Update Order Status</p>
                <div className="mt-4 flex flex-col gap-4">
                  <select
                    value={statusSelection}
                    onChange={(e) => setStatusSelection(e.target.value)}
                    className="w-full rounded-3xl border border-gray-300 bg-white px-4 py-3 outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <Button onClick={updateStatus} disabled={updating || statusSelection === order.status}>
                    {updating ? "Saving..." : "Save Status"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Ordered Products</h2>
              <div className="mt-5 space-y-4">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <img src={item.productImg || "https://via.placeholder.com/100"} alt={item.productName} className="h-20 w-20 rounded-3xl object-cover" />
                      <div>
                        <p className="font-semibold text-slate-900">{item.productName}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="mt-1 text-lg font-semibold">₹{item.productPrice.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OrderDetail;
