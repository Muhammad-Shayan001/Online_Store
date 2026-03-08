import React, { useState, useEffect } from 'react';
import { Product, Order, OrderStatus, UserRole } from '../types';
import { Ticket } from '../types';
import { ProductService, OrderService, TicketService } from '../services/api';

interface AdminDashboardProps {
  // Removed products and orders from props, as they will be fetched from API
}

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const [tab, setTab] = useState<'Orders' | 'Products' | 'Refind AI'>('Orders');
  const [tickets, setTickets] = useState<Ticket[]>([]); // Using 'Refind AI' as placeholder for Support/Tickets
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
     // Fetch Data
     const fetchData = async () => {
         try {
             const prods = await ProductService.getProducts();
             setProducts(prods);
             const ords = await OrderService.getOrders();
             setOrders(ords);
             try {
                const tix = await TicketService.getTickets();
                setTickets(tix);
             } catch (e) {
                 console.log("Not admin or no tickets");
             }
         } catch (e) {
             console.error(e);
         }
     }
     fetchData();
  }, []);

  const updateTicketStatus = async (id: string, status: string) => {
      await TicketService.updateTicket(id, { status });
      const tix = await TicketService.getTickets();
      setTickets(tix);
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    // API call to update status
    try {
        if (status === 'Delivered') {
            await OrderService.deliverOrder(orderId);
        }
        // Refresh
         const ords = await OrderService.getOrders();
         setOrders(ords);
    } catch (e) {
        alert('Update failed');
    }
  };

  const deleteProduct = (id: string) => {
    if (confirm("Are you sure?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.get('name') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      image: formData.get('image') as string,
      reviews: editingProduct?.reviews || []
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? productData : p));
    } else {
      setProducts(prev => [...prev, productData]);
    }
    setEditingProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-serif text-slate-900">Admin Command Center</h1>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setTab('Orders')}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${tab === 'Orders' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
          >
            Orders
          </button>
          <button 
            onClick={() => setTab('Products')}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${tab === 'Products' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
          >
            Products
          </button>
          <button 
            onClick={() => setTab('Refind AI')}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${tab === 'Refind AI' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
          >
            Support
          </button>
        </div>
      </div>

      {tab === 'Refind AI' ? (
          <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Support Tickets</h2>
              {tickets.map(ticket => (
                  <div key={ticket._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <h3 className="font-bold text-lg">{ticket.subject}</h3>
                              <p className="text-sm text-slate-500">From: {ticket.name} ({ticket.email})</p>
                              <p className="text-xs text-slate-400">ID: {ticket._id}</p>
                          </div>
                          <select 
                            value={ticket.status} 
                            onChange={(e) => updateTicketStatus(ticket._id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-sm font-bold border ${
                                ticket.status === 'Open' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                ticket.status === 'Resolved' ? 'bg-green-100 text-green-700 border-green-200' :
                                'bg-gray-100 text-gray-700 border-gray-200'
                            }`}
                          >
                              <option value="Open">Open</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                              <option value="Closed">Closed</option>
                          </select>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                          <p className="text-slate-700">{ticket.message}</p>
                      </div>
                      <div className="text-xs text-slate-400 text-right">
                          Created: {new Date(ticket.createdAt).toLocaleDateString()}
                      </div>
                  </div>
              ))}
              {tickets.length === 0 && <p className="text-slate-500 italic">No tickets found.</p>}
          </div>
      ) : tab === 'Orders' ? (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono font-bold">{order.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${order.userRole === UserRole.MEMBER ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {order.userRole}
                  </span>
                </div>
                <p className="text-slate-600 text-sm">{order.userName} • {order.items.length} items • ${order.grandTotal.toFixed(2)}</p>
                <p className="text-slate-400 text-xs mt-1">Status: <span className="font-bold text-slate-900">{order.status}</span></p>
              </div>
              <div className="flex gap-2">
                {order.status === OrderStatus.PLACED && (
                  <button 
                    onClick={() => updateOrderStatus(order.id, OrderStatus.SHIPPED)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all"
                  >
                    Ship Order
                  </button>
                )}
                {order.status === OrderStatus.SHIPPED && (
                  <button 
                    onClick={() => updateOrderStatus(order.id, OrderStatus.DELIVERED)}
                    className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-amber-600 transition-all"
                  >
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-center py-20 text-slate-400">No orders to manage.</p>}
        </div>
      ) : (
        <div>
          <button 
            onClick={() => setEditingProduct({ id: '', name: '', price: 0, description: '', category: '', image: '', reviews: [] })}
            className="mb-8 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-all"
          >
            Add New Product
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-4">
                <img src={p.image} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-grow">
                  <h4 className="font-bold text-slate-900 line-clamp-1">{p.name}</h4>
                  <p className="text-indigo-600 font-bold">${p.price}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => setEditingProduct(p)} className="text-slate-400 hover:text-indigo-600 transition-colors">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold">{editingProduct.id ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-1">Product Name</label>
                <input required name="name" defaultValue={editingProduct.name} className="w-full p-3 rounded-xl border border-slate-200 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Price ($)</label>
                  <input required name="price" type="number" step="0.01" defaultValue={editingProduct.price} className="w-full p-3 rounded-xl border border-slate-200 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Category</label>
                  <input required name="category" defaultValue={editingProduct.category} className="w-full p-3 rounded-xl border border-slate-200 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea required name="description" defaultValue={editingProduct.description} className="w-full p-3 rounded-xl border border-slate-200 outline-none h-32" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Image URL</label>
                <input required name="image" defaultValue={editingProduct.image} className="w-full p-3 rounded-xl border border-slate-200 outline-none" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
