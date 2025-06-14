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