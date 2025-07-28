import {LRUCache} from 'lru-cache';

const otpCache = new LRUCache<string, string>({
  max: 100,
  ttl: 1000 * 60 * 10, // 10 minutes
});

/**
 * Set OTP in LRU cache
 */
export const setOtpForNumber = (phone: string, otp: string): void => {
  otpCache.set(phone, otp);
};

/**
 * Verify OTP from LRU cache
 */
export const verifyOtpForNumber = (phone: string, inputOtp: string): boolean => {
  const storedOtp = otpCache.get(phone);
  return storedOtp === inputOtp;
};
