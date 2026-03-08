import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LiveChat from './components/LiveChat';
import CartDrawer from './components/CartDrawer';
import { User, CartItem } from './types';

interface WebsiteLayoutProps {
  user: User | null;
  cart: CartItem[];
  cartCount: number;
  updateCartQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  logout: () => void;
}

const WebsiteLayout: React.FC<WebsiteLayoutProps> = ({ 
  user, 
  cart,
  cartCount, 
  updateCartQty,
  removeFromCart,
  searchQuery, 
  setSearchQuery, 
  logout 
}) => {
  const { scrollYProgress } = useScroll();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white transition-colors duration-300">
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 origin-left z-[100]"
        style={{ scaleX: scrollYProgress }}
      />
      <Navbar 
          user={user}
          cartCount={cartCount}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          logout={logout}
          onCartClick={() => setIsCartOpen(true)}
      />
      <main className="flex-grow animate-fade-in">
        <Outlet />
      </main>
      <Footer />
      <LiveChat user={user} cart={cart} />
      <CartDrawer 
        isOpen={isCartOpen}
        setIsOpen={setIsCartOpen}
        cart={cart}
        updateCartQty={updateCartQty}
        removeFromCart={removeFromCart}
      />
    </div>
  );
};

export default WebsiteLayout;