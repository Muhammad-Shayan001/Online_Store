import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ShippingPolicy: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>
        <div className="prose max-w-none text-gray-700">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">1. Processing Time</h2>
          <p>All orders are processed within 1-3 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">2. Shipping Rates & Delivery Estimates</h2>
          <p>Shipping charges for your order will be calculated and displayed at checkout.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">3. Shipment Confirmation & Order Tracking</h2>
          <p>You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">4. Customs, Duties and Taxes</h2>
          <p>Online Store is not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.).</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">5. Damages</h2>
          <p>Online Store is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShippingPolicy;
