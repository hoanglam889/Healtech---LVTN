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

function App() {
  const [isBooking, setIsBooking] = useState(false);

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col justify-between">
      <div>
        <Navbar 
          onBookClick={() => setIsBooking(true)} 
          onHomeClick={() => setIsBooking(false)} 
        />
        
        {isBooking ? (
          <BookingPage onGoHome={() => setIsBooking(false)} />
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
    </div>
  );
}

export default App;
