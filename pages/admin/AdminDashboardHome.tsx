import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Users, Package, AlertTriangle, TrendingUp, ArrowUpRight, Clock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import AdminLayout from './AdminLayout';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  userCount: number;
  orderCount: number;
  productCount: number;
  totalRevenue: number;
  recentOrders: any[];
  lowStockProducts: any[];
  chartData: any[];
}

const AdminDashboardHome: React.FC<{user: any}> = ({ user }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/admin/stats', { withCredentials: true });
        setStats(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <AdminLayout user={user}>
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </AdminLayout>
  );

  if (error) return (
    <AdminLayout user={user}>
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm">{error}</div>
    </AdminLayout>
  );

  const statCards = [
    { title: 'Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, change: '+12.5%', bg: 'bg-indigo-50', iconColor: 'text-indigo-600', changeBg: 'bg-emerald-50 text-emerald-700' },
    { title: 'Orders', value: stats?.orderCount || 0, icon: ShoppingBag, change: '+5.2%', bg: 'bg-sky-50', iconColor: 'text-sky-600', changeBg: 'bg-emerald-50 text-emerald-700' },
    { title: 'Customers', value: stats?.userCount || 0, icon: Users, change: '+8.1%', bg: 'bg-violet-50', iconColor: 'text-violet-600', changeBg: 'bg-emerald-50 text-emerald-700' },
    { title: 'Products', value: stats?.productCount || 0, icon: Package, change: 'Active', bg: 'bg-amber-50', iconColor: 'text-amber-600', changeBg: 'bg-slate-100 text-slate-600' },
  ];

  return (
    <AdminLayout user={user}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Welcome back, {user?.name || 'Admin'}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            className="bg-white rounded-xl border border-slate-200/80 p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${card.changeBg}`}>
                {card.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{card.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart + Side Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="xl:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Revenue Overview</h3>
              <p className="text-xs text-slate-400 mt-0.5">Last 30 days performance</p>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">+12.5%</span>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.12}/>
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} tickFormatter={(v) => `$${v}`} width={55} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgb(0 0 0 / 0.06)', fontSize: '12px', padding: '8px 12px' }}
                  formatter={(value: any) => [`$${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Low Stock Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-xl border border-slate-200/80 p-5 flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Low Stock
            </h3>
            <span className="text-[11px] font-medium text-slate-400">{stats?.lowStockProducts?.length || 0} items</span>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto">
            {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
              stats.lowStockProducts.map((p: any) => (
                <div key={p._id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <span className="text-[13px] font-medium text-slate-700 truncate mr-3">{p.name}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap ${
                    p.countInStock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {p.countInStock === 0 ? 'Out' : `${p.countInStock} left`}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                All products well stocked
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="bg-white rounded-xl border border-slate-200/80 overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            Recent Orders
          </h3>
          <button
            onClick={() => navigate('/admin/orders')}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold transition-colors flex items-center gap-1"
          >
            View all <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {stats?.recentOrders?.length ? stats.recentOrders.map((order: any) => (
            <div
              key={order._id}
              onClick={() => navigate(`/admin/orders/${order._id}`)}
              className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-slate-800">#{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-[11px] text-slate-400 truncate">{order.user?.name || 'Guest'}</p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-4 flex items-center gap-3">
                <div>
                  <p className="text-[13px] font-bold text-slate-800">${order.total || order.totalPrice}</p>
                  <p className="text-[11px] text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <Eye className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-slate-400 text-sm">No orders yet</div>
          )}
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminDashboardHome;
