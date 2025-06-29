import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Syringe, TestTube, Ban as Bandage, Clock, Shield, Users, Star, CheckCircle, Phone, Calendar } from 'lucide-react'
import DisclaimerModal from '../components/DisclaimerModal'

const Home = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(false)

  useEffect(() => {
    // Check if user has already seen the disclaimer
    const hasSeenDisclaimer = localStorage.getItem('utkal_medpro_disclaimer_seen')
    if (!hasSeenDisclaimer) {
      // Show disclaimer after a short delay
      const timer = setTimeout(() => {
        setShowDisclaimer(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDisclaimerClose = () => {
    setShowDisclaimer(false)
    localStorage.setItem('utkal_medpro_disclaimer_seen', 'true')
  }

  const services = [
    {
      icon: TestTube,
      title: 'Blood Sample Collection',
      description: 'Professional blood collection at your home or office with sterile equipment',
      features: ['Home/Office visits', 'Sterile equipment', 'Quick results']
    },
    {
      icon: Syringe,
      title: 'Home Injections',
      description: 'Safe administration of prescribed injections by certified professionals',
      features: ['Certified nurses', 'All injection types', 'Pain-free technique']
    },
    {
      icon: Bandage,
      title: 'Post-Surgery Care',
      description: 'Complete wound dressing and post-operative care at home',
      features: ['Wound dressing', 'Medication assistance', 'Recovery monitoring']
    }
  ]

  const packageImages = [
    {
      title: 'Women\'s Health Screening',
      price: 'Worth ₹999 just at ₹499',
      image: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Comprehensive health package for women'
    },
    {
      title: 'Premium Care Package',
      price: 'Starting from ₹499',
      image: 'https://images.pexels.com/photos/4173624/pexels-photo-4173624.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Complete healthcare at your doorstep'
    },
    {
      title: 'Family Care Package',
      price: 'Starting from ₹999',
      image: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Healthcare solutions for the entire family'
    }
  ]

  const stats = [
    { number: '500+', label: 'Happy Patients' },
    { number: '6 AM-10 PM', label: 'Available' },
    { number: '2+', label: 'Years Experience' },
    { number: '100%', label: 'Satisfaction Rate' }
  ]

  return (
    <div>
      {/* Disclaimer Modal */}
      <DisclaimerModal isOpen={showDisclaimer} onClose={handleDisclaimerClose} />

      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Professional 
                <span className="block text-blue-200">Healthcare</span>
                at Your Doorstep
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Expert paramedical services including blood collection, injections, 
                and post-surgery care delivered to your home or office.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/booking"
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 text-center"
                >
                  Book Appointment
                </Link>
                <a
                  href="tel:+917064055180"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 text-center"
                >
                  Emergency Call
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="floating-animation">
                <img
                  src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Healthcare Professional"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Certified Professionals</p>
                    <p className="text-sm text-gray-600">Licensed & Insured</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Professional Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive paramedical care delivered by certified professionals 
              with years of experience in home healthcare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="service-card bg-white p-8 rounded-2xl shadow-lg">
                <div className="bg-primary-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <service.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Package Images Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Healthcare Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive healthcare solutions designed for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packageImages.map((pkg, index) => (
              <div key={index} className="relative group overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                  <p className="text-sm text-gray-200 mb-2">{pkg.description}</p>
                  <p className="text-lg font-semibold text-blue-200">{pkg.price}</p>
                </div>
                <div className="absolute top-4 right-4">
                  <Link
                    to="/booking"
                    className="bg-white text-primary-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Utkal Medpro?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-2 rounded-lg flex-shrink-0">
                    <Shield className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Certified Professionals</h3>
                    <p className="text-gray-600">All our staff are licensed, certified, and have years of experience in healthcare.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-2 rounded-lg flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">24/7 Availability</h3>
                    <p className="text-gray-600">Emergency services available round the clock for urgent medical needs.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-2 rounded-lg flex-shrink-0">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Personalized Care</h3>
                    <p className="text-gray-600">Tailored healthcare solutions based on individual patient needs and preferences.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/4173624/pexels-photo-4173624.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Professional Healthcare"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900">4.9/5</span>
                </div>
                <p className="text-sm text-gray-600">Patient Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience Quality Healthcare at Home?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Book your appointment today and let our certified professionals take care of your health needs 
            in the comfort of your own space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 inline-flex items-center justify-center space-x-2"
            >
              <Calendar className="h-5 w-5" />
              <span>Book Appointment</span>
            </Link>
            <a
              href="tel:+917064055180"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 inline-flex items-center justify-center space-x-2"
            >
              <Phone className="h-5 w-5" />
              <span>Call Now</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home