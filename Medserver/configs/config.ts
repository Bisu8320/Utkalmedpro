import dotenv from 'dotenv';
dotenv.config();

// Generate a fallback JWT secret if not provided
const generateFallbackSecret = () => {
  return 'fallback-jwt-secret-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const Configs = {
    JWT_SECRET: process.env.JWT_SECRET || generateFallbackSecret(), 
    PORT: process.env.PORT || '',
    MONGODB_URL: process.env.MONGODB_URL || '',
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || '',
    ADMIN_PHONE_NUMBER: process.env.ADMIN_PHONE_NUMBER || '+917064055180',
    EMAIL_USER: process.env.EMAIL_USER || '',
    EMAIL_PASS: process.env.EMAIL_PASS || '',
  };