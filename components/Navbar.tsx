import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ICONS, ADMIN_EMAIL } from '../constants';
import { User, UserRole } from '../types';
import logoImage from '../image__1_-removebg-preview.png';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  user: User | null;
  cartCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  logout: () => void;
  onCartClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, cartCount, searchQuery, setSearchQuery, logout, onCartClick }) => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const [mobileOpen, setMobileOpen] = React.useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <img
                src={logoImage}
                alt="Logo"
                className="h-48 w-auto object-contain"
                style={{ maxHeight: '100%' }}
              />
            </Link>
          </motion.div>

          {/* Hamburger for mobile */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <Link
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-indigo-600 relative overflow-hidden group ${
                    isActive(link.path) ? 'text-indigo-600' : 'text-slate-600'
                  }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transform origin-left transition-transform duration-300 ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-grow max-w-xs relative hidden sm:block"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm transition-all"
            />
          </motion.div>

          {/* User Controls */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2 lg:space-x-4"
          >
            <button 
              onClick={(e) => {
                if(onCartClick) {
                  e.preventDefault();
                  onCartClick();
                }
              }} 
              className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <ICONS.Cart />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-indigo-600 rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {(user?.isAdmin || (user?.email === 'onlinestore7188@gmail.com' || user?.email === 'onlinestore1788@gmail.com')) && (
              <Link to="/admin" className="p-2 text-slate-600 hover:text-indigo-600 transition-colors" title="Admin Dashboard">
                <ICONS.Admin />
              </Link>
            )}

            <Link
              to={user ? "/profile" : "/login"}
              className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-full transition-all border border-slate-200"
            >
              <ICONS.User />
              <span className="text-sm font-semibold hidden lg:inline">
                {user ? user.name : 'Sign In'}
              </span>
              {user && (
                <span className={`w-2 h-2 rounded-full ${user.role === UserRole.MEMBER ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              )}
            </Link>
             {user && (
                <button onClick={logout} className="p-2 text-slate-400 hover:text-slate-600" title="Sign Out">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
             )}
          </motion.div>
        </div>

        {/* Mobile Nav Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-50 bg-black/40" 
              onClick={() => setMobileOpen(false)}
            >
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute top-0 left-0 w-3/4 max-w-xs h-full bg-white shadow-lg p-6 flex flex-col gap-6" 
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileOpen(false)}>
                    <img src={logoImage} alt="Logo" className="h-10 w-auto object-contain" />
                  </Link>
                  <button className="p-2 rounded hover:bg-slate-100" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-2 px-3 rounded text-base font-medium transition-colors ${
                      isActive(link.path) ? 'bg-indigo-100 text-indigo-700' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="flex gap-3 mt-6">
                  <Link to="/cart" className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors" onClick={() => setMobileOpen(false)}>
                    <ICONS.Cart />
                    {cartCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-indigo-600 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  {(user?.isAdmin || (user?.email === 'onlinestore7188@gmail.com' || user?.email === 'onlinestore1788@gmail.com')) && (
                    <Link to="/admin" className="p-2 text-slate-600 hover:text-indigo-600 transition-colors" title="Admin Dashboard" onClick={() => setMobileOpen(false)}>
                      <ICONS.Admin />
                    </Link>
                  )}
                  <Link
                    to={user ? "/profile" : "/login"}
                    className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-full transition-all border border-slate-200"
                    onClick={() => setMobileOpen(false)}
                  >
                    <ICONS.User />
                    <span className="text-sm font-semibold">
                      {user ? user.name : 'Sign In'}
                    </span>
                    {user && (
                      <span className={`w-2 h-2 rounded-full ${user.role === UserRole.MEMBER ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    )}
                  </Link>
                  {user && (
                    <button onClick={() => { setMobileOpen(false); logout(); }} className="p-2 text-slate-400 hover:text-slate-600" title="Sign Out">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    </button>
                  )}
                </div>
                {/* Mobile Search Bar in Drawer */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Search Bar (below nav) */}
        <div className="sm:hidden pb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm transition-all"
              />
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
