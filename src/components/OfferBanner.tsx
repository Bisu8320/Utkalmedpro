import React, { useState, useEffect } from 'react'
import { X, Tag } from 'lucide-react'
import { getOffers } from '../utils/storage'
import { Offer } from '../types'

const OfferBanner = () => {
  const [offers, setOffers] = useState<Offer[]>([])
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const activeOffers = getOffers().filter(offer => 
      offer.isActive && new Date(offer.validUntil) > new Date()
    )
    setOffers(activeOffers)
  }, [])

  useEffect(() => {
    if (offers.length > 1) {
      const interval = setInterval(() => {
        setCurrentOfferIndex((prev) => (prev + 1) % offers.length)
      }, 5000) // Change offer every 5 seconds
      return () => clearInterval(interval)
    }
  }, [offers.length])

  if (!isVisible || offers.length === 0) {
    return null
  }

  const currentOffer = offers[currentOfferIndex]

  return (
    <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <Tag className="h-5 w-5 flex-shrink-0" />
          <div className="flex-1">
            <span className="font-semibold">{currentOffer.discount}</span>
            <span className="mx-2">•</span>
            <span>{currentOffer.description}</span>
            <span className="mx-2">•</span>
            <span className="text-blue-100">
              Valid until {new Date(currentOffer.validUntil).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {offers.length > 1 && (
          <div className="flex space-x-1 mx-4">
            {offers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentOfferIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentOfferIndex ? 'bg-white' : 'bg-blue-300'
                }`}
              />
            ))}
          </div>
        )}
        
        <button
          onClick={() => setIsVisible(false)}
          className="text-blue-100 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default OfferBanner