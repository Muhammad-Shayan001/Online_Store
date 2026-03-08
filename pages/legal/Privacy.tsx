import React from 'react';

const Privacy: React.FC = () => {
  return (
    <>
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose max-w-none text-gray-700 space-y-4">
          <p className="mb-4 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p>
              OS is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, including to:
            </p>
            <ul className="list-disc pl-5 mt-2">
              <li>Process transactions and send related information, including confirmations and invoices.</li>
              <li>Send you technical notices, updates, security alerts, and support and administrative messages.</li>
              <li>Respond to your comments, questions, and requests and provide customer service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Sharing of Information</h2>
            <p>
              We may share information about you with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Security</h2>
            <p>
              OS takes reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default Privacy;
