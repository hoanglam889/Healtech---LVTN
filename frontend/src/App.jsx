import React from 'react';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import HeroSection from './components/landing/HeroSection';
import SpecialtySection from './components/landing/SpecialtySection';
import DoctorSection from './components/landing/DoctorSection';
import QueueFeatureSection from './components/landing/QueueFeatureSection';
import ArticleSection from './components/landing/ArticleSection';
import ContactSection from './components/landing/ContactSection';

function App() {
  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <SpecialtySection />
        <DoctorSection />
        <QueueFeatureSection />
        <ArticleSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
