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
/**
* Initializes local storage with sample data for bookings, messages, offers, and staff if no data exists.
* @example
* initializeStorageData()
* // Sets up localStorage with sample data if not previously present.
* @param {void} No parameters - The function does not accept any arguments.
* @returns {void} No return value - The function performs actions without returning any value.
* @description
*   - Checks local storage for existing data under specific keys to prevent overwriting.
*   - Creates sample data for demonstration if corresponding data is absent.
*   - Utilizes current dates to generate timestamps for sample entries.
*   - Ensures that initialized data is properly formatted as JSON strings in local storage.
*/
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
/**
 * Creates and saves a new booking with automatic id, status, and creation date.
 * @example
 * const newBooking = createBooking({user: 'John Doe', date: '2023-10-12'})
 * Returns a Booking object with added properties like id, status 'pending', and createdAt.
 * @param {Omit<Booking, 'id' | 'status' | 'createdAt'>} booking - Partial booking object without id, status, and createdAt.
 * @returns {Booking} A fully constructed Booking object including generated id and timestamps.
 * @description
 *   - Uses current timestamp to generate a unique id for the booking.
 *   - Sets the status of the booking to 'pending' by default.
 *   - Notifies listeners after booking is successfully saved.
 */
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

/**
 * Updates the status of a booking with the given ID and persists changes.
 * @example
 * updateBookingStatus('abc123', 'confirmed')
 * // Updates the booking with ID 'abc123' to have the status 'confirmed'.
 * @param {string} id - The ID of the booking to update.
 * @param {Booking['status']} status - The new status to set for the booking.
 * @returns {void} No return value.
 * @description
 *   - Searches for the booking with the provided ID.
 *   - Updates the booking's status if the ID is found.
 *   - Persists changes to localStorage using a specific key defined in the constants.
 *   - Notifies listeners about the update to reflect changes across the application.
 */
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

/**
 * Assign a staff member to a booking by updating the booking record.
 * @example
 * assignBookingToStaff('123', '456', 'John Doe', 'Extra care needed')
 * // Successfully updates the booking record and staff count.
 * @param {string} bookingId - The unique identifier of the booking to be assigned.
 * @param {string} staffId - The unique identifier of the staff member assigned to the booking.
 * @param {string} staffName - The name of the staff member assigned to the booking.
 * @param {string} [notes] - Optional notes from staff related to the booking.
 * @returns {void} Does not return a value.
 * @description
 *   - Retrieves existing bookings from local storage before modifying.
 *   - Updates the staff booking count after assigning a booking.
 *   - Informs listeners about the booking update via a notification system.
 */
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
/**
 * Adds a new staff member to the staff list with default values for certain fields.
 * @example
 * addStaff({name: "John Doe", role: "Manager"})
 * // Returns: {name: "John Doe", role: "Manager", id: "1609459200000", currentBookings: 0, totalCompleted: 0, rating: 5.0, joinedDate: "2021-01-01T00:00:00.000Z"}
 * @param {Omit<Staff, 'id' | 'currentBookings' | 'totalCompleted' | 'rating' | 'joinedDate'>} staff - Details of the staff member excluding default fields.
 * @returns {Staff} A complete staff object including generated default fields.
 * @description
 *   - Generates a unique ID based on the current timestamp for the new staff member.
 *   - Initializes the 'rating' field to 5.0 by default.
 *   - Sets 'currentBookings' and 'totalCompleted' to 0 as default values.
 *   - The 'joinedDate' field is set to the current date and time in ISO string format.
 */
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

/**
* Updates staff information identified by id using partial updates provided.
* @example
* updateStaff('123', {name: 'John Doe', position: 'Manager'})
* // Updates the staff member with id '123' with the new name and position.
* @param {string} id - The unique identifier for a staff member.
* @param {Partial<Staff>} updates - An object containing the properties to be updated.
* @returns {void} No return value.
* @description
*   - Uses localStorage to persist the updated staff list.
*   - If the specified staff id does not exist, no updates are made and no errors are thrown.
*   - Notifies listeners subscribed to changes in staff data upon successful update.
*   - Catches potential errors during the update process and logs them to the console.
*/
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

