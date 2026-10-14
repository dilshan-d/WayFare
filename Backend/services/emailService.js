import nodemailer from 'nodemailer';

export const sendBookingConfirmationEmail = async ({ userEmail, userName, bookingReference, title, type, date, guests, totalAmount }) => {
  try {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background-color: #ffffff;">
        <div style="text-align: center; padding-bottom: 16px; border-bottom: 2px solid #00b4d8;">
          <h2 style="color: #0b132b; margin: 0;">WAYFARE TRAVEL</h2>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Official Reservation Voucher Pass</p>
        </div>

        <div style="margin-top: 20px;">
          <p style="font-size: 16px; color: #1e293b;">Hello <strong>${userName}</strong>,</p>
          <p style="font-size: 14px; color: #475569;">Thank you for booking with Wayfare. Your reservation is confirmed!</p>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 4px 0; font-size: 14px; color: #0f172a;"><strong>Booking Reference:</strong> <span style="font-family: monospace; color: #00b4d8;">${bookingReference}</span></p>
            <p style="margin: 4px 0; font-size: 14px; color: #0f172a;"><strong>Item:</strong> ${title} (${type})</p>
            <p style="margin: 4px 0; font-size: 14px; color: #0f172a;"><strong>Date:</strong> ${date}</p>
            <p style="margin: 4px 0; font-size: 14px; color: #0f172a;"><strong>Guests:</strong> ${guests} Guest(s)</p>
            <p style="margin: 4px 0; font-size: 16px; color: #0b132b; font-weight: bold; margin-top: 10px;"><strong>Total Paid:</strong> $${totalAmount}</p>
          </div>
          
          <p style="font-size: 13px; color: #94a3b8;">Please present this email or your reference code upon check-in.</p>
        </div>
      </div>
    `;

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: Number(smtpPort) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"Wayfare Travel" <${process.env.FROM_EMAIL || 'reservations@wayfare.com'}>`,
        to: userEmail,
        subject: `Booking Confirmation [${bookingReference}] - Wayfare`,
        html: htmlContent,
      });

      console.log(`[Email Service] Sent confirmation email to ${userEmail}`);
    } else {
      console.log(`[Email Service - Simulated] Confirmation email ready for ${userEmail} (Ref: ${bookingReference})`);
    }
  } catch (error) {
    console.error('[Email Service Error]:', error.message);
  }
};
