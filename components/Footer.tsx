
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { STORE_EMAIL } from '../constants';
import logoImage from '../image__1_-removebg-preview.png';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-slate-900 text-slate-300 pt-10 pb-4 overflow-hidden mt-auto border-t border-slate-800">
      {/* Abstract Background Effects */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-pink-500/10 blur-[80px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* Brand Column - Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 100, damping: 20 }}
          >
            <Link to="/" className="inline-block mb-4">
              <img
                src={logoImage}
                alt="Logo"
                className="h-16 w-auto object-contain brightness-0 invert drop-shadow-sm hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Discover unparalleled quality and timeless design. Elevate your everyday style with our curated collections.
            </p>
            <div className="w-full">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Stay in the Loop</h4>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-slate-800/60 border border-slate-700 text-white rounded-lg py-2.5 pl-4 pr-28 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition-all placeholder:text-slate-500"
                />
                <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded-md text-sm font-medium transition-all active:scale-95">
                  Subscribe
                </button>
              </div>
            </div>
          </motion.div>

          {/* Explore Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 100, damping: 20 }}
            className="flex flex-col items-start"
          >
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Explore</h4>
            <ul className="flex flex-col gap-3 items-start">
              {['Home', 'Products', 'Collections', 'Story'].map((link) => (
                <li key={link}>
                  <Link
                    to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-')}`}
                    className="text-slate-400 hover:text-white transition-colors text-sm font-medium relative group"
                  >
                    {link}
                    <span className="absolute -bottom-0.5 right-0 w-0 h-[1px] bg-indigo-500 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 100, damping: 20 }}
            className="flex flex-col items-start"
          >
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h4>
            <ul className="flex flex-col gap-3 items-start">
              {Object.entries({
                'Contact Us': '/contact',
                'FAQ': '/faq',
                'Shipping Policy': '/shipping-policy',
                'Returns': '/refund-policy'
              }).map(([name, path]) => (
                <li key={name}>
                  <Link to={path} className="text-slate-400 hover:text-white transition-colors text-sm font-medium relative group">
                    {name}
                    <span className="absolute -bottom-0.5 right-0 w-0 h-[1px] bg-indigo-500 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3, type: 'spring', stiffness: 100, damping: 20 }}
            className="flex flex-col items-start"
          >
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h4>
            <ul className="flex flex-col gap-3 items-start">
              {Object.entries({
                'Privacy Policy': '/privacy',
                'Terms of Service': '/terms',
                'Accessibility': '#'
              }).map(([name, path]) => (
                <li key={name}>
                  <Link to={path} className="text-slate-400 hover:text-white transition-colors text-sm font-medium relative group">
                    {name}
                    <span className="absolute -bottom-0.5 right-0 w-0 h-[1px] bg-indigo-500 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-5 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Online Store. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            {['Twitter', 'Facebook', 'Instagram', 'Pinterest'].map((social, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ y: -3, scale: 1.15 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="text-slate-500 hover:text-indigo-400 transition-colors"
                title={social}
              >
                <span className="sr-only">{social}</span>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </motion.a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-sm">Need help?</span>
            <a href={`mailto:${STORE_EMAIL}`} className="text-indigo-400 text-sm font-semibold hover:text-indigo-300 transition-colors">
              {STORE_EMAIL}
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
