import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Terms: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        <div className="prose max-w-none text-gray-700">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">1. Introduction</h2>
          <p>Welcome to Online Store. By accessing our website, you agree to be bound by these Terms and Conditions, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">2. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials (information or software) on Online Store's website for personal, non-commercial transitory viewing only.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">3. Disclaimer</h2>
          <p>The materials on Online Store's website are provided on an 'as is' basis. Online Store makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">4. Limitations</h2>
          <p>In no event shall Online Store or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Online Store's website.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">5. Governing Law</h2>
          <p>These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which our company is settled and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
