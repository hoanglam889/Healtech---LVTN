import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import StaffLogin from '../../components/auth/StaffLogin';
import AdminOverview from '../../components/dashboard/admin/AdminOverview';
import AdminUsers from '../../components/dashboard/admin/AdminUsers';
import AdminSpecialties from '../../components/dashboard/admin/AdminSpecialties';
import AdminSchedules from '../../components/dashboard/admin/AdminSchedules';
import AdminTransactions from '../../components/dashboard/admin/AdminTransactions';
import AdminArticles from '../../components/dashboard/admin/AdminArticles';
import AdminRatings from '../../components/dashboard/admin/AdminRatings';

export default function AdminDashboard() {
  // Trạng thái admin đang đăng nhập (lấy từ localStorage độc lập)
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('adminUser');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.role === 'ADMIN') return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  // Quản lý tab đang active
  const [activeTab, setActiveTab] = useState('overview');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Xử lý đăng nhập thành công
  const handleLoginSuccess = (user) => {
    if (user.role !== 'ADMIN') {
      alert('Tài khoản của bạn không có quyền truy cập trang quản trị!');
      return;
    }
    setAdminUser(user);
    localStorage.setItem('adminUser', JSON.stringify(user));
    setActiveTab('overview');
  };

  // Đăng xuất
  const handleLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('adminUser');
  };

  // Quay lại trang chủ bệnh nhân
  const handleGoHome = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  // Nếu chưa đăng nhập Admin, hiển thị cổng đăng nhập nhân viên để xác thực
  if (!adminUser) {
    return (
      <div className="relative">
        {/* Banner cảnh báo cổng Admin */}
        <div className="absolute top-4 left-4 right-4 z-50 bg-amber-500 text-white font-bold py-2.5 px-4 rounded-xl text-center text-xs shadow-md max-w-md mx-auto">
          ⚠️ CỔNG ĐĂNG NHẬP DÀNH RIÊNG CHO QUẢN TRỊ VIÊN (ADMIN)
        </div>
        <StaffLogin onLoginSuccess={handleLoginSuccess} onGoHome={handleGoHome} />
      </div>
    );
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
          <div className="flex flex-col items-center gap-1 pb-6 border-b border-gray-100/60 cursor-pointer" onClick={handleGoHome}>
            <img 
              src="/images/logo2.png" 
              alt="Healtech Logo" 
              className="h-12 w-auto object-contain" 
            />
            <span className="text-[10px] text-indigo-600 font-bold tracking-wider uppercase block mt-2">Admin Portal</span>
          </div>

          {/* PROFILE CARD */}
          <div className="mt-6 p-4 bg-gray-50/80 rounded-2xl border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-extrabold border border-indigo-200">
              {adminUser.fullName?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900 leading-tight">{adminUser.fullName}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                  Quản trị viên
                </span>
              </div>
            </div>
          </div>

          {/* MENU CHỨC NĂNG */}
          <nav className="mt-8 space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Bảng điều khiển</p>
            
            <button
              onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icons.LayoutDashboard className="w-5 h-5" />
              <span>Thống kê tổng quan</span>
            </button>

            <button
              onClick={() => { setActiveTab('doctors'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                activeTab === 'doctors'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icons.Stethoscope className="w-5 h-5" />
              <span>Quản lý Bác sĩ</span>
            </button>

            <button
              onClick={() => { setActiveTab('patients'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                activeTab === 'patients'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icons.Users className="w-5 h-5" />
              <span>Quản lý Bệnh nhân</span>
            </button>

            <button
              onClick={() => { setActiveTab('specialties'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                activeTab === 'specialties'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icons.Activity className="w-5 h-5" />
              <span>Quản lý Chuyên khoa</span>
            </button>

            <button
              onClick={() => { setActiveTab('schedules'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                activeTab === 'schedules'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icons.CalendarDays className="w-5 h-5" />
              <span>Lịch trực Bác sĩ</span>
            </button>

            <button
              onClick={() => { setActiveTab('transactions'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                activeTab === 'transactions'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icons.Receipt className="w-5 h-5" />
              <span>Hóa đơn & Lịch hẹn</span>
            </button>

            <button
              onClick={() => { setActiveTab('articles'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                activeTab === 'articles'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icons.FileText className="w-5 h-5" />
              <span>Quản lý Bài viết</span>
            </button>

            <button
              onClick={() => { setActiveTab('ratings'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                activeTab === 'ratings'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icons.Star className="w-5 h-5" />
              <span>Quản lý Đánh giá</span>
            </button>
          </nav>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="space-y-2">
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
        
        {/* HEADER */}
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
                {activeTab === 'overview' && 'Báo cáo Thống kê Tổng quan'}
                {activeTab === 'doctors' && 'Quản lý Thông tin Bác sĩ'}
                {activeTab === 'patients' && 'Quản lý Danh sách Bệnh nhân'}
                {activeTab === 'specialties' && 'Quản lý Danh mục Chuyên khoa'}
                {activeTab === 'schedules' && 'Cấu hình Lịch trực Bác sĩ'}
                {activeTab === 'transactions' && 'Quản lý Giao dịch & Ca hẹn'}
                {activeTab === 'articles' && 'Quản lý Bài viết & Tin tức'}
                {activeTab === 'ratings' && 'Quản lý Đánh giá Bác sĩ'}
              </h2>
              <p className="text-[10px] lg:text-xs text-gray-400 font-semibold mt-0.5">Trang dành riêng cho Quản trị viên phòng khám</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] lg:text-xs font-bold text-gray-400 bg-gray-50 px-2 lg:px-3 py-1.5 rounded-lg border border-gray-100">
              Hôm nay: {new Date().toLocaleDateString('vi-VN')}
            </span>
          </div>
        </header>

        {/* CONTAINER CONTENT */}
        <div className="p-4 lg:p-8 flex-1 overflow-y-auto">
          {activeTab === 'overview' && <AdminOverview />}
          {activeTab === 'doctors' && <AdminUsers roleType="DOCTOR" />}
          {activeTab === 'patients' && <AdminUsers roleType="PATIENT" />}
          {activeTab === 'specialties' && <AdminSpecialties />}
          {activeTab === 'schedules' && <AdminSchedules />}
          {activeTab === 'transactions' && <AdminTransactions />}
          {activeTab === 'articles' && <AdminArticles />}
          {activeTab === 'ratings' && <AdminRatings />}
        </div>
      </main>

    </div>
  );
}
