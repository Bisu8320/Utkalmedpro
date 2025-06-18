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
  MessageCircle
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
  MESSAGES_KEY
} from '../utils/storage'
import { sendBookingConfirmationSMS, sendBookingCancellationSMS, getSMSLogs } from '../utils/smsService'
import { Booking, Offer, ContactMessage } from '../types'

const AdminDashboard = () => {
  const { isAuthenticated, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('bookings')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [smsLogs, setSmsLogs] = useState<any[]>([])
  const [showOfferForm, setShowOfferForm] = useState(false)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [sendingSMS, setSendingSMS] = useState<string | null>(null)

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

      addStorageListener(BOOKINGS_KEY, handleBookingsUpdate)
      addStorageListener(OFFERS_KEY, handleOffersUpdate)
      addStorageListener(MESSAGES_KEY, handleMessagesUpdate)

      // Auto-refresh every 30 seconds
      const interval = setInterval(() => {
        loadData()
      }, 30000)

      return () => {
        removeStorageListener(BOOKINGS_KEY, handleBookingsUpdate)
        removeStorageListener(OFFERS_KEY, handleOffersUpdate)
        removeStorageListener(MESSAGES_KEY, handleMessagesUpdate)
        clearInterval(interval)
      }
    }
  }, [isAuthenticated])

  const loadData = () => {
    setBookings(getBookings())
    setOffers(getOffers())
    setMessages(getContactMessages())
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

  const handleDeleteOffer = (id: string) => {
    if (confirm('Are you sure you want to delete this offer?')) {
      deleteOffer(id)
    }
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-500" />
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
                    📱 SMS notifications are automatically sent when bookings are confirmed or cancelled.
                    In production, integrate with SMS providers like Textlocal, Twilio, or MSG91.
                  </p>
                </div>
                
                {smsLogs.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No SMS logs yet</h3>
                    <p className="text-gray-600">SMS activity will appear here when bookings are confirmed or cancelled.</p>
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
    </div>
  )
}

export default AdminDashboard