/**
 * Updates the booking count for a specific staff member in the local storage.
 * @example
 * updateStaffBookingCount("staff123", 2)
 * // This will increment the current bookings of staff with ID "staff123" by 2.
 * @param {string} staffId - The ID of the staff member whose booking count needs to be updated.
 * @param {number} increment - The number by which the current bookings should be incremented. Can be negative to decrement.
 * @returns {void} Does not return anything.
 * @description
 *   - If the increment is negative, adds the absolute value of increment to totalCompleted bookings.
 *   - Updates the staff data in the local storage under the key defined by STAFF_KEY.
 *   - Triggers notifyListeners to inform other parts of the application of the update.
 *   - Logs an error to the console if updating fails.
 */
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
/**
* Sends a staff message and stores it in local storage.
* @example
* sendStaffMessage({ text: "Hello Team!" })
* // Returns the new staff message object with generated id and sentAt timestamp.
* @param {Omit<StaffMessage, 'id' | 'sentAt'>} message - The staff message object without 'id' or 'sentAt' properties.
* @returns {StaffMessage} A complete staff message object including generated 'id' and 'sentAt' timestamp.
* @description
*   - Generates a unique identifier for the message using the current timestamp.
*   - Adds the current timestamp as the 'sentAt' property in ISO format.
*   - Stores the updated list of staff messages in browser's local storage.
*   - Notifies listeners after updating the local storage with new message data.
*/
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

/**
* Marks a staff message as read by updating its readAt timestamp.
* @example
* markStaffMessageAsRead("abc123")
* // Updates the readAt property for the message with id "abc123"
* @param {string} messageId - The ID of the message to be marked as read.
* @returns {void} This function does not return a value.
* @description
*   - Updates the `readAt` property of the staff message to the current timestamp.
*   - Persists the updated messages to local storage under the `STAFF_MESSAGES_KEY`.
*   - Notifies listeners that the staff messages have been updated.
*   - Logs an error if the operation fails.
*/
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
/**
 * Creates and saves a new offer by adding an ID and creation timestamp.
 * @example
 * saveOffer({ name: "Special Discount", price: 100 })
 * // Returns: { name: "Special Discount", price: 100, id: "1634891287345", createdAt: "2023-03-15T12:00:00Z" }
 * @param {Omit<Offer, 'id' | 'createdAt'>} offer - The offer details excluding ID and creation date.
 * @returns {Offer} The created offer including auto-generated ID and creation timestamp.
 * @description
 *   - Validates the absence of 'id' and 'createdAt' in the input offer.
 *   - Each offer is given a unique identifier based on the current timestamp.
 *   - The offer list is stored in the browser's local storage.
 *   - Notifies other parts of the application when the offers are updated.
 */
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

/**
 * Updates an existing offer in the local storage.
 * @example
 * updateOffer('offer123', { price: 299.99 })
 * // no return value
 * @param {string} id - ID of the offer to be updated.
 * @param {Partial<Offer>} updates - Partial object containing properties to update in the offer.
 * @returns {void} No return value.
 * @description
 *   - Uses `localStorage.setItem` to persist updates.
 *   - Notifies listeners with `notifyListeners`.
 *   - Logs an error if the update process fails.
 */
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
/**
 * Adds a new contact message to the local storage and notifies listeners.
 * @example
 * message({ name: 'John Doe', content: 'Hello World' })
 * { id: '1642271111234', createdAt: '2022-01-15T10:25:11.234Z', status: 'new', name: 'John Doe', content: 'Hello World' }
 * @param {Omit<ContactMessage, 'id' | 'createdAt' | 'status'>} message - The contact message information except for id, createdAt, and status.
 * @returns {ContactMessage} A new ContactMessage object including id, createdAt, and status.
 * @description
 *   - Generates a unique id based on the current timestamp.
 *   - Sets the initial status of the message to 'new'.
 *   - Updates the local storage with the new message.
 */
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

/**
* Updates the status of a contact message based on its ID and saves the change in local storage.
* @example
* updateMessageStatus('1234', 'read')
* // No return value, simply updates the message status and notifies listeners.
* @param {string} id - The unique identifier of the contact message to be updated.
* @param {ContactMessage['status']} status - The new status to set for the contact message.
* @returns {void} This function does not return a value.
* @description
*   - If the specified contact message ID is not found, no update is performed.
*   - Uses localStorage to persist changes across page reloads.
*   - Notifies listeners to react to updated data stored under the key.
*   - Handles any error that might occur while accessing or updating messages.
*/
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