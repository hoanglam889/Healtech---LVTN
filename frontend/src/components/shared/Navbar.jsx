import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import NotificationsPanel from './NotificationsPanel';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Navbar = ({
  isLoggedIn,
  user,
  activeTab,
  setActiveTab,
  onLogout,
  onLoginClick,
  onBookClick,
  onHomeClick
}) => {
  const { t } = useTranslation('nav');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">

        {/* LOGO */}
        <div className="flex items-center cursor-pointer" onClick={() => { onHomeClick(); setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}>
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
              <a href="#dashboard" onClick={(e) => { e.preventDefault(); onHomeClick(); setActiveTab('dashboard'); }}
                className={`hover:text-blue-600 transition-colors ${activeTab === 'dashboard' ? 'text-blue-600 font-extrabold' : ''}`}>
                {t('dashboard')}
              </a>
              <a href="#my-appointments" onClick={(e) => { e.preventDefault(); onHomeClick(); setActiveTab('appointments'); }}
                className={`hover:text-blue-600 transition-colors ${activeTab === 'appointments' ? 'text-blue-600 font-extrabold' : ''}`}>
                {t('my_appointments')}
              </a>
              <a href="#profiles" onClick={(e) => { e.preventDefault(); onHomeClick(); setActiveTab('profiles'); }}
                className={`hover:text-blue-600 transition-colors ${activeTab === 'profiles' ? 'text-blue-600 font-extrabold' : ''}`}>
                {t('patient_profiles')}
              </a>
              <a href="#history" onClick={(e) => { e.preventDefault(); onHomeClick(); setActiveTab('history'); }}
                className={`hover:text-blue-600 transition-colors ${activeTab === 'history' ? 'text-blue-600 font-extrabold' : ''}`}>
                {t('health_book')}
              </a>
            </>
          ) : (
            <>
              <a href="#home" onClick={(e) => { e.preventDefault(); onHomeClick(); }} className="hover:text-blue-600 transition-colors">{t('home')}</a>
              <a href="#specialties" className="hover:text-blue-600 transition-colors">{t('specialties')}</a>
              <a href="#doctors" className="hover:text-blue-600 transition-colors">{t('doctors')}</a>
              <a href="#articles" className="hover:text-blue-600 transition-colors">{t('news')}</a>
            </>
          )}
        </nav>

        {/* RIGHT ACTION BUTTONS */}
        <div className="flex items-center gap-3">

          <LanguageSwitcher />

          {/* DESKTOP PROFILE / LOGIN */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <NotificationsPanel user={user} />

                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-bold text-sm cursor-pointer select-none"
                  >
                    <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold border border-blue-200">
                      {user?.fullName?.charAt(0).toUpperCase() || 'L'}
                    </div>
                    <span>{user?.fullName || t('patient_default')}</span>
                    <Icons.ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)} />
                      <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-40 animate-[fadeIn_0.15s_ease-out]">
                        <button
                          onClick={() => { setIsDropdownOpen(false); onHomeClick(); setActiveTab('settings'); }}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-600 font-semibold flex items-center gap-2 cursor-pointer"
                        >
                          <Icons.User className="w-4 h-4" />
                          <span>{t('account')}</span>
                        </button>
                        <button
                          onClick={() => { setIsDropdownOpen(false); onLogout(); }}
                          className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-sm text-red-500 font-bold flex items-center gap-2 border-t border-gray-100/60 cursor-pointer"
                        >
                          <Icons.LogOut className="w-4 h-4" />
                          <span>{t('logout')}</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="text-gray-600 font-bold hover:text-blue-600 transition-colors cursor-pointer text-sm lg:text-base"
              >
                {t('login')}
              </button>
            )}
          </div>

          {/* BOOKING BUTTON */}
          <button
            onClick={onBookClick}
            className="hidden md:block bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 cursor-pointer text-sm"
          >
            {t('book_appointment')}
          </button>

          {/* HAMBURGER (MOBILE) */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
          >
            <Icons.Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 md:hidden ${
        isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsMobileMenuOpen(false)} />

        <div
          style={{ backgroundColor: '#ffffff', height: '100vh' }}
          className={`absolute right-0 top-0 w-64 bg-white p-6 shadow-2xl flex flex-col justify-between transition-transform duration-300 z-10 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="w-20 h-6 overflow-hidden relative flex items-center justify-center">
                <img src="/images/logo.png" alt="Healtech Logo" className="absolute w-28 h-28 max-w-none object-contain" />
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer">
                <Icons.X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <LanguageSwitcher />
            </div>

            {isLoggedIn ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-extrabold border border-blue-200">
                    {user?.fullName?.charAt(0).toUpperCase() || 'L'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm leading-none">{user?.fullName || t('patient_default')}</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1">{t('patient_member')}</p>
                  </div>
                </div>
                <nav className="flex flex-col gap-4 text-gray-600 font-bold text-sm">
                  <a href="#dashboard" onClick={(e) => { e.preventDefault(); onHomeClick(); setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                    className={`hover:text-blue-600 transition-colors py-1 ${activeTab === 'dashboard' ? 'text-blue-600 font-extrabold' : ''}`}>
                    {t('dashboard')}
                  </a>
                  <a href="#my-appointments" onClick={(e) => { e.preventDefault(); onHomeClick(); setActiveTab('appointments'); setIsMobileMenuOpen(false); }}
                    className={`hover:text-blue-600 transition-colors py-1 ${activeTab === 'appointments' ? 'text-blue-600 font-extrabold' : ''}`}>
                    {t('my_appointments')}
                  </a>
                  <a href="#profiles" onClick={(e) => { e.preventDefault(); onHomeClick(); setActiveTab('profiles'); setIsMobileMenuOpen(false); }}
                    className={`hover:text-blue-600 transition-colors py-1 ${activeTab === 'profiles' ? 'text-blue-600 font-extrabold' : ''}`}>
                    {t('patient_profiles')}
                  </a>
                  <a href="#history" onClick={(e) => { e.preventDefault(); onHomeClick(); setActiveTab('history'); setIsMobileMenuOpen(false); }}
                    className={`hover:text-blue-600 transition-colors py-1 ${activeTab === 'history' ? 'text-blue-600 font-extrabold' : ''}`}>
                    {t('health_book')}
                  </a>
                  <a href="#settings" onClick={(e) => { e.preventDefault(); onHomeClick(); setActiveTab('settings'); setIsMobileMenuOpen(false); }}
                    className={`hover:text-blue-600 transition-colors py-1 ${activeTab === 'settings' ? 'text-blue-600 font-extrabold' : ''}`}>
                    {t('account')}
                  </a>
                </nav>
              </div>
            ) : (
              <nav className="flex flex-col gap-4 text-gray-600 font-bold text-sm">
                <a href="#home" onClick={(e) => { e.preventDefault(); onHomeClick(); setIsMobileMenuOpen(false); }} className="hover:text-blue-600 transition-colors py-1">{t('home')}</a>
                <a href="#specialties" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-600 transition-colors py-1">{t('specialties')}</a>
                <a href="#doctors" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-600 transition-colors py-1">{t('doctors')}</a>
                <a href="#articles" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-600 transition-colors py-1">{t('news')}</a>
                <button onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }} className="text-left text-gray-600 hover:text-blue-600 transition-colors py-2 border-t border-gray-100 font-bold mt-2">
                  {t('login')}
                </button>
              </nav>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <button onClick={() => { onBookClick(); setIsMobileMenuOpen(false); }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-md shadow-blue-100 transition-all cursor-pointer text-center text-sm">
              {t('book_appointment')}
            </button>
            {isLoggedIn && (
              <button onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                className="w-full text-red-500 hover:bg-red-50 py-2.5 rounded-xl font-bold transition-all cursor-pointer text-center text-sm">
                {t('logout')}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
