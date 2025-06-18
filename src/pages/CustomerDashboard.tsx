import React, { useState, useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  LogOut, 
  User, 
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw
} from 'lucide-react'
import { useCustomerAuth } from '../contexts/CustomerAuthContext'
import { getBookings, addStorageListener, removeStorageListener, BOOKINGS_KEY } from '../utils/storage'
import { Booking } from '../types'

const CustomerDashboard = () => {
  const { customer, isAuthenticated, logout } = useCustomerAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated && customer) {
      loadCustomerBookings()
      
      // Set up real-time listener for booking updates
      const handleBookingsUpdate = () => {
        loadCustomerBookings()
      }
      
      addStorageListener(BOOKINGS_KEY, handleBookingsUpdate)
      
      return () => {
        removeStorageListener(BOOKINGS_KEY, handleBookingsUpdate)
      }
    }
  }, [isAuthenticated, customer])

  const loadCustomerBookings = () => {
    if (!customer) return
    
    try {
      const allBookings = getBookings()
      const customerBookings = allBookings.filter(booking => 
        booking.phone === customer.phone || booking.email === customer.email
      )
      setBookings(customerBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } catch (error) {
      console.error('Error loading customer bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/customer/login" replace />
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Your booking is being reviewed. We will contact you shortly.'
      case 'confirmed':
        return 'Your booking is confirmed! Our professional will visit you at the scheduled time.'
      case 'completed':
        return 'Service completed successfully. Thank you for choosing Utkal Medpro!'
      case 'cancelled':
        return 'This booking has been cancelled. Contact us if you have any questions.'
      default:
        return 'Status unknown. Please contact support.'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-gray-600">Welcome back, {customer?.name || 'Customer'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/booking"
                className="btn-primary text-white px-4 py-2 rounded-lg font-medium"
              >
                Book New Service
              </Link>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center mb-6">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{customer?.name || 'Customer'}</h3>
                <p className="text-gray-600">Utkal Medpro Customer</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{customer?.phone}</span>
                </div>
                {customer?.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{customer.email}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Member since {new Date(customer?.createdAt || '').toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h4 className="font-semibold text-gray-900 mb-4">Quick Stats</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Bookings</span>
                  <span className="font-semibold text-gray-900">{bookings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">
                    {bookings.filter(b => b.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="font-semibold text-yellow-600">
                    {bookings.filter(b => b.status === 'pending').length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">My Bookings</h2>
                  <button
                    onClick={loadCustomerBookings}
                    className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                    title="Refresh bookings"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading your bookings...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-600 mb-6">Book your first service to get started!</p>
                    <Link
                      to="/booking"
                      className="btn-primary text-white px-6 py-3 rounded-lg font-semibold"
                    >
                      Book a Service
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{booking.service}</h3>
                            <p className="text-gray-600">Booking ID: #{booking.id}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(booking.status)}
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{booking.date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{booking.time}</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                            <span className="text-sm text-gray-600">{booking.address}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">Price: {booking.price}</span>
                          </div>
                        </div>

                        {booking.notes && (
                          <div className="mb-4">
                            <div className="flex items-start space-x-2">
                              <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Notes:</p>
                                <p className="text-sm text-gray-600">{booking.notes}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-700">{getStatusMessage(booking.status)}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Booked on {new Date(booking.createdAt).toLocaleDateString()} at {new Date(booking.createdAt).toLocaleTimeString()}
                          </p>
                        </div>

                        {booking.status === 'confirmed' && (
                          <div className="mt-4 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                            <p className="text-sm text-blue-800 font-medium">
                              📱 SMS Confirmation sent to your mobile number!
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              Our professional will contact you before the visit.
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard