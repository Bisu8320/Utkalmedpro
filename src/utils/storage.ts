import { Booking, Offer, ContactMessage, Staff, StaffMessage } from '../types'

// Local storage keys
const BOOKINGS_KEY = 'utkal_medpro_bookings'
const OFFERS_KEY = 'utkal_medpro_offers'
const MESSAGES_KEY = 'utkal_medpro_messages'
const STAFF_KEY = 'utkal_medpro_staff'
const STAFF_MESSAGES_KEY = 'utkal_medpro_staff_messages'

// Event listeners for storage changes
const storageListeners: { [key: string]: (() => void)[] } = {}

// Add storage event listener
export const addStorageListener = (key: string, callback: () => void) => {
  if (!storageListeners[key]) {
    storageListeners[key] = []
  }
  storageListeners[key].push(callback)
}

// Remove storage event listener
export const removeStorageListener = (key: string, callback: () => void) => {
  if (storageListeners[key]) {
    storageListeners[key] = storageListeners[key].filter(cb => cb !== callback)
  }
}

// Notify listeners when storage changes
const notifyListeners = (key: string) => {
  if (storageListeners[key]) {
    storageListeners[key].forEach(callback => {
      try {
        callback()
      } catch (error) {
        console.error('Error in storage listener:', error)
      }
    })
  }
}

// Initialize with sample data if empty
export const initializeSampleData = () => {
  // Check if data already exists to avoid overwriting
  const existingBookings = localStorage.getItem(BOOKINGS_KEY)
  const existingMessages = localStorage.getItem(MESSAGES_KEY)
  const existingOffers = localStorage.getItem(OFFERS_KEY)
  const existingStaff = localStorage.getItem(STAFF_KEY)

  if (!existingBookings) {
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
        price: '₹199',
        assignedStaffId: '1',
        assignedStaffName: 'Dr. Priya Sharma'
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
        price: '₹499',
        assignedStaffId: '2',
        assignedStaffName: 'Nurse Amit Kumar'
      }
    ]
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(sampleBookings))
  }

  if (!existingMessages) {
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

  if (!existingOffers) {
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

  if (!existingStaff) {
    // Add sample staff members
    const sampleStaff: Staff[] = [
      {
        id: '1',
        name: 'Dr. Priya Sharma',
        phone: '+91 9876543210',
        email: 'priya.sharma@utkalmedpro.com',
        specialization: ['Blood Collection', 'Health Monitoring', 'Injections'],
        experience: '5 years',
        qualification: 'B.Sc Nursing, Certified Phlebotomist',
        isActive: true,
        currentBookings: 3,
        totalCompleted: 245,
        rating: 4.8,
        joinedDate: '2022-01-15',
        address: 'Bhubaneswar, Odisha',
        emergencyContact: '+91 9876543211'
      },
      {
        id: '2',
        name: 'Nurse Amit Kumar',
        phone: '+91 8765432109',
        email: 'amit.kumar@utkalmedpro.com',
        specialization: ['Wound Dressing', 'Post-Surgery Care', 'Elderly Care'],
        experience: '7 years',
        qualification: 'GNM, Wound Care Specialist',
        isActive: true,
        currentBookings: 2,
        totalCompleted: 312,
        rating: 4.9,
        joinedDate: '2021-06-10',
        address: 'Cuttack, Odisha',
        emergencyContact: '+91 8765432110'
      },
      {
        id: '3',
        name: 'Technician Ravi Patel',
        phone: '+91 7654321098',
        email: 'ravi.patel@utkalmedpro.com',
        specialization: ['Blood Collection', 'Sample Handling', 'Lab Coordination'],
        experience: '3 years',
        qualification: 'Diploma in Medical Lab Technology',
        isActive: true,
        currentBookings: 1,
        totalCompleted: 156,
        rating: 4.7,
        joinedDate: '2023-03-20',
        address: 'Khordha, Odisha',
        emergencyContact: '+91 7654321099'
      }
    ]
    localStorage.setItem(STAFF_KEY, JSON.stringify(sampleStaff))
  }
}

// Booking functions
export const saveBooking = (booking: Omit<Booking, 'id' |'status'| 'createdAt'>): Booking => {
  try {
    const bookings = getBookings()
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    }
    bookings.push(newBooking)
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
    
    // Notify listeners after successful save
    setTimeout(() => {
      notifyListeners(BOOKINGS_KEY)
    }, 100)
    
    return newBooking
  } catch (error) {
    console.error('Error saving booking:', error)
    throw error
  }
}

