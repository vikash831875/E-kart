import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Clock, Truck, XCircle, Search, CreditCard } from "lucide-react";

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

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusSelection, setStatusSelection] = useState({});
  const [updating, setUpdating] = useState({});
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get("http://localhost:8000/api/v1/order/all", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data.success) {
        setOrders(res.data.orders || []);
      } else {
        setError(res.data.message || "Unable to fetch orders");
      }
    } catch (err) {
      setError("Unable to fetch admin orders. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (orderId, selectedStatus) => {
    setStatusSelection((prev) => ({
      ...prev,
      [orderId]: selectedStatus,
    }));
  };

  const updateStatus = async (orderId) => {
    const nextStatus = statusSelection[orderId];
    if (!nextStatus) return;

    setUpdating((prev) => ({ ...prev, [orderId]: true }));

    try {
      const res = await axios.put(
        `http://localhost:8000/api/v1/order/${orderId}/status`,
        { status: nextStatus },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: res.data.order.status } : order
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase();
    const userName = `${order.userId?.firstName || ""} ${order.userId?.lastName || ""}`.toLowerCase();
    const userEmail = order.userId?.email?.toLowerCase() || "";
    return (
      order._id.toLowerCase().includes(query) ||
      userName.includes(query) ||
      userEmail.includes(query) ||
      order.status.toLowerCase().includes(query) ||
      order.paymentStatus.toLowerCase().includes(query)
    );
  });

  return (
    <div className="py-20 pr-20 min-h-screen bg-gray-100" style={{ paddingLeft: 350 }}>
      <div className="flex flex-col gap-4 mb-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-gray-600 max-w-2xl">
            View, filter, and update orders placed by customers. Use the search bar to find orders by ID,
            customer name, email, status, or payment status.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-[420px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 outline-none"
            />
          </div>
          <div className="text-sm text-gray-600">
            {loading
              ? "Loading orders..."
              : `${filteredOrders.length} of ${orders.length} orders shown`}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {!loading && filteredOrders.length === 0 && (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-xl font-semibold text-gray-700">No orders match your search.</p>
          <p className="text-gray-500 mt-2">Try a different order ID, customer name, or status.</p>
        </div>
      )}

      <div className="grid gap-6">
        {(loading ? Array.from({ length: 3 }) : filteredOrders).map((order, index) =>
          loading ? (
            <div
              key={`loading-${index}`}
              className="animate-pulse rounded-3xl border border-gray-200 bg-white p-6"
            >
              <div className="h-6 w-[30%] rounded bg-gray-200 mb-4" />
              <div className="h-4 w-[70%] rounded bg-gray-200 mb-2" />
              <div className="h-4 w-[60%] rounded bg-gray-200 mt-2" />
            </div>
          ) : (
            <div key={order._id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-500">Order</span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-lg font-semibold text-slate-900">{order.userId?.firstName} {order.userId?.lastName}</div>
                  <div className="text-sm text-gray-500">{order.userId?.email}</div>
                </div>

                <div className="grid gap-2 text-right">
                  <span className="text-sm text-gray-500">Created</span>
                  <span className="font-semibold text-slate-900">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="mt-2 text-2xl font-semibold">₹{order.totalPrice.toFixed(2)}</p>
                  <p className="mt-1 text-sm text-gray-500">{order.items.length} items</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-gray-500">Payment status</p>
                  <span className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${paymentMeta[order.paymentStatus]?.color || "bg-gray-100 text-gray-800"}`}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    {paymentMeta[order.paymentStatus]?.label || order.paymentStatus}
                  </span>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-gray-500">Order status</p>
                  <span className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusMeta[order.status]?.color || "bg-gray-100 text-gray-800"}`}>
                    {statusMeta[order.status]?.label || order.status}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-gray-500">Shipping address</p>
                  <p className="mt-3 text-sm text-slate-900">{order.shippingAddress.fullName}</p>
                  <p className="text-sm text-gray-600">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                  <p className="text-sm text-gray-600">{order.shippingAddress.state} {order.shippingAddress.zip}</p>
                  <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
                </div>

                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-gray-500">Update status</p>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <select
                      value={statusSelection[order._id] || order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <Button
                      className="min-w-[140px]"
                      onClick={() => updateStatus(order._id)}
                      disabled={updating[order._id] || statusSelection[order._id] === order.status}
                    >
                      {updating[order._id] ? "Saving..." : "Save status"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500">Order detail</p>
                  <p className="font-semibold text-slate-900">Full order page</p>
                </div>
                <Link to={`/dashboard/orders/detail/${order._id}`} className="inline-flex items-center justify-center rounded-3xl bg-pink-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-pink-700">
                  View detail
                </Link>
              </div>

              <div className="mt-6 rounded-3xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Products</h3>
                  <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                    <ArrowRight className="h-4 w-4" />
                    {order.items.length}
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4">
                      <img
                        src={item.productImg || "https://via.placeholder.com/96"}
                        alt={item.productName}
                        className="h-16 w-16 rounded-2xl object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{item.productName}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">₹{item.productPrice.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AdminOrder;
