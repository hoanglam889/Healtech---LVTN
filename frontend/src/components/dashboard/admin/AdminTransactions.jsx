import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { getAllAppointments, updateAppointment } from '../../../services/appointmentService';
import { getDoctors } from '../../../services/doctorService';
import { socket } from '../../../services/socket';

export default function AdminTransactions() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelConfirmId, setCancelConfirmId] = useState(null);
  
  const [doctors, setDoctors] = useState([]);
  const [rescheduleItem, setRescheduleItem] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '', doctorId: '' });
  const [isConfirmingReschedule, setIsConfirmingReschedule] = useState(false);
  const [notification, setNotification] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'PAID' | 'UNPAID' | 'CANCELLED'

  // Load danh sách lịch khám từ Backend
  const loadData = () => {
    setLoading(true);
    getAllAppointments()
      .then((data) => {
        setAppointments(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi tải danh sách lịch hẹn:', err);
        setLoading(false);
      });
  };


  useEffect(() => {
    loadData();
    getDoctors().then(docs => setDoctors(docs || [])).catch(console.error);

    // Admin quan tâm doanh thu, nên chỉ nghe khi có người thanh toán xong
    socket.on('invoice_paid', () => {
      console.log('⚡ Admin nhận: invoice_paid');
      loadData();
    });

    return () => socket.off('invoice_paid');
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Xử lý Hủy lịch khám (Gọi API)
  const handleCancel = async (id) => {
    try {
      setCancelConfirmId(null);
      await updateAppointment(id, { status: 'CANCELLED' });
      showToast('Hủy lịch khám thành công!');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Không thể hủy lịch khám này!', 'error');
    }
  };

  // Xử lý Dời lịch khám
  const handleReschedule = async () => {
    try {
      await updateAppointment(rescheduleItem.id, { 
        appointmentDate: rescheduleData.date,
        appointmentTime: rescheduleData.time,
        doctorProfileId: parseInt(rescheduleData.doctorId, 10)
      });
      
      setRescheduleItem(null);
      setIsConfirmingReschedule(false);
      showToast('Dời lịch khám thành công!', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Không thể dời lịch khám này!', 'error');
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
  const filteredData = appointments.filter((item) => {
    // 1. Lọc theo trạng thái hóa đơn hoặc trạng thái ca hẹn
    if (filter === 'PAID' && (item.invoices?.status !== 'PAID' || item.status === 'CANCELLED')) return false;
    if (filter === 'UNPAID' && (item.invoices?.status !== 'UNPAID' || item.status === 'CANCELLED')) return false;
    if (filter === 'CANCELLED' && item.status !== 'CANCELLED') return false;

    // 2. Tìm kiếm theo tên bệnh nhân, tên bác sĩ, mã qrCode hoặc mã ID
    const patientName = item.patient?.fullName?.toLowerCase() || '';
    const docName = item.doctorProfile?.fullName?.toLowerCase() || '';
    const apptCode = item.qrCode?.toLowerCase() || '';
    const search = searchQuery.toLowerCase().trim();

    return patientName.includes(search) || docName.includes(search) || apptCode.includes(search) || item.id.toString() === search;
  });

  return (
    <div className="space-y-6">
      {/* Thông báo Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-[60] px-6 py-3 rounded-xl font-bold shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-8 ${
          notification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
        }`}>
          {notification.type === 'success' ? <Icons.CheckCircle2 className="w-5 h-5" /> : <Icons.AlertCircle className="w-5 h-5" />}
          {notification.message}
        </div>
      )}
      
      {/* THANH TÌM KIẾM VÀ BỘ LỌC */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Icons.Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã, bệnh nhân, bác sĩ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-xs font-semibold text-gray-700"
          />
        </div>

        {/* Các nút lọc */}
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          {[
            { label: 'Tất cả ca khám', value: 'ALL' },
            { label: 'Đã thanh toán', value: 'PAID' },
            { label: 'Chưa thanh toán', value: 'UNPAID' },
            { label: 'Đã hủy ca', value: 'CANCELLED' }
          ].map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === btn.value
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* BẢNG LỊCH HẸN & GIAO DỊCH DỮ LIỆU THẬT */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-[fadeIn_0.25s_ease-out]">
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">Đang tải lịch hẹn & hóa đơn...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-16 text-center text-gray-400 font-bold text-sm">
            Không tìm thấy ca hẹn hoặc hóa đơn giao dịch nào phù hợp.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-wider bg-gray-50/30">
                  <th className="py-4 px-6">Mã ca</th>
                  <th className="py-4 px-6">Bệnh nhân</th>
                  <th className="py-4 px-6">Bác sĩ</th>
                  <th className="py-4 px-6">Ngày hẹn</th>
                  <th className="py-4 px-6">Khung giờ</th>
                  <th className="py-4 px-6">Chi phí</th>
                  <th className="py-4 px-6">Trạng thái khám</th>
                  <th className="py-4 px-6">Hóa đơn</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                {filteredData.map((item) => {
                  const isUpcoming = item.status === 'BOOKED';
                  const isCheckedIn = item.status === 'WAITING' || item.status === 'EXAMINING';
                  const isDone = item.status === 'DONE';
                  const isCancelled = item.status === 'CANCELLED';

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-gray-900 text-xs">
                        {item.qrCode || `HT-APPT-${item.id}`}
                      </td>
                      <td className="py-4 px-6">{item.patient?.fullName || 'N/A'}</td>
                      <td className="py-4 px-6 text-gray-900">
                        {item.doctorProfile?.fullName ? `BS. ${item.doctorProfile.fullName}` : 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-xs text-gray-500">{formatDate(item.appointmentDate)}</td>
                      <td className="py-4 px-6 text-xs font-semibold text-gray-700">
                        {item.appointmentTime?.substring(0, 5) || ''}
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-900">
                        {item.invoices?.totalAmount 
                          ? `${parseFloat(item.invoices.totalAmount).toLocaleString('vi-VN')} đ` 
                          : '150.000 đ'}
                      </td>
                      
                      {/* Trạng thái ca khám */}
                      <td className="py-4 px-6">
                        <span className={`inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          isDone
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : isCancelled
                              ? 'bg-red-50 text-red-600 border border-red-100'
                              : isCheckedIn
                                ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                : 'bg-blue-50 text-blue-600 border border-blue-100' // BOOKED
                        }`}>
                          {isDone ? 'Hoàn thành' : isCancelled ? 'Đã hủy' : isCheckedIn ? 'Đã check-in' : 'Đã đặt'}
                        </span>
                      </td>

                      {/* Trạng thái hóa đơn */}
                      <td className="py-4 px-6">
                        <span className={`inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          isCancelled
                            ? 'bg-red-50 text-red-600 border border-red-100'
                            : item.invoices?.status === 'PAID'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {isCancelled ? 'Đã hủy hóa đơn' : item.invoices?.status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </span>
                      </td>

                      {/* Thao tác hủy lịch khám */}
                      <td className="py-4 px-6 text-right">
                        {(!isDone && !isCancelled) ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setRescheduleItem(item);
                                setRescheduleData({
                                  date: item.appointmentDate || '',
                                  time: item.appointmentTime ? item.appointmentTime.slice(0, 5) : '',
                                  doctorId: item.doctorProfileId || ''
                                });
                              }}
                              className="text-xs font-bold text-blue-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-blue-100 transition-all cursor-pointer"
                            >
                              Dời lịch
                            </button>
                            <button
                              onClick={() => setCancelConfirmId(item.id)}
                              className="text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-100 transition-all cursor-pointer"
                            >
                              Hủy
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 font-semibold italic">Không khả dụng</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CONFIRM CANCELLATION MODAL */}
      {cancelConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setCancelConfirmId(null)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4 mx-auto text-rose-600">
              <Icons.AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Hủy ca khám?</h3>
            <p className="text-center text-sm text-gray-500 font-medium mb-6">
              Bạn có chắc chắn muốn hủy lịch khám này? Mọi thông tin hàng đợi sẽ bị xóa.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setCancelConfirmId(null)}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
              >
                Quay lại
              </button>
              <button 
                onClick={() => handleCancel(cancelConfirmId)}
                className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-200 rounded-xl font-bold transition-all cursor-pointer"
              >
                Xác nhận Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {rescheduleItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setRescheduleItem(null)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
            {!isConfirmingReschedule ? (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Dời lịch khám</h3>
                <p className="text-sm text-gray-500 font-medium mb-6">
                  Bệnh nhân: <span className="font-bold text-gray-700">{rescheduleItem.patient?.fullName}</span>
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Ngày khám</label>
                    <input 
                      type="date" 
                      value={rescheduleData.date}
                      onChange={(e) => setRescheduleData({...rescheduleData, date: e.target.value})}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Chọn bác sĩ (có ca trực trong ngày)</label>
                    <select 
                      value={rescheduleData.doctorId}
                      onChange={(e) => setRescheduleData({...rescheduleData, doctorId: e.target.value})}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                    >
                      <option value="">-- Chọn bác sĩ --</option>
                      {doctors.filter(doc => {
                        if (!rescheduleData.date) return true;
                        return doc.doctorSchedules?.some(sched => sched.date === rescheduleData.date);
                      }).map(doc => (
                        <option key={doc.id} value={doc.id}>{doc.fullName} ({doc.specialty?.name})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Giờ khám</label>
                    <input 
                      type="time" 
                      value={rescheduleData.time}
                      onChange={(e) => setRescheduleData({...rescheduleData, time: e.target.value})}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => { setRescheduleItem(null); setIsConfirmingReschedule(false); }}
                    className="flex-1 p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    onClick={() => {
                      if (!rescheduleData.date || !rescheduleData.time || !rescheduleData.doctorId) {
                        showToast('Vui lòng chọn đầy đủ Bác sĩ, Ngày và Giờ!', 'warning');
                        return;
                      }
                      setIsConfirmingReschedule(true);
                    }}
                    className="flex-1 p-3 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl font-bold transition-all cursor-pointer"
                  >
                    Tiếp tục
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.CalendarClock className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Xác nhận dời lịch</h4>
                <p className="text-sm text-gray-500 mb-6">
                  Bạn có chắc chắn muốn dời lịch khám của bệnh nhân <span className="font-bold text-gray-800">{rescheduleItem.patient?.fullName}</span> sang 
                  <span className="font-bold text-blue-600"> {rescheduleData.time} ngày {formatDate(rescheduleData.date)}</span> không?
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsConfirmingReschedule(false)}
                    className="flex-1 p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                  >
                    Quay lại
                  </button>
                  <button 
                    onClick={handleReschedule}
                    className="flex-1 p-3 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl font-bold transition-all"
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
