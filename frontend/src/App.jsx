import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import SpecialtySection from './components/SpecialtySection';
import DoctorSection from './components/DoctorSection';
import QueueFeatureSection from './components/QueueFeatureSection';
import ArticleSection from './components/ArticleSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

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
