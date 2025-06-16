import { Booking, Offer, ContactMessage } from '../types'

// Local storage keys
const BOOKINGS_KEY = 'utkal_medpro_bookings'
const OFFERS_KEY = 'utkal_medpro_offers'
const MESSAGES_KEY = 'utkal_medpro_messages'

// Initialize with sample data if empty
const initializeSampleData = () => {
  const bookings = getBookings()
  if (bookings.length === 0) {
    // Add sample bookings for demonstration
    const sampleBookings: Booking[] = [
      {
        id: '1',
        service: 'Blood Sample Collection',
        name: 'John Doe',
        phone: '+91 9876543210',
        email: 'john.doe@example.com',
        address: '123 Main Street, Bhubaneswar, Odisha - 751001',
        date: '2024-01-15',
        time: '10:00 AM',
        notes: 'Fasting blood test required',
        status: 'pending',
        createdAt: new Date().toISOString(),
        price: '₹299'
      },
      {
        id: '2',
        service: 'Home Injection',
        name: 'Sarah Smith',
        phone: '+91 8765432109',
        email: 'sarah.smith@example.com',
        address: '456 Park Avenue, Cuttack, Odisha - 753001',
        date: '2024-01-16',
        time: '02:00 PM',
        notes: 'Insulin injection - daily schedule',
        status: 'confirmed',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        price: '₹199'
      },
      {
        id: '3',
        service: 'Wound Dressing',
        name: 'Raj Patel',
        phone: '+91 7654321098',
        email: 'raj.patel@example.com',
        address: '789 Hospital Road, Khordha, Odisha - 752050',
        date: '2024-01-17',
        time: '11:00 AM',
        notes: 'Post-surgery wound care',
        status: 'completed',
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        price: '₹499'
      }
    ]
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(sampleBookings))
  }

  const messages = getContactMessages()
  if (messages.length === 0) {
    // Add sample contact messages
    const sampleMessages: ContactMessage[] = [
      {
        id: '1',
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        phone: '+91 9988776655',
        subject: 'Service Inquiry',
        message: 'I would like to know more about your blood collection services. Do you provide services on weekends?',
        status: 'new',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Amit Kumar',
        email: 'amit.kumar@example.com',
        phone: '+91 8877665544',
        subject: 'Emergency Request',
        message: 'Need urgent wound dressing service for my elderly father. Please contact immediately.',
        status: 'replied',
        createdAt: new Date(Date.now() - 43200000).toISOString() // 12 hours ago
      }
    ]
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(sampleMessages))
  }

  const offers = getOffers()
  if (offers.length === 0) {
    // Add sample offers
    const sampleOffers: Offer[] = [
      {
        id: '1',
        title: 'New Year Health Package',
        description: 'Complete health checkup at your doorstep with 30% discount',
        discount: '30% OFF',
        validUntil: '2024-01-31',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Senior Citizen Care',
        description: 'Special discount for elderly care services',
        discount: '₹200 OFF',
        validUntil: '2024-02-15',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ]
    localStorage.setItem(OFFERS_KEY, JSON.stringify(sampleOffers))
  }
}

// Booking functions
export const saveBooking = (booking: Omit<Booking, 'id' |'status'| 'createdAt'>): Booking => {
  const bookings = getBookings()
  const newBooking: Booking = {
    ...booking,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: 'pending'
  }
  bookings.push(newBooking)
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
  return newBooking
}

export const getBookings = (): Booking[] => {
  const stored = localStorage.getItem(BOOKINGS_KEY)
  const bookings = stored ? JSON.parse(stored) : []
  
  // Initialize sample data if no bookings exist
  if (bookings.length === 0) {
    initializeSampleData()
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]')
  }
  
  return bookings
}

export const updateBookingStatus = (id: string, status: Booking['status']): void => {
  const bookings = getBookings()
  const index = bookings.findIndex(b => b.id === id)
  if (index !== -1) {
    bookings[index].status = status
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
  }
}

// Offer functions
export const saveOffer = (offer: Omit<Offer, 'id' | 'createdAt'>): Offer => {
  const offers = getOffers()
  const newOffer: Offer = {
    ...offer,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  }
  offers.push(newOffer)
  localStorage.setItem(OFFERS_KEY, JSON.stringify(offers))
  return newOffer
}

export const getOffers = (): Offer[] => {
  const stored = localStorage.getItem(OFFERS_KEY)
  const offers = stored ? JSON.parse(stored) : []
  
  // Initialize sample data if no offers exist
  if (offers.length === 0) {
    initializeSampleData()
    return JSON.parse(localStorage.getItem(OFFERS_KEY) || '[]')
  }
  
  return offers
}

export const updateOffer = (id: string, updates: Partial<Offer>): void => {
  const offers = getOffers()
  const index = offers.findIndex(o => o.id === id)
  if (index !== -1) {
    offers[index] = { ...offers[index], ...updates }
    localStorage.setItem(OFFERS_KEY, JSON.stringify(offers))
  }
}

export const deleteOffer = (id: string): void => {
  const offers = getOffers()
  const filtered = offers.filter(o => o.id !== id)
  localStorage.setItem(OFFERS_KEY, JSON.stringify(filtered))
}

// Contact message functions
export const saveContactMessage = (message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): ContactMessage => {
  const messages = getContactMessages()
  const newMessage: ContactMessage = {
    ...message,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: 'new'
  }
  messages.push(newMessage)
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
  return newMessage
}

export const getContactMessages = (): ContactMessage[] => {
  const stored = localStorage.getItem(MESSAGES_KEY)
  const messages = stored ? JSON.parse(stored) : []
  
  // Initialize sample data if no messages exist
  if (messages.length === 0) {
    initializeSampleData()
    return JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]')
  }
  
  return messages
}

export const updateMessageStatus = (id: string, status: ContactMessage['status']): void => {
  const messages = getContactMessages()
  const index = messages.findIndex(m => m.id === id)
  if (index !== -1) {
    messages[index].status = status
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
  }
}