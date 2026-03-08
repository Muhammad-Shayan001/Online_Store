import React from 'react';

const RefundPolicy: React.FC = () => {
  return (
    <>
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
        <div className="prose max-w-none text-gray-700 space-y-4">
          <p className="mb-4 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="text-xl font-semibold mb-2">1. Returns</h2>
            <p>
              Our policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately we can’t offer you a refund or exchange.
            </p>
            <p>
              To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.
            </p>
          </section>

          <section>
              <h2 className="text-xl font-semibold mb-2">2. Refunds</h2>
              <p>
                  Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
              </p>
              <p>
                  If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.
              </p>
          </section>

          <section>
              <h2 className="text-xl font-semibold mb-2">3. Late or missing refunds</h2>
              <p>
                  If you haven’t received a refund yet, first check your bank account again.
                  Then contact your credit card company, it may take some time before your refund is officially posted.
                  Next contact your bank. There is often some processing time before a refund is posted.
              </p>
          </section>

          <section>
              <h2 className="text-xl font-semibold mb-2">4. Exchanges</h2>
              <p>
                  We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email.
              </p>
          </section>
          
          <section>
              <h2 className="text-xl font-semibold mb-2">5. Shipping</h2>
              <p>
                  To return your product, you should mail your product to our physical address.
              </p>
              <p>
                  You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
              </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default RefundPolicy;
