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

/**
 * Provides customer authentication capabilities via context
 * @example
 * <CustomerAuthContext.Provider>
 *  {children}
 * </CustomerAuthContext.Provider>
 * @param {Object} {children} - React child components to be wrapped by the context provider.
 * @returns {JSX.Element} A context provider wrapping its children to supply authentication functionalities.
 * @description
 *   - Utilizes local storage for persistent user session management.
 *   - Implements OTP sending using session storage and manual validation.
 *   - Creates new customer data and persists it, if not existing during login.
 *   - Provides callback functions for login, registration, logout, and OTP sending.
 */
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

  /**
   * Simulates sending an OTP via SMS for phone number authentication.
   * @example
   * sync("1234567890")
   * true
   * @param {string} phone - The phone number to which the OTP will be sent.
   * @returns {Promise<boolean>} Resolves to true if OTP is successfully "sent", otherwise false.
   * @description
   *   - Simulates OTP generation and storage using `sessionStorage`.
   *   - OTP is valid for 5 minutes from the time it's generated.
   *   - Prints the OTP to the console and shows it in an alert for demo purposes.
   *   - In a real app, the OTP would be sent via an actual SMS service.
   */
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

  /**
  * Authenticates a user via their phone number and OTP.
  * @example
  * sync("1234567890", "123456")
  * true
  * @param {string} phone - The phone number of the user attempting to authenticate.
  * @param {string} otp - The one-time password sent to the user's phone.
  * @returns {Promise<boolean>} Resolves to true if authentication is successful, otherwise false.
  * @description
  *   - The function verifies the OTP stored in sessionStorage against the provided OTP.
  *   - If the phone number doesn't exist in the customer list, a new customer is created.
  *   - Session data related to OTP is cleared upon successful authentication.
  *   - Error handling is performed to ensure the function returns false in case of exceptions.
  */
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

  /**
   * Synchronizes customer data with local storage and updates authentication state.
   * @example
   * sync({name: 'John Doe', phone: '1234567890'})
   * // returns true if the customer was successfully added, false if the customer already exists or an error occurs.
   * @param {Omit<Customer, 'id' | 'createdAt'>} customerData - The customer data excluding 'id' and 'createdAt' that needs to be synchronized.
   * @returns {Promise<boolean>} Returns a promise that resolves to true if the customer data is successfully synchronized, false otherwise.
   * @description
   *   - The function checks for existing customers based on the phone number before adding new data.
   *   - Newly created customers are assigned a unique 'id' using the current timestamp and 'createdAt' using the current date and time.
   *   - Updates the authentication state to reflect the addition of a new customer.
   *   - Stores customer authentication information in local storage.
   */
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