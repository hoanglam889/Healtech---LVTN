import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { getAppointmentsByUserId, updateAppointment } from '../../../services/appointmentService';
import AppointmentCard from '../../../components/dashboard/AppointmentCard';
import { QRCodeSVG } from 'qrcode.react';

const MyAppointments = ({ user, onBookClick }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQr, setSelectedQr] = useState(null); // Lưu mã QR khám hiển thị Modal

  // Bộ lọc tìm kiếm & trạng thái
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'BOOKED' | 'DONE' | 'CANCELLED'

  // Load danh sách lịch hẹn
  const loadAppointments = () => {
    setLoading(true);
    getAppointmentsByUserId(user?.id)
      .then((data) => {
        setAppointments(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi tải lịch hẹn:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAppointments();
  }, [user?.id]);

  // Hàm xử lý Hủy lịch khám
  const handleCancel = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy lịch khám này không? Thao tác này không thể hoàn tác.')) {
      updateAppointment(id, { status: 'CANCELLED' })
        .then(() => {
          alert('Hủy lịch khám thành công.');
          loadAppointments();
        })
        .catch((err) => {
          console.error('Lỗi khi hủy lịch khám:', err);
          alert('Không thể hủy lịch khám. Vui lòng thử lại sau.');
        });
    }
  };

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

  // Tiến hành lọc dữ liệu
  const filteredAppointments = appointments.filter((apt) => {
    // 1. Lọc theo trạng thái
    if (statusFilter !== 'ALL' && apt.status !== statusFilter) {
      return false;
    }
    // 2. Lọc theo tìm kiếm tên bác sĩ
    const doctorName = apt.doctorProfile?.fullName?.toLowerCase() || '';
    const search = searchQuery.toLowerCase().trim();
    if (search && !doctorName.includes(search)) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Tiêu đề */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl flex items-center gap-2">
              <Icons.CalendarRange className="w-8 h-8 text-blue-600" />
              <span>Lịch hẹn khám của tôi</span>
            </h1>
            <p className="text-sm text-gray-400 font-semibold">Theo dõi lịch khám sắp tới và xem lại lịch sử khám bệnh.</p>
          </div>
          <button 
            onClick={onBookClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-blue-100 cursor-pointer flex items-center justify-center gap-2 self-start sm:self-auto"
          >
            <Icons.Plus className="w-5 h-5" />
            <span>Đặt lịch mới</span>
          </button>
        </div>

        {/* Thanh Tìm kiếm & Bộ lọc */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Thanh Tìm kiếm */}
            <div className="relative w-full md:max-w-sm">
              <Icons.Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo tên bác sĩ..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-semibold text-gray-700"
              />
            </div>

            {/* Các Tab Lọc Trạng Thái */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {[
                { label: 'Tất cả', value: 'ALL' },
                { label: 'Sắp tới', value: 'BOOKED' },
                { label: 'Đã khám', value: 'DONE' },
                { label: 'Đã hủy', value: 'CANCELLED' }
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === tab.value
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Danh sách hiển thị */}
        {loading ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-semibold">Đang tải lịch hẹn khám...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-400 font-medium shadow-sm space-y-4">
            <Icons.FolderOpen className="w-12 h-12 mx-auto text-gray-300" />
            <p>Không tìm thấy lịch hẹn khám nào.</p>
            {statusFilter === 'ALL' && (
              <button 
                onClick={onBookClick}
                className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-bold text-sm transition-all cursor-pointer"
              >
                Đặt lịch đầu tiên ngay
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((apt) => (
              <AppointmentCard 
                key={apt.id}
                apt={apt}
                onShowQr={setSelectedQr}
                formatDate={formatDate}
                onCancel={apt.status === 'BOOKED' ? handleCancel : null}
              />
            ))}
          </div>
        )}
      </div>

      {/* ==========================================
         MODAL HIỂN THỊ MÃ QR CODE LỊCH HẸN
         ========================================== */}
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

export default MyAppointments;
