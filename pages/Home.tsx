import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';
import { motion, useScroll, useTransform } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import ProductCard3D from '../components/ProductCard3D';
import QuickViewModal from '../components/QuickViewModal';
import { Eye } from 'lucide-react';

interface HomeProps {
  products: Product[];
  addToCart: (p: Product) => void;
  searchQuery?: string;
  toggleWishlist?: (p: Product) => void;
  wishlist?: Product[];
}

const Home: React.FC<HomeProps> = ({ products, addToCart, searchQuery = '', toggleWishlist, wishlist = [] }) => {
  const handleAddToCart = (p: Product) => {
    addToCart(p);
    toast.success('Added to cart');
  }

  const isInWishlist = (p: Product) => {
      const pId = p._id || p.id;
      return wishlist.some(w => (w._id || w.id) === pId);
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const featured = !searchQuery ? products.slice(0, 8) : filteredProducts.slice(0, 8);

  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay({ delay: 4000, stopOnInteraction: false })]);
  
  const [quickViewProduct, setQuickViewProduct] = React.useState<Product | null>(null);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
  const opacityText = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="animate-fade-in">
      <SEO title="Home | Online Store" description="Discover our premium collection of products." />

      {/* Hero Section - Hide if searching */}
      {!searchQuery && (
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900 text-white">
          <motion.div 
            style={{ y: y1 }}
            animate={{ 
              backgroundPosition: ["0% 0%", "100% 100%"],
              opacity: [0.6, 0.8, 0.6]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 bg-[length:200%_200%] opacity-80" 
          />
          <motion.div style={{ y: y2 }} className="absolute top-0 right-0 w-1/2 h-full bg-slate-800 skew-x-12 translate-x-1/4 opacity-10 blur-3xl mix-blend-screen"></motion.div>
          
          <motion.div style={{ opacity: opacityText, y: y2 }} className="relative z-10 text-center max-w-4xl px-4">
            <motion.h1 
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-extrabold mb-6 mix-blend-plus-lighter"
            >
              Welcome to <span className="text-pink-400 animate-gradient-text drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">Online Store</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-xl md:text-2xl mb-8"
            >
              Discover premium products with a modern shopping experience.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link to="/products" className="inline-block px-8 py-4 text-lg font-semibold rounded-full bg-white/90 backdrop-blur-sm text-indigo-700 shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.6)] hover:scale-105 hover:bg-white transition-all">
                Shop Now
              </Link>
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* Featured Products / Search Results */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">
              {searchQuery ? `Results for "${searchQuery}"` : 'Curated For You'}
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              {searchQuery ? `Exploring our catalog for matches.` : 'Hand-picked items that define our commitment to exceptional quality and style.'}
            </p>
          </div>
          <Link to="/products" className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors flex items-center group">
            View All Products
            <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {featured.length > 0 ? (
          !searchQuery ? (
            <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
              <div className="flex gap-8">
                {featured.map((product, i) => (
                  <ProductCard3D 
                    key={product._id || product.id} 
                    index={i}
                    className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] overflow-hidden mx-3"
                  >
                    <Link to={`/product/${product._id || product.id}`} className="block relative h-80 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                        <button 
                             onClick={(e) => {
                                 e.preventDefault(); 
                                 if (toggleWishlist) toggleWishlist(product);
                             }}
                             className={`p-3 rounded-full transition-all ${
                                 isInWishlist(product) ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-white text-slate-900 hover:bg-red-50 hover:text-red-500 shadow-md'
                             }`}
                        >
                           <svg className="w-5 h-5" fill={isInWishlist(product) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setQuickViewProduct(product);
                          }}
                          className="p-3 bg-white text-slate-900 rounded-full hover:bg-slate-100 transition-all shadow-md"
                          title="Quick View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                          className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </button>
                      </div>
                    </Link>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          <Link to={`/product/${product._id || product.id}`}>{product.name}</Link>
                        </h3>
                        <span className="text-lg font-bold text-indigo-600">Rs.{product.price}</span>
                      </div>
                      <p className="text-slate-500 text-sm line-clamp-2">{product.description}</p>
                    </div>
                  </ProductCard3D>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((product, i) => (
                <ProductCard3D key={product._id || product.id} index={i} className="overflow-hidden">
                  <Link to={`/product/${product._id || product.id}`} className="block relative h-80 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                      <button 
                           onClick={(e) => {
                               e.preventDefault(); 
                               if (toggleWishlist) toggleWishlist(product);
                           }}
                           className={`p-3 rounded-full transition-all ${
                               isInWishlist(product) ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-white text-slate-900 hover:bg-red-50 hover:text-red-500 shadow-md'
                           }`}
                      >
                         <svg className="w-5 h-5" fill={isInWishlist(product) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setQuickViewProduct(product);
                        }}
                        className="p-3 bg-white text-slate-900 rounded-full hover:bg-slate-100 transition-all shadow-md"
                        title="Quick View"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      </button>
                    </div>
                  </Link>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        <Link to={`/product/${product._id || product.id}`}>{product.name}</Link>
                      </h3>
                      <span className="text-lg font-bold text-indigo-600">Rs.{product.price}</span>
                    </div>
                    <p className="text-slate-500 text-sm line-clamp-2">{product.description}</p>
                  </div>
                </ProductCard3D>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">No matching products</h3>
            <p className="text-slate-500 mt-2">Try adjusting your search terms to find what you're looking for.</p>
          </div>
        )}
      </section>

      {/* Trust Banner */}
      {!searchQuery && (
        <section className="bg-indigo-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h4 className="text-xl font-bold mb-2">Quality Guaranteed</h4>
              <p className="text-slate-600">Every product is vetted for durability and craftsmanship.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              <h4 className="text-xl font-bold mb-2">Fast Shipping</h4>
              <p className="text-slate-600">Tracked global shipping directly to your doorstep.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h4 className="text-xl font-bold mb-2">24/7 Support</h4>
              <p className="text-slate-600">Our concierge team is always here to assist you.</p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {!searchQuery && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-serif text-slate-900 mb-4">What Our Customers Say</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">Don't just take our word for it - hear from our amazing community.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Sarah J.", role: "Verified Buyer", text: "Absolutely stunning quality. The attention to detail is truly unparalleled.", rating: 5 },
                { name: "Michael T.", role: "Loyal Customer", text: "Fast shipping and the customer support team was incredibly helpful when I had a question.", rating: 5 },
                { name: "Emma L.", role: "Fashion Enthusiast", text: "This is my go-to store for all premium items. The aesthetic and feel are exactly what I wanted.", rating: 5 }
              ].map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-shadow relative"
                >
                  <div className="text-indigo-500 mb-4 flex gap-1">
                    {[...Array(testimonial.rating)].map((_, idx) => (
                      <svg key={idx} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{testimonial.name}</h4>
                      <p className="text-xs text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <QuickViewModal 
        product={quickViewProduct} 
        isOpen={!!quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
        onAddToCart={handleAddToCart}
        onToggleWishlist={toggleWishlist}
        isInWishlist={quickViewProduct ? isInWishlist(quickViewProduct) : false}
      />
    </div>
  );
};

export default Home;
