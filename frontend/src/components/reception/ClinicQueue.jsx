import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { getAllAppointments, updateAppointment } from '../../services/appointmentService';

export default function ClinicQueue() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Load appointments
  const loadAppointments = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const data = await getAllAppointments();
      setAppointments(data || []);
    } catch (err) {
      console.error('Lỗi khi tải lịch hẹn:', err);
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    // Tải lần đầu có hiện spinner
    loadAppointments(true);

    // Thiết lập tự động đồng bộ ngầm sau mỗi 5 giây
    const interval = setInterval(() => {
      loadAppointments(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Group appointments by Doctor Profile
  const getQueuesByDoctor = () => {
    const grouped = {};

    appointments.forEach((appt) => {
      // Bỏ qua lịch hẹn đã hủy hoặc chưa check-in (BOOKED)
      if (appt.status === 'BOOKED' || appt.status === 'CANCELLED') return;

      const docId = appt.doctorProfileId || 0;
      const docName = appt.doctorProfile?.fullName || 'Bác sĩ trực ban';
      const specialty = appt.doctorProfile?.specialty?.name || 'Đa khoa';

      if (!grouped[docId]) {
        grouped[docId] = {
          docId,
          docName,
          specialty,
          examining: null,
          waiting: [],
          done: []
        };
      }

      if (appt.status === 'EXAMINING') {
        grouped[docId].examining = appt;
      } else if (appt.status === 'WAITING' && appt.priorityScore !== null && appt.priorityScore !== undefined) {
        grouped[docId].waiting.push(appt);
      } else if (appt.status === 'DONE') {
        grouped[docId].done.push(appt);
      }
    });

    // Sắp xếp danh sách chờ theo điểm priorityScore giảm dần, nếu bằng nhau thì theo ID tăng dần
    Object.keys(grouped).forEach((key) => {
      grouped[key].waiting.sort((a, b) => {
        const scoreA = a.priorityScore || 0;
        const scoreB = b.priorityScore || 0;
        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }
        return a.id - b.id;
      });
    });

    return Object.values(grouped);
  };

  const queues = getQueuesByDoctor();

  return (
    <div className="space-y-6">
      
      {/* POPUP NOTIFICATION */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-white font-bold border transition-all animate-[fadeIn_0.2s_ease-out] ${
          notification.type === 'success' ? 'bg-emerald-500 border-emerald-600' : 
          notification.type === 'warning' ? 'bg-amber-500 border-amber-600' : 'bg-rose-500 border-rose-600'
        }`}>
          <Icons.Volume2 className="w-5 h-5 animate-bounce" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* HEADER SECTION WITH REFRESH BUTTON */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
          <Icons.LayoutGrid className="w-5 h-5 text-blue-600" />
          Giám sát hàng đợi phòng khám
        </h2>
        <button
          onClick={() => loadAppointments(true)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-600 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm hover:shadow active:scale-95 disabled:opacity-50"
        >
          <Icons.RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Đồng bộ hàng đợi</span>
        </button>
      </div>

      {/* HEADER STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
            <Icons.Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Đang đợi khám</span>
            <span className="font-extrabold text-2xl text-gray-900 mt-1 block">
              {appointments.filter(a => a.status === 'WAITING').length} người
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-bold">
            <Icons.Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Đang chẩn đoán</span>
            <span className="font-extrabold text-2xl text-gray-900 mt-1 block">
              {appointments.filter(a => a.status === 'EXAMINING').length} người
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
            <Icons.CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Đã khám xong</span>
            <span className="font-extrabold text-2xl text-gray-900 mt-1 block">
              {appointments.filter(a => a.status === 'DONE').length} người
            </span>
          </div>
        </div>
      </div>

      {/* DANH SÁCH HÀNG ĐỢI THEO PHÒNG KHÁM */}
      {loading && appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-3xl border border-gray-100">
          <Icons.Loader className="w-8 h-8 text-blue-600 animate-spin mb-3" />
          <p className="text-sm font-semibold text-gray-400">Đang đồng bộ dữ liệu hàng đợi phòng khám...</p>
        </div>
      ) : queues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-300">
            <Icons.Users className="w-8 h-8" />
          </div>
          <h4 className="font-extrabold text-gray-800 text-base">Hàng đợi hiện đang trống!</h4>
          <p className="text-sm text-gray-400 max-w-sm mt-1.5 font-semibold">Hãy thực hiện check-in cho bệnh nhân ở tab "Tiếp đón" để đưa họ vào danh sách xếp hàng chờ khám.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {queues.map((queue) => (
            <div key={queue.docId} className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex flex-col justify-between">
              
              {/* PHẦN ĐẦU: THÔNG TIN BÁC SĨ & PHÒNG KHÁM */}
              <div className="p-6 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                    <Icons.UserRound className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-base leading-tight">{queue.docName}</h4>
                    <span className="text-xs text-blue-600 font-bold mt-1 block uppercase tracking-wider">{queue.specialty}</span>
                  </div>
                </div>
                <div className="bg-white border border-gray-100 px-3 py-1.5 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Chờ khám</span>
                  <span className="font-extrabold text-base text-gray-800">{queue.waiting.length}</span>
                </div>
              </div>

              {/* PHẦN TRUNG TÂM: DANH SÁCH BỆNH NHÂN */}
              <div className="p-6 flex-1 space-y-5">
                
                {/* 1. BỆNH NHÂN ĐANG KHÁM */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500 block mb-2">Đang khám bệnh</span>
                  {queue.examining ? (
                    <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-2xl flex items-center justify-between animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-extrabold text-sm">
                          STT
                        </div>
                        <div>
                          <p className="font-extrabold text-purple-900 text-sm">{queue.examining.patient?.fullName}</p>
                          <span className="text-xs font-semibold text-purple-600/70 mt-0.5 block">
                            Mã số: {queue.examining.qrCode.split('-').pop()}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-purple-600 bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200">
                        Đang chẩn đoán
                      </span>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-center">
                      <p className="text-xs font-bold text-gray-400">Không có bệnh nhân trong phòng khám</p>
                    </div>
                  )}
                </div>

                {/* 2. HÀNG ĐỢI CHỜ KHÁM */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">Hàng đợi chờ khám</span>
                  {queue.waiting.length > 0 ? (
                    <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                      {queue.waiting.map((appt, idx) => (
                        <div key={appt.id} className="p-3.5 bg-white border border-gray-100 hover:border-gray-200 rounded-2xl flex items-center justify-between transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center font-extrabold text-xs">
                              {idx + 1}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-sm text-gray-800">{appt.patient?.fullName}</p>
                                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                                  (appt.priorityScore || 0) >= 8 
                                    ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                                    : 'bg-blue-50 text-blue-600 border border-blue-100'
                                }`}>
                                  {appt.priorityScore || 1} Điểm
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">
                                Hẹn: {appt.appointmentTime?.substring(0, 5)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50/50 border border-dashed border-gray-100 rounded-2xl text-center">
                      <p className="text-xs font-bold text-gray-400">Không có bệnh nhân chờ khám</p>
                    </div>
                  )}
                </div>

              </div>

              {/* PHẦN DƯỚI: THỐNG KÊ ĐÃ KHÁM XONG */}
              <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-400">
                <span>Số ca đã khám xong trong ngày:</span>
                <span className="text-emerald-600 font-bold">{queue.done.length} ca</span>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
