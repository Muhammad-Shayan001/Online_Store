
import { Order, OrderStatus } from '../types';

export const generateInvoiceHTML = (order: Order): string => {
    // Basic color logic
    const statusColor = order.isPaid ? '#10b981' : '#ef4444'; 
    const statusText = order.isPaid ? 'PAID' : 'UNPAID';
    
    const date = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    // Handle both orderItems (new) and items (legacy)
    const items = order.orderItems || order.items || [];
    
    const itemsRows = items.map((item: any) => {
        const qty = item.qty || item.quantity || 0;
        const price = item.price || 0;
        const total = qty * price;
        return `
        <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px; color: #1f2937;">${item.name}</td>
            <td style="padding: 12px; text-align: center; color: #4b5563;">${qty}</td>
            <td style="padding: 12px; text-align: right; color: #4b5563;">$${price.toFixed(2)}</td>
            <td style="padding: 12px; text-align: right; color: #1f2937; font-weight: 500;">$${total.toFixed(2)}</td>
        </tr>
    `}).join('');

    const invoiceNum = order.invoiceNumber || order.invoiceId || order._id || 'N/A';
    
    // Handle totals (legacy vs new)
    const subtotal = order.itemsPrice ?? order.total ?? 0;
    const tax = order.taxPrice ?? 0;
    const shipping = order.shippingPrice ?? order.shipping ?? 0;
    const grandTotal = order.totalPrice ?? order.grandTotal ?? 0;

    // Handle address (legacy vs new)
    let addressBlock = '';
    if (order.shippingAddress) {
        addressBlock = `
            <div>${order.shippingAddress.address}</div>
            <div>${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</div>
            <div>${order.shippingAddress.country}</div>
        `;
    } else if (order.address) {
        addressBlock = `<div>${order.address}</div>`;
    }

    // Handle User Info
    const userName = order.user?.name || order.userName || 'Guest';
    const userEmail = order.user?.email || (order.shippingAddress && order.shippingAddress.email) || 'N/A';

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Invoice #${invoiceNum}</title>
        <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #374151; line-height: 1.6; margin: 0; padding: 0; }
            .container { max-width: 800px; margin: 0 auto; padding: 40px; background-color: white; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #f3f4f6; padding-bottom: 20px; }
            .brand { font-size: 28px; font-weight: 800; color: #111827; letter-spacing: -0.5px; }
            .invoice-details { text-align: right; }
            .invoice-title { font-size: 24px; font-weight: bold; color: #111827; margin-bottom: 4px; }
            .status-badge { 
                background-color: ${statusColor}; 
                color: white; 
                padding: 4px 12px; 
                border-radius: 9999px; 
                font-size: 12px; 
                font-weight: bold; 
                display: inline-block;
                margin-top: 8px;
            }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
            .section-title { font-size: 13px; color: #6b7280; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
            .address-box { font-size: 15px; color: #1f2937; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th { text-align: left; padding: 12px; background-color: #f9fafb; font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: 600; border-bottom: 1px solid #e5e7eb; }
            .totals-container { display: flex; justify-content: flex-end; }
            .totals { width: 300px; }
            .total-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
            .final-total { font-weight: 800; font-size: 18px; border-top: 2px solid #111827; border-bottom: none; margin-top: 8px; padding-top: 16px; color: #111827; }
            .footer { margin-top: 60px; text-align: center; color: #9ca3af; font-size: 13px; border-top: 1px solid #f3f4f6; padding-top: 30px; }
            @media print {
                body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                .container { padding: 20px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div>
                    <div class="brand">Online Store</div>
                    <div style="font-size: 14px; color: #6b7280; margin-top: 4px;">Thank you for your business</div>
                </div>
                <div class="invoice-details">
                    <div class="invoice-title">INVOICE</div>
                    <div style="font-size: 15px; font-weight: 500;">#${invoiceNum}</div>
                    <div style="font-size: 14px; color: #6b7280;">${date}</div>
                    <div class="status-badge">${statusText}</div>
                </div>
            </div>

            <div class="grid">
                <div>
                    <div class="section-title">Bill To</div>
                    <div class="address-box">
                        <div style="font-weight: 600;">${userName}</div>
                        ${addressBlock}
                        <div style="margin-top: 4px; color: #4b5563;">${userEmail}</div>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div class="section-title">Payment Details</div>
                    <div class="address-box">
                        <div><span style="color: #6b7280;">Method:</span> ${order.paymentMethod || 'Credit Card'}</div>
                        ${order.isPaid && order.paidAt ? `<div><span style="color: #6b7280;">Paid:</span> ${new Date(order.paidAt).toLocaleDateString()}</div>` : '<div>Payment Pending</div>'}
                    </div>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th width="45%">Item Description</th>
                        <th width="15%" style="text-align: center;">Qty</th>
                        <th width="20%" style="text-align: right;">Price</th>
                        <th width="20%" style="text-align: right;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsRows}
                </tbody>
            </table>

            <div class="totals-container">
                <div class="totals">
                    <div class="total-row">
                        <span style="color: #6b7280;">Subtotal</span>
                        <span style="font-weight: 500;">$${subtotal.toFixed(2)}</span>
                    </div>
                    ${tax > 0 ? `
                    <div class="total-row">
                        <span style="color: #6b7280;">Tax</span>
                        <span style="font-weight: 500;">$${tax.toFixed(2)}</span>
                    </div>` : ''}
                    <div class="total-row">
                        <span style="color: #6b7280;">Shipping</span>
                        <span style="font-weight: 500;">$${shipping.toFixed(2)}</span>
                    </div>
                    <div class="total-row final-total">
                        <span>Total Due</span>
                        <span>$${grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div class="footer">
                <p>If you have any questions about this invoice, please contact support@onlinestore.com</p>
                <p>&copy; ${new Date().getFullYear()} Online Store Inc. All rights reserved.</p>
            </div>
        </div>
        <script>
            window.onload = function() { window.print(); }
        </script>
    </body>
    </html>
    `;
};
