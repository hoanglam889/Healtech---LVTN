import React, { useState, useEffect } from 'react';
import { getAppointmentsByUserId } from '../../../services/appointmentService';
import { getPatientsByAccountId } from '../../../services/patientService';
import * as Icons from 'lucide-react';
import AppointmentCard from '../../../components/dashboard/AppointmentCard';
import { QRCodeSVG } from 'qrcode.react';
import PatientProfiles from '../../../components/dashboard/patient/PatientProfiles';
import MyAppointments from '../../../components/dashboard/patient/MyAppointments';
import HealthBook from '../../../components/dashboard/patient/HealthBook';

const PatientDashboard = ({ user, onBookClick, activeTab, setActiveTab }) => {
  const [appointments, setAppointments] = useState([]);
  const [patientCount, setPatientCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedQr, setSelectedQr] = useState(null); // Lưu qrCode để hiển thị Modal

  useEffect(() => {
    Promise.all([
      getAppointmentsByUserId(user?.id),
      getPatientsByAccountId(user?.id)
    ])
      .then(([appointmentsData, patientsData]) => {
        setAppointments(appointmentsData || []);
        setPatientCount(patientsData?.length || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi tải dữ liệu dashboard:', err);
        setLoading(false);
      });
  }, [user?.id]);

  // Hàm định dạng ngày hiển thị
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateString;
    }
  };

  // Thống kê nhanh
  const upcomingCount = appointments.filter(a => a.status === 'BOOKED').length;
  const unpaidInvoices = appointments.filter(a => a.invoices?.status === 'UNPAID').length;

  // Render các màn hình con tương ứng theo Tab
  if (activeTab === 'profiles') {
    return <PatientProfiles user={user} />;
  }

  if (activeTab === 'appointments') {
    return <MyAppointments user={user} onBookClick={onBookClick} />;
  }

  if (activeTab === 'history') {
    return <HealthBook user={user} />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-4 lg:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 lg:space-y-5">
        
        {/* Header chào mừng */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 lg:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl flex items-center gap-2.5">
              <span>Xin chào, <span className="text-blue-600 font-extrabold">{user?.fullName || 'Hoàng Lâm'}</span>!</span>
              <span className="animate-waving-hand text-2xl">👋</span>
            </h1>
            <p className="text-sm text-gray-400 font-semibold">Chào mừng bạn quay trở lại. Hôm nay bạn muốn làm gì?</p>
          </div>
          <button 
            onClick={onBookClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-blue-100 cursor-pointer flex items-center justify-center gap-2 self-start md:self-auto"
          >
            <Icons.Plus className="w-5 h-5" />
            <span>Đặt lịch khám mới</span>
          </button>
        </div>

        {/* Khung chỉ số thống kê */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {/* Chỉ số 1 */}
          <div className="bg-white p-4 lg:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Icons.CalendarDays className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider">Lịch hẹn sắp tới</p>
              <h3 className="text-lg md:text-2xl font-extrabold text-gray-900 leading-tight">{upcomingCount} ca</h3>
            </div>
          </div>

          {/* Chỉ số 2 */}
          <div className="bg-white p-4 lg:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Icons.Users className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider">Hồ sơ bệnh nhân</p>
              <h3 className="text-lg md:text-2xl font-extrabold text-gray-900 leading-tight">{patientCount} hồ sơ</h3>
            </div>
          </div>

          {/* Chỉ số 3 */}
          <div className="bg-white p-4 lg:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ${
              unpaidInvoices > 0 ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-400'
            }`}>
              <Icons.CreditCard className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider">Hóa đơn chưa đóng</p>
              <h3 className="text-lg md:text-2xl font-extrabold text-gray-900 leading-tight">{unpaidInvoices} hóa đơn</h3>
            </div>
          </div>
        </div>

        {/* Layout 2 cột chính */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* CỘT TRÁI (LỚN - LỊCH SỬ HẸN) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Icons.Clock className="w-5 h-5 text-blue-500" />
                <span>Lịch hẹn gần đây</span>
              </h3>
              {appointments.length > 3 && (
                <button 
                  onClick={() => setActiveTab('appointments')}
                  className="text-blue-600 text-sm font-semibold hover:text-blue-700 hover:underline cursor-pointer flex items-center gap-1"
                >
                  Xem tất cả <Icons.ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {loading ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-sm">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-400 font-medium text-sm">Đang tải lịch hẹn...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center text-gray-400 font-medium shadow-sm space-y-3">
                <Icons.FolderOpen className="w-10 h-10 mx-auto text-gray-300" />
                <p className="text-sm">Bạn chưa có lịch hẹn khám nào.</p>
                <button 
                  onClick={onBookClick}
                  className="px-5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-bold text-sm transition-all cursor-pointer"
                >
                  Đăng ký đặt lịch ngay
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.slice(0, 3).map((apt) => (
                  <AppointmentCard 
                    key={apt.id} 
                    apt={apt} 
                    onShowQr={setSelectedQr} 
                    formatDate={formatDate} 
                  />
                ))}
                {appointments.length > 3 && (
                  <div className="text-center pt-2">
                    <button 
                      onClick={() => setActiveTab('appointments')}
                      className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm w-full md:w-auto"
                    >
                      Xem toàn bộ lịch sử khám ({appointments.length})
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CỘT PHẢI (NHỎ - LỐI TẮT & LƯU Ý) */}
          <div className="space-y-4">
            {/* Lối tắt */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
              <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider border-b border-gray-100 pb-2">Tiện ích nhanh</h4>
              <div className="space-y-2 text-sm">
                <button 
                  onClick={onBookClick}
                  className="w-full text-left p-3 rounded-xl hover:bg-blue-50 text-gray-600 hover:text-blue-600 font-semibold transition-all flex items-center justify-between"
                >
                  <span>Đặt lịch khám bệnh</span>
                  <Icons.ChevronRight className="w-4 h-4" />
                </button>
                <button className="w-full text-left p-3 rounded-xl hover:bg-blue-50 text-gray-600 hover:text-blue-600 font-semibold transition-all flex items-center justify-between opacity-50 cursor-not-allowed">
                  <span>Hồ sơ sức khỏe cá nhân</span>
                  <Icons.ChevronRight className="w-4 h-4" />
                </button>
                <button className="w-full text-left p-3 rounded-xl hover:bg-blue-50 text-gray-600 hover:text-blue-600 font-semibold transition-all flex items-center justify-between opacity-50 cursor-not-allowed">
                  <span>Liên hệ hỗ trợ 24/7</span>
                  <Icons.ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lưu ý khi đi khám */}
            <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-5 shadow-sm space-y-3">
              <h4 className="font-bold text-blue-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <Icons.Info className="w-4 h-4 text-blue-500" />
                <span>Lưu ý khi đi khám</span>
              </h4>
              <ul className="text-xs text-blue-800/80 space-y-2 list-disc list-inside leading-relaxed font-medium">
                <li>Vui lòng đem theo CCCD / Thẻ BHYT bản chính để đối chiếu.</li>
                <li>Có mặt trước ca khám ít nhất 15 phút để làm thủ tục tiếp đón.</li>
                <li>Xuất trình **Mã QR phiếu khám** trên điện thoại tại quầy để lấy số thứ tự.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL HIỂN THỊ MÃ QR CODE LỊCH HẸN */}
      {selectedQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedQr(null)} />
          <div className="bg-white rounded-3xl p-6 text-center max-w-sm w-full relative z-10 shadow-2xl border border-gray-100 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h4 className="font-bold text-gray-900">Mã QR Phiếu Khám</h4>
              <button onClick={() => setSelectedQr(null)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer">
                <Icons.X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center p-4 rounded-2xl bg-white shadow-inner border border-gray-100 max-w-[200px] mx-auto">
                <QRCodeSVG 
                  value={selectedQr} 
                  size={168} 
                  level="H"
                  includeMargin={false}
                />
              </div>
              <p className="font-mono font-bold text-gray-800 text-lg bg-gray-50 py-1.5 rounded-xl border border-gray-200/50">
                {selectedQr}
              </p>
              <p className="text-xs text-gray-400 leading-normal px-2">
                Vui lòng xuất trình mã này cho nhân viên lễ tân khi bạn đến phòng khám để quét mã tiếp nhận khám bệnh.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
