import React from 'react';

const ShippingPolicy: React.FC = () => {
  return (
    <>
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>
        <div className="prose max-w-none text-gray-700 space-y-4">
          <p className="mb-4 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="text-xl font-semibold mb-2">1. Shipping Costs</h2>
            <p>
              Shipping costs are calculated during checkout based on weight, dimensions and destination of the items in the order. Payment for shipping will be collected with the purchase.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Delivery Terms</h2>
            <h3 className="text-lg font-medium mt-2">Transit Time</h3>
            <p>
              In general, domestic shipments are in transit for 2 - 7 days.
            </p>
            <h3 className="text-lg font-medium mt-2">Dispatch Time</h3>
            <p>
              Orders are usually dispatched within 2 business days of payment of order.
              Our warehouse operates on Monday - Friday during standard business hours, except on national holidays at which time the warehouse will be closed. In these instances, we take steps to ensure shipment delays will be kept to a minimum.
            </p>
          </section>

          <section>
              <h2 className="text-xl font-semibold mb-2">3. Tracking Notification</h2>
              <p>
                  Upon dispatch, customers will receive a tracking link from which they will be able to follow the progress of their shipment based on the latest updates made available by the shipping provider.
              </p>
          </section>

          <section>
              <h2 className="text-xl font-semibold mb-2">4. Parcels Damaged In Transit</h2>
              <p>
                  If you find a parcel is damaged in-transit, if possible, please reject the parcel from the courier and get in touch with our customer service. If the parcel has been delivered without you being present, please contact customer service with next steps.
              </p>
          </section>

          <section>
              <h2 className="text-xl font-semibold mb-2">5. Cancellations</h2>
              <p>
                  If you change your mind before you have received your order, we are able to accept cancellations at any time before the order has been dispatched. If an order has already been dispatched, please refer to our refund policy.
              </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default ShippingPolicy;
