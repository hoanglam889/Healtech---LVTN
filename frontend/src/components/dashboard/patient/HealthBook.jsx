import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { getAppointmentsByUserId } from '../../../services/appointmentService';
import { BASE_URL } from '../../../services/apiClient';

const HealthBook = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null); // Lưu thông tin bệnh án đang chọn xem chi tiết

  useEffect(() => {
    setLoading(true);
    getAppointmentsByUserId(user?.id)
      .then((data) => {
        // Lọc các ca khám có trạng thái DONE (Đã khám xong) và có thông tin bệnh án
        const completedVisits = (data || []).filter((apt) => apt.status === 'DONE');
        setAppointments(completedVisits);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi tải sổ sức khỏe:', err);
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

  // Trình in ấn phiếu khám (giả lập hoặc dùng window.print)
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Tiêu đề */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Icons.HeartPulse className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Sổ sức khỏe cá nhân</h1>
            <p className="text-sm text-gray-400 font-semibold">Tra cứu hồ sơ bệnh án, chẩn đoán và đơn thuốc từ bác sĩ sau mỗi ca khám.</p>
          </div>
        </div>

        {/* Danh sách các ca khám hoàn thành */}
        {loading ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-semibold">Đang tải lịch sử bệnh án...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-400 font-medium shadow-sm space-y-4">
            <Icons.Activity className="w-12 h-12 mx-auto text-gray-300 animate-pulse" />
            <p>Bạn chưa có kết quả khám bệnh nào.</p>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">Các ca khám sẽ hiển thị tại đây kèm chẩn đoán chi tiết sau khi bạn hoàn thành quy trình khám tại phòng khám.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appointments.map((apt) => {
              const imageUrl = apt.doctorProfile?.avatarUrl ? `${BASE_URL}${apt.doctorProfile.avatarUrl}` : null;
              return (
                <div key={apt.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow transition-all flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    {/* Bác sĩ và Ngày khám */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-50 rounded-full overflow-hidden border border-blue-100 flex items-center justify-center text-xl shrink-0">
                          {imageUrl ? (
                            <img src={imageUrl} alt={apt.doctorProfile?.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <span>🩺</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm md:text-base">BS. {apt.doctorProfile?.fullName}</h4>
                          <p className="text-xs text-gray-400 font-semibold">
                            Khoa: <span className="text-gray-600">{apt.doctorProfile?.specialty?.name || 'Khám tổng quát'}</span>
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase">
                        Hoàn thành
                      </span>
                    </div>

                    {/* Chi tiết ca khám bệnh án */}
                    <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100 text-xs space-y-2">
                      <p className="font-semibold text-gray-600">
                        Bệnh nhân: <span className="text-gray-800 font-bold">{apt.patient?.fullName}</span>
                      </p>
                      <p className="font-semibold text-gray-600">
                        Ngày khám: <span className="text-gray-800">{formatDate(apt.appointmentDate)}</span>
                      </p>
                      <p className="font-semibold text-gray-600 truncate">
                        Chẩn đoán chính: <span className="text-blue-600 font-bold">{apt.medicalRecords?.diagnosis || 'Theo dõi lâm sàng'}</span>
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedRecord(apt)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-blue-100"
                  >
                    <Icons.FileText className="w-4 h-4" />
                    <span>Xem bệnh án chi tiết</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ==========================================
         MODAL HIỂN THỊ PHIẾU BỆNH ÁN CHI TIẾT
         ========================================== */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedRecord(null)} />
          
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full relative z-10 shadow-2xl border border-gray-100 animate-[fadeIn_0.2s_ease-out] flex flex-col max-h-[90vh]">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-2 text-blue-600">
                <Icons.Activity className="w-5 h-5" />
                <h4 className="font-bold text-gray-900">Chi Tiết Phiếu Kết Quả Khám</h4>
              </div>
              <button 
                onClick={() => setSelectedRecord(null)} 
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            {/* Nội dung Bệnh Án dạng Tờ phiếu bệnh án */}
            <div className="overflow-y-auto space-y-6 flex-1 pr-1 print-area">
              
              {/* Logo Phòng khám & Mã phiếu */}
              <div className="flex justify-between items-start border-b border-dashed border-gray-100 pb-4">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-blue-600 text-lg uppercase tracking-wider">HEALTECH CLINIC</h3>
                  <p className="text-[10px] text-gray-400 font-semibold">Hệ thống Y tế Chất lượng cao Healtech</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold">MÃ PHIẾU KHÁM</p>
                  <p className="font-mono font-bold text-gray-800 text-sm bg-gray-50 px-2 py-0.5 rounded border border-gray-200/50 mt-1 inline-block">
                    {selectedRecord.qrCode}
                  </p>
                </div>
              </div>

              {/* Thông tin Hành chính */}
              <div className="space-y-2">
                <h5 className="font-bold text-gray-800 text-xs uppercase tracking-wider text-blue-600">I. Thông tin bệnh nhân</h5>
                <div className="grid grid-cols-2 gap-y-2 text-xs font-semibold text-gray-500 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <p>Họ tên: <span className="text-gray-800 font-bold">{selectedRecord.patient?.fullName}</span></p>
                  <p>Giới tính: <span className="text-gray-800 font-bold">{selectedRecord.patient?.gender === 'MALE' ? 'Nam' : selectedRecord.patient?.gender === 'FEMALE' ? 'Nữ' : 'Khác'}</span></p>
                  <p>Ngày sinh: <span className="text-gray-800">{formatDate(selectedRecord.patient?.dob)}</span></p>
                  <p>Điện thoại: <span className="text-gray-800">{selectedRecord.patient?.phone || 'Chưa có'}</span></p>
                  <p className="col-span-2">Địa chỉ: <span className="text-gray-800">{selectedRecord.patient?.address || 'Chưa cập nhật'}</span></p>
                </div>
              </div>

              {/* Thông tin Chuyên môn */}
              <div className="space-y-3">
                <h5 className="font-bold text-gray-800 text-xs uppercase tracking-wider text-blue-600">II. Kết quả chẩn đoán y khoa</h5>
                
                <div className="space-y-4">
                  {/* Triệu chứng */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Triệu chứng bệnh nhân khai báo</label>
                    <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs font-medium text-gray-700 leading-relaxed shadow-sm">
                      {selectedRecord.medicalRecords?.symptoms || 'Khám sức khỏe định kỳ / Không có triệu chứng đặc trưng.'}
                    </div>
                  </div>

                  {/* Chẩn đoán */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Chẩn đoán của Bác sĩ</label>
                    <div className="p-3 bg-blue-50/20 rounded-xl border border-blue-100 text-xs font-bold text-blue-800 leading-relaxed shadow-sm">
                      {selectedRecord.medicalRecords?.diagnosis || 'Theo dõi sức khỏe tổng quát.'}
                    </div>
                  </div>

                  {/* Lời khuyên bác sĩ */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Lời dặn / Ghi chú điều trị</label>
                    <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs font-medium text-gray-600 leading-relaxed italic shadow-sm">
                      {selectedRecord.medicalRecords?.notes || 'Uống nhiều nước, ăn nhiều rau xanh, nghỉ ngơi hợp lý. Tái khám sau 2 tuần hoặc khi có dấu hiệu bất thường.'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Người ký tên */}
              <div className="flex justify-between items-center border-t border-dashed border-gray-100 pt-6 mt-4">
                <div className="text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Ngày khám</p>
                  <p className="text-xs font-bold text-gray-700 mt-1">{formatDate(selectedRecord.appointmentDate)}</p>
                </div>
                <div className="text-center pr-6">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Bác sĩ chẩn đoán</p>
                  <p className="text-xs font-bold text-gray-700 mt-1">{selectedRecord.doctorProfile?.fullName}</p>
                  <p className="text-[9px] text-gray-400 font-semibold mt-1">(Đã ký xác nhận điện tử)</p>
                </div>
              </div>

            </div>

            {/* Footer Modal với Nút In */}
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 mt-4 shrink-0">
              <button 
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gray-50 text-gray-500 hover:bg-gray-100 transition-all border border-gray-200 cursor-pointer"
              >
                Đóng lại
              </button>
              <button 
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-100 cursor-pointer flex items-center gap-1.5"
              >
                <Icons.Printer className="w-4 h-4" />
                <span>In phiếu khám</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default HealthBook;
