import React, { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react'
import { saveContactMessage } from '../utils/storage'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveContactMessage(formData)
    alert('Thank you for your message! We will get back to you within 24 hours.')
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })
  }

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone Numbers',
      details: [
        { label: 'Main Line', value: '+91 7064055180' },
        { label: 'Emergency', value: '+91 7064055180' },
        { label: 'WhatsApp', value: '+91 7064055180' }
      ]
    },
    {
      icon: Mail,
      title: 'Email Addresses',
      details: [
        { label: 'General Inquiries', value: 'info@utkalmedpro.com' },
        { label: 'Bookings', value: 'booking@utkalmedpro.com' },
        { label: 'Emergency', value: 'emergency@utkalmedpro.com' }
      ]
    },
    {
      icon: MapPin,
      title: 'Service Areas',
      details: [
        { label: 'Primary', value: 'Central City & Suburbs' },
        { label: 'Extended', value: 'Metro Area (50km radius)' },
        { label: 'Emergency', value: 'State-wide coverage' }
      ]
    },
    {
      icon: Clock,
      title: 'Operating Hours',
      details: [
        { label: 'Regular Services', value: '8:00 AM - 8:00 PM' },
        { label: 'Emergency', value: '24/7 Available' },
        { label: 'Customer Support', value: '9:00 AM - 6:00 PM' }
      ]
    }
  ]

  const subjects = [
    'General Inquiry',
    'Service Booking',
    'Emergency Request',
    'Feedback/Complaint',
    'Partnership Inquiry',
    'Other'
  ]

  return (
    <div className="py-20">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Get in touch with our team for any questions, bookings, or emergency assistance. 
            We're here to help you 24/7.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple ways to reach us for your convenience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="bg-primary-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <info.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{info.title}</h3>
                <div className="space-y-2">
                  {info.details.map((detail, idx) => (
                    <div key={idx}>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">{detail.label}</p>
                      <p className="text-sm font-medium text-gray-900">{detail.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select a subject...</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Please describe your inquiry or requirements in detail..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary text-white py-4 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Location</h2>
              
              {/* Map Placeholder */}
              <div className="bg-gray-200 h-64 rounded-2xl mb-8 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Interactive Map</p>
                  <p className="text-sm text-gray-500">Service coverage area visualization</p>
                </div>
              </div>

              {/* Office Address */}
              <div className="bg-gray-50 p-6 rounded-2xl mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Main Office</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">123 Healthcare Street</p>
                  <p className="text-gray-700">Medical District</p>
                  <p className="text-gray-700">City - 123456</p>
                  <p className="text-gray-700">State, Country</p>
                </div>
              </div>

              {/* Quick Contact Options */}
              <div className="space-y-4">
                <a
                  href="tel:+917064055180"
                  className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Phone className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Call Now</p>
                    <p className="text-sm text-gray-600">+91 7064055180</p>
                  </div>
                </a>

                <a
                  href="https://wa.me/917064055180"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">WhatsApp</p>
                    <p className="text-sm text-gray-600">Quick messaging</p>
                  </div>
                </a>

                <a
                  href="mailto:info@utkalmedpro.com"
                  className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Mail className="h-6 w-6 text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Email Us</p>
                    <p className="text-sm text-gray-600">info@utkalmedpro.com</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-16 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-red-800 mb-4">Emergency Services</h2>
            <p className="text-lg text-red-700 mb-8 max-w-3xl mx-auto">
              For urgent medical assistance or emergency paramedical services, 
              contact our emergency hotline immediately. Available 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+917064055180"
                className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors inline-flex items-center justify-center space-x-2"
              >
                <Phone className="h-5 w-5" />
                <span>Emergency: +91 7064055180</span>
              </a>
              <a
                href="https://wa.me/917064055180"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center justify-center space-x-2"
              >
                <MessageCircle className="h-5 w-5" />
                <span>WhatsApp Emergency</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact