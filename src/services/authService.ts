import { apiService } from './apiService'
import { API_ENDPOINTS } from '../config/api'

export interface LoginCredentials {
  phone: string
  otp: string
}

export interface RegisterData {
  name: string
  phone: string
  email?: string
  password?: string
}

export interface AuthResponse {
  success: boolean
  token?: string
  user?: {
    id: string
    name: string
    phone: string
    email?: string
    role: 'customer' | 'admin' | 'staff'
  }
  message?: string
}

export interface OTPResponse {
  success: boolean
  message: string
}

class AuthService {
  async sendOTP(phone: string): Promise<OTPResponse> {
    try {
      const response = await apiService.post<OTPResponse>(API_ENDPOINTS.auth.sendOTP, { phone })
      return response
    } catch (error) {
      console.error('Error sending OTP:', error)
      throw error
    }
  }

  async verifyOTP(phone: string, otp: string): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>(API_ENDPOINTS.auth.verifyOTP, { phone, otp })
      
      if (response.success && response.token) {
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('user_data', JSON.stringify(response.user))
      }
      
      return response
    } catch (error) {
      console.error('Error verifying OTP:', error)
      throw error
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>(API_ENDPOINTS.auth.register, data)
      
      if (response.success && response.token) {
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('user_data', JSON.stringify(response.user))
      }
      
      return response
    } catch (error) {
      console.error('Error registering:', error)
      throw error
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>(API_ENDPOINTS.auth.login, credentials)
      
      if (response.success && response.token) {
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('user_data', JSON.stringify(response.user))
      }
      
      return response
    } catch (error) {
      console.error('Error logging in:', error)
      throw error
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.post(API_ENDPOINTS.auth.logout)
    } catch (error) {
      console.error('Error logging out:', error)
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>(API_ENDPOINTS.auth.refreshToken)
      
      if (response.success && response.token) {
        localStorage.setItem('auth_token', response.token)
      }
      
      return response
    } catch (error) {
      console.error('Error refreshing token:', error)
      throw error
    }
  }

  getCurrentUser() {
    const userData = localStorage.getItem('user_data')
    return userData ? JSON.parse(userData) : null
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token')
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token')
  }
}

export const authService = new AuthService()