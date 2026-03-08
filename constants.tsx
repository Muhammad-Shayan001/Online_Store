
import React from 'react';
import { Product, UserRole } from './types';

export const ADMIN_EMAIL = 'admin@onlinestore.com';
export const SHIPPING_FEE = 10;
export const STORE_EMAIL = 'onlinestore7188@gmail.com';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Precision Timepiece',
    price: 299,
    description: 'A masterpiece of horology, combining stainless steel elegance with sapphire crystal durability.',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800',
    category: 'Accessories',
    reviews: []
  },
  {
    id: 'p2',
    name: 'SoundWave Elite',
    price: 199,
    description: 'Immersive noise-canceling headphones with spatial audio and 40-hour battery life.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    category: 'Electronics',
    reviews: []
  },
  {
    id: 'p3',
    name: 'Luxe Leather Tote',
    price: 150,
    description: 'Handcrafted from full-grain Italian leather, designed for both style and utility.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    category: 'Bags',
    reviews: []
  },
  {
    id: 'p4',
    name: 'Glow Skin Serum',
    price: 45,
    description: 'Vitamin C-rich formula that rejuvenates skin and provides a radiant, natural glow.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
    category: 'Skincare',
    reviews: []
  },
  {
    id: 'p5',
    name: 'Smart Desk Lamp',
    price: 79,
    description: 'Voice-controlled lighting with adjustable color temperatures and built-in wireless charging.',
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800',
    category: 'Home Office',
    reviews: []
  }
];

export const ICONS = {
  Cart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Admin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
};
