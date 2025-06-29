import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { asyncHandler } from '../middleware/errorHandler'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { sendOTP, verifyOTP } from '../services/smsService'
import { validateRegister, validateLogin, validateOTP } from '../validators/authValidator'

const router = Router()

// In-memory storage for demo (use Redis in production)
const users: any[] = []
const otpStore: Map<string, { otp: string, expires: number }> = new Map()

// Send OTP
router.post('/send-otp', asyncHandler(async (req, res) => {
  const { phone } = req.body

  if (!phone) {
    return res.status(400).json({
      success: false,
      message: 'Phone number is required'
    })
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = Date.now() + 5 * 60 * 1000 // 5 minutes

    // Store OTP
    otpStore.set(phone, { otp, expires })

    // Send OTP via SMS
    await sendOTP(phone, otp)

    res.json({
      success: true,
      message: 'OTP sent successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    })
  }
}))

// Verify OTP and login/register
router.post('/verify-otp', asyncHandler(async (req, res) => {
  const { phone, otp } = req.body

  if (!phone || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Phone number and OTP are required'
    })
  }

  // Verify OTP
  const storedOTP = otpStore.get(phone)
  if (!storedOTP || storedOTP.otp !== otp || Date.now() > storedOTP.expires) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired OTP'
    })
  }

  // Remove used OTP
  otpStore.delete(phone)

  // Find or create user
  let user = users.find(u => u.phone === phone)
  if (!user) {
    user = {
      id: Date.now().toString(),
      phone,
      role: 'customer',
      createdAt: new Date().toISOString()
    }
    users.push(user)
  }

  // Generate JWT token
  const token = jwt.sign(
    { 
      id: user.id, 
      phone: user.phone, 
      role: user.role 
    },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  )

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name || 'Customer',
      phone: user.phone,
      email: user.email,
      role: user.role
    }
  })
}))

// Register with additional details
router.post('/register', asyncHandler(async (req, res) => {
  const { error } = validateRegister(req.body)
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    })
  }

  const { name, phone, email, password } = req.body

  // Check if user exists
  const existingUser = users.find(u => u.phone === phone || u.email === email)
  if (existingUser) {
    // Update existing user
    existingUser.name = name
    existingUser.email = email
    if (password) {
      existingUser.password = await bcrypt.hash(password, 10)
    }

    const token = jwt.sign(
      { 
        id: existingUser.id, 
        phone: existingUser.phone, 
        role: existingUser.role 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    return res.json({
      success: true,
      token,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        phone: existingUser.phone,
        email: existingUser.email,
        role: existingUser.role
      }
    })
  }

  // Create new user
  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined
  const newUser = {
    id: Date.now().toString(),
    name,
    phone,
    email,
    password: hashedPassword,
    role: 'customer',
    createdAt: new Date().toISOString()
  }

  users.push(newUser)

  const token = jwt.sign(
    { 
      id: newUser.id, 
      phone: newUser.phone, 
      role: newUser.role 
    },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  )

  res.status(201).json({
    success: true,
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      phone: newUser.phone,
      email: newUser.email,
      role: newUser.role
    }
  })
}))

// Login with phone/email and password
router.post('/login', asyncHandler(async (req, res) => {
  const { error } = validateLogin(req.body)
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    })
  }

  const { identifier, password } = req.body

  // Find user by phone or email
  const user = users.find(u => u.phone === identifier || u.email === identifier)
  if (!user || !user.password) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    })
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password)
  if (!isValidPassword) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    })
  }

  const token = jwt.sign(
    { 
      id: user.id, 
      phone: user.phone, 
      role: user.role 
    },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  )

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role
    }
  })
}))

// Refresh token
router.post('/refresh', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const user = users.find(u => u.id === req.user?.id)
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }

  const token = jwt.sign(
    { 
      id: user.id, 
      phone: user.phone, 
      role: user.role 
    },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  )

  res.json({
    success: true,
    token
  })
}))

// Logout
router.post('/logout', authenticateToken, asyncHandler(async (req, res) => {
  // In a real app, you'd blacklist the token or remove it from Redis
  res.json({
    success: true,
    message: 'Logged out successfully'
  })
}))

export { router as authRoutes }