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

function App() {
  const [isBooking, setIsBooking] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState({
    id: 1,
    fullName: 'Hoàng Lâm',
    phone: '0901234567'
  });

  // Giả lập Đăng nhập (Phục vụ báo cáo/Demo đồ án)
  const handleLogin = () => {
    setIsLoggedIn(true);
    setUser({
      id: 1,
      fullName: 'Hoàng Lâm',
      phone: '0901234567'
    });
  };

  // Đăng xuất
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col justify-between">
      <div>
        <Navbar 
          isLoggedIn={isLoggedIn}
          user={user}
          onLogout={handleLogout}
          onLoginClick={handleLogin}
          onBookClick={() => setIsBooking(true)} 
          onHomeClick={() => setIsBooking(false)} 
        />
        
        {isBooking ? (
          <BookingPage user={user} onGoHome={() => setIsBooking(false)} />
        ) : isLoggedIn ? (
          // Đã đăng nhập -> Hiển thị trang quản lý lịch khám cá nhân (Dashboard)
          <PatientDashboard user={user} onBookClick={() => setIsBooking(true)} />
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
    </div>
  );
}

export default App;
