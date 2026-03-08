
import React from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../types';

import { motion, AnimatePresence } from 'framer-motion';

interface CartProps {
  cart: CartItem[];
  updateQty: (id: string, d: number) => void;
  remove: (id: string) => void;
}

const Cart: React.FC<CartProps> = ({ cart, updateQty, remove }) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-slate-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-600 transition-all">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <h1 className="text-4xl font-serif text-slate-900 mb-12">Shopping Bag</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <motion.div layout className="lg:col-span-2 space-y-6">
          <AnimatePresence>
          {cart.map(item => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              key={item.productId} 
              className="flex gap-6 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
            >
              <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-xl" />
              <div className="flex-grow flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
                    <p className="text-slate-500 font-medium">Rs.{item.price}</p>
                  </div>
                  <button onClick={() => remove(item.productId)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-slate-100 rounded-lg p-1">
                    <button 
                      onClick={() => updateQty(item.productId, -1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors"
                    >-</button>
                    <span className="w-10 text-center font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQty(item.productId, 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors"
                    >+</button>
                  </div>
                  <span className="font-bold text-indigo-600">Rs.{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl sticky top-24">
            <h3 className="text-2xl font-bold mb-8">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-white">Rs.{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className="text-white italic text-sm">Calculated at checkout</span>
              </div>
              <div className="pt-4 border-t border-slate-700 flex justify-between">
                <span className="text-xl font-bold">Total</span>
                <span className="text-xl font-bold text-indigo-400">Rs.{subtotal.toFixed(2)}</span>
              </div>
            </div>
            <Link 
              to="/checkout" 
              className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95"
            >
              Proceed to Checkout
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Cart;
