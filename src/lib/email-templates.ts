export function generateOrderConfirmationEmail(order: any, brandName: string, brandLogoUrl?: string) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; color: #333;">
      ${brandLogoUrl ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${brandLogoUrl}" alt="${brandName}" style="max-height: 50px;"></div>` : `<h2 style="text-align: center;">${brandName}</h2>`}
      
      <h3 style="color: #4CAF50;">Order Confirmation</h3>
      <p>Thank you for your order!</p>
      
      <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Total Amount:</strong> $${order.total.toFixed(2)}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      </div>

      <h4 style="margin-top: 30px;">Order Details</h4>
      
      ${order.items && Array.isArray(order.items) ? `
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <tr style="background: #eee;">
          <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Item</th>
          <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Qty</th>
          <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Price</th>
        </tr>
        ${order.items.map((item: any) => `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">
             ${item.name || 'Product'} 
             ${item.customOptions ? `<br/><small style="color: #666;">Customized</small>` : ''}
          </td>
          <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${item.quantity || 1}</td>
          <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">$${(item.price * (item.quantity || 1)).toFixed(2)}</td>
        </tr>
        `).join('')}
      </table>
      ` : '<p>Custom order details included.</p>'}

      <p style="margin-top: 30px; font-size: 14px; color: #777;">
        If you have any questions, feel free to reply to this email.
      </p>
    </div>
  `;
}

export function generateOtpEmail(otp: string, type: 'REGISTER' | 'FORGOT_PASSWORD' | 'CHANGE_PASSWORD', brandName: string, brandLogoUrl?: string) {
  let actionText = '';
  switch (type) {
    case 'REGISTER': actionText = 'registering your account'; break;
    case 'FORGOT_PASSWORD': actionText = 'resetting your password'; break;
    case 'CHANGE_PASSWORD': actionText = 'changing your password'; break;
  }

  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: 0 auto; color: #333; text-align: center;">
      ${brandLogoUrl ? `<img src="${brandLogoUrl}" alt="${brandName}" style="max-height: 50px; margin-bottom: 20px;">` : `<h2>${brandName}</h2>`}
      
      <h3>Verification Code</h3>
      <p>Here is your one-time password (OTP) for ${actionText}.</p>
      
      <div style="margin: 30px 0; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">${otp}</span>
      </div>
      
      <p style="font-size: 14px; color: #777;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
    </div>
  `;
}

export function generatePasswordChangeEmail(brandName: string, brandLogoUrl?: string) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: 0 auto; color: #333; text-align: center;">
      ${brandLogoUrl ? `<img src="${brandLogoUrl}" alt="${brandName}" style="max-height: 50px; margin-bottom: 20px;">` : `<h2>${brandName}</h2>`}
      
      <h3 style="color: #4CAF50;">Password Changed Successfully</h3>
      <p>Your account password has been updated.</p>
      
      <p style="margin-top: 30px; font-size: 14px; color: #777;">
        If you did not make this change, please contact support immediately.
      </p>
    </div>
  `;
}
