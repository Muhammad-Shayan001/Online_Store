import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Order, OrderStatus } from '../types';
import { OrderService } from '../services/api'; 
import { generateInvoiceHTML } from '../services/invoice';
import toast from 'react-hot-toast';

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (id) {
          const data = await OrderService.getOrderById(id);
          setOrder(data);
        }
      } catch (error) {
        toast.error('Failed to load order.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading order details...</div>;
  if (!order) return <div className="text-center py-20">Order not found.</div>;

  const handleDownloadInvoice = () => {
    if (!order) return;
    const invoiceHTML = generateInvoiceHTML(order);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(invoiceHTML);
        printWindow.document.close();
    } else {
      toast.error("Please allow popups to download the invoice.");
    }
  };

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
        try {
            if (_id) {
                await OrderService.cancelOrder(_id);
                toast.success('Order cancelled successfully');
                const data = await OrderService.getOrderById(_id);
                setOrder(data);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to cancel order');
        }
    }
  };

  const { 
    _id, invoiceNumber, createdAt, status, 
    orderItems, items, itemsPrice, total, shippingPrice, shipping, totalPrice, grandTotal, taxPrice, 
    shippingAddress, paymentMethod, isPaid, paidAt, isDelivered, deliveredAt
  } = order;

  // Normalize Data
  const displayId = invoiceNumber || _id;
  const displayDate = createdAt ? new Date(createdAt).toLocaleDateString() : 'Unknown Date';
  const displayItems = orderItems || items || [];
  const subtotal = itemsPrice ?? total ?? 0;
  const shippingCost = shippingPrice ?? shipping ?? 0;
  const tax = taxPrice ?? 0; 
  const finalTotal = totalPrice ?? grandTotal ?? 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-slate-900">Order Details</h1>
        <Link to="/profile" className="text-indigo-600 font-bold hover:underline">&larr; Back to Profile</Link>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
           <div>
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order ID</span>
             <h2 className="text-2xl font-mono font-bold text-slate-900">{displayId}</h2>
             <p className="text-slate-500 mt-1">Placed on {displayDate}</p>
           </div>
           <div className="text-right">
              <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm inline-block mb-2 ${
                  status === OrderStatus.PLACED ? 'bg-indigo-100 text-indigo-700' :
                  status === OrderStatus.SHIPPED ? 'bg-blue-100 text-blue-700' :
                  status === OrderStatus.DELIVERED ? 'bg-amber-100 text-amber-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {status}
              </span>
              <br/>
              <button 
                 onClick={handleDownloadInvoice}
                 className="text-indigo-600 font-bold hover:underline flex items-center justify-end gap-2 ml-auto"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                 Download Invoice
               </button>
           </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
           <div>
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Shipping Address</h3>
             {shippingAddress ? (
               <div className="text-slate-700">
                 <p>{shippingAddress.address}</p>
                 <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
                 <p>{shippingAddress.country}</p>
               </div>
             ) : (
               <p className="text-slate-500">No shipping address provided.</p>
             )}
           </div>
           <div>
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Payment Info</h3>
             <div className="text-slate-700 space-y-2">
               <p><span className="font-semibold">Method:</span> {paymentMethod}</p>
               <p>
                 <span className="font-semibold">Status:</span> 
                 <span className={isPaid ? "text-emerald-600 font-bold ml-2" : "text-amber-600 font-bold ml-2"}>
                   {isPaid ? `Paid on ${new Date(paidAt!).toLocaleDateString()}` : 'Pending Payment'}
                 </span>
               </p>
               <p>
                 <span className="font-semibold">Delivery:</span> 
                 <span className={isDelivered ? "text-emerald-600 font-bold ml-2" : "text-slate-500 ml-2"}>
                   {isDelivered ? `Delivered on ${new Date(deliveredAt!).toLocaleDateString()}` : 'Not Delivered'}
                 </span>
               </p>
             </div>
           </div>
        </div>

        <div className="p-8 border-t border-slate-100">
           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Order Items</h3>
           <div className="space-y-4">
             {displayItems.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center py-3 border-b border-dashed border-slate-200 last:border-0">
                   <div className="flex items-center gap-4">
                      {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-slate-100" />}
                      <div>
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-500">${item.price} x {item.qty || item.quantity}</p>
                      </div>
                   </div>
                   <div className="font-bold text-lg text-slate-700">
                     ${(item.price * (item.qty || item.quantity)).toFixed(2)}
                   </div>
                </div>
             ))}
           </div>
        </div>

        <div className="bg-slate-50 p-8 border-t border-slate-200">
           <div className="ml-auto max-w-sm space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-slate-900 pt-4 border-t border-slate-200">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>

              {!isDelivered && status !== 'Cancelled' && (
                  <button 
                    onClick={handleCancelOrder}
                    className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition duration-300 shadow-md"
                  >
                    Cancel Order
                  </button>
               )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;