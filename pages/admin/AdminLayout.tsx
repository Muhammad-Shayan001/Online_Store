import React from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Bell } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  user: any;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, user }) => {
  return (
    <div className="flex bg-slate-100 min-h-screen font-sans">
      <AdminSidebar user={user} />
      <div className="flex-1 ml-[260px]">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 px-8 py-3.5 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Admin Panel</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2.5 pl-4 border-l border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-700 leading-tight">{user?.name || 'Admin'}</p>
                <p className="text-[11px] text-slate-400">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-6 lg:p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default AdminLayout;
