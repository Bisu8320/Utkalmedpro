import React from 'react'
import { Link } from 'react-router-dom'
import { TestTube, Syringe, Ban as Bandage, Heart, Clock, CheckCircle, Shield, Users } from 'lucide-react'

const Services = () => {
  const services = [
    {
      icon: TestTube,
      title: 'Blood Sample Collection',
      description: 'Professional blood collection services at your home or office with complete safety protocols.',Blood sample collected and reported directly by "Relion Diagnostics & Research Center".
      features: [
        'Home and office visits',
        'Sterile equipment and techniques',
        'Quick and painless collection',
        'Lab coordination and results',
        'Multiple test packages available',
        'Fasting and non-fasting tests'
      ],
      price: 'Free Home Visit Collection',
      image: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: Syringe,
      title: 'Home Injections',
      description: 'Safe administration of prescribed injections by certified healthcare professionals.',
      features: [
        'All types of injections',
        'Certified nursing staff',
        'Pain-free injection techniques',
        'Medication management',
        'Vaccination services',
        'IV therapy available'
      ],
      price: 'Starting from ₹199',
      image: 'https://images.pexels.com/photos/4173624/pexels-photo-4173624.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: Bandage,
      title: 'Post-Surgery Care & Dressing',
      description: 'Comprehensive wound care and post-operative support for faster recovery.',
      features: [
        'Wound dressing and cleaning',
        'Suture removal',
        'Recovery monitoring',
        'Medication assistance',
        'Mobility support',
        'Follow-up consultations'
      ],
      price: 'Starting from ₹499',
      image: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ]

  const additionalServices = [
    {
      icon: Heart,
      title: 'Health Monitoring',
      description: 'Regular health checkups and vital signs monitoring',
      features: ['Blood pressure monitoring', 'Blood sugar testing', 'Weight management', 'Health reports']
    },
    {
      icon: Users,
      title: 'Elderly Care',
      description: 'Specialized care services for senior citizens',
      features: ['Medication reminders', 'Mobility assistance', 'Companionship', 'Emergency response']
    },
    {
      icon: Shield,
      title: 'Emergency Services',
      description: '24/7 emergency medical assistance',
      features: ['Rapid response', 'First aid', 'Emergency transport coordination', 'Critical care support']
    }
  ]

  return (
    <div className="py-20">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Professional Paramedical Services
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Comprehensive healthcare services delivered by certified professionals 
            in the comfort and safety of your home or office.
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert care delivered with precision, safety, and compassion.
            </p>
          </div>

          <div className="space-y-16">
            {services.map((service, index) => (
              <div
                key={index}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="bg-primary-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    <service.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">{service.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-bold text-primary-600">{service.price}</span>
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Same day service available</span>
                    </div>
                  </div>

                  <Link
                    to="/booking"
                    className="btn-primary text-white px-8 py-3 rounded-lg font-semibold inline-block"
                  >
                    Book This Service
                  </Link>
                </div>

                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="relative">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="rounded-2xl shadow-xl w-full"
                    />
                    <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary-600">24/7</div>
                        <div className="text-sm text-gray-600">Available</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Additional Care Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive healthcare support for all your medical needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <div key={index} className="service-card bg-gray-50 p-8 rounded-2xl">
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

      {/* Service Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to get professional healthcare at your doorstep.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Book Online', description: 'Schedule your appointment through our website or call us directly' },
              { step: '2', title: 'Confirmation', description: 'Receive confirmation with professional details and arrival time' },
              { step: '3', title: 'Service Delivery', description: 'Our certified professional arrives at your location with equipment' },
              { step: '4', title: 'Follow-up', description: 'Get results, reports, and follow-up care as needed' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Need Professional Healthcare Services?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Book your appointment now and experience quality healthcare in the comfort of your home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
            >
              Book Appointment
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services