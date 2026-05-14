import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Clock, Truck, XCircle, ArrowLeft, ShoppingBag, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ShowUserOrders = () => {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const accessToken = localStorage.getItem('accessToken');
        const res = await axios.get(
          `http://localhost:8000/api/v1/order/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setOrders(res.data.orders || []);
      } catch (err) {
        console.error('Failed to load user orders:', err);
        setError('Unable to fetch orders for this user.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const renderStatusIcon = (status) => {
    if (status === 'delivered') return <CheckCircle className='w-5 h-5 text-green-500' />;
    if (status === 'shipped') return <Truck className='w-5 h-5 text-blue-500' />;
    if (status === 'processing') return <Clock className='w-5 h-5 text-yellow-500' />;
    if (status === 'cancelled') return <XCircle className='w-5 h-5 text-red-500' />;
    return <Clock className='w-5 h-5 text-gray-500' />;
  };

  const renderPaymentBadge = (paymentStatus) => {
    const statusText = paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1);
    const classes =
      paymentStatus === 'paid'
        ? 'bg-green-100 text-green-800'
        : paymentStatus === 'failed'
        ? 'bg-red-100 text-red-800'
        : 'bg-yellow-100 text-yellow-800';

    return <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${classes}`}><CreditCard className='w-4 h-4' />{statusText}</span>;
  };

  return (
    <div className='py-20 mx-auto px-4' style={{ paddingLeft: 350 }}>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold'>User Orders</h1>
          <p className='text-gray-600 mt-2'>Review all orders placed by this user.</p>
        </div>
        <Link to='/dashboard/users'>
          <Button variant='outline'>
            <ArrowLeft className='mr-2 h-4 w-4' /> Back to Users
          </Button>
        </Link>
      </div>

      {loading && <p className='text-gray-600'>Loading orders...</p>}
      {error && <p className='text-red-600'>{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className='rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center'>
          <ShoppingBag className='mx-auto mb-4 h-12 w-12 text-pink-600' />
          <h2 className='text-xl font-semibold'>No orders found for this user.</h2>
          <p className='mt-2 text-gray-600'>This user has not placed any orders yet.</p>
        </div>
      )}

      <div className='grid gap-6'>
        {orders.map((order) => (
          <div key={order._id} className='rounded-3xl border border-gray-200 bg-pink-50 p-6 shadow-sm'>
            <div className='flex flex-wrap items-center justify-between gap-4'>
              <div>
                <h2 className='text-xl font-semibold'>Order #{order._id.slice(-6).toUpperCase()}</h2>
                <p className='text-sm text-gray-600'>Created at: {new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className='flex flex-wrap gap-2'>
                {renderPaymentBadge(order.paymentStatus)}
                <span className='inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm'>
                  {renderStatusIcon(order.status)}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            <div className='mt-6 grid gap-4 sm:grid-cols-2'>
              <div className='rounded-3xl bg-white p-4 shadow-sm'>
                <p className='text-sm text-gray-500'>Total Price</p>
                <p className='mt-2 text-lg font-semibold'>₹{order.totalPrice.toFixed(2)}</p>
                <p className='mt-1 text-sm text-gray-600'>Items: {order.items.length}</p>
              </div>
              <div className='rounded-3xl bg-white p-4 shadow-sm'>
                <p className='text-sm text-gray-500'>Shipping Address</p>
                <p className='mt-2 text-gray-700'>{order.shippingAddress.fullName}</p>
                <p className='text-gray-600'>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                <p className='text-gray-600'>{order.shippingAddress.state} - {order.shippingAddress.zip}</p>
                <p className='text-gray-600'>{order.shippingAddress.country}</p>
              </div>
            </div>

            <div className='mt-6 rounded-3xl bg-white p-4 shadow-sm'>
              <h3 className='text-lg font-semibold mb-3'>Products</h3>
              <div className='space-y-3'>
                {order.items.map((item) => (
                  <div key={item.productId} className='flex items-center gap-4 rounded-2xl border border-gray-200 p-3'>
                    <img src={item.productImg || 'https://via.placeholder.com/80'} alt={item.productName} className='h-16 w-16 rounded-2xl object-cover' />
                    <div className='flex-1'>
                      <p className='font-medium'>{item.productName}</p>
                      <p className='text-sm text-gray-500'>Qty: {item.quantity}</p>
                    </div>
                    <p className='text-sm font-semibold'>₹{item.productPrice.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowUserOrders;
