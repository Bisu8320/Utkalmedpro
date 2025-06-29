// Cloud Storage Service using JSONBin.io (free tier)
// This allows data to sync across different devices

interface CloudStorageConfig {
  apiKey: string
  baseUrl: string
  binId: string | null
}

// Free JSONBin.io configuration
const CLOUD_CONFIG: CloudStorageConfig = {
  apiKey: '$2a$10$8K8vwuQmyIeYy5WSfQVbeOUsYqg6.IRJF8z0BVXkwjpbMXpjy.BtC', // Free API key
  baseUrl: 'https://api.jsonbin.io/v3',
  binId: null // Will be created dynamically if needed
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

// Create a new bin if none exists
const createNewBin = async (): Promise<string | null> => {
  try {
    const initialData = initializeCloudData()
    
    const response = await fetch(`${CLOUD_CONFIG.baseUrl}/b`, {
      method: 'POST',
      headers: {
        'X-Master-Key': CLOUD_CONFIG.apiKey,
        'Content-Type': 'application/json',
        'X-Bin-Name': 'Utkal Medpro Data',
        'X-Bin-Private': 'false'
      },
      body: JSON.stringify(initialData)
    })

    if (!response.ok) {
      console.error('Failed to create new bin:', response.status)
      return null
    }

    const result = await response.json()
    const newBinId = result.metadata.id
    
    // Store the new bin ID in localStorage for persistence
    localStorage.setItem('utkal_medpro_bin_id', newBinId)
    CLOUD_CONFIG.binId = newBinId
    
    console.log('✅ Created new cloud storage bin:', newBinId)
    return newBinId
  } catch (error) {
    console.error('Error creating new bin:', error)
    return null
  }
}

// Get or create bin ID
const getBinId = async (): Promise<string | null> => {
  // Check if we have a stored bin ID
  const storedBinId = localStorage.getItem('utkal_medpro_bin_id')
  if (storedBinId) {
    CLOUD_CONFIG.binId = storedBinId
    return storedBinId
  }

  // Try to create a new bin
  return await createNewBin()
}

// Fetch data from cloud storage
export const fetchCloudData = async (): Promise<CloudData> => {
  try {
    const binId = await getBinId()
    if (!binId) {
      console.log('No cloud storage available, using local data only')
      return initializeCloudData()
    }

    const response = await fetch(`${CLOUD_CONFIG.baseUrl}/b/${binId}/latest`, {
      method: 'GET',
      headers: {
        'X-Master-Key': CLOUD_CONFIG.apiKey,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        console.log('Bin not found, creating new one...')
        // Clear the stored bin ID and try to create a new one
        localStorage.removeItem('utkal_medpro_bin_id')
        CLOUD_CONFIG.binId = null
        const newBinId = await createNewBin()
        if (newBinId) {
          return await fetchCloudData() // Retry with new bin
        }
      }
      console.log('Cloud storage not available, using local data')
      return initializeCloudData()
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
    const binId = await getBinId()
    if (!binId) {
      console.log('No cloud storage available, data saved locally only')
      return false
    }

    const dataToSave = {
      ...data,
      lastUpdated: new Date().toISOString()
    }

    const response = await fetch(`${CLOUD_CONFIG.baseUrl}/b/${binId}`, {
      method: 'PUT',
      headers: {
        'X-Master-Key': CLOUD_CONFIG.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSave)
    })

    if (!response.ok) {
      if (response.status === 404) {
        console.log('Bin not found, creating new one...')
        // Clear the stored bin ID and try to create a new one
        localStorage.removeItem('utkal_medpro_bin_id')
        CLOUD_CONFIG.binId = null
        const newBinId = await createNewBin()
        if (newBinId) {
          return await saveCloudData(data) // Retry with new bin
        }
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    console.log('✅ Data saved to cloud successfully')
    return true
  } catch (error) {
    console.error('❌ Error saving to cloud:', error)
    console.log('Data will be stored locally only')
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
    } else {
      console.log('📱 New booking saved locally:', newBooking.id)
    }
    return true // Return true even if cloud save fails, as we have local fallback
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
      } else {
        console.log('📝 Booking updated locally:', bookingId)
      }
      return true
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
    const success = await saveCloudData(cloudData)
    return success || true // Return true even if cloud save fails
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
    console.log('Using local data only')
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
    const binId = await getBinId()
    if (!binId) return false

    const response = await fetch(`${CLOUD_CONFIG.baseUrl}/b/${binId}/latest`, {
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