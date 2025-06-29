import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { User, Phone, Mail, Eye, EyeOff, UserPlus, CheckCircle } from 'lucide-react'
import { useCustomerAuth } from '../contexts/CustomerAuthContext'

const CustomerSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'signup' | 'otp'>('signup')
  const [otp, setOtp] = useState('')
  
  const { isAuthenticated, register, sendOTP, login } = useCustomerAuth()

  if (isAuthenticated) {
    return <Navigate to="/customer/dashboard" replace />
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your full name')
      return false
    }

    if (!formData.phone.trim() && !formData.email.trim()) {
      setError('Please provide either phone number or email address')
      return false
    }

    if (formData.phone && !/^[+]?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      setError('Please enter a valid phone number')
      return false
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }

    if (formData.password && formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions')
      return false
    }

    return true
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // If phone number is provided, send OTP for verification
      if (formData.phone) {
        const otpSent = await sendOTP(formData.phone)
        if (otpSent) {
          setStep('otp')
        } else {
          setError('Failed to send OTP. Please try again.')
        }
      } else {
        // For email-only registration, register directly
        const success = await register({
          name: formData.name,
          phone: formData.phone || '',
          email: formData.email,
          password: formData.password
        })

        if (!success) {
          setError('Registration failed. Email may already be registered.')
        }
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)

    try {
      // Verify OTP and complete registration
      const loginSuccess = await login(formData.phone, otp)
      if (loginSuccess) {
        // Update customer profile with additional details
        const success = await register({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          password: formData.password
        })

        if (!success) {
          setError('Registration completed but profile update failed.')
        }
      } else {
        setError('Invalid or expired OTP. Please try again.')
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setError('')
    setLoading(true)
    
    try {
      const success = await sendOTP(formData.phone)
      if (success) {
        alert('OTP sent successfully!')
      } else {
        setError('Failed to resend OTP. Please try again.')
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="bg-primary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {step === 'signup' ? 'Create Account' : 'Verify Phone Number'}
          </h2>
          <p className="mt-2 text-gray-600">
            {step === 'signup' 
              ? 'Join Utkal Medpro for personalized healthcare services'
              : 'Enter the OTP sent to your phone number'
            }
          </p>
        </div>

        {step === 'signup' ? (
          <form className="mt-8 space-y-6" onSubmit={handleSignup}>
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+91 7064055180"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <p>📱 Provide at least one contact method (phone or email)</p>
              <p>• Phone number: Required for OTP verification and SMS updates</p>
              <p>• Email: For booking confirmations and health reports</p>
            </div>

            {/* Password (Optional) */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password (Optional)
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12"
                  placeholder="Create a password (optional)"
                />
                {formData.password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Confirm Password */}
            {formData.password && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                required
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-500 underline">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-500 underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleOTPVerification}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-2xl tracking-widest"
                placeholder="000000"
              />
              <p className="mt-2 text-sm text-gray-500">
                OTP sent to {formData.phone}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-white py-3 px-4 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
              ) : (
                'Verify & Complete Registration'
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                Resend OTP
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setStep('signup')
                  setOtp('')
                  setError('')
                }}
                className="text-gray-600 hover:text-gray-500 text-sm"
              >
                Change phone number
              </button>
            </div>
          </form>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/customer/login" className="text-primary-600 hover:text-primary-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        {/* Benefits Section */}
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 text-green-800 mb-2">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Benefits of Creating Account</span>
          </div>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Track your booking history and status</li>
            <li>• Faster booking with saved details</li>
            <li>• Receive SMS and email notifications</li>
            <li>• Access to exclusive health packages</li>
            <li>• Priority customer support</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CustomerSignup