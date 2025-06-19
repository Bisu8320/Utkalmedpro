import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Tag, 
  LogOut, 
  Eye, 
  Check, 
  X, 
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  Clock,
  RefreshCw,
  MessageCircle,
  UserPlus,
  UserCheck,
  Send,
  Star,
  Award,
  Activity,
  MapPin,
  Briefcase
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { 
  getBookings, 
  updateBookingStatus, 
  getOffers, 
  saveOffer, 
  updateOffer, 
  deleteOffer,
  getContactMessages,
  updateMessageStatus,
  addStorageListener,
  removeStorageListener,
  BOOKINGS_KEY,
  OFFERS_KEY,
  MESSAGES_KEY,
  STAFF_KEY,
  STAFF_MESSAGES_KEY,
  getStaff,
  saveStaff,
  updateStaff,
  deleteStaff,
  assignBookingToStaff,
  sendStaffMessage,
  getStaffMessages
} from '../utils/storage'
import { sendBookingConfirmationSMS, sendBookingCancellationSMS, sendStaffAssignmentSMS, getSMSLogs } from '../utils/smsService'
import { Booking, Offer, ContactMessage, Staff, StaffMessage } from '../types'

const AdminDashboard = () => {
  const { isAuthenticated, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('bookings')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [staffMessages, setStaffMessages] = useState<StaffMessage[]>([])
  const [smsLogs, setSmsLogs] = useState<any[]>([])
  const [showOfferForm, setShowOfferForm] = useState(false)
  const [showStaffForm, setShowStaffForm] = useState(false)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [sendingSMS, setSendingSMS] = useState<string | null>(null)

  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    discount: '',
    validUntil: '',
    isActive: true
  })

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

  const [assignmentForm, setAssignmentForm] = useState({
    staffId: '',
    notes: ''
  })

  const specializations = [
    'Blood Collection',
    'Injections',
    'Wound Dressing',
    'Post-Surgery Care',
    'Health Monitoring',
    'Elderly Care',
    'Emergency Response',
    'Lab Coordination'
  ]

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
      
      // Set up real-time listeners
      const handleBookingsUpdate = () => {
        setBookings(getBookings())
        setLastUpdate(new Date())
      }
      
      const handleOffersUpdate = () => {
        setOffers(getOffers())
        setLastUpdate(new Date())
      }
      
      const handleMessagesUpdate = () => {
        setMessages(getContactMessages())
        setLastUpdate(new Date())
      }

      const handleStaffUpdate = () => {
        setStaff(getStaff())
        setLastUpdate(new Date())
      }

      const handleStaffMessagesUpdate = () => {
        setStaffMessages(getStaffMessages())
        setLastUpdate(new Date())
      }

      addStorageListener(BOOKINGS_KEY, handleBookingsUpdate)
      addStorageListener(OFFERS_KEY, handleOffersUpdate)
      addStorageListener(MESSAGES_KEY, handleMessagesUpdate)
      addStorageListener(STAFF_KEY, handleStaffUpdate)
      addStorageListener(STAFF_MESSAGES_KEY, handleStaffMessagesUpdate)

      // Auto-refresh every 30 seconds
      const interval = setInterval(() => {
        loadData()
      }, 30000)

      return () => {
        removeStorageListener(BOOKINGS_KEY, handleBookingsUpdate)
        removeStorageListener(OFFERS_KEY, handleOffersUpdate)
        removeStorageListener(MESSAGES_KEY, handleMessagesUpdate)
        removeStorageListener(STAFF_KEY, handleStaffUpdate)
        removeStorageListener(STAFF_MESSAGES_KEY, handleStaffMessagesUpdate)
        clearInterval(interval)
      }
    }
  }, [isAuthenticated])

  const loadData = () => {
    setBookings(getBookings())
    setOffers(getOffers())
    setMessages(getContactMessages())
    setStaff(getStaff())
    setStaffMessages(getStaffMessages())
    setSmsLogs(getSMSLogs())
    setLastUpdate(new Date())
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  const handleBookingStatusUpdate = async (id: string, status: Booking['status']) => {
    const booking = bookings.find(b => b.id === id)
    if (!booking) return

    // Update booking status
    updateBookingStatus(id, status)
    
    // Send SMS notification for confirmed or cancelled bookings
    if (status === 'confirmed' || status === 'cancelled') {
      setSendingSMS(id)
      
      try {
        let smsSuccess = false
        
        if (status === 'confirmed') {
          smsSuccess = await sendBookingConfirmationSMS(
            booking.phone,
            booking.name,
            booking.service,
            booking.date,
            booking.time,
            booking.id
          )
        } else if (status === 'cancelled') {
          smsSuccess = await sendBookingCancellationSMS(
            booking.phone,
            booking.name,
            booking.service,
            booking.id
          )
        }
        
        if (smsSuccess) {
          // Refresh SMS logs
          setSmsLogs(getSMSLogs())
        }
      } catch (error) {
        console.error('Error sending SMS:', error)
      } finally {
        setSendingSMS(null)
      }
    }
  }

  const handleAssignBooking = async () => {
    if (!selectedBooking || !assignmentForm.staffId) return

    const selectedStaff = staff.find(s => s.id === assignmentForm.staffId)
    if (!selectedStaff) return

    // Assign booking to staff
    assignBookingToStaff(
      selectedBooking.id,
      assignmentForm.staffId,
      selectedStaff.name,
      assignmentForm.notes
    )

    // Send message to staff
    sendStaffMessage({
      staffId: assignmentForm.staffId,
      bookingId: selectedBooking.id,
      message: `New booking assigned: ${selectedBooking.service} for ${selectedBooking.name} on ${selectedBooking.date} at ${selectedBooking.time}. ${assignmentForm.notes ? 'Notes: ' + assignmentForm.notes : ''}`,
      type: 'assignment',
      adminId: 'admin'
    })

    // Send SMS to staff
    setSendingSMS(selectedBooking.id)
    try {
      await sendStaffAssignmentSMS(
        selectedStaff.phone,
        selectedStaff.name,
        selectedBooking.name,
        selectedBooking.service,
        selectedBooking.date,
        selectedBooking.time,
        selectedBooking.address,
        selectedBooking.id
      )
      setSmsLogs(getSMSLogs())
    } catch (error) {
      console.error('Error sending staff SMS:', error)
    } finally {
      setSendingSMS(null)
    }

    // Reset form and close modal
    setAssignmentForm({ staffId: '', notes: '' })
    setSelectedBooking(null)
    setShowAssignmentModal(false)
  }

  const handleMessageStatusUpdate = (id: string, status: ContactMessage['status']) => {
    updateMessageStatus(id, status)
  }

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingOffer) {
      updateOffer(editingOffer.id, offerForm)
      setEditingOffer(null)
    } else {
      saveOffer(offerForm)
    }
    setOfferForm({ title: '', description: '', discount: '', validUntil: '', isActive: true })
    setShowOfferForm(false)
  }

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingStaff) {
      updateStaff(editingStaff.id, staffForm)
      setEditingStaff(null)
    } else {
      saveStaff(staffForm)
    }
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
    setShowStaffForm(false)
  }

  const handleEditOffer = (offer: Offer) => {
    setEditingOffer(offer)
    setOfferForm({
      title: offer.title,
      description: offer.description,
      discount: offer.discount,
      validUntil: offer.validUntil,
      isActive: offer.isActive
    })
    setShowOfferForm(true)
  }

  const handleEditStaff = (staffMember: Staff) => {
    setEditingStaff(staffMember)
    setStaffForm({
      name: staffMember.name,
      phone: staffMember.phone,
      email: staffMember.email,
      specialization: staffMember.specialization,
      experience: staffMember.experience,
      qualification: staffMember.qualification,
      address: staffMember.address,
      emergencyContact: staffMember.emergencyContact,
      isActive: staffMember.isActive
    })
    setShowStaffForm(true)
  }

  const handleDeleteOffer = (id: string) => {
    if (confirm('Are you sure you want to delete this offer?')) {
      deleteOffer(id)
    }
  }

  const handleDeleteStaff = (id: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      deleteStaff(id)
    }
  }

  const handleSpecializationChange = (specialization: string) => {
    setStaffForm(prev => ({
      ...prev,
      specialization: prev.specialization.includes(specialization)
        ? prev.specialization.filter(s => s !== specialization)
        : [...prev.specialization, specialization]
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'read': return 'bg-gray-100 text-gray-800'
      case 'replied': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const tabs = [
    { id: 'bookings', label: 'Bookings', icon: Calendar, count: bookings.length },
    { id: 'staff', label: 'Staff', icon: Users, count: staff.filter(s => s.isActive).length },
    { id: 'messages', label: 'Messages', icon: MessageSquare, count: messages.filter(m => m.status === 'new').length },
    { id: 'offers', label: 'Offers', icon: Tag, count: offers.length },
    { id: 'sms', label: 'SMS Logs', icon: MessageCircle, count: smsLogs.length }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Utkal Medpro Admin</h1>
              <p className="text-gray-600">Dashboard & Management</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
              <button
                onClick={loadData}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Staff</p>
                <p className="text-2xl font-bold text-gray-900">
                  {staff.filter(s => s.isActive).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New Messages</p>
                <p className="text-2xl font-bold text-gray-900">
                  {messages.filter(m => m.status === 'new').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">SMS Sent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {smsLogs.filter(log => log.status === 'sent').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time indicator */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live updates enabled</span>
          </div>
          <div className="text-sm text-gray-500">
            {bookings.filter(b => b.status === 'pending').length > 0 && (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                {bookings.filter(b => b.status === 'pending').length} pending bookings need attention
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`py-0.5 px-2 rounded-full text-xs ${
                      activeTab === tab.id ? 'bg-primary-100 text-primary-900' : 'bg-gray-100 text-gray-900'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Service Bookings</h2>
                  <div className="text-sm text-gray-500">
                    {bookings.length === 0 ? 'No bookings yet' : `${bookings.length} total bookings`}
                  </div>
                </div>
                
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-600">New bookings will appear here automatically when customers book services.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Assigned Staff
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((booking) => (
                          <tr key={booking.id} className={booking.status === 'pending' ? 'bg-yellow-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                                <div className="text-sm text-gray-500 flex items-center space-x-4">
                                  <span className="flex items-center">
                                    <Phone className="h-3 w-3 mr-1" />
                                    {booking.phone}
                                  </span>
                                  {booking.email && (
                                    <span className="flex items-center">
                                      <Mail className="h-3 w-3 mr-1" />
                                      {booking.email}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{booking.service}</div>
                              <div className="text-sm text-gray-500">{booking.price}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{booking.date}</div>
                              <div className="text-sm text-gray-500">{booking.time}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {booking.assignedStaffName ? (
                                <div className="text-sm">
                                  <div className="font-medium text-gray-900">{booking.assignedStaffName}</div>
                                  {booking.staffNotes && (
                                    <div className="text-gray-500 text-xs">{booking.staffNotes}</div>
                                  )}
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedBooking(booking)
                                    setShowAssignmentModal(true)
                                  }}
                                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                                >
                                  Assign Staff
                                </button>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                              {sendingSMS === booking.id && (
                                <div className="text-xs text-blue-600 mt-1">Sending SMS...</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                {booking.status === 'pending' && (
                                  <button
                                    onClick={() => handleBookingStatusUpdate(booking.id, 'confirmed')}
                                    disabled={sendingSMS === booking.id}
                                    className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                    title="Confirm & Send SMS"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                )}
                                {booking.status === 'confirmed' && (
                                  <button
                                    onClick={() => handleBookingStatusUpdate(booking.id, 'completed')}
                                    className="text-blue-600 hover:text-blue-900"
                                    title="Mark Complete"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleBookingStatusUpdate(booking.id, 'cancelled')}
                                  disabled={sendingSMS === booking.id}
                                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                  title="Cancel & Send SMS"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Staff Tab */}
            {activeTab === 'staff' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Staff Management</h2>
                  <button
                    onClick={() => setShowStaffForm(true)}
                    className="btn-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Add Staff</span>
                  </button>
                </div>

                {showStaffForm && (
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                    </h3>
                    <form onSubmit={handleStaffSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={staffForm.name}
                            onChange={(e) => setStaffForm({...staffForm, name: e.target.value})}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            placeholder="Dr. John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            value={staffForm.phone}
                            onChange={(e) => setStaffForm({...staffForm, phone: e.target.value})}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            placeholder="+91 9876543210"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={staffForm.email}
                            onChange={(e) => setStaffForm({...staffForm, email: e.target.value})}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            placeholder="john.doe@utkalmedpro.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Experience *
                          </label>
                          <input
                            type="text"
                            value={staffForm.experience}
                            onChange={(e) => setStaffForm({...staffForm, experience: e.target.value})}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            placeholder="5 years"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Qualification *
                        </label>
                        <input
                          type="text"
                          value={staffForm.qualification}
                          onChange={(e) => setStaffForm({...staffForm, qualification: e.target.value})}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="B.Sc Nursing, Certified Phlebotomist"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Specializations *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {specializations.map((spec) => (
                            <label key={spec} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={staffForm.specialization.includes(spec)}
                                onChange={() => handleSpecializationChange(spec)}
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">{spec}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address *
                          </label>
                          <input
                            type="text"
                            value={staffForm.address}
                            onChange={(e) => setStaffForm({...staffForm, address: e.target.value})}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            placeholder="Bhubaneswar, Odisha"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Emergency Contact *
                          </label>
                          <input
                            type="tel"
                            value={staffForm.emergencyContact}
                            onChange={(e) => setStaffForm({...staffForm, emergencyContact: e.target.value})}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            placeholder="+91 9876543211"
                          />
                        </div>
                      </div>

                      <div className="flex items-center">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={staffForm.isActive}
                            onChange={(e) => setStaffForm({...staffForm, isActive: e.target.checked})}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Active</span>
                        </label>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="btn-primary text-white px-4 py-2 rounded-lg"
                        >
                          {editingStaff ? 'Update Staff' : 'Add Staff'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowStaffForm(false)
                            setEditingStaff(null)
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
                          }}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {staff.map((staffMember) => (
                    <div key={staffMember.id} className="bg-white border rounded-lg p-6 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-primary-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{staffMember.name}</h3>
                            <p className="text-sm text-gray-600">{staffMember.experience} experience</p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEditStaff(staffMember)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(staffMember.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{staffMember.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="h-3 w-3" />
                          <span>{staffMember.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>{staffMember.address}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-1">Specializations:</p>
                        <div className="flex flex-wrap gap-1">
                          {staffMember.specialization.map((spec, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{staffMember.currentBookings}</div>
                          <div className="text-xs text-gray-600">Current</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{staffMember.totalCompleted}</div>
                          <div className="text-xs text-gray-600">Completed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900 flex items-center justify-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            {staffMember.rating}
                          </div>
                          <div className="text-xs text-gray-600">Rating</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          staffMember.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {staffMember.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-xs text-gray-500">
                          Joined {new Date(staffMember.joinedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Messages</h2>
                <div className="space-y-4">
                  {messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((message) => (
                    <div key={message.id} className={`p-4 rounded-lg ${message.status === 'new' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{message.name}</h3>
                          <p className="text-sm text-gray-600">{message.subject}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(message.status)}`}>
                            {message.status}
                          </span>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleMessageStatusUpdate(message.id, 'read')}
                              className="text-blue-600 hover:text-blue-900"
                              title="Mark as Read"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleMessageStatusUpdate(message.id, 'replied')}
                              className="text-green-600 hover:text-green-900"
                              title="Mark as Replied"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{message.message}</p>
                      <div className="text-sm text-gray-500 flex items-center space-x-4">
                        <span className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {message.phone}
                        </span>
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {message.email}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(message.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Offers Tab */}
            {activeTab === 'offers' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Special Offers</h2>
                  <button
                    onClick={() => setShowOfferForm(true)}
                    className="btn-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Offer</span>
                  </button>
                </div>

                {showOfferForm && (
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingOffer ? 'Edit Offer' : 'Create New Offer'}
                    </h3>
                    <form onSubmit={handleOfferSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={offerForm.title}
                            onChange={(e) => setOfferForm({...offerForm, title: e.target.value})}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            placeholder="e.g., 20% Off Blood Tests"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Discount
                          </label>
                          <input
                            type="text"
                            value={offerForm.discount}
                            onChange={(e) => setOfferForm({...offerForm, discount: e.target.value})}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            placeholder="e.g., 20% OFF or ₹100 OFF"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={offerForm.description}
                          onChange={(e) => setOfferForm({...offerForm, description: e.target.value})}
                          required
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="Describe the offer details..."
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Valid Until
                          </label>
                          <input
                            type="date"
                            value={offerForm.validUntil}
                            onChange={(e) => setOfferForm({...offerForm, validUntil: e.target.value})}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={offerForm.isActive}
                              onChange={(e) => setOfferForm({...offerForm, isActive: e.target.checked})}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Active</span>
                          </label>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="btn-primary text-white px-4 py-2 rounded-lg"
                        >
                          {editingOffer ? 'Update Offer' : 'Create Offer'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowOfferForm(false)
                            setEditingOffer(null)
                            setOfferForm({ title: '', description: '', discount: '', validUntil: '', isActive: true })
                          }}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {offers.map((offer) => (
                    <div key={offer.id} className="bg-white border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{offer.title}</h3>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEditOffer(offer)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOffer(offer.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-primary-600 mb-2">{offer.discount}</p>
                      <p className="text-gray-600 text-sm mb-3">{offer.description}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">
                          Valid until: {new Date(offer.validUntil).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          offer.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {offer.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SMS Logs Tab */}
            {activeTab === 'sms' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">SMS Activity Logs</h2>
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-blue-800">
                    📱 SMS notifications are automatically sent when bookings are confirmed/cancelled and when staff are assigned.
                    In production, integrate with SMS providers like Textlocal, Twilio, or MSG91.
                  </p>
                </div>
                
                {smsLogs.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No SMS logs yet</h3>
                    <p className="text-gray-600">SMS activity will appear here when bookings are confirmed/cancelled or staff are assigned.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {smsLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((log) => (
                      <div key={log.id} className={`p-4 rounded-lg border ${
                        log.status === 'sent' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-gray-900">SMS to {log.phoneNumber}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(log.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            log.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {log.status}
                          </span>
                        </div>
                        {log.message && (
                          <div className="bg-white p-3 rounded border text-sm text-gray-700">
                            {log.message}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Staff Assignment Modal */}
      {showAssignmentModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Assign Staff to Booking</h2>
              <p className="text-gray-600">Booking: {selectedBooking.service} for {selectedBooking.name}</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Staff Member *
                  </label>
                  <select
                    value={assignmentForm.staffId}
                    onChange={(e) => setAssignmentForm({...assignmentForm, staffId: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Choose a staff member...</option>
                    {staff.filter(s => s.isActive).map((staffMember) => (
                      <option key={staffMember.id} value={staffMember.id}>
                        {staffMember.name} - {staffMember.specialization.join(', ')} ({staffMember.currentBookings} current bookings)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Notes
                  </label>
                  <textarea
                    value={assignmentForm.notes}
                    onChange={(e) => setAssignmentForm({...assignmentForm, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Any special instructions for the staff member..."
                  />
                </div>

                {assignmentForm.staffId && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Selected Staff Details:</h4>
                    {(() => {
                      const selectedStaff = staff.find(s => s.id === assignmentForm.staffId)
                      return selectedStaff ? (
                        <div className="text-sm text-blue-800">
                          <p><strong>Name:</strong> {selectedStaff.name}</p>
                          <p><strong>Phone:</strong> {selectedStaff.phone}</p>
                          <p><strong>Specializations:</strong> {selectedStaff.specialization.join(', ')}</p>
                          <p><strong>Experience:</strong> {selectedStaff.experience}</p>
                          <p><strong>Current Bookings:</strong> {selectedStaff.currentBookings}</p>
                          <p><strong>Rating:</strong> ⭐ {selectedStaff.rating}/5</p>
                        </div>
                      ) : null
                    })()}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAssignmentModal(false)
                  setSelectedBooking(null)
                  setAssignmentForm({ staffId: '', notes: '' })
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignBooking}
                disabled={!assignmentForm.staffId || sendingSMS === selectedBooking.id}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {sendingSMS === selectedBooking.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Assigning...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4" />
                    <span>Assign & Notify</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard