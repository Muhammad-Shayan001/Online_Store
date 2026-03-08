
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Order, OrderStatus, CartItem } from '../types';
import toast from 'react-hot-toast';
import { generateInvoiceHTML } from '../services/invoice';
import { OrderService, UserService } from '../services/api';

interface ProfileProps {
  user: User | null;
  orders: Order[]; // Keep interface but we might ignore props if empty
  logout: () => void;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  cart?: CartItem[];
}

const Profile: React.FC<ProfileProps> = ({ user, orders: propOrders, logout, setOrders: setPropOrders, cart }) => {
  const navigate = useNavigate();
  const [localOrders, setLocalOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
      if (user) {
          setName(user.name || '');
          setEmail(user.email || '');
          if (user.addresses && user.addresses.length > 0) {
              setAddress(user.addresses[0].address || '');
              setCity(user.addresses[0].city || '');
              setPostalCode(user.addresses[0].postalCode || '');
              setCountry(user.addresses[0].country || '');
          }
      }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
      e.preventDefault();
      if (password && password !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
      }
      try {
          const updates: any = { name, email };
          if (password) updates.password = password;
          // Always send addresses array
          updates.addresses = [{ address, city, postalCode, country }];
          
          await UserService.updateProfile(updates);
          toast.success("Profile Updated Successfully");
          setIsEditing(false);
          setPassword('');
          setConfirmPassword('');
          // In a real app, we should trigger a refresh of the user object in App.tsx
          // For now, we rely on the fact that if App.tsx re-fetches or we reload...
          // But actually App.tsx doesn't refetch on this action.
          // Better force a reload or callback
          window.location.reload(); 
      } catch (error: any) {
          toast.error(error.response?.data?.message || "Update failed");
      }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      // If user is logged in, fetch from API
      if (user && user.id) {
          try {
             // OrderService.getMyOrders() calls /api/orders/myorders which uses req.user._id
             const data = await OrderService.getMyOrders();
             if (Array.isArray(data)) {
                 setLocalOrders(data);
             }
          } catch (error) {
              console.error("Failed to fetch orders:", error);
          } finally {
              setLoading(false);
          }
      } else {
          setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);
  
  // Use local state if we fetched data, otherwise fallback to props (for legacy/testing)
  const ordersToDisplay = localOrders.length > 0 ? localOrders : propOrders;

  // Filter orders to ensure they belong to current user (though backend should enforce this)
  const userOrders = ordersToDisplay.filter(o => {
      // Backend returns populated user object or ID
      const orderUserId = typeof o.user === 'object' && o.user ? (o.user._id || o.user.id) : o.user;
      const currentUserId = user?._id || user?.id;

      // Legacy or current ID check
      return (orderUserId === currentUserId) || 
             (o.userId === currentUserId) || 
             (o.userId?.startsWith('GUEST') && !user);
  });

  const cartOrder = cart && cart.length > 0 ? {
    _id: 'cart-current',
    id: 'cart-current',
    status: 'In Cart',
    createdAt: new Date().toISOString(),
    orderItems: cart.map(item => ({
      name: item.name,
      qty: item.quantity,
      price: item.price,
      product: item.productId,
    })),
    totalPrice: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    invoiceNumber: 'CART-PENDING',
  } as any : null;

  const allOrders = cartOrder ? [cartOrder, ...userOrders] : userOrders;

  const [hoveredOrderId, setHoveredOrderId] = useState<string | null>(null);

  if (!user && allOrders.length === 0) {
    return <div className="p-20 text-center"><p className="mb-4">Please log in to view your profile.</p><button onClick={() => navigate('/login')} className="text-indigo-600 font-bold">Login</button></div>;
  }

  const markCompleted = (orderId: string) => {
    // Optimistic update
    setLocalOrders(prev => prev.map(o => 
      (o._id === orderId || o.id === orderId) ? { ...o, status: OrderStatus.COMPLETED } : o
    ));
    toast.success("Order marked as Completed! You can now leave a review on the product pages.");
    // Ideally we would also update backend here if needed
  };

  const handleDownloadInvoice = (order: Order) => {
      const invoiceHTML = generateInvoiceHTML(order);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
          printWindow.document.write(invoiceHTML);
          printWindow.document.close();
          // The print() call is now embedded in the generated HTML's window.onload
      } else {
        toast.error("Please allow popups to download the invoice.");
      }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
        <div className="flex items-center gap-6 w-full">
          <div className="w-24 h-24 bg-indigo-600 text-white rounded-3xl flex items-center justify-center text-3xl font-bold shadow-lg flex-shrink-0">
            {user?.name?.charAt(0) || 'G'}
          </div>
          
          {!isEditing ? (
            <div className="flex-grow">
               <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-serif text-slate-900">{user?.name || 'Guest User'}</h1>
                    <p className="text-slate-500">{user?.email || 'No email provided'}</p>
                    {user?.addresses && user.addresses.length > 0 && (
                        <p className="text-sm text-slate-400 mt-1">
                            {user.addresses[0].address}, {user.addresses[0].city}, {user.addresses[0].country}
                        </p>
                    )}
                    <div className="flex gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user?.isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {user?.isAdmin ? 'Admin' : 'Member'}
                        </span>
                        {user?.isVerified && <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Verified</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold transition-all hover:bg-indigo-700 shadow-md"
                    >
                        Edit Profile
                    </button>
                    <button 
                        onClick={() => { logout(); navigate('/'); }}
                        className="px-6 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-xl font-bold transition-all text-slate-600 border border-slate-200"
                    >
                        Logout
                    </button>
                  </div>
               </div>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="flex-grow bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-slate-800">Edit Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                        <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Street Address" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                        <input type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="City" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Postal Code</label>
                        <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="ZIP / Postal Code" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                        <input type="text" value={country} onChange={e => setCountry(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Country" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">New Password (leave blank to keep)</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">Save Changes</button>
                </div>
            </form>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <h2 className="text-2xl font-serif">Order History</h2>
        {allOrders.length > 0 ? (
          <div className="space-y-6">
            {allOrders.map(order => {
              const { 
                _id, id, invoiceNumber, invoiceId, createdAt, status, 
                orderItems, items, itemsPrice, total, shippingPrice, shipping, totalPrice, grandTotal, taxPrice 
              } = order;
              
              // Normalize Order Data
              const displayId = invoiceNumber || invoiceId || _id || id;
              const displayDate = createdAt ? new Date(createdAt).toLocaleDateString() : 'Unknown Date';
              const displayStatus = status;
              const displayItems = orderItems || items || [];
              const subtotal = itemsPrice ?? total ?? 0;
              const shippingCost = shippingPrice ?? shipping ?? 0;
              const tax = taxPrice ?? 0;
              const finalTotal = totalPrice ?? grandTotal ?? 0;

              return (
              <div
                key={_id || id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
                onMouseEnter={() => setHoveredOrderId(_id || id)}
                onMouseLeave={() => setHoveredOrderId(null)}
              >
                <div className="flex flex-col md:flex-row justify-between mb-6 gap-4 border-b border-slate-50 pb-6">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order ID</span>
                    <p className="font-mono font-bold text-slate-900">{displayId}</p>
                    <p className="text-sm text-slate-500">{displayDate}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${
                      displayStatus === 'In Cart' ? 'bg-purple-100 text-purple-700' :
                      displayStatus === OrderStatus.PLACED ? 'bg-indigo-100 text-indigo-700' :
                      displayStatus === OrderStatus.SHIPPED ? 'bg-blue-100 text-blue-700' :
                      displayStatus === OrderStatus.DELIVERED ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {displayStatus}
                    </span>
                    {displayStatus === OrderStatus.DELIVERED && (
                      <button 
                        onClick={() => markCompleted(_id || id || '')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-bold hover:bg-indigo-700 shadow-md transition-all"
                      >
                        Accept & Complete
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Items Ordered</h4>
                    <div className="space-y-3">
                      {displayItems.map((item: any, idx: number) => {
                        const name = item.name;
                        const qty = item.qty || item.quantity;
                        const price = item.price;
                        const key = item.product || item.productId || idx;
                        
                        return (
                          <div key={key} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                            <span className="font-medium">{name} <span className="text-slate-400">x{qty}</span></span>
                            <span className="font-bold">Rs.{(price * qty).toFixed(2)}</span>
                          </div>
                      )})}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>Rs.{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>Rs.{shippingCost.toFixed(2)}</span>
                      </div>
                      {tax > 0 && (
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span>Rs.{tax.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="pt-4 border-t border-slate-200 flex justify-between text-lg font-bold">
                        <span>Paid Total</span>
                        <span className="text-indigo-600">Rs.{finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 items-center justify-between mt-6 bg-indigo-50/50 p-4 rounded-2xl">
                   <div className="flex items-center gap-2 text-sm text-indigo-800 font-semibold">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Invoice: {invoiceNumber || invoiceId}
                   </div>
                   {hoveredOrderId === (_id || id) && (
                     <button 
                       onClick={() => handleDownloadInvoice(order)}
                       className="text-indigo-600 font-bold hover:underline flex items-center gap-2"
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                       Download PDF Invoice
                     </button>
                   )}
                </div>
              </div>
            
            )})}
          </div>
        ) : (
          <div className="bg-white p-20 rounded-3xl border border-dashed border-slate-300 text-center">
            <p className="text-slate-500">You haven't placed any orders yet.</p>
            <button onClick={() => navigate('/products')} className="mt-4 text-indigo-600 font-bold hover:underline">Start Shopping</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
