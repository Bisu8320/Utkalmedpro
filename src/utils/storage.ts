import { Booking, Offer, ContactMessage, Staff, StaffMessage } from '../types'
import { 
  fetchCloudData, 
  saveCloudData, 
  addBookingToCloud, 
  updateBookingInCloud,
  addCustomerToCloud,
  syncWithCloud,
  startAutoSync
} from './cloudStorage'

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

// Initialize with cloud data
export const initializeSampleData = async () => {
  try {
    console.log('🌐 Initializing cloud storage...')
    
    // Start auto-sync for real-time updates
    startAutoSync()
    
    // Sync with cloud on startup
    await syncWithCloud()
    
    console.log('✅ Cloud storage initialized successfully')
  } catch (error) {
    console.error('❌ Error initializing cloud storage:', error)
    // Fallback to local storage if cloud fails
    initializeLocalData()
  }
}

// Fallback local initialization
const initializeLocalData = () => {
  const existingBookings = localStorage.getItem(BOOKINGS_KEY)
  if (!existingBookings) {
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
      }
    ]
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(sampleBookings))
  }
}

// Enhanced booking functions with cloud sync
export const saveBooking = async (booking: Omit<Booking, 'id' |'status'| 'createdAt'>): Promise<Booking> => {
  try {
    // Save to cloud first
    const success = await addBookingToCloud(booking)
    
    if (success) {
      // Also save locally for offline access
      const bookings = getBookings()
      const newBooking: Booking = {
        ...booking,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: 'pending'
      }
      bookings.push(newBooking)
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
      
      // Notify listeners
      setTimeout(() => {
        notifyListeners(BOOKINGS_KEY)
      }, 100)
      
      console.log('📱 Booking saved to cloud and local storage')
      return newBooking
    } else {
      throw new Error('Failed to save booking to cloud')
    }
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

export const updateBookingStatus = async (id: string, status: Booking['status']): Promise<void> => {
  try {
    // Update in cloud
    await updateBookingInCloud(id, { status })
    
    // Update locally
    const bookings = getBookings()
    const index = bookings.findIndex(b => b.id === id)
    if (index !== -1) {
      bookings[index].status = status
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
      notifyListeners(BOOKINGS_KEY)
    }
    
    console.log(`📝 Booking ${id} status updated to ${status}`)
  } catch (error) {
    console.error('Error updating booking status:', error)
  }
}

export const assignBookingToStaff = async (bookingId: string, staffId: string, staffName: string, notes?: string): Promise<void> => {
  try {
    const updates = {
      assignedStaffId: staffId,
      assignedStaffName: staffName,
      status: 'confirmed',
      ...(notes && { staffNotes: notes })
    }
    
    // Update in cloud
    await updateBookingInCloud(bookingId, updates)
    
    // Update locally
    const bookings = getBookings()
    const index = bookings.findIndex(b => b.id === bookingId)
    if (index !== -1) {
      Object.assign(bookings[index], updates)
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
      notifyListeners(BOOKINGS_KEY)
      
      // Update staff current bookings count
      updateStaffBookingCount(staffId, 1)
    }
    
    console.log(`👨‍⚕️ Booking ${bookingId} assigned to ${staffName}`)
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

// Customer functions with cloud sync
export const saveCustomer = async (customer: any): Promise<boolean> => {
  try {
    // Save to cloud
    await addCustomerToCloud(customer)
    
    // Save locally
    const customers = getCustomers()
    customers.push(customer)
    localStorage.setItem('utkal_customers', JSON.stringify(customers))
    
    return true
  } catch (error) {
    console.error('Error saving customer:', error)
    return false
  }
}

const getCustomers = () => {
  try {
    const stored = localStorage.getItem('utkal_customers')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error getting customers:', error)
    return []
  }
}

// Storage keys for listeners
export { BOOKINGS_KEY, OFFERS_KEY, MESSAGES_KEY, STAFF_KEY, STAFF_MESSAGES_KEY }