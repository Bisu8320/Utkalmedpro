import React, { useState } from 'react'
import { Calendar, Clock, MapPin, User, Phone, Mail, FileText } from 'lucide-react'
import { saveBooking } from '../utils/storage'

const Booking = () => {
  const [formData, setFormData] = useState({
    service: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    date: '',
    time: '',
    notes: ''
  })

  const services = [
    { value: 'blood-collection', label: 'Blood Sample Collection', price: '₹299' },
    { value: 'injection', label: 'Home Injection', price: '₹199' },
    { value: 'wound-dressing', label: 'Wound Dressing', price: '₹499' },
    { value: 'health-monitoring', label: 'Health Monitoring', price: '₹399' },
    { value: 'elderly-care', label: 'Elderly Care', price: '₹799' },
    { value: 'emergency', label: 'Emergency Service', price: 'Call for pricing' }
  ]

  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const selectedService = services.find(s => s.value === formData.service)
    const bookingData = {
      ...formData,
      service: selectedService?.label || formData.service,
      price: selectedService?.price || 'N/A'
    }
    
    saveBooking(bookingData)
    alert('Booking request submitted successfully! We will contact you shortly to confirm.')
    
    // Reset form
    setFormData({
      service: '',
      name: '',
      phone: '',
      email: '',
      address: '',
      date: '',
      time: '',
      notes: ''
    })
  }

  const selectedService = services.find(s => s.value === formData.service)

  return (
    <div className="py-20">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Book Your Appointment
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Schedule professional paramedical services at your convenience. 
            Our certified professionals will visit you at your preferred location.
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Service Booking Form</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Service *
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Choose a service...</option>
                    {services.map((service) => (
                      <option key={service.value} value={service.value}>
                        {service.label} - {service.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="inline h-4 w-4 mr-1" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="+91 7064055180"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Service Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter complete address where service is required"
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="inline h-4 w-4 mr-1" />
                      Preferred Time *
                    </label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select time...</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline h-4 w-4 mr-1" />
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Any specific requirements, medical conditions, or instructions for our professional..."
                  />
                </div>

                {/* Service Summary */}
                {selectedService && (
                  <div className="bg-primary-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Service Summary</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">{selectedService.label}</span>
                      <span className="font-semibold text-primary-600">{selectedService.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      * Final pricing may vary based on specific requirements and location
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full btn-primary text-white py-4 px-6 rounded-lg font-semibold text-lg"
                  >
                    Book Appointment
                  </button>
                  <p className="text-sm text-gray-600 text-center mt-4">
                    We will contact you within 30 minutes to confirm your appointment
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-red-800 mb-4">Emergency Services</h3>
            <p className="text-red-700 mb-6">
              For urgent medical assistance, call our emergency hotline immediately
            </p>
            <a
              href="tel:+917064055180"
              className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors inline-flex items-center space-x-2"
            >
              <Phone className="h-5 w-5" />
              <span>Emergency: +91 7064055180</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Booking