// SMS Service for sending OTP and notifications
export const sendOTP = async (phone: string, otp: string): Promise<boolean> => {
  try {
    // In production, integrate with SMS provider like Twilio, AWS SNS, etc.
    console.log(`📱 SMS: Sending OTP ${otp} to ${phone}`)
    
    // Simulate SMS sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo purposes, always return success
    return true
  } catch (error) {
    console.error('Error sending SMS:', error)
    return false
  }
}

export const verifyOTP = async (phone: string, otp: string): Promise<boolean> => {
  // This would typically verify with your SMS provider
  // For demo, we'll use the in-memory store
  return true
}

export const sendBookingConfirmation = async (
  phone: string,
  customerName: string,
  service: string,
  date: string,
  time: string,
  bookingId: string
): Promise<boolean> => {
  try {
    const message = `Dear ${customerName}, your booking for ${service} on ${date} at ${time} has been CONFIRMED. Booking ID: #${bookingId}. Our professional will contact you before the visit. - Utkal Medpro`
    
    console.log(`📱 SMS: ${message}`)
    
    // Simulate SMS sending
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return true
  } catch (error) {
    console.error('Error sending booking confirmation:', error)
    return false
  }
}