export const getBookings = (): Booking[] => {
  try {
    const stored = localStorage.getItem(BOOKINGS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error getting bookings:', error)
    return []
  }
}

export const updateBookingStatus = (id: string, status: Booking['status']): void => {
  try {
    const bookings = getBookings()
    const index = bookings.findIndex(b => b.id === id)
    if (index !== -1) {
      bookings[index].status = status
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
      notifyListeners(BOOKINGS_KEY)
    }
  } catch (error) {
    console.error('Error updating booking status:', error)
  }
}

export const assignBookingToStaff = (bookingId: string, staffId: string, staffName: string, notes?: string): void => {
  try {
    const bookings = getBookings()
    const index = bookings.findIndex(b => b.id === bookingId)
    if (index !== -1) {
      bookings[index].assignedStaffId = staffId
      bookings[index].assignedStaffName = staffName
      if (notes) {
        bookings[index].staffNotes = notes
      }
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
      notifyListeners(BOOKINGS_KEY)
      
      // Update staff current bookings count
      updateStaffBookingCount(staffId, 1)
    }
  } catch (error) {
    console.error('Error assigning booking to staff:', error)
  }
}

// Staff functions
export const saveStaff = (staff: Omit<Staff, 'id' | 'currentBookings' | 'totalCompleted' | 'rating' | 'joinedDate'>): Staff => {
  try {
    const staffList = getStaff()
    const newStaff: Staff = {
      ...staff,
      id: Date.now().toString(),
      currentBookings: 0,
      totalCompleted: 0,
      rating: 5.0,
      joinedDate: new Date().toISOString()
    }
    staffList.push(newStaff)
    localStorage.setItem(STAFF_KEY, JSON.stringify(staffList))
    notifyListeners(STAFF_KEY)
    return newStaff
  } catch (error) {
    console.error('Error saving staff:', error)
    throw error
  }
}

export const getStaff = (): Staff[] => {
  try {
    const stored = localStorage.getItem(STAFF_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error getting staff:', error)
    return []
  }
}

export const updateStaff = (id: string, updates: Partial<Staff>): void => {
  try {
    const staffList = getStaff()
    const index = staffList.findIndex(s => s.id === id)
    if (index !== -1) {
      staffList[index] = { ...staffList[index], ...updates }
      localStorage.setItem(STAFF_KEY, JSON.stringify(staffList))
      notifyListeners(STAFF_KEY)
    }
  } catch (error) {
    console.error('Error updating staff:', error)
  }
}

export const deleteStaff = (id: string): void => {
  try {
    const staffList = getStaff()
    const filtered = staffList.filter(s => s.id !== id)
    localStorage.setItem(STAFF_KEY, JSON.stringify(filtered))
    notifyListeners(STAFF_KEY)
  } catch (error) {
    console.error('Error deleting staff:', error)
  }
}

export const updateStaffBookingCount = (staffId: string, increment: number): void => {
  try {
    const staffList = getStaff()
    const index = staffList.findIndex(s => s.id === staffId)
    if (index !== -1) {
      staffList[index].currentBookings += increment
      if (increment < 0) {
        staffList[index].totalCompleted += Math.abs(increment)
      }
      localStorage.setItem(STAFF_KEY, JSON.stringify(staffList))
      notifyListeners(STAFF_KEY)
    }
  } catch (error) {
    console.error('Error updating staff booking count:', error)
  }
}

// Staff Messages functions
export const sendStaffMessage = (message: Omit<StaffMessage, 'id' | 'sentAt'>): StaffMessage => {
  try {
    const messages = getStaffMessages()
    const newMessage: StaffMessage = {
      ...message,
      id: Date.now().toString(),
      sentAt: new Date().toISOString()
    }
    messages.push(newMessage)
    localStorage.setItem(STAFF_MESSAGES_KEY, JSON.stringify(messages))
    notifyListeners(STAFF_MESSAGES_KEY)
    return newMessage
  } catch (error) {
    console.error('Error sending staff message:', error)
    throw error
  }
}

export const getStaffMessages = (): StaffMessage[] => {
  try {
    const stored = localStorage.getItem(STAFF_MESSAGES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error getting staff messages:', error)
    return []
  }
}

export const markStaffMessageAsRead = (messageId: string): void => {
  try {
    const messages = getStaffMessages()
    const index = messages.findIndex(m => m.id === messageId)
    if (index !== -1) {
      messages[index].readAt = new Date().toISOString()
      localStorage.setItem(STAFF_MESSAGES_KEY, JSON.stringify(messages))
      notifyListeners(STAFF_MESSAGES_KEY)
    }
  } catch (error) {
    console.error('Error marking staff message as read:', error)
  }
}

// Offer functions
export const saveOffer = (offer: Omit<Offer, 'id' | 'createdAt'>): Offer => {
  try {
    const offers = getOffers()
    const newOffer: Offer = {
      ...offer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    offers.push(newOffer)
    localStorage.setItem(OFFERS_KEY, JSON.stringify(offers))
    notifyListeners(OFFERS_KEY)
    return newOffer
  } catch (error) {
    console.error('Error saving offer:', error)
    throw error
  }
}

export const getOffers = (): Offer[] => {
  try {
    const stored = localStorage.getItem(OFFERS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error getting offers:', error)
    return []
  }
}

export const updateOffer = (id: string, updates: Partial<Offer>): void => {
  try {
    const offers = getOffers()
    const index = offers.findIndex(o => o.id === id)
    if (index !== -1) {
      offers[index] = { ...offers[index], ...updates }
      localStorage.setItem(OFFERS_KEY, JSON.stringify(offers))
      notifyListeners(OFFERS_KEY)
    }
  } catch (error) {
    console.error('Error updating offer:', error)
  }
}

export const deleteOffer = (id: string): void => {
  try {
    const offers = getOffers()
    const filtered = offers.filter(o => o.id !== id)
    localStorage.setItem(OFFERS_KEY, JSON.stringify(filtered))
    notifyListeners(OFFERS_KEY)
  } catch (error) {
    console.error('Error deleting offer:', error)
  }
}

// Contact message functions
export const saveContactMessage = (message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): ContactMessage => {
  try {
    const messages = getContactMessages()
    const newMessage: ContactMessage = {
      ...message,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'new'
    }
    messages.push(newMessage)
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
    notifyListeners(MESSAGES_KEY)
    return newMessage
  } catch (error) {
    console.error('Error saving contact message:', error)
    throw error
  }
}

export const getContactMessages = (): ContactMessage[] => {
  try {
    const stored = localStorage.getItem(MESSAGES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error getting contact messages:', error)
    return []
  }
}

export const updateMessageStatus = (id: string, status: ContactMessage['status']): void => {
  try {
    const messages = getContactMessages()
    const index = messages.findIndex(m => m.id === id)
    if (index !== -1) {
      messages[index].status = status
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
      notifyListeners(MESSAGES_KEY)
    }
  } catch (error) {
    console.error('Error updating message status:', error)
  }
}

// Storage keys for listeners
export { BOOKINGS_KEY, OFFERS_KEY, MESSAGES_KEY, STAFF_KEY, STAFF_MESSAGES_KEY }