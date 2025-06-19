export interface Booking {
  id: string
  service: string
  name: string
  phone: string
  email: string
  address: string
  date: string
  time: string
  notes: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
  price: string
  assignedStaffId?: string
  assignedStaffName?: string
  staffNotes?: string
}

export interface Offer {
  id: string
  title: string
  description: string
  discount: string
  validUntil: string
  isActive: boolean
  createdAt: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied'
  createdAt: string
}

export interface Staff {
  id: string
  name: string
  phone: string
  email: string
  specialization: string[]
  experience: string
  qualification: string
  isActive: boolean
  currentBookings: number
  totalCompleted: number
  rating: number
  joinedDate: string
  address: string
  emergencyContact: string
  profileImage?: string
}

export interface StaffMessage {
  id: string
  staffId: string
  bookingId: string
  message: string
  type: 'assignment' | 'update' | 'completion' | 'cancellation'
  sentAt: string
  readAt?: string
  adminId: string
}