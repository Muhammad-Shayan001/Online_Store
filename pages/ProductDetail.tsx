import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, User } from '../types';
import { ProductService } from '../services/api';
import { generateProductDescription } from '../services/gemini';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductDetailProps {
  addToCart: (p: Product) => void;
  user: User | null;
  toggleWishlist?: (p: Product) => void;
  wishlist?: Product[];
}

const ProductDetail: React.FC<ProductDetailProps> = ({ addToCart, user, toggleWishlist, wishlist = [] }) => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiDescription, setAiDescription] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const navigate = useNavigate();

  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
        if (!id) return;
        try {
            const data = await ProductService.getProductById(id);
            setProduct(data);
            if (data.name) {
                 generateProductDescription(data.name).then(setAiDescription);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!product) {
    return <div className="p-12 text-center">Product not found.</div>;
  }

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await ProductService.createReview(product._id || product.id, { rating, comment });
        toast.success('Review submitted!');
        const data = await ProductService.getProductById(product._id || product.id);
        setProduct(data);
        setComment('');
    } catch (err: any) {
        toast.error(err.toString());
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <SEO title={`${product.name} | Online Store`} description={product.description} image={product.image} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 relative">
        <motion.div 
          className="rounded-3xl overflow-hidden shadow-2xl h-[600px] cursor-zoom-in relative group"
          onClick={() => setIsZoomed(true)}
          layoutId={`product-image-${product._id || product.id}`}
        >
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="bg-white/90 backdrop-blur-sm text-slate-800 px-4 py-2 rounded-full font-medium shadow-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
              Click to Zoom
            </span>
          </div>
        </motion.div>
        
        {/* Zoom Modal */}
        <AnimatePresence>
          {isZoomed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
              onClick={() => setIsZoomed(false)}
            >
              <button className="absolute top-6 right-6 text-white bg-black/50 p-3 rounded-full hover:bg-white hover:text-black transition-colors z-50">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <motion.img 
                layoutId={`product-image-${product._id || product.id}`}
                src={product.image} 
                alt={product.name} 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center"
        >
          <span className="text-indigo-600 font-bold tracking-widest uppercase text-sm mb-4">{product.category}</span>
          <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6">{product.name}</h1>
          <p className="text-3xl font-bold text-slate-900 mb-8">Rs.{product.price}</p>
          
          <div className="space-y-6 mb-10">
            <div className="p-4 bg-slate-100 rounded-xl border-l-4 border-indigo-600">
              <h4 className="text-sm font-bold text-indigo-600 uppercase mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd" /></svg>
                AI Insights
              </h4>
              <p className="italic text-slate-700">{aiDescription || 'Loading creative description...'}</p>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed">{product.description}</p>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => {
                addToCart(product);
                toast.success('Added to Bag');
              }}
              className="flex-grow bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-lg active:scale-95 hover:-translate-y-1"
            >
              Add to Bag
            </button>
            <button 
                onClick={() => toggleWishlist && toggleWishlist(product)}
                className={`p-4 border rounded-xl transition-all hover:-translate-y-1 active:scale-95 ${
                    wishlist.some(w => (w._id || w.id) === (product._id || product.id)) 
                    ? 'bg-indigo-50 border-indigo-200 text-red-500' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
            >
              <svg className="w-6 h-6" fill={wishlist.some(w => (w._id || w.id) === (product._id || product.id)) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-slate-200 pt-16">
        <h2 className="text-3xl font-serif mb-12">Customer Reviews</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1">
            <div className="bg-indigo-50 p-8 rounded-3xl sticky top-24">
              <h3 className="text-xl font-bold mb-6">Write a Review</h3>
              {user ? (
                <form onSubmit={handleReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Rating</label>
                    <select 
                      value={rating} 
                      onChange={(e) => setRating(parseInt(e.target.value))}
                      className="w-full p-3 rounded-xl border border-indigo-200"
                    >
                      {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Your Thoughts</label>
                    <textarea 
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-3 rounded-xl border border-indigo-200 h-32"
                      placeholder="Share your experience..."
                    />
                  </div>
                  <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                    Submit Review
                  </button>
                </form>
              ) : (
                <div className="text-center p-6">
                  <p className="text-slate-600 mb-4">Please sign in to leave a review.</p>
                  <button onClick={() => navigate('/login')} className="text-indigo-600 font-bold underline">Login Now</button>
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-2 space-y-8">
            {product.reviews.length > 0 ? product.reviews.map(review => (
              <div key={review.id} className="pb-8 border-b border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-900">{review.userName}</span>
                  <span className="text-sm text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex text-amber-400 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-300'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-slate-600">{review.comment}</p>
              </div>
            )) : (
              <p className="text-slate-500 italic">Be the first to review this product!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
