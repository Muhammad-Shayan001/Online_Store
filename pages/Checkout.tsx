
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem, User, Order } from '../types';
import { OrderService } from '../services/api';
import toast from 'react-hot-toast';
import axios from 'axios';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface CheckoutProps {
  cart: CartItem[];
  user: User | null;
  emptyCart: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, user, emptyCart }) => {
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string, discount: number, applicableProducts: string[] } | null>(null);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  
  // Recalculate discount whenever cart or coupon changes
  useEffect(() => {
    if (appliedCoupon && appliedCoupon.applicableProducts && appliedCoupon.applicableProducts.length > 0) {
        let disc = 0;
        cart.forEach(item => {
            if (appliedCoupon.applicableProducts.includes(item.productId)) {
                disc += (item.price * item.quantity * appliedCoupon.discount) / 100;
            }
        });
        setDiscountAmount(disc);
    } else {
        setDiscountAmount(0);
    }
  }, [cart, appliedCoupon]);

  // Shipping Display (Estimated)
  const isMember = !!user; // Simple check
  const shippingCost = isMember ? 0 : 10;
  
  const total = subtotal + shippingCost - discountAmount;

  const applyCouponHandler = async () => {
      try {
          const { data } = await axios.post('/api/coupons/validate', { code: couponCode }, { withCredentials: true });
          
          if (data.applicableProducts.length === 0) {
              toast.error('This coupon is not applicable to any products.');
              setAppliedCoupon(null);
              return;
          }

          // Check if any cart item matches applicable products
          const hasApplicableItem = cart.some(item => data.applicableProducts.includes(item.productId));
          
          if (!hasApplicableItem) {
              toast.error('This coupon does not apply to items in your cart.');
              setAppliedCoupon(null);
              return;
          }

          setAppliedCoupon(data);
          toast.success(`Coupon Applied: ${data.discount}% Off specific items`);
      } catch (err: any) {
          setDiscountAmount(0);
          setAppliedCoupon(null);
          toast.error(err.response?.data?.message || 'Invalid Coupon');
      }
  };

  if (cart.length === 0) {
     return <div className="p-10 text-center">Cart is empty <button onClick={() => navigate('/')} className="text-indigo-600 underline">Go Home</button></div>;
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const orderData = {
      orderItems: cart.map(item => ({
        product: item.productId, // Ensure this maps to _id
        name: item.name,
        qty: item.quantity,
        image: item.image,
        price: item.price
      })),
      shippingAddress: { address, city, postalCode, country, email },
      paymentMethod: 'COD',
      itemsPrice: subtotal,
      taxPrice: subtotal * 0.1, // Mock Tax
      totalPrice: total,
      coupon: appliedCoupon ? appliedCoupon.code : null,
      discount: appliedCoupon ? appliedCoupon.discount : 0,
    };

    try {
        const createdOrder = await OrderService.createOrder(orderData);
        // Fire confetti!
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#ec4899', '#ffb100']
        });
        toast.success(`Order Placed! Invoice: ${createdOrder.invoiceNumber}`);
        setTimeout(() => {
          navigate(user ? '/profile' : '/');
        }, 1500);
    } catch (err: any) {
        toast.error("Order failed: " + (err.response?.data?.message || err.toString()));
    } finally {
        setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <h1 className="text-4xl font-serif text-slate-900 mb-12">Checkout</h1>
      
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-12"
        >
          {/* Shipping Details */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="w-8 h-8 bg-slate-900 text-white rounded-full inline-flex items-center justify-center text-sm mr-3">1</span>
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none" 
                  placeholder="John Doe"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Email Address</label>
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none" 
                  placeholder="john@example.com"
                />
              </div>
               <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Address</label>
                <input 
                  required
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none" 
                  placeholder="123 Main St"
                />
              </div>
               <div>
                <label className="block text-sm font-semibold mb-1">City</label>
                <input 
                  required
                  type="text" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none" 
                  placeholder="New York"
                />
              </div>
               <div>
                <label className="block text-sm font-semibold mb-1">Postal Code</label>
                <input 
                  required
                  type="text" 
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none" 
                  placeholder="10001"
                />
              </div>
               <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Country</label>
                <input 
                  required
                  type="text" 
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none" 
                  placeholder="USA"
                />
              </div>
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="w-8 h-8 bg-slate-900 text-white rounded-full inline-flex items-center justify-center text-sm mr-3">2</span>
              Payment Method
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className={`p-4 border rounded-xl cursor-pointer transition-all border-indigo-600 bg-indigo-50`}>
                <div className="flex items-center">
                    <input type="radio" checked readOnly className="h-5 w-5 text-indigo-600" />
                    <span className="ml-3 font-semibold">Cash on Delivery (COD)</span>
                </div>
              </div>
               <div className={`p-4 border rounded-xl cursor-not-allowed opacity-50`}>
                <div className="flex items-center">
                    <input type="radio" disabled className="h-5 w-5 text-gray-400" />
                    <span className="ml-3 font-semibold text-gray-500">Credit Card (Coming Soon)</span>
                </div>
              </div>
            </div>
          </section>
        </motion.div>

        {/* Order Summary */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-slate-50 p-8 rounded-3xl h-fit border border-slate-200"
        >
          <h2 className="text-2xl font-serif mb-6">Order Summary</h2>
          <div className="space-y-4 mb-8">
            {cart.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={item.productId} className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-white overflow-hidden mr-4">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{item.name}</h3>
                    <p className="text-slate-500 text-xs">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-semibold">Rs.{(item.price * item.quantity).toFixed(2)}</span>
              </motion.div>
            ))}
          </div>
          
          <div className="border-t border-slate-200 pt-4 space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>Rs.{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span>{isMember ? 'Free' : 'Rs.100.00'}</span>
            </div>
            {discountAmount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-Rs.{discountAmount.toFixed(2)}</span>
                </div>
            )}
            <div className="flex justify-between text-xl font-bold text-slate-900 pt-4 border-t border-slate-200 mt-4">
              <span>Total</span>
              <span>Rs.{total.toFixed(2)}</span>
            </div>

            {/* Coupon Input */}
            <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Coupon Code" 
                        className="border rounded-lg p-2 w-full text-sm uppercase"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button 
                        type="button"
                        onClick={applyCouponHandler}
                        className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
                    >
                        Apply
                    </button>
                </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            {loading ? 'Processing...' : 'Confirm Order'}
          </button>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            <span>Secure Checkout</span>
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default Checkout;

