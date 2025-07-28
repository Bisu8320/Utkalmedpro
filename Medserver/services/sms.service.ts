import twilio from 'twilio';
import { Configs } from '../configs/config';

const accountSid = Configs.TWILIO_ACCOUNT_SID;
const authToken = Configs.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = Configs.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

/**
 * Send a single SMS using Twilio
 */
export const sendSMS = async (to: string, body: string): Promise<void> => {
  try {
    console.log("sending sms to", to);
    const message = await client.messages.create({
      body,
      from: twilioPhoneNumber,
      to,
    });
    console.log('✅ SMS sent:', message.sid);
  } catch (error) {
    console.error('❌ Failed to send SMS:', error);
    throw error;
  }
};

/**
 * Prepare and send SMS to both admin and customer
 */
export const prepareSms = async (
  customerName: string,
  customerPhoneNumber: string,
  customerEmail: string,
  customerAddress: string,
  serviceName: string,
  customerDate: string,
  customerTime: string,
  customerAdditionalNotes: string
): Promise<void> => {
  const adminSMS = `📩Hey Admin New Booking Request From ${customerName}\nPhone: ${customerPhoneNumber}`;

  const customerSMS = `Hi ${customerName}, your booking request has been received! We'll get back to you soon.`;

  // Send both SMS in parallel (non-blocking relative to each other)
  Promise.all([
    sendSMS(Configs.ADMIN_PHONE_NUMBER, adminSMS).catch((e) => {
      console.error('❌ Failed to send SMS to admin:', e.message);
    }),
    sendSMS(customerPhoneNumber, customerSMS).catch((e) => {
      console.error('❌ Failed to send SMS to customer:', e.message);
    }),
  ]);
  
};
