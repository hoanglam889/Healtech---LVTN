import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import StaffLogin from '../../../components/auth/StaffLogin';
import CheckinPanel from '../../../components/reception/CheckinPanel';
import ClinicQueue from '../../../components/reception/ClinicQueue';
import BillingManager from '../../../components/reception/BillingManager';
import AppointmentMonitor from '../../../components/reception/AppointmentMonitor';
import DoctorClinicQueue from '../../../components/doctor/DoctorClinicQueue';

export default function StaffDashboard() {
  // Trạng thái nhân viên đang đăng nhập
  const [staffUser, setStaffUser] = useState(() => {
    try {
      const saved = localStorage.getItem('staffUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Quản lý tab hiển thị
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'checkin';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Xử lý đăng nhập
  const handleLoginSuccess = (user) => {
    setStaffUser(user);
    localStorage.setItem('staffUser', JSON.stringify(user));
    if (user.role === 'STAFF') {
      setActiveTab('checkin');
    } else if (user.role === 'DOCTOR') {
      setActiveTab('doctor-queue');
    }
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    setStaffUser(null);
    localStorage.removeItem('staffUser');
  };

  // Quay lại trang chủ bệnh nhân
  const handleGoHome = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  // Nếu chưa đăng nhập, hiển thị form Đăng nhập
  if (!staffUser) {
    return <StaffLogin onLoginSuccess={handleLoginSuccess} onGoHome={handleGoHome} />;
  }

  return (
    <div className="flex bg-gray-50/50 h-screen text-gray-800 font-sans relative overflow-hidden">
      
      {/* BACKDROP OVERLAY TRÊN MOBILE */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR BÊN TRÁI */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 lg:z-30 w-72 h-screen bg-white border-r border-gray-100 flex flex-col justify-between p-6 shrink-0 shadow-sm transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div>
          {/* NÚT CLOSE SIDEBAR TRÊN MOBILE */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 lg:hidden cursor-pointer"
          >
            <Icons.X className="w-5 h-5" />
          </button>

          {/* LOGO */}
          <div className="flex flex-col gap-1 pb-6 border-b border-gray-100/60 cursor-pointer" onClick={handleGoHome}>
            <img 
              src="/images/logo2.png" 
              alt="Healtech Logo" 
              className="h-12 w-auto object-contain" 
            />
            <span className="text-[10px] text-blue-600 font-bold tracking-wider uppercase block mt-2">Staff Portal</span>
          </div>

          {/* USER INFO PROFILE CARD */}
          <div className="mt-6 p-4 bg-gray-50/80 rounded-2xl border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-extrabold border border-blue-200">
              {staffUser.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900 leading-tight">{staffUser.fullName}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                  {staffUser.role === 'STAFF' ? 'Lễ tân' : staffUser.role === 'DOCTOR' ? 'Bác sĩ' : 'Quản lý'}
                </span>
              </div>
            </div>
          </div>

          {/* DANH SÁCH MENU DỰA TRÊN ROLE */}
          <nav className="mt-8 space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Chức năng chính</p>
            
            {staffUser.role === 'STAFF' && (
              <>
                <button
                  onClick={() => { setActiveTab('checkin'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                    activeTab === 'checkin'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icons.QrCode className="w-5 h-5" />
                  <span>Tiếp đón & Check-in</span>
                </button>

                <button
                  onClick={() => { setActiveTab('queue'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                    activeTab === 'queue'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icons.Users className="w-5 h-5" />
                  <span>Hàng đợi phòng khám</span>
                </button>

                <button
                  onClick={() => { setActiveTab('appointments'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                    activeTab === 'appointments'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icons.CalendarClock className="w-5 h-5" />
                  <span>Lịch hẹn & Nhắc nhở</span>
                </button>

                <button
                  onClick={() => { setActiveTab('billing'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                    activeTab === 'billing'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icons.Receipt className="w-5 h-5" />
                  <span>Thu ngân & Thanh toán</span>
                </button>
              </>
            )}

            {staffUser.role === 'DOCTOR' && (
              <>
                <button
                  onClick={() => { setActiveTab('doctor-queue'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                    activeTab === 'doctor-queue'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icons.Stethoscope className="w-5 h-5" />
                  <span>Danh sách chờ khám</span>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* THAO TÁC HỆ THỐNG PHÍA DƯỚI */}
        <div className="space-y-2">
          <button
            onClick={handleGoHome}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all cursor-pointer"
          >
            <Icons.Globe className="w-5 h-5" />
            <span>Trang bệnh nhân</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-red-500 hover:bg-red-50 transition-all cursor-pointer border-t border-gray-100/60 pt-4"
          >
            <Icons.LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* KHU VỰC NỘI DUNG CHÍNH BÊN PHẢI */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* HEADER TRÊN CÙNG */}
        <header className="h-20 bg-white border-b border-gray-100 px-6 lg:px-8 flex justify-between items-center z-10 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* NÚT HAMBURGER CHỈ HIỆN TRÊN MOBILE */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl lg:hidden cursor-pointer"
            >
              <Icons.Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="font-bold text-gray-900 text-sm lg:text-lg whitespace-nowrap">
                {activeTab === 'checkin' && 'Tiếp đón Bệnh nhân mới'}
                {activeTab === 'queue' && 'Giám sát Hàng đợi Phòng khám'}
                {activeTab === 'appointments' && 'Giám sát Lịch hẹn Đặt trước'}
                {activeTab === 'billing' && 'Quản lý Thu ngân / Thanh toán'}
                {activeTab === 'doctor-queue' && 'Phòng Khám Nội / Ngoại khoa'}
              </h2>
              <p className="text-[10px] lg:text-xs text-gray-400 font-semibold mt-0.5">Hệ thống quản lý thông tin nội bộ Healtech ERP</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] lg:text-xs font-bold text-gray-400 bg-gray-50 px-2 lg:px-3 py-1.5 rounded-lg border border-gray-100">
              Hôm nay: {new Date().toLocaleDateString('vi-VN')}
            </span>
          </div>
        </header>

        {/* BẢNG ĐIỀU KHIỂN CHI TIẾT */}
        <div className="p-4 lg:p-8 flex-1 overflow-y-auto">
          {activeTab === 'checkin' && <CheckinPanel />}
          {activeTab === 'queue' && <ClinicQueue />}
          {activeTab === 'appointments' && <AppointmentMonitor />}
          {activeTab === 'billing' && <BillingManager />}
          {activeTab === 'doctor-queue' && <DoctorClinicQueue staffUser={staffUser} />}
        </div>
      </main>

    </div>
  );
}
