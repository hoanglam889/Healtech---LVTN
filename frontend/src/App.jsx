import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import HeroSection from './components/landing/HeroSection';
import SpecialtySection from './components/landing/SpecialtySection';
import DoctorSection from './components/landing/DoctorSection';
import QueueFeatureSection from './components/landing/QueueFeatureSection';
import ArticleSection from './components/landing/ArticleSection';
import ContactSection from './components/landing/ContactSection';
import BookingPage from './pages/booking/BookingPage';
import PatientDashboard from './pages/dashboard/patient/PatientDashboard';
import StaffDashboard from './pages/dashboard/staff/StaffDashboard';
import AuthModal from './components/auth/AuthModal';


function PatientApp() {
  const navigate = useNavigate();
  const [isBooking, setIsBooking] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthModalOpen(false);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsBooking(false);
    setActiveTab('dashboard');
  };

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col justify-between">
      <div>
        <Navbar
          isLoggedIn={isLoggedIn}
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
          onLoginClick={() => setIsAuthModalOpen(true)}
          onBookClick={() => {
            if (isLoggedIn) {
              setIsBooking(true);
            } else {
              setIsAuthModalOpen(true);
            }
          }}
          onHomeClick={() => { setIsBooking(false); setActiveTab('dashboard'); }}
        />

        {isBooking ? (
          <BookingPage user={user} onGoHome={() => setIsBooking(false)} />
        ) : isLoggedIn ? (
          <PatientDashboard
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onBookClick={() => setIsBooking(true)}
          />
        ) : (
          <main>
            <HeroSection />
            <SpecialtySection />
            <DoctorSection />
            <QueueFeatureSection />
            <ArticleSection />
            <ContactSection />
          </main>
        )}
      </div>
      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/staff" element={<StaffDashboard />} />
      <Route path="/*" element={<PatientApp />} />
    </Routes>
  );
}

export default App;
