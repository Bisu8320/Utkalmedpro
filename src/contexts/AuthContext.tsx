import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Simple password - in production, use proper authentication
const ADMIN_PASSWORD = 'utkalmedpro2024'

/**
 * Provides authentication context for managing user's login state.
 * @example
 * const { isAuthenticated, login, logout } = useContext(AuthContext);
 * login('password'); // returns true if password is correct
 * @param {object} { children } - React children components to be wrapped with the AuthContext provider.
 * @returns {JSX.Element} A React context provider that supplies authentication status and methods.
 * @description
 *   - Initializes the authentication state based on local storage.
 *   - Handles login by verifying password and updating state and local storage.
 *   - Manages logout by clearing the authentication state and local storage.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('utkal_admin_auth')
    if (stored === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem('utkal_admin_auth', 'true')
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('utkal_admin_auth')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}