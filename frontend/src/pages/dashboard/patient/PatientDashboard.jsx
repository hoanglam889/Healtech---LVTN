import React, { useState, useEffect } from 'react';
import { getAppointmentsByUserId } from '../../../services/appointmentService';
import { getPatientsByAccountId } from '../../../services/patientService';
import * as Icons from 'lucide-react';
import AppointmentCard from '../../../components/dashboard/AppointmentCard';
import { QRCodeSVG } from 'qrcode.react';

const PatientDashboard = ({ user, onBookClick }) => {
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

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header chào mừng */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chỉ số 1 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Icons.CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Lịch hẹn sắp tới</p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{upcomingCount} ca</h3>
            </div>
          </div>

          {/* Chỉ số 2 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Icons.Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Hồ sơ bệnh nhân</p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{patientCount} hồ sơ</h3>
            </div>
          </div>

          {/* Chỉ số 3 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              unpaidInvoices > 0 ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-400'
            }`}>
              <Icons.CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Hóa đơn chưa đóng</p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{unpaidInvoices} hóa đơn</h3>
            </div>
          </div>
        </div>

        {/* Layout 2 cột chính */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CỘT TRÁI (LỚN - LỊCH SỬ HẸN) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Icons.Clock className="w-5 h-5 text-gray-400" />
              <span>Danh sách lịch hẹn đã đặt</span>
            </h3>

            {loading ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400 font-semibold">Đang tải lịch hẹn...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-400 font-medium shadow-sm space-y-4">
                <Icons.FolderOpen className="w-12 h-12 mx-auto text-gray-300" />
                <p>Bạn chưa có lịch hẹn khám nào.</p>
                <button 
                  onClick={onBookClick}
                  className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-bold text-sm transition-all cursor-pointer"
                >
                  Đăng ký đặt lịch ngay
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <AppointmentCard 
                    key={apt.id} 
                    apt={apt} 
                    onShowQr={setSelectedQr} 
                    formatDate={formatDate} 
                  />
                ))}
              </div>
            )}
          </div>

          {/* CỘT PHẢI (NHỎ - LỐI TẮT & LƯU Ý) */}
          <div className="space-y-6">
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
