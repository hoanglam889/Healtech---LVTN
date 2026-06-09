import React, { useState } from 'react';
import * as Icons from 'lucide-react';

const Navbar = ({ 
  isLoggedIn, 
  user, 
  onLogout, 
  onLoginClick, 
  onBookClick, 
  onHomeClick 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        
        {/* LOGO */}
        <div className="flex items-center cursor-pointer" onClick={() => { onHomeClick(); setIsMobileMenuOpen(false); }}>
          <div className="w-28 h-10 md:w-44 md:h-16 overflow-hidden relative flex items-center justify-center">
            <img 
              src="/images/logo.png" 
              alt="Healtech Logo" 
              className="absolute w-44 h-44 md:w-72 md:h-72 max-w-none object-contain" 
            />
          </div>
        </div>
        
        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex gap-8 font-semibold text-gray-500 text-sm lg:text-base">
          {isLoggedIn ? (
            <>
              <a href="#dashboard" onClick={(e) => { e.preventDefault(); onHomeClick(); }} className="hover:text-blue-600 transition-colors">Bảng điều khiển</a>
              <a href="#my-appointments" onClick={(e) => { e.preventDefault(); }} className="hover:text-blue-600 transition-colors opacity-50 cursor-not-allowed">Lịch hẹn của tôi</a>
              <a href="#profiles" onClick={(e) => { e.preventDefault(); }} className="hover:text-blue-600 transition-colors opacity-50 cursor-not-allowed">Hồ sơ bệnh nhân</a>
              <a href="#history" onClick={(e) => { e.preventDefault(); }} className="hover:text-blue-600 transition-colors opacity-50 cursor-not-allowed">Sổ sức khỏe</a>
            </>
          ) : (
            <>
              <a href="#home" onClick={(e) => { e.preventDefault(); onHomeClick(); }} className="hover:text-blue-600 transition-colors">Trang chủ</a>
              <a href="#specialties" className="hover:text-blue-600 transition-colors">Chuyên khoa</a>
              <a href="#doctors" className="hover:text-blue-600 transition-colors">Bác sĩ</a>
              <a href="#articles" className="hover:text-blue-600 transition-colors">Tin tức</a>
            </>
          )}
        </nav>

        {/* RIGHT ACTION BUTTONS */}
        <div className="flex items-center gap-4">
          
          {/* DESKTOP PROFILE / LOGIN */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="relative">
                {/* User Profile Trigger */}
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-bold text-sm cursor-pointer select-none"
                >
                  <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold border border-blue-200">
                    {user?.fullName?.charAt(0).toUpperCase() || 'L'}
                  </div>
                  <span>{user?.fullName || 'Hoàng Lâm'}</span>
                  <Icons.ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)} />
                    <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-40 animate-[fadeIn_0.15s_ease-out]">
                      <button 
                        onClick={() => { setIsDropdownOpen(false); alert('Chức năng Tài khoản đang phát triển!'); }}
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-600 font-semibold flex items-center gap-2 cursor-pointer"
                      >
                        <Icons.User className="w-4 h-4" />
                        <span>Tài khoản cá nhân</span>
                      </button>
                      <button 
                        onClick={() => { setIsDropdownOpen(false); onLogout(); }}
                        className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-sm text-red-500 font-bold flex items-center gap-2 border-t border-gray-100/60 cursor-pointer"
                      >
                        <Icons.LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="text-gray-600 font-bold hover:text-blue-600 transition-colors cursor-pointer text-sm lg:text-base"
              >
                Đăng nhập
              </button>
            )}
          </div>

          {/* BOOKING BUTTON (ALWAYS SHOW ON DESKTOP) */}
          <button 
            onClick={onBookClick}
            className="hidden md:block bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 cursor-pointer text-sm"
          >
            Đặt lịch khám
          </button>

          {/* HAMBURGER TOGGLE BUTTON (MOBILE ONLY) */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
          >
            <Icons.Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* ==========================================
         MOBILE MENU DRAWER (SLIDE-OUT OVERLAY)
         ========================================== */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 md:hidden ${
        isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Dark blurred background overlay */}
        <div 
          className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
        
        <div 
          style={{ backgroundColor: '#ffffff', height: '100vh' }}
          className={`absolute right-0 top-0 w-64 bg-white p-6 shadow-2xl flex flex-col justify-between transition-transform duration-300 z-10 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            {/* Header / Close button */}
            <div className="flex justify-between items-center mb-6">
              <div className="w-20 h-6 overflow-hidden relative flex items-center justify-center">
                <img src="/images/logo.png" alt="Healtech Logo" className="absolute w-28 h-28 max-w-none object-contain" />
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <Icons.X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Links */}
            {isLoggedIn ? (
              <div className="space-y-6">
                {/* Quick user badge */}
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-extrabold border border-blue-200">
                    {user?.fullName?.charAt(0).toUpperCase() || 'L'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm leading-none">{user?.fullName || 'Hoàng Lâm'}</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1">Bệnh nhân thành viên</p>
                  </div>
                </div>
                {/* Vertical links */}
                <nav className="flex flex-col gap-4 text-gray-600 font-bold text-sm">
                  <a 
                    href="#dashboard" 
                    onClick={(e) => { e.preventDefault(); onHomeClick(); setIsMobileMenuOpen(false); }}
                    className="hover:text-blue-600 transition-colors py-1"
                  >
                    Bảng điều khiển
                  </a>
                  <a href="#my-appointments" onClick={(e) => e.preventDefault()} className="hover:text-blue-600 transition-colors py-1 opacity-50 cursor-not-allowed">Lịch hẹn của tôi</a>
                  <a href="#profiles" onClick={(e) => e.preventDefault()} className="hover:text-blue-600 transition-colors py-1 opacity-50 cursor-not-allowed">Hồ sơ bệnh nhân</a>
                  <a href="#history" onClick={(e) => e.preventDefault()} className="hover:text-blue-600 transition-colors py-1 opacity-50 cursor-not-allowed">Sổ sức khỏe</a>
                </nav>
              </div>
            ) : (
              <nav className="flex flex-col gap-4 text-gray-600 font-bold text-sm">
                <a 
                  href="#home" 
                  onClick={(e) => { e.preventDefault(); onHomeClick(); setIsMobileMenuOpen(false); }}
                  className="hover:text-blue-600 transition-colors py-1"
                >
                  Trang chủ
                </a>
                <a href="#specialties" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-600 transition-colors py-1">Chuyên khoa</a>
                <a href="#doctors" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-600 transition-colors py-1">Bác sĩ</a>
                <a href="#articles" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-600 transition-colors py-1">Tin tức</a>
                <button 
                  onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }}
                  className="text-left text-gray-600 hover:text-blue-600 transition-colors py-2 border-t border-gray-100 font-bold mt-2"
                >
                  Đăng nhập
                </button>
              </nav>
            )}
          </div>

          {/* Action buttons (fixed at bottom) */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <button 
              onClick={() => { onBookClick(); setIsMobileMenuOpen(false); }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-md shadow-blue-100 transition-all cursor-pointer text-center text-sm"
            >
              Đặt lịch khám
            </button>
            {isLoggedIn && (
              <button 
                onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                className="w-full text-red-500 hover:bg-red-50 py-2.5 rounded-xl font-bold transition-all cursor-pointer text-center text-sm"
              >
                Đăng xuất
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;