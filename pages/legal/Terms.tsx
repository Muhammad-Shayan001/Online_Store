import React from 'react';

const Terms: React.FC = () => {
  return (
    <>
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        <div className="prose max-w-none text-gray-700 space-y-4">
          <p className="mb-4 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">1. Introduction</h2>
          <p>
            Welcome to OS ("Company", "we", "our", "us"). These Terms and Conditions govern your use of our website.
          </p>
          <p>
            By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">2. Accounts</h2>
          <p>
            When you create an account with us, you guarantee that the information you provide us is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on our Service.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">3. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of OS and its licensors. The Service is protected by copyright, trademark, and other laws.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">4. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">5. Indemnification</h2>
          <p>
            You agree to defend, indemnify and hold harmless OS and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of a) your use and access of the Service, or b) a breach of these Terms.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">6. Limitation of Liability</h2>
          <p>
            In no event shall OS, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">7. Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">8. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us.
          </p>
        </div>
      </div>
    </>
  );
};

export default Terms;
