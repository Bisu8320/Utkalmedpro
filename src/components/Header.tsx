import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Heart, Phone, User } from 'lucide-react'
import { useCustomerAuth } from '../contexts/CustomerAuthContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, customer } = useCustomerAuth()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Booking', href: '/booking' },
    { name: 'Contact', href: '/contact' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-500 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Utkal Medpro</h1>
              <p className="text-xs text-gray-500">Paramedical Services</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-primary-600">
              <Phone className="h-4 w-4" />
              <span className="text-sm font-medium">Emergency: +91 7064055180</span>
            </div>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/customer/dashboard"
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{customer?.name || 'Dashboard'}</span>
                </Link>
                <Link
                  to="/booking"
                  className="btn-primary text-white px-6 py-2 rounded-lg text-sm font-medium"
                >
                  Book Now
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/customer/login"
                  className="text-gray-700 hover:text-primary-600 text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/customer/signup"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors border border-primary-600 px-3 py-1 rounded-lg hover:bg-primary-50"
                >
                  Sign Up
                </Link>
                <Link
                  to="/booking"
                  className="btn-primary text-white px-6 py-2 rounded-lg text-sm font-medium"
                >
                  Book Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-primary-600 px-3 py-2">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm font-medium">Emergency: +91 7064055180</span>
                </div>
                
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      to="/customer/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2"
                    >
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">{customer?.name || 'Dashboard'}</span>
                    </Link>
                    <Link
                      to="/booking"
                      onClick={() => setIsMenuOpen(false)}
                      className="btn-primary text-white px-3 py-2 rounded-lg text-sm font-medium mx-3 mt-2 inline-block text-center"
                    >
                      Book Now
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/customer/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-700 hover:text-primary-600 text-sm font-medium px-3 py-2 block"
                    >
                      Login
                    </Link>
                    <Link
                      to="/customer/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium px-3 py-2 block border border-primary-600 mx-3 rounded-lg text-center hover:bg-primary-50"
                    >
                      Sign Up
                    </Link>
                    <Link
                      to="/booking"
                      onClick={() => setIsMenuOpen(false)}
                      className="btn-primary text-white px-3 py-2 rounded-lg text-sm font-medium mx-3 mt-2 inline-block text-center"
                    >
                      Book Now
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header