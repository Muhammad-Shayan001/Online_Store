import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  cart: CartItem[];
  updateCartQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, setIsOpen, cart, updateCartQty, removeFromCart }) => {
  const navigate = useNavigate();
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl z-[201] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-bold text-slate-800">Your Cart</h2>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {cart.length}
                </span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Your cart is empty</h3>
                  <p className="text-slate-500 max-w-[250px]">Looks like you haven't added anything to your cart yet.</p>
                  <button 
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/products');
                    }}
                    className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <motion.div layout key={item.productId} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl bg-white shadow-sm" />
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <Link 
                          to={`/product/${item.productId}`} 
                          onClick={() => setIsOpen(false)}
                          className="font-bold text-slate-800 hover:text-indigo-600 line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button 
                          onClick={() => removeFromCart(item.productId)}
                          className="text-slate-400 hover:text-red-500 transition-colors bg-white p-1.5 rounded-lg shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-indigo-600 font-bold mb-auto">Rs.{item.price}</p>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center bg-white rounded-lg border border-slate-200">
                          <button 
                            onClick={() => updateCartQty(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1 px-2 text-slate-400 hover:text-slate-700 disabled:opacity-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold text-slate-700 w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQty(item.productId, item.quantity + 1)}
                            className="p-1 px-2 text-slate-400 hover:text-slate-700"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-700">Rs.{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Shipping</span>
                    <span className="font-medium text-emerald-600">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-slate-800 pt-3 border-t border-slate-200">
                    <span>Total</span>
                    <span>Rs.{subtotal}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 active:scale-[0.98]"
                >
                  Proceed to Checkout <ShoppingBag className="w-4 h-4" />
                </button>
                <div className="mt-4 text-center">
                    <Link to="/cart" onClick={() => setIsOpen(false)} className="text-sm font-medium text-indigo-600 hover:underline">
                        View Full Cart
                    </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;