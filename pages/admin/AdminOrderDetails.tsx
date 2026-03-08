import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Truck, CreditCard } from 'lucide-react';
import AdminLayout from './AdminLayout';

const AdminOrderDetails: React.FC<{ user: any }> = ({ user }) => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deliverLoading, setDeliverLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${id}`, { withCredentials: true });
        setOrder(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const deliverHandler = async () => {
    setDeliverLoading(true);
    try {
      await axios.put(`/api/orders/${id}/deliver`, {}, { withCredentials: true });
      const { data } = await axios.get(`/api/orders/${id}`, { withCredentials: true });
      setOrder(data);
    } catch (err: any) {
      alert(err.response?.data?.message);
    } finally {
      setDeliverLoading(false);
    }
  };

  const payHandler = async () => {
    if (window.confirm('Mark as paid manually?')) {
      try {
        await axios.put(`/api/orders/${id}/pay`, { status: 'COMPLETED', update_time: Date.now() }, { withCredentials: true });
        const { data } = await axios.get(`/api/orders/${id}`, { withCredentials: true });
        setOrder(data);
      } catch (err: any) {
        alert(err.response?.data?.message);
      }
    }
  };

  if (loading)
    return (
      <AdminLayout user={user}>
        <div className="flex items-center justify-center h-64">
          <div className="w-7 h-7 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );

  if (error)
    return (
      <AdminLayout user={user}>
        <div className="text-red-600 bg-red-50 p-4 rounded-xl border border-red-200 text-sm">{error}</div>
      </AdminLayout>
    );

  return (
    <AdminLayout user={user}>
      <Link to="/admin/orders" className="text-slate-400 hover:text-slate-700 mb-6 inline-flex items-center text-sm font-medium transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Order Details</h1>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">#{order._id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.orderItems.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-4">
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg border border-slate-100" />
                    <div>
                      <p className="text-[13px] font-semibold text-slate-800">{item.name}</p>
                      <p className="text-[12px] text-slate-400">{item.qty} x ${item.price} = <span className="font-semibold text-slate-600">${(item.qty * item.price).toFixed(2)}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Shipping</h3>
            <div className="space-y-1.5 text-[13px] text-slate-600">
              <p><span className="font-semibold text-slate-700">Name:</span> {order.user?.name || 'Guest'}</p>
              <p><span className="font-semibold text-slate-700">Email:</span> {order.user?.email || order.shippingAddress.email}</p>
              <p><span className="font-semibold text-slate-700">Address:</span> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
            </div>
            <div className={`mt-4 px-3 py-2 rounded-lg text-[12px] font-bold ${order.isDelivered ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : 'Not Delivered'}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Payment</h3>
            <p className="text-[13px] text-slate-600"><span className="font-semibold text-slate-700">Method:</span> {order.paymentMethod}</p>
            <div className={`mt-4 px-3 py-2 rounded-lg text-[12px] font-bold ${order.isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
              {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Not Paid'}
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 sticky top-24">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Order Summary</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between text-[13px] text-slate-500">
                <span>Items</span>
                <span className="font-semibold text-slate-700">${order.itemsPrice}</span>
              </div>
              <div className="flex justify-between text-[13px] text-slate-500">
                <span>Shipping</span>
                <span className="font-semibold text-slate-700">${order.shippingPrice}</span>
              </div>
              <div className="flex justify-between text-[13px] text-slate-500">
                <span>Tax</span>
                <span className="font-semibold text-slate-700">${order.taxPrice}</span>
              </div>
            </div>
            <div className="border-t border-slate-100 my-4 pt-4 flex justify-between font-bold text-slate-900">
              <span>Total</span>
              <span className="text-lg">${order.totalPrice}</span>
            </div>

            <div className="space-y-3 mt-6">
              {!order.isPaid && (
                <button
                  onClick={payHandler}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Mark As Paid
                </button>
              )}
              {!order.isDelivered && (
                <button
                  onClick={deliverHandler}
                  disabled={deliverLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <Truck className="w-4 h-4 mr-2" />
                  {deliverLoading ? 'Processing...' : 'Mark As Delivered'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderDetails;
