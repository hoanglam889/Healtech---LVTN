import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StaffLogin from '../../../components/auth/StaffLogin';
import CheckinPanel from '../../../components/reception/CheckinPanel';
import ClinicQueue from '../../../components/reception/ClinicQueue';
import BillingManager from '../../../components/reception/BillingManager';
import DoctorClinicQueue from '../../../components/doctor/DoctorClinicQueue';
import ScheduleManager from '../../../components/staff/ScheduleManager';
import LanguageSwitcher from '../../../components/shared/LanguageSwitcher';

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('staff');

  const [staffUser, setStaffUser] = useState(() => {
    try {
      const saved = localStorage.getItem('staffUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState('checkin');

  const handleLoginSuccess = (user) => {
    setStaffUser(user);
    localStorage.setItem('staffUser', JSON.stringify(user));
    if (user.role === 'STAFF') {
      setActiveTab('checkin');
    } else if (user.role === 'DOCTOR') {
      setActiveTab('doctor-queue');
    }
  };

  const handleLogout = () => {
    setStaffUser(null);
    localStorage.removeItem('staffUser');
    localStorage.removeItem('token');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const getRoleLabel = (role) => {
    if (role === 'STAFF') return t('common:role.staff');
    if (role === 'DOCTOR') return t('common:role.doctor');
    return t('common:role.manager');
  };

  const getHeaderTitle = () => {
    if (activeTab === 'checkin') return t('header_checkin');
    if (activeTab === 'queue') return t('header_queue');
    if (activeTab === 'billing') return t('header_billing');
    if (activeTab === 'doctor-queue') return t('header_doctor_queue');
    if (activeTab === 'schedules') return t('header_schedules');
    return '';
  };

  if (!staffUser) {
    return <StaffLogin onLoginSuccess={handleLoginSuccess} onGoHome={handleGoHome} />;
  }

  return (
    <div className="flex bg-gray-50/50 min-h-screen text-gray-800 font-sans">

      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col justify-between p-6 shrink-0 sticky top-0 h-screen shadow-sm">
        <div>
          {/* LOGO */}
          <div className="flex items-center gap-3 pb-8 border-b border-gray-100/60 cursor-pointer" onClick={handleGoHome}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-100 text-white">
              <Icons.ShieldPlus className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-gray-900 tracking-tight leading-none">Healtech</h1>
              <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mt-1 block">{t('portal')}</span>
            </div>
          </div>

          {/* USER PROFILE CARD */}
          <div className="mt-6 p-4 bg-gray-50/80 rounded-2xl border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-extrabold border border-blue-200">
              {staffUser.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900 leading-tight">{staffUser.fullName}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                  {getRoleLabel(staffUser.role)}
                </span>
              </div>
            </div>
          </div>

          {/* NAV MENU */}
          <nav className="mt-8 space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">{t('main_functions')}</p>

            {staffUser.role === 'STAFF' && (
              <>
                <button
                  onClick={() => setActiveTab('checkin')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                    activeTab === 'checkin'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icons.QrCode className="w-5 h-5" />
                  <span>{t('checkin_menu')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('queue')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                    activeTab === 'queue'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icons.Users className="w-5 h-5" />
                  <span>{t('queue_menu')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('billing')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                    activeTab === 'billing'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icons.Receipt className="w-5 h-5" />
                  <span>{t('billing_menu')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('schedules')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                    activeTab === 'schedules'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icons.CalendarDays className="w-5 h-5" />
                  <span>{t('schedules_menu')}</span>
                </button>
              </>
            )}

            {staffUser.role === 'DOCTOR' && (
              <button
                onClick={() => setActiveTab('doctor-queue')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                  activeTab === 'doctor-queue'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icons.Stethoscope className="w-5 h-5" />
                <span>{t('doctor_queue_menu')}</span>
              </button>
            )}
          </nav>
        </div>

        {/* BOTTOM ACTIONS */}
        <div className="space-y-2">
          <button
            onClick={handleGoHome}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all cursor-pointer"
          >
            <Icons.Globe className="w-5 h-5" />
            <span>{t('patient_portal')}</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-red-500 hover:bg-red-50 transition-all cursor-pointer border-t border-gray-100/60 pt-4"
          >
            <Icons.LogOut className="w-5 h-5" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">

        {/* TOP HEADER */}
        <header className="h-20 bg-white border-b border-gray-100 px-8 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">{getHeaderTitle()}</h2>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">{t('system_subtitle')}</p>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              {new Date().toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US')}
            </span>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="p-8 flex-1">
          {activeTab === 'checkin' && <CheckinPanel />}
          {activeTab === 'queue' && <ClinicQueue />}
          {activeTab === 'billing' && <BillingManager />}
          {activeTab === 'doctor-queue' && <DoctorClinicQueue staffUser={staffUser} />}
          {activeTab === 'schedules' && <ScheduleManager />}
        </div>
      </main>

    </div>
  );
}
