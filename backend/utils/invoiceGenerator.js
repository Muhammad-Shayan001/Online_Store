const generateInvoiceHTML = (order, user, title = 'Invoice') => {
    const statusColor = order.isPaid ? '#10b981' : '#ef4444'; // Green if paid, Red if unpaid
    const statusText = order.isPaid ? 'PAID' : 'UNPAID';
    
    // Format date
    const date = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    const itemsRows = order.orderItems.map(item => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px;">${item.name}</td>
            <td style="padding: 12px; text-align: center;">${item.qty}</td>
            <td style="padding: 12px; text-align: right;">$${item.price.toFixed(2)}</td>
            <td style="padding: 12px; text-align: right;">$${(item.qty * item.price).toFixed(2)}</td>
        </tr>
    `).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #f3f4f6; padding-bottom: 20px; }
            .brand { font-size: 24px; font-weight: bold; color: #111827; }
            .invoice-details { text-align: right; }
            .status-badge { 
                background-color: ${statusColor}; 
                color: white; 
                padding: 4px 12px; 
                border-radius: 9999px; 
                font-size: 12px; 
                font-weight: bold; 
                display: inline-block;
                margin-top: 5px;
            }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .section-title { font-size: 14px; color: #6b7280; font-weight: bold; text-transform: uppercase; margin-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { text-align: left; padding: 12px; background-color: #f9fafb; font-size: 12px; text-transform: uppercase; color: #6b7280; }
            .totals { margin-left: auto; width: 250px; }
            .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
            .final-total { font-weight: bold; font-size: 18px; border-top: 2px solid #111827; border-bottom: none; margin-top: 8px; padding-top: 12px; }
            .footer { margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; padding-top: 20px; }
            .btn { display: inline-block; background-color: #111827; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="brand">Online Store</div>
                <div class="invoice-details">
                    <div style="font-size: 20px; font-weight: bold;">${title}</div>
                    <div>#${order.invoiceNumber || order._id}</div>
                    <div>${date}</div>
                    <div class="status-badge">${statusText}</div>
                </div>
            </div>

            <div class="grid">
                <div>
                    <div class="section-title">Billed To</div>
                    <div>${user.name}</div>
                    <div>${order.shippingAddress.address}</div>
                    <div>${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</div>
                    <div>${order.shippingAddress.country}</div>
                    <div>${user.email}</div>
                </div>
                <div style="text-align: right;">
                    <div class="section-title">Payment Method</div>
                    <div>${order.paymentMethod}</div>
                    ${order.isPaid ? `<div>Paid on: ${new Date(order.paidAt).toLocaleDateString()}</div>` : '<div>Payment Pending</div>'}
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th width="40%">Item</th>
                        <th width="15%" style="text-align: center;">Qty</th>
                        <th width="20%" style="text-align: right;">Price</th>
                        <th width="25%" style="text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsRows}
                </tbody>
            </table>

            <div class="totals">
                <div class="total-row">
                    <span>Subtotal</span>
                    <span>$${order.itemsPrice.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>Tax</span>
                    <span>$${order.taxPrice.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>Shipping</span>
                    <span>$${order.shippingPrice.toFixed(2)}</span>
                </div>
                <div class="total-row final-total">
                    <span>Total</span>
                    <span>$${order.totalPrice.toFixed(2)}</span>
                </div>
            </div>

            <div class="footer">
                <p>Thank you for your business!</p>
                <p>If you have any questions about this invoice, please contact support@onlinestore.com</p>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/order/${order._id}" class="btn">View Order on Website</a>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = generateInvoiceHTML;