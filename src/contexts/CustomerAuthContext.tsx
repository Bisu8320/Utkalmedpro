import React, { createContext, useContext, useState, useEffect } from 'react'

interface Customer {
  id: string
  name: string
  phone: string
  email: string
  createdAt: string
}

interface CustomerAuthContextType {
  customer: Customer | null
  isAuthenticated: boolean
  login: (phone: string, otp: string) => Promise<boolean>
  register: (customerData: Omit<Customer, 'id' | 'createdAt'>) => Promise<boolean>
  logout: () => void
  sendOTP: (phone: string) => Promise<boolean>
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined)

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('utkal_customer_auth')
    if (stored) {
      try {
        const customerData = JSON.parse(stored)
        setCustomer(customerData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing stored customer data:', error)
        localStorage.removeItem('utkal_customer_auth')
      }
    }
  }, [])

  const sendOTP = async (phone: string): Promise<boolean> => {
    try {
      // In a real app, this would call your SMS API
      // For demo purposes, we'll simulate OTP sending
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      
      // Store OTP temporarily (in real app, this would be server-side)
      sessionStorage.setItem(`otp_${phone}`, otp)
      sessionStorage.setItem(`otp_${phone}_expires`, (Date.now() + 300000).toString()) // 5 minutes
      
      // Simulate SMS sending
      console.log(`SMS sent to ${phone}: Your OTP is ${otp}`)
      alert(`Demo: Your OTP is ${otp} (In production, this would be sent via SMS)`)
      
      return true
    } catch (error) {
      console.error('Error sending OTP:', error)
      return false
    }
  }

  const login = async (phone: string, otp: string): Promise<boolean> => {
    try {
      // Verify OTP
      const storedOTP = sessionStorage.getItem(`otp_${phone}`)
      const expiresAt = sessionStorage.getItem(`otp_${phone}_expires`)
      
      if (!storedOTP || !expiresAt || Date.now() > parseInt(expiresAt)) {
        return false
      }
      
      if (storedOTP !== otp) {
        return false
      }
      
      // Check if customer exists
      const customers = getCustomers()
      let existingCustomer = customers.find(c => c.phone === phone)
      
      if (!existingCustomer) {
        // Create new customer with minimal info
        existingCustomer = {
          id: Date.now().toString(),
          name: 'Customer',
          phone: phone,
          email: '',
          createdAt: new Date().toISOString()
        }
        customers.push(existingCustomer)
        localStorage.setItem('utkal_customers', JSON.stringify(customers))
      }
      
      setCustomer(existingCustomer)
      setIsAuthenticated(true)
      localStorage.setItem('utkal_customer_auth', JSON.stringify(existingCustomer))
      
      // Clear OTP
      sessionStorage.removeItem(`otp_${phone}`)
      sessionStorage.removeItem(`otp_${phone}_expires`)
      
      return true
    } catch (error) {
      console.error('Error during login:', error)
      return false
    }
  }

  const register = async (customerData: Omit<Customer, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      const customers = getCustomers()
      
      // Check if customer already exists
      if (customers.find(c => c.phone === customerData.phone)) {
        return false
      }
      
      const newCustomer: Customer = {
        ...customerData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      
      customers.push(newCustomer)
      localStorage.setItem('utkal_customers', JSON.stringify(customers))
      
      setCustomer(newCustomer)
      setIsAuthenticated(true)
      localStorage.setItem('utkal_customer_auth', JSON.stringify(newCustomer))
      
      return true
    } catch (error) {
      console.error('Error during registration:', error)
      return false
    }
  }

  const logout = () => {
    setCustomer(null)
    setIsAuthenticated(false)
    localStorage.removeItem('utkal_customer_auth')
  }

  return (
    <CustomerAuthContext.Provider value={{
      customer,
      isAuthenticated,
      login,
      register,
      logout,
      sendOTP
    }}>
      {children}
    </CustomerAuthContext.Provider>
  )
}

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext)
  if (context === undefined) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider')
  }
  return context
}

const getCustomers = (): Customer[] => {
  try {
    const stored = localStorage.getItem('utkal_customers')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error getting customers:', error)
    return []
  }
}