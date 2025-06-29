import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { 
  Calendar, 
  Clock, 
  Users, 
  MessageSquare, 
  Phone, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  LogOut,
  RefreshCw,
  Bell,
  Wifi,
  WifiOff
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { 
  getBookings, 
  updateBookingStatus, 
  assignBookingToStaff,
  getStaff, 
  getContactMessages, 
  getOffers, 
  addStorageListener,
  removeStorageListener,
  BOOKINGS_KEY
} from '../utils/storage'
import { 
  sendBookingConfirmationSMS, 
  sendBookingCancellationSMS, 
  sendStaffAssignmentSMS
} from '../utils/smsService'
import { 
  checkCloudConnection, 
  syncWithCloud,
  fetchCloudData,
  requestNotificationPermission
} from '../utils/cloudStorage'
import { Booking, Staff, ContactMessage, Offer } from '../types'

const AdminDashboard = () => {
  const { isAuthenticated, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [cloudConnected, setCloudConnected] = useState(false)
  const [newBookingCount, setNewBookingCount] = useState(0)

  // Real-time notification state
  const [notifications, setNotifications] = useState<string[]>([])

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
      setupRealTimeUpdates()
      checkConnection()
      requestNotificationPermission()
    }
  }, [isAuthenticated])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Try to load from cloud first
      try {
        const cloudData = await fetchCloudData()
        setBookings(cloudData.bookings || [])
        setStaff(cloudData.staff || [])
        setMessages(cloudData.messages || [])
        console.log('📊 Data loaded from cloud storage')
      } catch (error) {
        // Fallback to local storage
        setBookings(getBookings())
        setStaff(getStaff())
        setMessages(getContactMessages())
        getOffers()
        console.log('📊 Data loaded from local storage (fallback)')
      }
      
      // Count new bookings
      const newBookings = bookings.filter(b => b.status === 'pending').length
      setNewBookingCount(newBookings)
      
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const setupRealTimeUpdates = () => {
    // Listen for storage changes
    const handleBookingsUpdate = () => {
      const updatedBookings = getBookings()
      setBookings(updatedBookings)
      
      // Check for new bookings
      const newBookings = updatedBookings.filter(b => 
        b.status === 'pending' && 
        new Date(b.createdAt).getTime() > Date.now() - 60000 // Last minute
      )
      
      if (newBookings.length > 0) {
        setNewBookingCount(prev => prev + newBookings.length)
        setNotifications(prev => [
          ...prev,
          `New booking from ${newBookings[0].name} for ${newBookings[0].service}`
        ])
      }
    }

    // Listen for new booking events
    const handleNewBooking = (event: CustomEvent) => {
      const { booking } = event.detail
      setNotifications(prev => [
        ...prev,
        `🔔 New booking: ${booking.name} - ${booking.service}`
      ])
      loadData() // Refresh data
    }

    addStorageListener(BOOKINGS_KEY, handleBookingsUpdate)
    window.addEventListener('newBookingReceived', handleNewBooking as EventListener)

    return () => {
      removeStorageListener(BOOKINGS_KEY, handleBookingsUpdate)
      window.removeEventListener('newBookingReceived', handleNewBooking as EventListener)
    }
  }

  const checkConnection = async () => {
    const connected = await checkCloudConnection()
    setCloudConnected(connected)
  }

  const handleSyncData = async () => {
    try {
      await syncWithCloud()
      await loadData()
      setNotifications(prev => [...prev, '🔄 Data synced successfully'])
    } catch (error) {
      setNotifications(prev => [...prev, '❌ Sync failed'])
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  const handleBookingStatusUpdate = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      await updateBookingStatus(bookingId, newStatus)
      
      const booking = bookings.find(b => b.id === bookingId)
      if (booking) {
        if (newStatus === 'confirmed') {
          await sendBookingConfirmationSMS(
            booking.phone,
            booking.name,
            booking.service,
            booking.date,
            booking.time,
            booking.id
          )
        } else if (newStatus === 'cancelled') {
          await sendBookingCancellationSMS(
            booking.phone,
            booking.name,
            booking.service,
            booking.id
          )
        }
      }
      
      await loadData()
      setNotifications(prev => [...prev, `📝 Booking ${bookingId} updated to ${newStatus}`])
    } catch (error) {
      console.error('Error updating booking status:', error)
    }
  }

  const handleStaffAssignment = async (bookingId: string, staffId: string) => {
    try {
      const selectedStaff = staff.find(s => s.id === staffId)
      const booking = bookings.find(b => b.id === bookingId)
      
      if (selectedStaff && booking) {
        await assignBookingToStaff(bookingId, staffId, selectedStaff.name)
        
        // Send SMS to staff
        await sendStaffAssignmentSMS(
          selectedStaff.phone,
          selectedStaff.name,
          booking.name,
          booking.service,
          booking.date,
          booking.time,
          booking.address,
          booking.id
        )
        
        await loadData()
        setNotifications(prev => [...prev, `👨‍⚕️ ${selectedStaff.name} assigned to booking ${bookingId}`])
      }
    } catch (error) {
      console.error('Error assigning staff:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'confirmed': return <CheckCircle className="h-5 w-5 text-blue-500" />
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'cancelled': return <XCircle className="h-5 w-5 text-red-500" />
      default: return <AlertCircle className="h-5 w-5 text-gray-500" />
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

  const stats = [
    {
      title: 'Total Bookings',
      value: bookings.length,
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Pending Bookings',
      value: bookings.filter(b => b.status === 'pending').length,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Active Staff',
      value: staff.filter(s => s.isActive).length,
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'New Messages',
      value: messages.filter(m => m.status === 'new').length,
      icon: MessageSquare,
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <div className="flex items-center space-x-2">
                {cloudConnected ? (
                  <div className="flex items-center space-x-1 text-green-600">
                    <Wifi className="h-4 w-4" />
                    <span className="text-sm">Cloud Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-red-600">
                    <WifiOff className="h-4 w-4" />
                    <span className="text-sm">Offline Mode</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              {notifications.length > 0 && (
                <div className="relative">
                  <Bell className="h-6 w-6 text-gray-600" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                </div>
              )}
              
              {/* Sync Button */}
              <button
                onClick={handleSyncData}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                title="Sync with cloud"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              
              {/* Logout */}
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
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'bookings', label: `Bookings ${newBookingCount > 0 ? `(${newBookingCount})` : ''}` },
              { id: 'staff', label: 'Staff Management' },
              { id: 'messages', label: 'Messages' },
              { id: 'offers', label: 'Offers' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                  </div>
                ) : bookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No bookings yet</p>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(booking.status)}
                          <div>
                            <p className="font-medium text-gray-900">{booking.name}</p>
                            <p className="text-sm text-gray-600">{booking.service}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-900">{booking.date}</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Real-time Notifications */}
            {notifications.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Live Notifications</h3>
                    <button
                      onClick={() => setNotifications([])}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-2">
                    {notifications.slice(-5).map((notification, index) => (
                      <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">{notification}</p>
                        <p className="text-xs text-blue-600 mt-1">
                          {new Date().toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bookings Management */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">All Bookings</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {cloudConnected ? '🌐 Live updates enabled' : '📱 Local data only'}
                  </span>
                  <button
                    onClick={loadData}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading bookings...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No bookings found</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Bookings will appear here when patients make appointments
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{booking.name}</h4>
                          <p className="text-gray-600">{booking.service}</p>
                          <p className="text-sm text-gray-500">Booking ID: #{booking.id}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(booking.status)}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{booking.date} at {booking.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{booking.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">Price: {booking.price}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <span className="text-sm text-gray-600">{booking.address}</span>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700"><strong>Notes:</strong> {booking.notes}</p>
                        </div>
                      )}

                      {booking.assignedStaffName && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Assigned to:</strong> {booking.assignedStaffName}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleBookingStatusUpdate(booking.id, 'confirmed')}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                            >
                              Confirm Booking
                            </button>
                            <select
                              onChange={(e) => e.target.value && handleStaffAssignment(booking.id, e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              defaultValue=""
                            >
                              <option value="">Assign Staff</option>
                              {staff.filter(s => s.isActive).map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                              ))}
                            </select>
                          </>
                        )}
                        
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleBookingStatusUpdate(booking.id, 'completed')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                          >
                            Mark Completed
                          </button>
                        )}
                        
                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                          <button
                            onClick={() => handleBookingStatusUpdate(booking.id, 'cancelled')}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>

                      <div className="mt-4 text-xs text-gray-500">
                        Created: {new Date(booking.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Other tabs content would go here... */}
        {activeTab === 'staff' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Staff Management</h3>
            <p className="text-gray-600">Staff management features coming soon...</p>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Messages</h3>
            <p className="text-gray-600">Message management features coming soon...</p>
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Promotional Offers</h3>
            <p className="text-gray-600">Offer management features coming soon...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard