
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OrderDetails from './pages/OrderDetails';
// import AdminDashboard from './pages/AdminDashboard'; // Unused currently, or switch to it if needed
import AdminDashboardHome from './pages/admin/AdminDashboardHome';
import AdminProductList from './pages/admin/AdminProductList';
import AdminProductEdit from './pages/admin/AdminProductEdit';
import AdminOrderList from './pages/admin/AdminOrderList';
import AdminOrderDetails from './pages/admin/AdminOrderDetails';
import AdminCouponList from './pages/admin/AdminCouponList';
import AdminUserList from './pages/admin/AdminUserList';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import ShippingPolicy from './pages/legal/ShippingPolicy';
import RefundPolicy from './pages/legal/RefundPolicy';
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Wishlist from './pages/Wishlist';
import { User, Product, CartItem } from './types';
import { ProductService, UserService, OrderService } from './services/api';
import { initGA, logPageView } from './services/analytics';
import { AnalyticsTracker } from './components/AnalyticsTracker';
import { Toaster } from 'react-hot-toast';
import { LoadingSpinner } from './components/Loading';

import WebsiteLayout from './WebsiteLayout';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Initialize GA
  useEffect(() => {
    initGA();
  }, []);

  // Fetch Featured Products (Page 1, No Keyword) - Run once on mount
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await ProductService.getProducts('', 1);
        setFeaturedProducts(data.products || []);
      } catch (e) {
        console.error("Failed to fetch featured products", e);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    // Only fetch user profile and cart once
    const initUser = async () => {
        try {
            const userData = await UserService.getProfile();
            setUser(userData);
            // Fetch wishlist if user exists
            if (userData) {
               try {
                  const wishlistData = await UserService.getWishlist();
                  setWishlist(wishlistData);
               } catch (e) { console.error("Wishlist error", e); }
            }
        } catch (e) { }

        const savedCart = localStorage.getItem('os_cart');
        if (savedCart) setCart(JSON.parse(savedCart));
        setLoading(false);
    }
    initUser();
  }, [])

  const toggleWishlist = async (product: Product) => {
    if (!user) {
      // Prompt logic? Or just fail silently/toast?
      alert("Please login to manage wishlist");
      return; 
    }
    
    // Check if in wishlist
    const exists = wishlist.find(p => p._id === product._id);
    try {
        if (exists) {
            await UserService.removeFromWishlist(product._id);
            setWishlist(prev => prev.filter(p => p._id !== product._id));
        } else {
            await UserService.addToWishlist(product._id);
            setWishlist(prev => [...prev, product]);
        }
    } catch (e) {
        console.error("Wishlist toggle error", e);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const data = await ProductService.getProducts(searchQuery, page);
            setProducts(data.products);
            setPages(data.pages);
        } catch (e) {
            console.error(e);
        }
    }
    fetchProducts();
  }, [page, searchQuery]);



  // Cart Persistence
  useEffect(() => {
    localStorage.setItem('os_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      // Use _id as primary, fall back to id for mocks
      // Backend uses _id, Types use id (legacy)
      const prodId = product._id || product.id;
      
      const existing = prev.find(item => item.productId === prodId); 
      
      if (existing) {
        return prev.map(item =>
          item.productId === prodId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, {
        productId: prodId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleLogout = async () => {
    await UserService.logout();
    setUser(null);
    setCart([]);
    localStorage.removeItem('os_cart');
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner />
        <p className="text-slate-500 font-medium animate-pulse mt-4">Loading experience...</p>
      </div>
    </div>
  );

  return (
    <Router>
        <Toaster 
          position="top-center" 
          reverseOrder={false}
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(8px)',
              color: '#334155',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              borderRadius: '1rem',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              fontWeight: 500
            },
          }} 
        />
        <AnalyticsTracker />
        <Routes>
          {/* Public Website Routes wrapped in WebsiteLayout */}
          <Route element={<WebsiteLayout user={user} cart={cart} updateCartQty={updateCartQty} removeFromCart={removeFromCart} cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} searchQuery={searchQuery} setSearchQuery={setSearchQuery} logout={handleLogout} />}>
            <Route path="/" element={<Home products={searchQuery ? products : featuredProducts.slice(0, 8)} addToCart={addToCart} searchQuery={searchQuery} toggleWishlist={toggleWishlist} wishlist={wishlist} />} />
            <Route path="/products" element={<ProductList products={products} addToCart={addToCart} searchQuery={searchQuery} page={page} pages={pages} setPage={setPage} toggleWishlist={toggleWishlist} wishlist={wishlist} />} />
            <Route path="/product/:id" element={<ProductDetail user={user} addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />} />
            <Route path="/cart" element={<Cart cart={cart} updateQty={updateCartQty} remove={removeFromCart} />} />
            <Route path="/checkout" element={<Checkout cart={cart} user={user} emptyCart={() => setCart([])} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/profile" element={user ? <Profile user={user} orders={[]} setOrders={() => {}} logout={handleLogout} cart={cart} /> : <Navigate to="/login" />} />
            <Route path="/order/:id" element={user ? <OrderDetails /> : <Navigate to="/login" />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/wishlist" element={<Wishlist user={user} addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin Routes - No WebsiteLayout (Navbar/Footer) */}
          <Route path="/admin" element={user && (user.isAdmin || user.email === 'onlinestore7188@gmail.com') ? <AdminDashboardHome user={user} /> : <Navigate to="/" />} />
          <Route path="/admin/products" element={user && (user.isAdmin || user.email === 'onlinestore7188@gmail.com') ? <AdminProductList user={user} /> : <Navigate to="/" />} />
          <Route path="/admin/product/:id/edit" element={user && (user.isAdmin || user.email === 'onlinestore7188@gmail.com') ? <AdminProductEdit user={user} /> : <Navigate to="/" />} />
          <Route path="/admin/orders" element={user && (user.isAdmin || user.email === 'onlinestore7188@gmail.com') ? <AdminOrderList user={user} /> : <Navigate to="/" />} />
          <Route path="/admin/orders/:id" element={user && (user.isAdmin || user.email === 'onlinestore7188@gmail.com') ? <AdminOrderDetails user={user} /> : <Navigate to="/" />} />
          <Route path="/admin/users" element={user && (user.isAdmin || user.email === 'onlinestore7188@gmail.com') ? <AdminUserList user={user} /> : <Navigate to="/" />} />
          <Route path="/admin/coupons" element={user && (user.isAdmin || user.email === 'onlinestore7188@gmail.com') ? <AdminCouponList user={user} /> : <Navigate to="/" />} />
        </Routes>
    </Router>
  );
};

export default App;
