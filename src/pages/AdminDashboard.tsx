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
  Plus,
  Edit,
  Trash2,
  Star,
  UserPlus,
  Tag,
  Gift
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { 
  getBookings, 
  updateBookingStatus, 
  assignBookingToStaff,
  getStaff, 
  saveStaff,
  updateStaff,
  deleteStaff,
  getContactMessages,
  updateMessageStatus,
  getOffers,
  saveOffer,
  updateOffer,
  deleteOffer,
  addStorageListener,
  removeStorageListener,
  BOOKINGS_KEY,
  STAFF_KEY,
  MESSAGES_KEY,
  OFFERS_KEY
} from '../utils/storage'
import { 
  sendBookingConfirmationSMS, 
  sendBookingCancellationSMS, 
  sendStaffAssignmentSMS
} from '../utils/smsService'
import { Booking, Staff, ContactMessage, Offer } from '../types'

const AdminDashboard = () => {
  const { isAuthenticated, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [newBookingCount, setNewBookingCount] = useState(0)
  const [notifications, setNotifications] = useState<string[]>([])

  // Form states
  const [showStaffForm, setShowStaffForm] = useState(false)
  const [showOfferForm, setShowOfferForm] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)

  // Staff form data
  const [staffForm, setStaffForm] = useState({
    name: '',
    phone: '',
    email: '',
    specialization: [] as string[],
    experience: '',
    qualification: '',
    address: '',
    emergencyContact: '',
    isActive: true
  })

  // Offer form data
  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    discount: '',
    validUntil: '',
    isActive: true
  })

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
      setupRealTimeUpdates()
    }
  }, [isAuthenticated])

  const loadData = () => {
    try {
      setLoading(true)
      const allBookings = getBookings()
      const allStaff = getStaff()
      const allMessages = getContactMessages()
      const allOffers = getOffers()
      
      setBookings(allBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      setStaff(allStaff)
      setMessages(allMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      setOffers(allOffers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      
      // Count new bookings
      const newBookings = allBookings.filter(b => b.status === 'pending').length
      setNewBookingCount(newBookings)
      
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const setupRealTimeUpdates = () => {
    const handleBookingsUpdate = () => {
      const updatedBookings = getBookings()
      setBookings(updatedBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      
      // Check for new bookings
      const newBookings = updatedBookings.filter(b => 
        b.status === 'pending' && 
        new Date(b.createdAt).getTime() > Date.now() - 60000 // Last minute
      )
      
      if (newBookings.length > 0) {
        setNewBookingCount(prev => prev + newBookings.length)
        setNotifications(prev => [
          ...prev,
          `🔔 New booking from ${newBookings[0].name} for ${newBookings[0].service}`
        ])
      }
    }

    const handleStaffUpdate = () => {
      setStaff(getStaff())
    }

    const handleMessagesUpdate = () => {
      setMessages(getContactMessages().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    }

    const handleOffersUpdate = () => {
      setOffers(getOffers().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    }

    const handleNewBooking = (event: CustomEvent) => {
      const { booking } = event.detail
      setNotifications(prev => [
        ...prev,
        `🔔 New booking: ${booking.name} - ${booking.service}`
      ])
      loadData()
    }

    addStorageListener(BOOKINGS_KEY, handleBookingsUpdate)
    addStorageListener(STAFF_KEY, handleStaffUpdate)
    addStorageListener(MESSAGES_KEY, handleMessagesUpdate)
    addStorageListener(OFFERS_KEY, handleOffersUpdate)
    window.addEventListener('newBookingReceived', handleNewBooking as EventListener)

    return () => {
      removeStorageListener(BOOKINGS_KEY, handleBookingsUpdate)
      removeStorageListener(STAFF_KEY, handleStaffUpdate)
      removeStorageListener(MESSAGES_KEY, handleMessagesUpdate)
      removeStorageListener(OFFERS_KEY, handleOffersUpdate)
      window.removeEventListener('newBookingReceived', handleNewBooking as EventListener)
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
        
        setNotifications(prev => [...prev, `👨‍⚕️ ${selectedStaff.name} assigned to booking ${bookingId}`])
      }
    } catch (error) {
      console.error('Error assigning staff:', error)
    }
  }

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingStaff) {
        updateStaff(editingStaff.id, staffForm)
        setNotifications(prev => [...prev, `✅ Staff ${staffForm.name} updated successfully`])
      } else {
        saveStaff(staffForm)
        setNotifications(prev => [...prev, `✅ Staff ${staffForm.name} added successfully`])
      }
      resetStaffForm()
    } catch (error) {
      console.error('Error saving staff:', error)
      setNotifications(prev => [...prev, `❌ Error saving staff member`])
    }
  }

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingOffer) {
        updateOffer(editingOffer.id, offerForm)
        setNotifications(prev => [...prev, `✅ Offer ${offerForm.title} updated successfully`])
      } else {
        saveOffer(offerForm)
        setNotifications(prev => [...prev, `✅ Offer ${offerForm.title} created successfully`])
      }
      resetOfferForm()
    } catch (error) {
      console.error('Error saving offer:', error)
      setNotifications(prev => [...prev, `❌ Error saving offer`])
    }
  }

  const resetStaffForm = () => {
    setStaffForm({
      name: '',
      phone: '',
      email: '',
      specialization: [],
      experience: '',
      qualification: '',
      address: '',
      emergencyContact: '',
      isActive: true
    })
    setEditingStaff(null)
    setShowStaffForm(false)
  }

  const resetOfferForm = () => {
    setOfferForm({
      title: '',
      description: '',
      discount: '',
      validUntil: '',
      isActive: true
    })
    setEditingOffer(null)
    setShowOfferForm(false)
  }

  const editStaff = (staff: Staff) => {
    setStaffForm({
      name: staff.name,
      phone: staff.phone,
      email: staff.email,
      specialization: staff.specialization,
      experience: staff.experience,
      qualification: staff.qualification,
      address: staff.address,
      emergencyContact: staff.emergencyContact,
      isActive: staff.isActive
    })
    setEditingStaff(staff)
    setShowStaffForm(true)
  }

  const editOffer = (offer: Offer) => {
    setOfferForm({
      title: offer.title,
      description: offer.description,
      discount: offer.discount,
      validUntil: offer.validUntil,
      isActive: offer.isActive
    })
    setEditingOffer(offer)
    setShowOfferForm(true)
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
              <div className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                🟢 Live Updates Active
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
              
              {/* Refresh Button */}
              <button
                onClick={loadData}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                title="Refresh data"
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
              { id: 'offers', label: 'Offers & Packages' }
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
                  <span className="text-sm text-green-600">🔴 Live updates enabled</span>
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

        {/* Staff Management */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Staff Management</h3>
                  <button
                    onClick={() => setShowStaffForm(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center space-x-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Add Staff</span>
                  </button>
                </div>
              </div>
              <div className="p-6">
                {staff.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No staff members found</p>
                    <p className="text-sm text-gray-400 mt-2">Add your first staff member to get started</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {staff.map((member) => (
                      <div key={member.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{member.name}</h4>
                            <p className="text-gray-600">{member.qualification}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">{member.rating}</span>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {member.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{member.phone}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Experience:</strong> {member.experience}
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Specialization:</strong> {member.specialization.join(', ')}
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Current Bookings:</strong> {member.currentBookings}
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Completed:</strong> {member.totalCompleted}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => editStaff(member)}
                            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center space-x-1"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this staff member?')) {
                                deleteStaff(member.id)
                                setNotifications(prev => [...prev, `🗑️ Staff ${member.name} deleted`])
                              }
                            }}
                            className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Staff Form Modal */}
            {showStaffForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                      {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                    </h2>
                  </div>
                  <form onSubmit={handleStaffSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                        <input
                          type="text"
                          required
                          value={staffForm.name}
                          onChange={(e) => setStaffForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                        <input
                          type="tel"
                          required
                          value={staffForm.phone}
                          onChange={(e) => setStaffForm(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={staffForm.email}
                        onChange={(e) => setStaffForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Qualification *</label>
                      <input
                        type="text"
                        required
                        value={staffForm.qualification}
                        onChange={(e) => setStaffForm(prev => ({ ...prev, qualification: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., B.Sc Nursing, GNM, etc."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Experience *</label>
                        <input
                          type="text"
                          required
                          value={staffForm.experience}
                          onChange={(e) => setStaffForm(prev => ({ ...prev, experience: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="e.g., 5 years"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                        <input
                          type="tel"
                          value={staffForm.emergencyContact}
                          onChange={(e) => setStaffForm(prev => ({ ...prev, emergencyContact: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <textarea
                        value={staffForm.address}
                        onChange={(e) => setStaffForm(prev => ({ ...prev, address: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Blood Collection', 'Injections', 'Wound Dressing', 'Health Monitoring', 'Elderly Care', 'Post-Surgery Care'].map((spec) => (
                          <label key={spec} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={staffForm.specialization.includes(spec)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setStaffForm(prev => ({ ...prev, specialization: [...prev.specialization, spec] }))
                                } else {
                                  setStaffForm(prev => ({ ...prev, specialization: prev.specialization.filter(s => s !== spec) }))
                                }
                              }}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700">{spec}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={staffForm.isActive}
                        onChange={(e) => setStaffForm(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label className="text-sm text-gray-700">Active</label>
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700"
                      >
                        {editingStaff ? 'Update Staff' : 'Add Staff'}
                      </button>
                      <button
                        type="button"
                        onClick={resetStaffForm}
                        className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Messages */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Contact Messages</h3>
            </div>
            <div className="p-6">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No messages found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{message.name}</h4>
                          <p className="text-gray-600">{message.subject}</p>
                          <p className="text-sm text-gray-500">{message.email} • {message.phone}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          message.status === 'new' ? 'bg-yellow-100 text-yellow-800' :
                          message.status === 'read' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {message.status}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4">{message.message}</p>
                      <div className="flex space-x-2">
                        {message.status === 'new' && (
                          <button
                            onClick={() => updateMessageStatus(message.id, 'read')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                          >
                            Mark as Read
                          </button>
                        )}
                        {message.status !== 'replied' && (
                          <button
                            onClick={() => updateMessageStatus(message.id, 'replied')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                          >
                            Mark as Replied
                          </button>
                        )}
                      </div>
                      <div className="mt-4 text-xs text-gray-500">
                        Received: {new Date(message.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Offers & Packages */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Promotional Offers & Packages</h3>
                  <button
                    onClick={() => setShowOfferForm(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Offer</span>
                  </button>
                </div>
              </div>
              <div className="p-6">
                {offers.length === 0 ? (
                  <div className="text-center py-8">
                    <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No offers found</p>
                    <p className="text-sm text-gray-400 mt-2">Create your first promotional offer</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map((offer) => (
                      <div key={offer.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{offer.title}</h4>
                            <p className="text-2xl font-bold text-primary-600">{offer.discount}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            offer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {offer.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-4">{offer.description}</p>
                        
                        <div className="text-sm text-gray-600 mb-4">
                          <strong>Valid until:</strong> {new Date(offer.validUntil).toLocaleDateString()}
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => editOffer(offer)}
                            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center space-x-1"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this offer?')) {
                                deleteOffer(offer.id)
                                setNotifications(prev => [...prev, `🗑️ Offer ${offer.title} deleted`])
                              }
                            }}
                            className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Offer Form Modal */}
            {showOfferForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                      {editingOffer ? 'Edit Offer' : 'Create New Offer'}
                    </h2>
                  </div>
                  <form onSubmit={handleOfferSubmit} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                      <input
                        type="text"
                        required
                        value={offerForm.title}
                        onChange={(e) => setOfferForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., New Year Health Package"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                      <textarea
                        required
                        value={offerForm.description}
                        onChange={(e) => setOfferForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Describe the offer details..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Discount *</label>
                      <input
                        type="text"
                        required
                        value={offerForm.discount}
                        onChange={(e) => setOfferForm(prev => ({ ...prev, discount: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., 30% OFF, ₹200 OFF"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until *</label>
                      <input
                        type="date"
                        required
                        value={offerForm.validUntil}
                        onChange={(e) => setOfferForm(prev => ({ ...prev, validUntil: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={offerForm.isActive}
                        onChange={(e) => setOfferForm(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label className="text-sm text-gray-700">Active</label>
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700"
                      >
                        {editingOffer ? 'Update Offer' : 'Create Offer'}
                      </button>
                      <button
                        type="button"
                        onClick={resetOfferForm}
                        className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard