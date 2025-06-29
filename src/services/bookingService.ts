import { apiService } from './apiService'
import { API_ENDPOINTS } from '../config/api'
import { Booking } from '../types'

export interface CreateBookingData {
  service: string
  name: string
  phone: string
  email?: string
  address: string
  date: string
  time: string
  notes?: string
}

export interface UpdateBookingData {
  status?: Booking['status']
  assignedStaffId?: string
  staffNotes?: string
}

export interface BookingResponse {
  success: boolean
  booking?: Booking
  bookings?: Booking[]
  message?: string
}

class BookingService {
  async createBooking(data: CreateBookingData): Promise<BookingResponse> {
    try {
      const response = await apiService.post<BookingResponse>(API_ENDPOINTS.bookings.create, data)
      return response
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    }
  }

  async getAllBookings(): Promise<BookingResponse> {
    try {
      const response = await apiService.get<BookingResponse>(API_ENDPOINTS.bookings.getAll)
      return response
    } catch (error) {
      console.error('Error fetching bookings:', error)
      throw error
    }
  }

  async getBookingById(id: string): Promise<BookingResponse> {
    try {
      const response = await apiService.get<BookingResponse>(API_ENDPOINTS.bookings.getById(id))
      return response
    } catch (error) {
      console.error('Error fetching booking:', error)
      throw error
    }
  }

  async getCustomerBookings(customerId: string): Promise<BookingResponse> {
    try {
      const response = await apiService.get<BookingResponse>(API_ENDPOINTS.bookings.getByCustomer(customerId))
      return response
    } catch (error) {
      console.error('Error fetching customer bookings:', error)
      throw error
    }
  }

  async updateBooking(id: string, data: UpdateBookingData): Promise<BookingResponse> {
    try {
      const response = await apiService.put<BookingResponse>(API_ENDPOINTS.bookings.update(id), data)
      return response
    } catch (error) {
      console.error('Error updating booking:', error)
      throw error
    }
  }

  async updateBookingStatus(id: string, status: Booking['status']): Promise<BookingResponse> {
    try {
      const response = await apiService.patch<BookingResponse>(API_ENDPOINTS.bookings.updateStatus(id), { status })
      return response
    } catch (error) {
      console.error('Error updating booking status:', error)
      throw error
    }
  }

  async assignStaff(id: string, staffId: string): Promise<BookingResponse> {
    try {
      const response = await apiService.patch<BookingResponse>(API_ENDPOINTS.bookings.assignStaff(id), { staffId })
      return response
    } catch (error) {
      console.error('Error assigning staff:', error)
      throw error
    }
  }

  async deleteBooking(id: string): Promise<BookingResponse> {
    try {
      const response = await apiService.delete<BookingResponse>(API_ENDPOINTS.bookings.delete(id))
      return response
    } catch (error) {
      console.error('Error deleting booking:', error)
      throw error
    }
  }
}

export const bookingService = new BookingService()