import React, { useState } from 'react';
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
import AdminDashboard from './pages/admin/AdminDashboard';
import AuthModal from './components/auth/AuthModal';
import PaymentResult from './pages/reception/PaymentResult';


function App() {
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
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);


  // Xử lý Đăng nhập thành công
  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthModalOpen(false);
    setActiveTab('dashboard');
  };

  // Đăng xuất
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setIsBooking(false);
    setActiveTab('dashboard');
  };

  if (currentPath === '/admin') {
    return <AdminDashboard />;
  }

  if (currentPath === '/staff') {
    return <StaffDashboard />;
  }

  if (currentPath === '/payment-result') {
    return <PaymentResult />;
  }

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
          onAccountClick={() => { setIsBooking(false); setActiveTab('account'); }}
        />
        
        {isBooking ? (
          <BookingPage user={user} onGoHome={() => setIsBooking(false)} />
        ) : isLoggedIn ? (
          // Đã đăng nhập -> Hiển thị trang quản lý lịch khám cá nhân (Dashboard)
          <PatientDashboard 
            user={user} 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onBookClick={() => setIsBooking(true)} 
          />
        ) : (
          // Chưa đăng nhập -> Hiển thị trang chủ giới thiệu (Landing Page)
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

      {/* Patient Auth Modal (Login / Registration) */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />
    </div>
  );
}

export default App;
