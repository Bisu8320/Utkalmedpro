import nodemailer from 'nodemailer';
import { Configs } from '../configs/config';

// Create transporter for Gmail
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: Configs.EMAIL_USER,
    pass: Configs.EMAIL_PASS, // Use App Password, not regular password
  },
});

/**
 * Send booking data directly to customer
 */
export const sendBookingDataToCustomer = async (
  customerName: string,
  customerPhoneNumber: string,
  customerEmail: string,
  customerAddress: string,
  serviceName: string,
  customerDate: string,
  customerTime: string,
  customerAdditionalNotes: string
): Promise<void> => {
  if (!customerEmail) {
    console.log('No customer email provided, cannot send booking data');
    return;
  }

  try {
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #2c5aa0; text-align: center; margin-bottom: 30px;">🏥 Your Booking Details - Utkal Medpro</h2>
        
        <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
          <h3 style="color: #155724; margin: 0;">✅ Booking Confirmed!</h3>
        </div>

        <p style="color: #333; font-size: 16px;">Dear ${customerName},</p>
        
        <p style="color: #333;">Here are your complete booking details:</p>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Your Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Name:</td>
              <td style="padding: 8px 0; color: #333;">${customerName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
              <td style="padding: 8px 0; color: #333;">${customerPhoneNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 8px 0; color: #333;">${customerEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Service Address:</td>
              <td style="padding: 8px 0; color: #333;">${customerAddress}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Service Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Service:</td>
              <td style="padding: 8px 0; color: #333;">${serviceName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Preferred Date:</td>
              <td style="padding: 8px 0; color: #333;">${customerDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Preferred Time:</td>
              <td style="padding: 8px 0; color: #333;">${customerTime}</td>
            </tr>
          </table>
        </div>

        ${customerAdditionalNotes ? `
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Your Additional Notes:</h3>
          <p style="color: #333; margin: 0;">${customerAdditionalNotes}</p>
        </div>
        ` : ''}

        <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">What's Next?</h3>
          <ul style="color: #333; margin: 0; padding-left: 20px;">
            <li>Our team will contact you within 24 hours to confirm your appointment</li>
            <li>Please keep your phone available for our call</li>
            <li>If you need to make any changes, please contact us immediately</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #fff3cd; border-radius: 8px;">
          <p style="margin: 0; color: #856404; font-weight: bold;">📞 For urgent queries, please call us directly</p>
        </div>

        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
          <p>Thank you for choosing Utkal Medpro for your healthcare needs</p>
          <p>Booking received at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Utkal Medpro Bookings" <${Configs.EMAIL_USER}>`,
      to: customerEmail,
      subject: `🏥 Your Booking Details: ${serviceName} - Utkal Medpro`,
      html: emailContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Booking data sent to customer:', info.messageId);
  } catch (error) {
    console.error('❌ Failed to send booking data to customer:', error);
    throw error;
  }
};

/**
 * Send confirmation email to customer
 */
export const sendCustomerConfirmationEmail = async (
  customerName: string,
  customerEmail: string,
  serviceName: string,
  customerDate: string,
  customerTime: string
): Promise<void> => {
  if (!customerEmail) {
    console.log('No customer email provided, skipping confirmation email');
    return;
  }

  try {
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #2c5aa0; text-align: center; margin-bottom: 30px;">🏥 Booking Confirmation - Utkal Medpro</h2>
        
        <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
          <h3 style="color: #155724; margin: 0;">✅ Your booking request has been received!</h3>
        </div>

        <p style="color: #333; font-size: 16px;">Dear ${customerName},</p>
        
        <p style="color: #333;">Thank you for choosing Utkal Medpro. We have received your booking request with the following details:</p>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Service:</td>
              <td style="padding: 8px 0; color: #333;">${serviceName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Preferred Date:</td>
              <td style="padding: 8px 0; color: #333;">${customerDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Preferred Time:</td>
              <td style="padding: 8px 0; color: #333;">${customerTime}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">What's Next?</h3>
          <ul style="color: #333; margin: 0; padding-left: 20px;">
            <li>Our team will contact you within 24 hours to confirm your appointment</li>
            <li>Please keep your phone available for our call</li>
            <li>If you need to make any changes, please contact us immediately</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #fff3cd; border-radius: 8px;">
          <p style="margin: 0; color: #856404; font-weight: bold;">📞 For urgent queries, please call us directly</p>
        </div>

        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
          <p>Thank you for trusting Utkal Medpro with your healthcare needs</p>
          <p>This is an automated confirmation email</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Utkal Medpro" <${Configs.EMAIL_USER}>`,
      to: customerEmail,
      subject: `✅ Booking Confirmation - ${serviceName}`,
      html: emailContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Customer confirmation email sent:', info.messageId);
  } catch (error) {
    console.error('❌ Failed to send customer confirmation email:', error);
    // Don't throw error for customer email failure
  }
};