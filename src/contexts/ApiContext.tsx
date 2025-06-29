import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRealTimeUpdates } from '../hooks/useRealTimeUpdates'
import { bookingService } from '../services/bookingService'
import { staffService } from '../services/staffService'
import { offerService } from '../services/offerService'
import { Booking, Staff, Offer } from '../types'

interface ApiContextType {
  // Data
  bookings: Booking[]
  staff: Staff[]
  offers: Offer[]
  
  // Loading states
  bookingsLoading: boolean
  staffLoading: boolean
  offersLoading: boolean
  
  // Error states
  bookingsError: string | null
  staffError: string | null
  offersError: string | null
  
  // Real-time connection
  isConnected: boolean
  
  // Actions
  refreshBookings: () => Promise<void>
  refreshStaff: () => Promise<void>
  refreshOffers: () => Promise<void>
  refreshAll: () => Promise<void>
}

const ApiContext = createContext<ApiContextType | undefined>(undefined)

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Data states
  const [bookings, setBookings] = useState<Booking[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  
  // Loading states
  const [bookingsLoading, setBookingsLoading] = useState(false)
  const [staffLoading, setStaffLoading] = useState(false)
  const [offersLoading, setOffersLoading] = useState(false)
  
  // Error states
  const [bookingsError, setBookingsError] = useState<string | null>(null)
  const [staffError, setStaffError] = useState<string | null>(null)
  const [offersError, setOffersError] = useState<string | null>(null)

  // Real-time updates
  const { isConnected } = useRealTimeUpdates({
    endpoint: '/ws/updates',
    onMessage: (data) => {
      console.log('Real-time update received:', data)
      
      switch (data.type) {
        case 'booking_created':
        case 'booking_updated':
          refreshBookings()
          break
        case 'staff_updated':
          refreshStaff()
          break
        case 'offer_created':
        case 'offer_updated':
          refreshOffers()
          break
        default:
          console.log('Unknown update type:', data.type)
      }
    },
    onConnect: () => {
      console.log('Real-time updates connected')
    },
    onDisconnect: () => {
      console.log('Real-time updates disconnected')
    }
  })

  // Refresh functions
  const refreshBookings = async () => {
    setBookingsLoading(true)
    setBookingsError(null)
    
    try {
      const response = await bookingService.getAllBookings()
      if (response.success && response.bookings) {
        setBookings(response.bookings)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bookings'
      setBookingsError(errorMessage)
      console.error('Error fetching bookings:', error)
    } finally {
      setBookingsLoading(false)
    }
  }

  const refreshStaff = async () => {
    setStaffLoading(true)
    setStaffError(null)
    
    try {
      const response = await staffService.getAllStaff()
      if (response.success && response.staffList) {
        setStaff(response.staffList)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch staff'
      setStaffError(errorMessage)
      console.error('Error fetching staff:', error)
    } finally {
      setStaffLoading(false)
    }
  }

  const refreshOffers = async () => {
    setOffersLoading(true)
    setOffersError(null)
    
    try {
      const response = await offerService.getAllOffers()
      if (response.success && response.offers) {
        setOffers(response.offers)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch offers'
      setOffersError(errorMessage)
      console.error('Error fetching offers:', error)
    } finally {
      setOffersLoading(false)
    }
  }

  const refreshAll = async () => {
    await Promise.all([
      refreshBookings(),
      refreshStaff(),
      refreshOffers()
    ])
  }

  // Initial data load
  useEffect(() => {
    refreshAll()
  }, [])

  const value: ApiContextType = {
    // Data
    bookings,
    staff,
    offers,
    
    // Loading states
    bookingsLoading,
    staffLoading,
    offersLoading,
    
    // Error states
    bookingsError,
    staffError,
    offersError,
    
    // Real-time connection
    isConnected,
    
    // Actions
    refreshBookings,
    refreshStaff,
    refreshOffers,
    refreshAll
  }

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  )
}

export const useApi = () => {
  const context = useContext(ApiContext)
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider')
  }
  return context
}