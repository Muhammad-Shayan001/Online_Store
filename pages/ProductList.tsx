
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { motion } from 'framer-motion';
import ProductCard3D from '../components/ProductCard3D';
import QuickViewModal from '../components/QuickViewModal';
import { Eye } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  addToCart: (p: Product) => void;
  searchQuery?: string;
  page?: number;
  pages?: number;
  setPage?: (page: number) => void;
  toggleWishlist?: (p: Product) => void;
  wishlist?: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ 
  products,  
  addToCart, 
  searchQuery = '', 
  page = 1, 
  pages = 1, 
  setPage,
  toggleWishlist,
  wishlist = []
}) => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filtered = products.filter(p => {
    const matchesCategory = filter === 'All' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const isInWishlist = (p: Product) => {
      const pId = p._id || p.id;
      return wishlist.some(w => (w._id || w.id) === pId);
  }

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-serif text-slate-900 mb-6">
          {searchQuery ? `Results for "${searchQuery}"` : 'Our Collection'}
        </h1>
        <div className="flex flex-wrap gap-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all border ${
                filter === cat 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-600 hover:text-indigo-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filtered.map((product, i) => {
              const prodId = product._id || product.id;
              return (
              <ProductCard3D 
                key={prodId}
                index={i}
                className="p-4"
              >
                <Link to={`/product/${prodId}`} className="block relative h-64 mb-4 overflow-hidden rounded-lg group">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                         onClick={(e) => {
                             e.preventDefault(); 
                             if (toggleWishlist) toggleWishlist(product);
                         }}
                         className={`p-3 rounded-full transition-all hover:scale-110 shadow-lg ${
                             isInWishlist(product) ? 'bg-indigo-600 text-white' : 'bg-white text-slate-900 hover:bg-indigo-600 hover:text-white'
                         }`}
                         title="Toggle Wishlist"
                    >
                       <svg className="w-6 h-6" fill={isInWishlist(product) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                      }}
                      className="p-3 bg-white text-slate-900 rounded-full hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-110 shadow-lg"
                      title="Add to Cart"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        setQuickViewProduct(product);
                      }}
                      className="p-3 bg-white text-slate-900 rounded-full hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-110 shadow-lg"
                      title="Quick View"
                    >
                      <Eye className="w-6 h-6" />
                    </button>
                  </div>
                </Link>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{product.category}</span>
                  <h3 className="font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                    <Link to={`/product/${prodId}`}>{product.name}</Link>
                  </h3>
                  <p className="text-slate-500 text-xs line-clamp-1">{product.description}</p>
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-xl font-bold text-slate-900">Rs.{product.price}</span>
                  </div>
                </div>
              </ProductCard3D>
            );
            })}
          </div>

          {pages > 1 && setPage && (
            <div className="flex justify-center mt-12 gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-slate-50"
              >
                Previous
              </button>
              {[...Array(pages).keys()].map(x => (
                <button
                  key={x + 1}
                  onClick={() => setPage(x + 1)}
                  className={`px-4 py-2 border rounded-md ${
                    x + 1 === page ? 'bg-slate-900 text-white' : 'hover:bg-slate-50'
                  }`}
                >
                  {x + 1}
                </button>
              ))}
              <button
                disabled={page === pages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900">No products found</h3>
          <p className="text-slate-500 mt-2">
            We couldn't find anything matching your criteria. Try a different search term or category.
          </p>
          {searchQuery && (
            <button 
              onClick={() => setFilter('All')} 
              className="mt-6 text-indigo-600 font-bold hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
          addToCart={addToCart} 
        />
      )}
    </div>
  );
};

export default ProductList;
