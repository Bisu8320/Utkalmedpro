// Cloud Storage Service using JSONBin.io (free tier)
// This allows data to sync across different devices

interface CloudStorageConfig {
  apiKey: string
  baseUrl: string
  binId: string
}

// Free JSONBin.io configuration
const CLOUD_CONFIG: CloudStorageConfig = {
  apiKey: '$2a$10$8K8vwuQmyIeYy5WSfQVbeOUsYqg6.IRJF8z0BVXkwjpbMXpjy.BtC', // Free API key
  baseUrl: 'https://api.jsonbin.io/v3',
  binId: '676b8f2fad19ca34f8c8f5a2' // Shared bin for Utkal Medpro
}

export interface CloudData {
  bookings: any[]
  staff: any[]
  messages: any[]
  offers: any[]
  customers: any[]
  lastUpdated: string
}

// Initialize cloud storage with default data
const initializeCloudData = (): CloudData => ({
  bookings: [],
  staff: [
    {
      id: '1',
      name: 'Dr. Priya Sharma',
      phone: '+91 9876543210',
      email: 'priya.sharma@utkalmedpro.com',
      specialization: ['Blood Collection', 'Health Monitoring', 'Injections'],
      experience: '5 years',
      qualification: 'B.Sc Nursing, Certified Phlebotomist',
      isActive: true,
      currentBookings: 0,
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
      currentBookings: 0,
      totalCompleted: 312,
      rating: 4.9,
      joinedDate: '2021-06-10',
      address: 'Cuttack, Odisha',
      emergencyContact: '+91 8765432110'
    }
  ],
  messages: [],
  offers: [
    {
      id: '1',
      title: 'New Year Health Package',
      description: 'Complete health checkup at your doorstep with 30% discount',
      discount: '30% OFF',
      validUntil: '2024-12-31',
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ],
  customers: [],
  lastUpdated: new Date().toISOString()
})

// Fetch data from cloud storage
export const fetchCloudData = async (): Promise<CloudData> => {
  try {
    const response = await fetch(`${CLOUD_CONFIG.baseUrl}/b/${CLOUD_CONFIG.binId}/latest`, {
      method: 'GET',
      headers: {
        'X-Master-Key': CLOUD_CONFIG.apiKey,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.log('No cloud data found, initializing...')
      const initialData = initializeCloudData()
      await saveCloudData(initialData)
      return initialData
    }

    const result = await response.json()
    return result.record || initializeCloudData()
  } catch (error) {
    console.error('Error fetching cloud data:', error)
    return initializeCloudData()
  }
}

// Save data to cloud storage
export const saveCloudData = async (data: CloudData): Promise<boolean> => {
  try {
    const dataToSave = {
      ...data,
      lastUpdated: new Date().toISOString()
    }

    const response = await fetch(`${CLOUD_CONFIG.baseUrl}/b/${CLOUD_CONFIG.binId}`, {
      method: 'PUT',
      headers: {
        'X-Master-Key': CLOUD_CONFIG.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSave)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    console.log('✅ Data saved to cloud successfully')
    return true
  } catch (error) {
    console.error('❌ Error saving to cloud:', error)
    return false
  }
}

// Add a new booking to cloud storage
export const addBookingToCloud = async (booking: any): Promise<boolean> => {
  try {
    const cloudData = await fetchCloudData()
    
    const newBooking = {
      ...booking,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    
    cloudData.bookings.push(newBooking)
    
    const success = await saveCloudData(cloudData)
    if (success) {
      console.log('📱 New booking added to cloud:', newBooking.id)
      // Trigger real-time notification for admin
      notifyAdminOfNewBooking(newBooking)
    }
    return success
  } catch (error) {
    console.error('Error adding booking to cloud:', error)
    return false
  }
}

// Update booking status in cloud
export const updateBookingInCloud = async (bookingId: string, updates: any): Promise<boolean> => {
  try {
    const cloudData = await fetchCloudData()
    const bookingIndex = cloudData.bookings.findIndex(b => b.id === bookingId)
    
    if (bookingIndex !== -1) {
      cloudData.bookings[bookingIndex] = {
        ...cloudData.bookings[bookingIndex],
        ...updates
      }
      
      const success = await saveCloudData(cloudData)
      if (success) {
        console.log('📝 Booking updated in cloud:', bookingId)
      }
      return success
    }
    return false
  } catch (error) {
    console.error('Error updating booking in cloud:', error)
    return false
  }
}

// Add customer to cloud
export const addCustomerToCloud = async (customer: any): Promise<boolean> => {
  try {
    const cloudData = await fetchCloudData()
    
    // Check if customer already exists
    const existingCustomer = cloudData.customers.find(c => c.phone === customer.phone)
    if (existingCustomer) {
      return true // Customer already exists
    }
    
    cloudData.customers.push(customer)
    return await saveCloudData(cloudData)
  } catch (error) {
    console.error('Error adding customer to cloud:', error)
    return false
  }
}

// Real-time notification system for admin
const notifyAdminOfNewBooking = (booking: any) => {
  // Create a custom event for real-time updates
  const event = new CustomEvent('newBookingReceived', {
    detail: { booking }
  })
  window.dispatchEvent(event)
  
  // Show browser notification if permission granted
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('New Booking Received!', {
      body: `${booking.name} booked ${booking.service} for ${booking.date}`,
      icon: '/vite.svg',
      tag: 'new-booking'
    })
  }
}

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }
  return false
}

// Sync local storage with cloud (for offline support)
export const syncWithCloud = async (): Promise<void> => {
  try {
    const cloudData = await fetchCloudData()
    
    // Update local storage with cloud data
    localStorage.setItem('utkal_medpro_bookings', JSON.stringify(cloudData.bookings))
    localStorage.setItem('utkal_medpro_staff', JSON.stringify(cloudData.staff))
    localStorage.setItem('utkal_medpro_messages', JSON.stringify(cloudData.messages))
    localStorage.setItem('utkal_medpro_offers', JSON.stringify(cloudData.offers))
    localStorage.setItem('utkal_customers', JSON.stringify(cloudData.customers))
    
    console.log('🔄 Local data synced with cloud')
  } catch (error) {
    console.error('Error syncing with cloud:', error)
  }
}

// Auto-sync every 30 seconds
export const startAutoSync = () => {
  setInterval(syncWithCloud, 30000)
  console.log('🔄 Auto-sync started (every 30 seconds)')
}

// Check cloud connection status
export const checkCloudConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${CLOUD_CONFIG.baseUrl}/b/${CLOUD_CONFIG.binId}/latest`, {
      method: 'HEAD',
      headers: {
        'X-Master-Key': CLOUD_CONFIG.apiKey
      }
    })
    return response.ok
  } catch (error) {
    return false
  }
}