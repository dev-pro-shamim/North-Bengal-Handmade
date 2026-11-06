import nodemailer from 'nodemailer';

export interface EmailPayload {
  to: string;
  toName: string;
  subject: string;
  message: string;
  inquiryRef?: string;
  productTitle?: string;
}

export async function sendCustomerEmail(payload: EmailPayload): Promise<{ success: boolean; simulated?: boolean; message: string }> {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || '"North Bengal Handmade Export Desk" <export@northbengalhandmade.com>';

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f5f2; margin: 0; padding: 24px; color: #2d2a26; }
        .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e0d8; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
        .header { background: #0f1412; color: #ffffff; padding: 28px 32px; border-bottom: 3px solid #f59e0b; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px; }
        .header p { margin: 6px 0 0; font-size: 11px; color: #fbbf24; text-transform: uppercase; letter-spacing: 1px; }
        .content { padding: 32px; }
        .greeting { font-size: 15px; font-weight: 600; margin-bottom: 16px; color: #1c1917; }
        .message-box { font-size: 14px; line-height: 1.6; color: #44403c; white-space: pre-wrap; background: #faf8f5; padding: 20px; border-radius: 12px; border: 1px solid #e7e5e4; }
        .ref-pill { display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; font-family: monospace; margin-bottom: 16px; }
        .footer { background: #f5f5f4; padding: 20px 32px; font-size: 11px; color: #78716c; border-top: 1px solid #e7e5e4; text-align: center; }
        .footer a { color: #d97706; text-decoration: none; font-weight: 600; }
        .credentials { margin-top: 10px; font-size: 10px; color: #a8a29e; font-family: monospace; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>NORTH BENGAL HANDMADE PRODUCTS BD</h1>
          <p>Verified Handicrafts Manufacturer & Exporter (Bangladesh)</p>
        </div>
        <div class="content">
          ${payload.inquiryRef ? `<div class="ref-pill">Ref: ${payload.inquiryRef}</div>` : ''}
          <div class="greeting">Dear ${payload.toName || 'Valued International Partner'},</div>
          <div class="message-box">${payload.message}</div>
          <p style="margin-top: 24px; font-size: 13px; color: #57534e;">
            Best regards,<br>
            <strong>Commercial Export & Merchandising Desk</strong><br>
            North Bengal Handmade Products BD<br>
            Dhaka Liaison: House 08, Road 08, Sector 06, Uttara, Dhaka-1230<br>
            Workshop: Kaunia, Rangpur-5440, Bangladesh
          </p>
        </div>
        <div class="footer">
          <div>Email: <a href="mailto:export@northbengalhandmade.com">export@northbengalhandmade.com</a> | WhatsApp: +880 1740-305936</div>
          <div class="credentials">Govt Reg: ERC No. 260326211291422 | BIN: 004681231-0102 | Trade Lic: No. 147</div>
        </div>
      </div>
    </body>
    </html>
  `;

  // If live SMTP credentials exist in environment
  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass }
      });

      await transporter.sendMail({
        from,
        to: payload.to,
        subject: payload.subject,
        text: payload.message,
        html: htmlBody
      });

      console.log(`[EMAIL DISPATCHED] To: ${payload.to} | Subject: ${payload.subject}`);
      return { success: true, message: `Email dispatched successfully to ${payload.to}` };
    } catch (err: any) {
      console.error('[SMTP ERROR]', err);
      return { success: false, message: `SMTP error: ${err.message}` };
    }
  }

  // Graceful simulation fallback for development or before SMTP keys are configured
  console.log(`[SIMULATED EMAIL DISPATCH]`);
  console.log(`To: ${payload.to} (${payload.toName})`);
  console.log(`Subject: ${payload.subject}`);
  console.log(`Body: ${payload.message}`);

  return {
    success: true,
    simulated: true,
    message: `Email prepared and logged for ${payload.to}. (To dispatch live over internet, configure SMTP_HOST & SMTP_PASS in Vercel settings).`
  };
}
