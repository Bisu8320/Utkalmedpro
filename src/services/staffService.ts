import { apiService } from './apiService'
import { API_ENDPOINTS } from '../config/api'
import { Staff } from '../types'

export interface CreateStaffData {
  name: string
  phone: string
  email: string
  specialization: string[]
  experience: string
  qualification: string
  address: string
  emergencyContact: string
  isActive?: boolean
}

export interface StaffResponse {
  success: boolean
  staff?: Staff
  staffList?: Staff[]
  message?: string
}

class StaffService {
  async getAllStaff(): Promise<StaffResponse> {
    try {
      const response = await apiService.get<StaffResponse>(API_ENDPOINTS.staff.getAll)
      return response
    } catch (error) {
      console.error('Error fetching staff:', error)
      throw error
    }
  }

  async getStaffById(id: string): Promise<StaffResponse> {
    try {
      const response = await apiService.get<StaffResponse>(API_ENDPOINTS.staff.getById(id))
      return response
    } catch (error) {
      console.error('Error fetching staff member:', error)
      throw error
    }
  }

  async createStaff(data: CreateStaffData): Promise<StaffResponse> {
    try {
      const response = await apiService.post<StaffResponse>(API_ENDPOINTS.staff.create, data)
      return response
    } catch (error) {
      console.error('Error creating staff:', error)
      throw error
    }
  }

  async updateStaff(id: string, data: Partial<CreateStaffData>): Promise<StaffResponse> {
    try {
      const response = await apiService.put<StaffResponse>(API_ENDPOINTS.staff.update(id), data)
      return response
    } catch (error) {
      console.error('Error updating staff:', error)
      throw error
    }
  }

  async deleteStaff(id: string): Promise<StaffResponse> {
    try {
      const response = await apiService.delete<StaffResponse>(API_ENDPOINTS.staff.delete(id))
      return response
    } catch (error) {
      console.error('Error deleting staff:', error)
      throw error
    }
  }

  async getAvailableStaff(): Promise<StaffResponse> {
    try {
      const response = await apiService.get<StaffResponse>(API_ENDPOINTS.staff.getAvailable)
      return response
    } catch (error) {
      console.error('Error fetching available staff:', error)
      throw error
    }
  }
}

export const staffService = new StaffService()