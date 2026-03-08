import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Privacy: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose max-w-none text-gray-700">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
          <p>We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the site, place an order, subscribe to the newsletter, and in connection with other activities, services, features or resources we make available on our Site.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Collected Information</h2>
          <p>Online Store may collect and use Users personal information for the following purposes:</p>
          <ul className="list-disc ml-6 mb-4">
            <li>To improve customer service</li>
            <li>To personalize user experience</li>
            <li>To process payments</li>
            <li>To send periodic emails</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">3. How We Protect Your Information</h2>
          <p>We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our Site.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">4. Sharing Your Personal Information</h2>
          <p>We do not sell, trade, or rent Users personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates and advertisers for the purposes outlined above.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
