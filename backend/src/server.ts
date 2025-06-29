import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import dotenv from 'dotenv'

import { errorHandler } from './middleware/errorHandler'
import { authRoutes } from './routes/auth'
import { bookingRoutes } from './routes/bookings'
import { staffRoutes } from './routes/staff'
import { customerRoutes } from './routes/customers'
import { offerRoutes } from './routes/offers'
import { messageRoutes } from './routes/messages'
import { adminRoutes } from './routes/admin'
import { setupWebSocket } from './websocket/websocket'

// Load environment variables
dotenv.config()

const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server })

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(compression())
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use('/api', limiter)

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/staff', staffRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/offers', offerRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/admin', adminRoutes)

// WebSocket setup
setupWebSocket(wss)

// Error handling
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  })
})

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🔌 WebSocket server ready`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('Process terminated')
  })
})

export default app