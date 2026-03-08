import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const RefundPolicy: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Cancellation & Refund Policy</h1>
        <div className="prose max-w-none text-gray-700">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">1. Cancellation Policy</h2>
          <p>You can cancel your order within 24 hours of placing it. Once the order has been processed or shipped, it cannot be cancelled.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">2. Returns</h2>
          <p>Our policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately we can’t offer you a refund or exchange. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">3. Refunds</h2>
          <p>Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund. If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">4. Late or Missing Refunds</h2>
          <p>If you haven’t received a refund yet, first check your bank account again. Then contact your credit card company, it may take some time before your refund is officially posted. If you’ve done all of this and you still have not received your refund yet, please contact us at support@onlinestore.com.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
