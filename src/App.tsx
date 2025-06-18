import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CustomerAuthProvider } from './contexts/CustomerAuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import OfferBanner from './components/OfferBanner'
import Home from './pages/Home'
import Services from './pages/Services'
import Booking from './pages/Booking'
import Contact from './pages/Contact'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import CustomerLogin from './pages/CustomerLogin'
import CustomerDashboard from './pages/CustomerDashboard'

function App() {
  return (
    <AuthProvider>
      <CustomerAuthProvider>
        <div className="min-h-screen bg-gray-50">
          <OfferBanner />
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/customer/login" element={<CustomerLogin />} />
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CustomerAuthProvider>
    </AuthProvider>
  )
}

export default App