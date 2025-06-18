import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { Phone, Shield, ArrowRight, Clock } from 'lucide-react'
import { useCustomerAuth } from '../contexts/CustomerAuthContext'

const CustomerLogin = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  
  const { isAuthenticated, login, sendOTP } = useCustomerAuth()

  if (isAuthenticated) {
    return <Navigate to="/customer/dashboard" replace />
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate phone number
    const phoneRegex = /^[+]?[0-9]{10,15}$/
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      setError('Please enter a valid phone number')
      setLoading(false)
      return
    }

    try {
      const success = await sendOTP(phone)
      if (success) {
        setStep('otp')
        setOtpSent(true)
      } else {
        setError('Failed to send OTP. Please try again.')
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      setLoading(false)
      return
    }

    try {
      const success = await login(phone, otp)
      if (!success) {
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
      const success = await sendOTP(phone)
      if (success) {
        setOtpSent(true)
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
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Customer Login</h2>
          <p className="mt-2 text-gray-600">Track your bookings and manage your account</p>
        </div>

        {step === 'phone' ? (
          <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
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
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+91 7064055180"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                We'll send you a verification code via SMS
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
              className="w-full btn-primary text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Send OTP</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
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
                OTP sent to {phone}
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
                'Verify & Login'
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
                  setStep('phone')
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
            New to Utkal Medpro?{' '}
            <Link to="/booking" className="text-primary-600 hover:text-primary-500 font-medium">
              Book a service
            </Link>
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-800">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Quick Access</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            Login to track your bookings, view service history, and manage your account.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CustomerLogin