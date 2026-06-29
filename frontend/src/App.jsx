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
import FloatingAIAssistant from './components/shared/FloatingAIAssistant';


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
  
  // Trạng thái AI Chat
  const [isAiChatOpen, setIsAiChatOpen] = useState(() => {
    return localStorage.getItem('ai_chat_open') === 'true';
  });

  React.useEffect(() => {
    localStorage.setItem('ai_chat_open', isAiChatOpen);
  }, [isAiChatOpen]);

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
  };

  // Xử lý Đăng xuất
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('ai_chat_history'); // Tự động xóa lịch sử chat AI khi đăng xuất
    window.location.href = '/';
  };

  if (currentPath === '/admin') {
    return (
      <>
        <AdminDashboard user={user} onLogout={handleLogout} />
        <FloatingAIAssistant isChatOpen={isAiChatOpen} setIsChatOpen={setIsAiChatOpen} />
      </>
    );
  }

  if (currentPath === '/staff') {
    return (
      <>
        <StaffDashboard user={user} onLogout={handleLogout} />
        <FloatingAIAssistant isChatOpen={isAiChatOpen} setIsChatOpen={setIsAiChatOpen} />
      </>
    );
  }

  if (currentPath.startsWith('/payment-result')) {
    return <PaymentResult />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Main Content wrapper */}
      <div className="flex-1 flex flex-col min-h-screen">
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
          onHomeClick={() => { setIsBooking(false); setActiveTab('dashboard'); window.history.pushState({}, '', '/'); setCurrentPath('/'); }} 
          onAccountClick={() => { setIsBooking(false); setActiveTab('account'); }}
        />
        <div className="flex-grow">
          {isBooking ? (
            // Trang Đặt lịch khám
            <BookingPage 
              user={user} 
              onBack={() => {
                setIsBooking(false);
                window.history.pushState({}, '', '/');
                setCurrentPath('/');
              }} 
            />
          ) : isLoggedIn && user?.role === 'PATIENT' ? (
            // Đã đăng nhập -> Hiển thị trang quản lý lịch khám cá nhân (Dashboard)
            <PatientDashboard 
              user={user} 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onBookClick={() => {
                setIsBooking(true);
              }} 
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
      </div>

      {/* Tích hợp Trợ lý AI Gợi ý chuyên khoa */}
      <FloatingAIAssistant isChatOpen={isAiChatOpen} setIsChatOpen={setIsAiChatOpen} />

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
