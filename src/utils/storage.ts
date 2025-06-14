import { Booking, Offer, ContactMessage } from '../types'

// Local storage keys
const BOOKINGS_KEY = 'utkal_medpro_bookings'
const OFFERS_KEY = 'utkal_medpro_offers'
const MESSAGES_KEY = 'utkal_medpro_messages'

// Booking functions
export const saveBooking = (booking: Omit<Booking, 'id' | 'createdAt'>): Booking => {
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
  return stored ? JSON.parse(stored) : []
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
  return stored ? JSON.parse(stored) : []
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
  return stored ? JSON.parse(stored) : []
}

export const updateMessageStatus = (id: string, status: ContactMessage['status']): void => {
  const messages = getContactMessages()
  const index = messages.findIndex(m => m.id === id)
  if (index !== -1) {
    messages[index].status = status
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
  }
}