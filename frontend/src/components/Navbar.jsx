import React from 'react';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-8 h-8 bg-blue-600 rounded-lg shadow-sm"></div>
          <span className="text-xl font-bold tracking-tight text-gray-900">MediCare</span>
        </div>
        
        <nav className="hidden md:flex gap-8 font-medium text-gray-500">
          <a href="#home" className="hover:text-blue-600 transition-colors">Home</a>
          <a href="#specialties" className="hover:text-blue-600 transition-colors">Specialties</a>
          <a href="#doctors" className="hover:text-blue-600 transition-colors">Doctors</a>
          <a href="#articles" className="hover:text-blue-600 transition-colors">Articles</a>
        </nav>

        <div className="flex items-center gap-6">
          <button className="hidden md:block text-gray-600 font-medium hover:text-gray-900 transition-colors">
            Log In
          </button>
          <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow">
            Book Appointment
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;