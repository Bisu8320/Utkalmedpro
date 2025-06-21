import React from 'react'
import { X, AlertTriangle, Shield, FileText } from 'lucide-react'

interface DisclaimerModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * DisclaimerModal displays a modal with service declaration, disclaimer, and important notices.
 * @example
 * DisclaimerModal({ isOpen: true, onClose: () => console.log('Modal closed') })
 * null (if isOpen is false)
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Indicates whether the modal should be displayed.
 * @param {function} props.onClose - Function to call when closing the modal.
 * @returns {JSX.Element|null} Modal component with various disclaimer sections or null if not open.
 * @description
 *   - The modal includes sections for service declaration, important notice, legal notice, and emergency contact.
 *   - Only renders when `isOpen` is true; otherwise returns null.
 *   - Styling and layout involve fixed positioning and responsive design practices.
 */
const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Service Declaration & Disclaimer</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Service Declaration */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Our Services</h3>
            </div>
            <p className="text-blue-800 mb-4">
              We hereby declare that <strong>Utkal Medpro</strong> provides only home-based paramedical services, which include:
            </p>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Home blood sample collection</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Home injections (only as prescribed by a registered medical practitioner)</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Post-surgical care (as per the doctor's written instructions)</span>
              </li>
            </ul>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4">Important Notice</h3>
            <p className="text-yellow-800 mb-4">
              We <strong>do not provide</strong> emergency medical services, diagnosis, or medical treatment. 
              All services are rendered strictly as per the written advice or prescription of a qualified and registered medical doctor.
            </p>
          </div>

          {/* Legal Notice */}
          <div className="bg-red-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold text-red-900">Important Legal Notice</h3>
            </div>
            <div className="space-y-4 text-red-800">
              <p>
                Our team consists of trained paramedical professionals. We do not substitute the services 
                of a hospital, nursing home, or licensed medical practitioner.
              </p>
              <p>
                Clients are advised to consult their doctor for any medical condition or emergency.
              </p>
              <p>
                By availing our services, you acknowledge and agree that <strong>Utkal Medpro</strong> is not liable 
                for any medical complications arising from services rendered under the supervision or prescription of your doctor.
              </p>
              <p>
                All medical instructions, prescriptions, and post-operative protocols must be provided clearly 
                by your consulting doctor and followed accordingly.
              </p>
              <p className="font-semibold">
                For any medical emergency, please contact a hospital or emergency medical services immediately.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
            <p className="text-gray-700 mb-2">
              For urgent medical emergencies, please contact:
            </p>
            <div className="space-y-2">
              <p className="text-gray-800 font-medium">Emergency Services: 108 / 102</p>
              <p className="text-gray-800 font-medium">Local Hospital Emergency</p>
              <p className="text-gray-600 text-sm">
                Our services are for non-emergency paramedical care only.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="btn-primary text-white px-8 py-3 rounded-lg font-semibold"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DisclaimerModal