import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { getAllAppointments, updateAppointment } from '../../services/appointmentService';

export default function CheckinPanel() {
  const [searchCode, setSearchCode] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [matchedAppt, setMatchedAppt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');
  const [notification, setNotification] = useState(null);

  // Load appointments from API
  const loadAppointments = async () => {
    try {
      const data = await getAllAppointments();
      setAppointments(data || []);
    } catch (err) {
      console.error('Lỗi khi tải lịch hẹn:', err);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  // Effect khởi chạy html5-qrcode camera thật
  useEffect(() => {
    let html5QrCode = null;
    if (isScanning) {
      setScanMessage('Đang khởi động Camera...');
      const timer = setTimeout(() => {
        const readerElement = document.getElementById('reader');
        if (!readerElement) return;

        html5QrCode = new Html5Qrcode("reader");
        const config = { fps: 10, qrbox: { width: 220, height: 220 } };

        html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            // Quét thành công!
            html5QrCode.stop().then(() => {
              setIsScanning(false);
              setSearchCode(decodedText);
              handleSearch(decodedText);
            }).catch(err => {
              console.error("Lỗi khi tắt camera:", err);
              setIsScanning(false);
            });
          },
          (errorMessage) => {
            // Đang quét liên tục, bỏ qua log tìm kiếm
          }
        ).then(() => {
          setScanMessage('Đang quét... Hãy đưa mã QR lịch hẹn trước Webcam.');
        }).catch(err => {
          console.error("Lỗi khởi chạy camera:", err);
          setScanMessage('Không tìm thấy Camera hoặc chưa được cấp quyền truy cập thiết bị.');
        });
      }, 500);

      return () => {
        clearTimeout(timer);
        if (html5QrCode) {
          if (html5QrCode.isScanning) {
            html5QrCode.stop().catch(e => console.error("Lỗi dừng camera khi unmount:", e));
          }
        }
      };
    }
  }, [isScanning]);

  // Show status popup notification
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Tra cứu mã lịch hẹn (đồng bộ fresh data từ backend)
  const handleSearch = async (code) => {
    const query = (code || searchCode).trim().toUpperCase();
    if (!query) return;

    setLoading(true);
    try {
      const data = await getAllAppointments();
      setAppointments(data || []);

      const found = data.find(
        (appt) => appt.qrCode.toUpperCase() === query || appt.qrCode.endsWith(query)
      );

      if (found) {
        setMatchedAppt(found);
        showToast('Đã tìm thấy lịch khám bệnh nhân!', 'success');
      } else {
        setMatchedAppt(null);
        showToast('Không tìm thấy lịch khám khớp với mã đã quét/nhập!', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Lỗi kết nối khi tra cứu lịch khám!', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Xác nhận Check-in (chỉ bắt đầu tính điểm ưu tiên y khoa khi nhấn nút)
  const handleCheckinConfirm = async () => {
    if (!matchedAppt) return;
    setLoading(true);

    try {
      // Gọi API cập nhật trạng thái lịch hẹn sang WAITING để kích hoạt tính điểm ưu tiên tại backend
      const updated = await updateAppointment(matchedAppt.id, { status: 'WAITING' });
      
      setMatchedAppt(updated);
      showToast(`Xác nhận Check-in thành công! Điểm ưu tiên: ${updated.priorityScore}đ. Đã xếp bệnh nhân vào hàng đợi.`, 'success');
      
      loadAppointments();
    } catch (err) {
      console.error('Lỗi check-in:', err);
      showToast('Đã xảy ra lỗi khi xác nhận Check-in!', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* THÔNG BÁO POPUP */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-white font-bold border transition-all animate-[fadeIn_0.2s_ease-out] ${
          notification.type === 'success' ? 'bg-emerald-500 border-emerald-600' : 
          notification.type === 'warning' ? 'bg-amber-500 border-amber-600' :
          'bg-rose-500 border-rose-600'
        }`}>
          {notification.type === 'success' ? <Icons.CheckCircle className="w-5 h-5" /> : <Icons.AlertCircle className="w-5 h-5" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* PANEL TÌM KIẾM CHÍNH */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/40 p-6 md:p-8">
        <h3 className="font-extrabold text-gray-900 text-lg mb-2">Tiếp tiếp đón & Check-in</h3>
        <p className="text-sm text-gray-400 font-semibold mb-6">Quét mã QR từ điện thoại của bệnh nhân hoặc nhập mã đặt lịch khám thủ công để kiểm tra hồ sơ.</p>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Icons.Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Nhập mã lịch hẹn (Ví dụ: HT-APPT-...)"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-gray-50 border-none outline-none pl-12 pr-4 py-3.5 rounded-2xl font-semibold text-gray-800 focus:ring-2 focus:ring-blue-500/20 text-sm md:text-base placeholder-gray-400"
            />
          </div>

          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="bg-blue-600 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-blue-700 transition-colors cursor-pointer text-sm shrink-0 flex items-center justify-center gap-2"
          >
            {loading ? <Icons.Loader className="w-5 h-5 animate-spin" /> : <Icons.ArrowRight className="w-5 h-5" />}
            <span>Tìm kiếm</span>
          </button>

          <button
            onClick={() => setIsScanning(true)}
            className="bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold px-6 py-3.5 rounded-2xl hover:bg-emerald-100 transition-colors cursor-pointer text-sm shrink-0 flex items-center justify-center gap-2"
          >
            <Icons.QrCode className="w-5 h-5" />
            <span>Quét bằng Camera</span>
          </button>
        </div>
      </div>

      {/* MODAL QUÉT CAMERA CAMERA WEBCAM THẬT */}
      {isScanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-md">
          <div className="bg-gray-900 w-[450px] rounded-3xl border border-gray-800 shadow-2xl p-6 relative text-center text-white overflow-hidden">
            <button
              onClick={() => setIsScanning(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white bg-gray-800 p-2 rounded-xl cursor-pointer z-20"
            >
              <Icons.X className="w-5 h-5" />
            </button>

            <h4 className="font-extrabold text-base tracking-wide uppercase text-emerald-400 mb-4 flex items-center justify-center gap-2">
              <Icons.Camera className="w-5 h-5 animate-pulse" />
              <span>Camera Quét QR Trực Tuyến</span>
            </h4>
            
            {/* KHUNG MÀN HÌNH QUÉT CAMERA THẬT */}
            <div className="w-full aspect-square bg-gray-950 rounded-2xl border-2 border-gray-800 relative flex flex-col items-center justify-center overflow-hidden">
              <div id="reader" className="absolute inset-0 w-full h-full"></div>

              {/* CÁC GÓC QUÉT NHẬN DIỆN */}
              <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-emerald-500 pointer-events-none z-10"></div>
              <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-emerald-500 pointer-events-none z-10"></div>
              <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-emerald-500 pointer-events-none z-10"></div>
              <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-emerald-500 pointer-events-none z-10"></div>

              {/* TIA LASER QUÉT CHẠY LÊN XUỐNG */}
              <div className="absolute left-6 right-6 h-0.5 bg-emerald-500 shadow-[0_0_8px_#10b981] animate-[scan_2s_infinite_ease-in-out] pointer-events-none z-10"></div>
            </div>

            <p className="mt-6 font-bold text-sm text-gray-300 px-4">{scanMessage}</p>
          </div>
        </div>
      )}

      {/* HIỂN THỊ HỒ SƠ LỊCH HẸN TÌM THẤY */}
      {matchedAppt && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-8 space-y-6 animate-[fadeIn_0.3s_ease-out]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Mã QR Lịch Hẹn</span>
              <h4 className="font-extrabold text-xl text-gray-900 mt-1 flex items-center gap-2">
                <Icons.QrCode className="w-6 h-6 text-blue-600" />
                <span>{matchedAppt.qrCode}</span>
              </h4>
            </div>

            <div className="flex gap-2">
              <span className={`px-4 py-2 rounded-xl font-bold text-xs border uppercase tracking-wider ${
                matchedAppt.status === 'BOOKED' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                matchedAppt.status === 'WAITING' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                matchedAppt.status === 'EXAMINING' ? 'bg-purple-50 border-purple-100 text-purple-600' :
                matchedAppt.status === 'DONE' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                'bg-gray-50 border-gray-100 text-gray-400'
              }`}>
                {matchedAppt.status === 'BOOKED' && 'Chưa check-in'}
                {matchedAppt.status === 'WAITING' && 'Đang đợi khám'}
                {matchedAppt.status === 'EXAMINING' && 'Đang khám bệnh'}
                {matchedAppt.status === 'DONE' && 'Đã hoàn tất'}
                {matchedAppt.status === 'CANCELLED' && 'Đã huỷ'}
              </span>

              {matchedAppt.invoices && (
                <span className={`px-4 py-2 rounded-xl font-bold text-xs border uppercase tracking-wider ${
                  matchedAppt.invoices.status === 'PAID' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'
                }`}>
                  {matchedAppt.invoices.status === 'PAID' ? 'Đã Thanh toán' : 'Chưa Thanh toán'}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* THÔNG TIN BỆNH NHÂN */}
            <div className="space-y-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-100/50">
              <h5 className="font-extrabold text-sm text-gray-800 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
                <Icons.User className="w-4.5 h-4.5 text-blue-600" />
                <span>Thông tin Bệnh nhân</span>
              </h5>
              
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">Họ và Tên:</span>
                  <span className="font-extrabold text-gray-900">{matchedAppt.patient?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">Giới tính:</span>
                  <span className="font-bold text-gray-800">{matchedAppt.patient?.gender === 'MALE' ? 'Nam' : 'Nữ'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">Ngày sinh:</span>
                  <span className="font-bold text-gray-800">
                    {matchedAppt.patient?.dob ? new Date(matchedAppt.patient.dob).toLocaleDateString('vi-VN') : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">Số điện thoại:</span>
                  <span className="font-bold text-gray-800">{matchedAppt.patient?.phone}</span>
                </div>
              </div>
            </div>

            {/* THÔNG TIN DỊCH VỤ / LỊCH HẸN */}
            <div className="space-y-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-100/50">
              <h5 className="font-extrabold text-sm text-gray-800 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
                <Icons.Calendar className="w-4.5 h-4.5 text-blue-600" />
                <span>Thông tin Khám bệnh</span>
              </h5>
              
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">Chuyên khoa:</span>
                  <span className="font-bold text-blue-600">{matchedAppt.doctorProfile?.specialty?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">Bác sĩ phụ trách:</span>
                  <span className="font-extrabold text-gray-900">{matchedAppt.doctorProfile?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">Ngày khám:</span>
                  <span className="font-bold text-gray-800">
                    {matchedAppt.appointmentDate ? new Date(matchedAppt.appointmentDate).toLocaleDateString('vi-VN') : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">Giờ hẹn khám:</span>
                  <span className="font-bold text-gray-800">{matchedAppt.appointmentTime?.substring(0, 5)}</span>
                </div>
              </div>
            </div>

          </div>

          {/* NÚT XÁC NHẬN HOẶC TRẠNG THÁI HÀNG ĐỢI */}
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            {matchedAppt.status === 'BOOKED' ? (
              <button
                onClick={handleCheckinConfirm}
                disabled={loading}
                className="bg-blue-600 text-white font-extrabold px-8 py-3.5 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 cursor-pointer text-sm flex items-center gap-2 animate-bounce"
              >
                {loading ? <Icons.Loader className="w-5 h-5 animate-spin" /> : <Icons.Check className="w-5 h-5" />}
                <span>Xác nhận Check-in & Tính điểm Smart Queue</span>
              </button>
            ) : matchedAppt.status === 'WAITING' ? (
              <div className="flex items-center gap-3 text-amber-600 font-bold bg-amber-50 border border-amber-100 px-5 py-3 rounded-2xl text-sm">
                <Icons.Clock className="w-5 h-5" />
                <span>Bệnh nhân đã được tiếp đón. Điểm xếp hàng: <b className="text-base text-rose-600">{matchedAppt.priorityScore}đ</b></span>
              </div>
            ) : matchedAppt.status === 'EXAMINING' ? (
              <div className="flex items-center gap-2 text-purple-600 font-bold bg-purple-50 border border-purple-100 px-5 py-3 rounded-2xl text-sm">
                <Icons.Activity className="w-5 h-5 animate-pulse" />
                <span>Bệnh nhân đang khám cùng Bác sĩ</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-5 py-3 rounded-2xl text-sm">
                <Icons.CheckCircle className="w-5 h-5" />
                <span>Lịch khám đã hoàn tất chẩn đoán bệnh án</span>
              </div>
            )}
          </div>

        </div>
      )}

      {/* DÙNG ĐỂ CHẠY CÁC THIẾT KẾ ĐẸP (CSS KEYFRAMES TRONG DOM) */}
      <style>{`
        @keyframes scan {
          0% { top: 24px; }
          50% { top: calc(100% - 28px); }
          100% { top: 24px; }
        }
      `}</style>

    </div>
  );
}
