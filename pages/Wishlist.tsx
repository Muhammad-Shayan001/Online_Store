import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { UserService } from '../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface WishlistProps {
  user: any;
  addToCart: (product: Product) => void;
  toggleWishlist?: (product: Product) => void; // Add this
  wishlist?: Product[]; // Add this if we want to use props instead of fetch
}

const Wishlist: React.FC<WishlistProps> = ({ user, addToCart }) => {
  const handleRemove = (product: Product) => {
      if (toggleWishlist) {
          toggleWishlist(product);
          toast.success('Removed from wishlist');
      }
  };

  const handleAddToCart = (product: Product) => {
      addToCart(product);
      toast.success('Added to cart');
  }

  if (!user) {
      return (
        <div className="container mx-auto px-4 py-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Please log in to view your wishlist</h2>
            <Link to="/login" className="text-indigo-600 hover:underline">Login here</Link>
        </div>
      );
  }

  // Use props.wishlist if available, fallback to empty array (should be populated by parent)
  const items = wishlist || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
      {items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">Your wishlist is empty.</p>
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <Link to={`/product/${product._id}`}>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <Link to={`/product/${product._id}`}>
                  <h3 className="text-lg font-semibold text-gray-800 hover:text-indigo-600 truncate">{product.name}</h3>
                </Link>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">Rs.{product.price}</span>
                  <div className="flex space-x-2">
                    <button 
                        onClick={() => handleRemove(product)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Remove from Wishlist"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                    <button 
                        onClick={() => handleAddToCart(product)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                        title="Add to Cart"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
