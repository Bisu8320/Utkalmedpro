import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler'
import { authenticateToken, requireAdmin, requireCustomer, AuthRequest } from '../middleware/auth'
import { validateBooking } from '../validators/bookingValidator'
import { broadcastUpdate } from '../websocket/websocket'

const router = Router()

// In-memory storage for demo (use database in production)
const bookings: any[] = []

// Create booking
router.post('/', asyncHandler(async (req, res) => {
  const { error } = validateBooking(req.body)
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    })
  }

  const booking = {
    id: Date.now().toString(),
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString()
  }

  bookings.push(booking)

  // Broadcast real-time update
  broadcastUpdate({
    type: 'booking_created',
    data: booking
  })

  res.status(201).json({
    success: true,
    booking,
    message: 'Booking created successfully'
  })
}))

// Get all bookings (admin only)
router.get('/', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  res.json({
    success: true,
    bookings: bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  })
}))

// Get booking by ID
router.get('/:id', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const booking = bookings.find(b => b.id === req.params.id)
  
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    })
  }

  // Check if user can access this booking
  if (req.user?.role === 'customer' && booking.phone !== req.user.phone) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    })
  }

  res.json({
    success: true,
    booking
  })
}))

// Get customer bookings
router.get('/customer/:customerId', authenticateToken, requireCustomer, asyncHandler(async (req: AuthRequest, res) => {
  const customerBookings = bookings.filter(b => 
    b.phone === req.user?.phone || b.email === req.user?.email
  )

  res.json({
    success: true,
    bookings: customerBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  })
}))

// Update booking
router.put('/:id', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const bookingIndex = bookings.findIndex(b => b.id === req.params.id)
  
  if (bookingIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    })
  }

  bookings[bookingIndex] = {
    ...bookings[bookingIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  }

  // Broadcast real-time update
  broadcastUpdate({
    type: 'booking_updated',
    data: bookings[bookingIndex]
  })

  res.json({
    success: true,
    booking: bookings[bookingIndex],
    message: 'Booking updated successfully'
  })
}))

// Update booking status
router.patch('/:id/status', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const { status } = req.body
  const bookingIndex = bookings.findIndex(b => b.id === req.params.id)
  
  if (bookingIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    })
  }

  bookings[bookingIndex].status = status
  bookings[bookingIndex].updatedAt = new Date().toISOString()

  // Broadcast real-time update
  broadcastUpdate({
    type: 'booking_updated',
    data: bookings[bookingIndex]
  })

  res.json({
    success: true,
    booking: bookings[bookingIndex],
    message: 'Booking status updated successfully'
  })
}))

// Assign staff to booking
router.patch('/:id/assign-staff', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const { staffId } = req.body
  const bookingIndex = bookings.findIndex(b => b.id === req.params.id)
  
  if (bookingIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    })
  }

  bookings[bookingIndex].assignedStaffId = staffId
  bookings[bookingIndex].updatedAt = new Date().toISOString()

  // Broadcast real-time update
  broadcastUpdate({
    type: 'booking_updated',
    data: bookings[bookingIndex]
  })

  res.json({
    success: true,
    booking: bookings[bookingIndex],
    message: 'Staff assigned successfully'
  })
}))

// Delete booking
router.delete('/:id', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const bookingIndex = bookings.findIndex(b => b.id === req.params.id)
  
  if (bookingIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    })
  }

  const deletedBooking = bookings.splice(bookingIndex, 1)[0]

  // Broadcast real-time update
  broadcastUpdate({
    type: 'booking_deleted',
    data: { id: deletedBooking.id }
  })

  res.json({
    success: true,
    message: 'Booking deleted successfully'
  })
}))

export { router as bookingRoutes }