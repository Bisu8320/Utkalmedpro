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

/**
 * Sends a booking confirmation SMS to the customer.
 * @example
 * sync("+123456789", "John Doe", "Consultation", "2023-10-01", "15:00", "ABC123")
 * true
 * @param {string} phoneNumber - The customer's phone number.
 * @param {string} customerName - The customer's name.
 * @param {string} service - The booked service description.
 * @param {string} date - The date of the service.
 * @param {string} time - The time of the service.
 * @param {string} bookingId - The unique booking identifier.
 * @returns {Promise<boolean>} Returns true if the SMS was successfully sent, otherwise false.
 * @description
 *   - Simulates sending an SMS by logging to console and optionally showing an alert in development.
 *   - Logs SMS activity for administrative tracking.
 *   - Handles errors during SMS sending process, logging failed attempt.
 */
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

/**
 * Sends a cancellation SMS to the specified phone number.
 * @example
 * sync('+911234567890', 'John Doe', 'Dental Appointment', '123456')
 * true
 * @param {string} phoneNumber - The recipient's phone number.
 * @param {string} customerName - The name of the customer.
 * @param {string} service - The service that has been booked.
 * @param {string} bookingId - The unique ID of the booking.
 * @returns {Promise<boolean>} Indicates whether the SMS was sent successfully.
 * @description
 *   - Logs SMS activity with a status of 'sent' or 'failed' based on operation success.
 *   - Displays an alert with the SMS details in development environment.
 *   - Simulates SMS sending with a delay of 1 second.
 */
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

/**
* Sends a staff assignment SMS with booking details to the specified staff member.
* @example
* sync('+123456789', 'John Doe', 'Jane Smith', 'Consultation', '2023-10-25', '10:00 AM', '123 Medical St.', 'B123')
* true
* @param {string} staffPhone - The phone number of the staff member receiving the assignment.
* @param {string} staffName - The name of the staff member.
* @param {string} customerName - The name of the customer the staff is assigned to.
* @param {string} service - The type of service the customer booked.
* @param {string} date - The date of the booking.
* @param {string} time - The time of the booking.
* @param {string} address - The address where the service is to be provided.
* @param {string} bookingId - The unique identifier for the booking.
* @returns {Promise<boolean>} Returns a promise that resolves to true if the SMS is sent successfully, or false in case of an error.
* @description
*   - Logs the SMS activity as 'sent' or 'failed' based on the success of the operation.
*   - In development mode, displays an alert with the message details.
*   - Simulates a delay to mimic SMS sending process.
*/
export const sendStaffAssignmentSMS = async (
  staffPhone: string,
  staffName: string,
  customerName: string,
  service: string,
  date: string,
  time: string,
  address: string,
  bookingId: string
): Promise<boolean> => {
  try {
    const message = `Hi ${staffName}, you have been assigned a new booking:\n\nCustomer: ${customerName}\nService: ${service}\nDate: ${date} at ${time}\nAddress: ${address}\nBooking ID: #${bookingId}\n\nPlease contact customer before visit. - Utkal Medpro`
    
    console.log('Staff Assignment SMS Sent:', {
      to: staffPhone,
      message: message,
      timestamp: new Date().toISOString()
    })
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (process.env.NODE_ENV === 'development') {
      alert(`📱 Staff Assignment SMS Sent to ${staffPhone}:\n\n${message}`)
    }
    
    logSMSActivity(staffPhone, message, 'sent')
    return true
  } catch (error) {
    console.error('Error sending staff assignment SMS:', error)
    logSMSActivity(staffPhone, '', 'failed')
    return false
  }
}

// Log SMS activity for admin tracking
/**
 * Logs SMS activities by storing the details of the message, recipient, and delivery status.
 * @example
 * logSMSActivity('+1234567890', 'Hello, World!', 'sent')
 * @param {string} phoneNumber - The recipient's phone number.
 * @param {string} message - The content of the SMS message.
 * @param {'sent' | 'failed'} status - The delivery status of the message.
 * @returns {void} This function does not return anything.
 * @description
 *   - Maintains a history of the last 100 SMS logs.
 *   - Uses localStorage to persist SMS log data.
 *   - Handles any errors during logging by outputting them to the console.
 */
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
/**
 * Sends an SMS message to a specified phone number using a predefined SMS service configuration.
 * @example
 * sync('+1234567890', 'Hello World!')
 * { status: 'success', messageId: 'abc123' }
 * @param {string} phoneNumber - The recipient's phone number in international format.
 * @param {string} message - The text message content to send to the recipient.
 * @returns {Promise<Object>} A promise that resolves to the JSON response from the SMS service.
 * @description
 *   - Utilizes FormData to format message data for the SMS service API.
 *   - Requires an API key and sender ID, which are configured in SMS_CONFIG.
 *   - Communicates with the SMS service via a POST request to the service's base URL.
 *   - The response JSON typically contains the status and a message ID for tracking.
 */
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
/**
 * Sends an SMS to a specified phone number using Twilio's API.
 * @example
 * sync('+1234567890', 'Hello, World!')
 * { sid: 'SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', status: 'queued', ... }
 * @param {string} phoneNumber - The recipient's phone number in E.164 format.
 * @param {string} message - The message content to be sent.
 * @returns {Promise<Object>} A promise that resolves to the response object containing details of the sent message.
 * @description
 *   - Utilizes Twilio's REST API to send SMS messages.
 *   - Requires environment variables for account SID, auth token, and originating phone number.
 *   - Uses basic authentication for API access.
 */
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
/**
* Sends an SMS to a specified phone number using MSG91 service.
* @example
* sync('9876543210', 'Hello, this is a test message.')
* { message: 'SMS sent successfully', status: 'success' }
* @param {string} phoneNumber - The recipient's phone number in string format.
* @param {string} message - The SMS content to be sent to the recipient.
* @returns {object} JSON response from MSG91 API indicating the status of the SMS.
* @description
*   - Uses environment variables for authentication and sender ID.
*   - Utilizes MSG91 API's HTTP route for SMS delivery.
*   - Assumes the country code as '91'.
*   - Requires the configuration of MSG91 credentials via environment variables.
*/
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