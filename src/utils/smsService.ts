// SMS Service for sending booking confirmations
export interface SMSConfig {
  apiKey: string
  senderId: string
  baseUrl: string
}

// In production, these would come from environment variables
const SMS_CONFIG: SMSConfig = {
  apiKey: process.env.VITE_SMS_API_KEY || 'demo_api_key',
  senderId: 'UTKLMD',
  baseUrl: process.env.VITE_SMS_API_URL || 'https://api.textlocal.in/send/'
}

export const sendBookingConfirmationSMS = async (
  phoneNumber: string, 
  customerName: string, 
  service: string, 
  date: string, 
  time: string,
  bookingId: string
): Promise<boolean> => {
  try {
    // Format the message
    const message = `Dear ${customerName}, your booking for ${service} on ${date} at ${time} has been CONFIRMED. Booking ID: #${bookingId}. Our professional will contact you before the visit. - Utkal Medpro`
    
    // In production, you would make an actual API call to your SMS provider
    // For demo purposes, we'll simulate the SMS sending
    
    console.log('SMS Sent:', {
      to: phoneNumber,
      message: message,
      timestamp: new Date().toISOString()
    })
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo, show alert (in production, this would be a real SMS)
    if (process.env.NODE_ENV === 'development') {
      alert(`📱 SMS Sent to ${phoneNumber}:\n\n${message}`)
    }
    
    // Log SMS for admin tracking
    logSMSActivity(phoneNumber, message, 'sent')
    
    return true
  } catch (error) {
    console.error('Error sending SMS:', error)
    logSMSActivity(phoneNumber, '', 'failed')
    return false
  }
}

export const sendBookingCancellationSMS = async (
  phoneNumber: string, 
  customerName: string, 
  service: string, 
  bookingId: string
): Promise<boolean> => {
  try {
    const message = `Dear ${customerName}, your booking for ${service} (ID: #${bookingId}) has been cancelled. For rebooking or queries, call +91 7064055180. - Utkal Medpro`
    
    console.log('Cancellation SMS Sent:', {
      to: phoneNumber,
      message: message,
      timestamp: new Date().toISOString()
    })
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (process.env.NODE_ENV === 'development') {
      alert(`📱 Cancellation SMS Sent to ${phoneNumber}:\n\n${message}`)
    }
    
    logSMSActivity(phoneNumber, message, 'sent')
    return true
  } catch (error) {
    console.error('Error sending cancellation SMS:', error)
    logSMSActivity(phoneNumber, '', 'failed')
    return false
  }
}

// Log SMS activity for admin tracking
const logSMSActivity = (phoneNumber: string, message: string, status: 'sent' | 'failed') => {
  try {
    const logs = getSMSLogs()
    const newLog = {
      id: Date.now().toString(),
      phoneNumber,
      message,
      status,
      timestamp: new Date().toISOString()
    }
    logs.push(newLog)
    
    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100)
    }
    
    localStorage.setItem('utkal_sms_logs', JSON.stringify(logs))
  } catch (error) {
    console.error('Error logging SMS activity:', error)
  }
}

export const getSMSLogs = () => {
  try {
    const stored = localStorage.getItem('utkal_sms_logs')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error getting SMS logs:', error)
    return []
  }
}

// For production integration with popular SMS providers:

// 1. Textlocal API integration
export const sendSMSViaTextlocal = async (phoneNumber: string, message: string) => {
  const formData = new FormData()
  formData.append('apikey', SMS_CONFIG.apiKey)
  formData.append('numbers', phoneNumber)
  formData.append('message', message)
  formData.append('sender', SMS_CONFIG.senderId)
  
  const response = await fetch(SMS_CONFIG.baseUrl, {
    method: 'POST',
    body: formData
  })
  
  return response.json()
}

// 2. Twilio API integration example
export const sendSMSViaTwilio = async (phoneNumber: string, message: string) => {
  const accountSid = process.env.VITE_TWILIO_ACCOUNT_SID
  const authToken = process.env.VITE_TWILIO_AUTH_TOKEN
  const fromNumber = process.env.VITE_TWILIO_PHONE_NUMBER
  
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      From: fromNumber || '',
      To: phoneNumber,
      Body: message
    })
  })
  
  return response.json()
}

// 3. MSG91 API integration example
export const sendSMSViaMSG91 = async (phoneNumber: string, message: string) => {
  const authKey = process.env.VITE_MSG91_AUTH_KEY
  const senderId = process.env.VITE_MSG91_SENDER_ID
  
  const response = await fetch('https://api.msg91.com/api/sendhttp.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sender: senderId,
      route: '4',
      country: '91',
      sms: [{
        message: message,
        to: [phoneNumber]
      }]
    })
  })
  
  return response.json()
}