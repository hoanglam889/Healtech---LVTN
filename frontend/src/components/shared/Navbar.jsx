import React from 'react';

const Navbar = ({ onBookClick, onHomeClick }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        <div className="flex items-center cursor-pointer" onClick={onHomeClick}>
          {/* Khung mặt nạ co giãn: nhỏ trên mobile, to rộng trên desktop */}
          <div className="w-28 h-10 md:w-44 md:h-16 overflow-hidden relative flex items-center justify-center">
            <img 
              src="/images/logo.png" 
              alt="Healtech Logo" 
              className="absolute w-44 h-44 md:w-72 md:h-72 max-w-none object-contain" 
            />
          </div>
        </div>
        
        <nav className="hidden md:flex gap-8 font-medium text-gray-500">
          <a href="#home" onClick={(e) => { e.preventDefault(); onHomeClick(); }} className="hover:text-blue-600 transition-colors">Trang chủ</a>
          <a href="#specialties" className="hover:text-blue-600 transition-colors">Chuyên khoa</a>
          <a href="#doctors" className="hover:text-blue-600 transition-colors">Bác sĩ</a>
          <a href="#articles" className="hover:text-blue-600 transition-colors">Tin tức & Bài viết</a>
        </nav>

        <div className="flex items-center gap-6">
          <button className="hidden md:block text-gray-600 font-medium hover:text-gray-900 transition-colors">
            Đăng nhập
          </button>
          <button 
            onClick={onBookClick}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow cursor-pointer"
          >
            Đặt lịch khám
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;