import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Heart } from 'lucide-react';
import { Product } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  onToggleWishlist?: (p: Product) => void;
  isInWishlist?: boolean;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart, 
  onToggleWishlist, 
  isInWishlist = false 
}) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-3xl shadow-2xl z-[201] overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Section */}
            <div className="md:w-1/2 h-64 md:h-auto relative bg-slate-100">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Content Section */}
            <div className="md:w-1/2 p-8 md:p-10 flex flex-col overflow-y-auto">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-indigo-600 mb-2 block">{product.category}</span>
                <h2 className="text-3xl font-serif text-slate-900 mb-4">{product.name}</h2>
                <span className="text-2xl font-black text-slate-800 block mb-6">Rs.{product.price}</span>
              </div>

              <p className="text-slate-600 leading-relaxed mb-8 flex-grow">
                {product.description}
              </p>

              <div className="flex gap-4 mt-auto">
                <button 
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="flex-1 bg-slate-900 hover:bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                >
                  <ShoppingBag className="w-5 h-5" /> Add to Bag
                </button>
                {onToggleWishlist && (
                  <button 
                    onClick={() => onToggleWishlist(product)}
                    className={`p-4 border-2 rounded-xl transition-all active:scale-95 flex items-center justify-center ${
                      isInWishlist ? 'border-red-100 bg-red-50 text-red-500' : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-600'
                    }`}
                  >
                    <Heart className="w-6 h-6" fill={isInWishlist ? "currentColor" : "none"} />
                  </button>
                )}
              </div>
              <div className="mt-4 text-center">
                <a href={`#/product/${product._id || product.id}`} onClick={onClose} className="text-sm font-semibold text-indigo-600 hover:underline">
                  View Full Details &rarr;
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;