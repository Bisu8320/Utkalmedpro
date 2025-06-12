import React from 'react'
import { Heart, Phone, Mail, MapPin, Clock } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-500 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">MediCare Home</h3>
                <p className="text-gray-400 text-sm">Paramedical Services</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Professional paramedical services at your doorstep. We provide blood sample collection, 
              injections, and post-surgery care in the comfort of your home or office.
            </p>
            <div className="flex items-center space-x-2 text-primary-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Available 24/7 for emergencies</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-primary-400 transition-colors">Home</a></li>
              <li><a href="/services" className="text-gray-300 hover:text-primary-400 transition-colors">Services</a></li>
              <li><a href="/booking" className="text-gray-300 hover:text-primary-400 transition-colors">Book Appointment</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-primary-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300 text-sm">+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300 text-sm">info@medicarehome.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary-400 mt-1" />
                <span className="text-gray-300 text-sm">
                  123 Healthcare Street,<br />
                  Medical District,<br />
                  City - 123456
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 MediCare Home. All rights reserved. | Licensed Paramedical Services
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer