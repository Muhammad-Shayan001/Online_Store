import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, ShoppingBag, ShoppingCart, Users, Tag, ShieldCheck, Store } from 'lucide-react';
import { UserService } from '../../services/api';
import { motion } from 'framer-motion';

interface AdminSidebarProps {
  user: any;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await UserService.logout();
    navigate('/login');
    window.location.reload();
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Products', icon: ShoppingBag, path: '/admin/products' },
    { name: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Coupons', icon: Tag, path: '/admin/coupons' },
  ];

  return (
    <div className="w-[260px] bg-slate-950 text-white min-h-screen flex flex-col fixed left-0 top-0 z-50">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/25">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide">Online Store</h1>
            <p className="text-[11px] text-slate-500 font-medium">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Menu</p>
        {navItems.map((item, index) => (
          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 + index * 0.04, duration: 0.3 }}
            key={item.name}
          >
            <NavLink
              to={item.path}
              end={item.name === 'Dashboard'}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 text-[13px] font-medium rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`
              }
            >
              <item.icon className="w-[18px] h-[18px] mr-3" />
              {item.name}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Back to store link */}
      <div className="px-3 pb-2">
        <NavLink
          to="/"
          className="flex items-center px-3 py-2.5 text-[13px] font-medium rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
        >
          <Store className="w-[18px] h-[18px] mr-3" />
          Back to Store
        </NavLink>
      </div>

      {/* User + Logout */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.04] mb-2">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'Admin'}</p>
            <p className="text-[11px] text-slate-500 truncate">{user?.email || 'admin@store.com'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-3 py-2 bg-white/[0.04] hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg transition-all duration-200 text-[13px] font-medium gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
