// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
}

export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    sendOTP: '/auth/send-otp',
    verifyOTP: '/auth/verify-otp',
    refreshToken: '/auth/refresh',
    logout: '/auth/logout'
  },
  
  // Bookings
  bookings: {
    create: '/bookings',
    getAll: '/bookings',
    getById: (id: string) => `/bookings/${id}`,
    update: (id: string) => `/bookings/${id}`,
    delete: (id: string) => `/bookings/${id}`,
    getByCustomer: (customerId: string) => `/bookings/customer/${customerId}`,
    updateStatus: (id: string) => `/bookings/${id}/status`,
    assignStaff: (id: string) => `/bookings/${id}/assign-staff`
  },
  
  // Staff
  staff: {
    getAll: '/staff',
    create: '/staff',
    getById: (id: string) => `/staff/${id}`,
    update: (id: string) => `/staff/${id}`,
    delete: (id: string) => `/staff/${id}`,
    getAvailable: '/staff/available'
  },
  
  // Customers
  customers: {
    getAll: '/customers',
    getById: (id: string) => `/customers/${id}`,
    update: (id: string) => `/customers/${id}`,
    getProfile: '/customers/profile'
  },
  
  // Messages
  messages: {
    create: '/messages',
    getAll: '/messages',
    getById: (id: string) => `/messages/${id}`,
    updateStatus: (id: string) => `/messages/${id}/status`
  },
  
  // Offers
  offers: {
    getAll: '/offers',
    create: '/offers',
    getById: (id: string) => `/offers/${id}`,
    update: (id: string) => `/offers/${id}`,
    delete: (id: string) => `/offers/${id}`,
    getActive: '/offers/active'
  },
  
  // Admin
  admin: {
    dashboard: '/admin/dashboard',
    stats: '/admin/stats'
  }
}