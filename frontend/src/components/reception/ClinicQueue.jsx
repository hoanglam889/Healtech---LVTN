import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { getAllAppointments, updateAppointment, createAppointment } from '../../services/appointmentService';
import { createPatient } from '../../services/patientService';
import { getDoctors } from '../../services/doctorService';
import { socket } from '../../services/socket';
import { useToast } from '../../contexts/ToastContext';

export default function ClinicQueue() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [cancelConfirmId, setCancelConfirmId] = useState(null);
  
  const [doctors, setDoctors] = useState([]);
      
  // Thêm state cho Walk-In Modal
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInData, setWalkInData] = useState({
    fullName: '', phone: '', cccd: '', dob: '', gender: 'MALE', address: '',
    date: '', time: '', doctorId: ''
  });
  const [isSubmittingWalkIn, setIsSubmittingWalkIn] = useState(false);

  // Thêm formatDate để xài cho confirm modal
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
    getDoctors().then(docs => setDoctors(docs || [])).catch(console.error);

    // Lắng nghe sự kiện từ Backend qua Socket.IO (Chỉ nghe update)
    socket.on('appointment_updated', () => {
      console.log('⚡ Lễ tân nhận: appointment_updated');
      loadAppointments(false);
    });

    return () => socket.off('appointment_updated');
  }, []);



  const handleCancelAppointment = async (id) => {
    try {
      setCancelConfirmId(null);
      await updateAppointment(id, { status: 'CANCELLED' });
      showToast('Đã hủy ca khám thành công');
      loadAppointments(true);
    } catch (err) {
      console.error(err);
      showToast('Lỗi khi hủy ca khám', 'error');
    }
  };

  // Xử lý dời lịch khám
  const handleReschedule = async () => {
    try {
      if (!rescheduleData.date || !rescheduleData.time || !rescheduleData.doctorId) {
        showToast('Vui lòng chọn đầy đủ Bác sĩ, Ngày và Giờ!', 'warning');
        return;
      }
      
      await updateAppointment(rescheduleItem.id, { 
        appointmentDate: rescheduleData.date,
        appointmentTime: rescheduleData.time,
        doctorProfileId: parseInt(rescheduleData.doctorId, 10)
      });
      
      setRescheduleItem(null);
      setIsConfirmingReschedule(false);
      showToast('Đã dời lịch khám thành công!', 'success');
      loadAppointments(false);
    } catch (err) {
      console.error(err);
      showToast('Không thể dời lịch khám này!', 'error');
    }
  };

  // Xử lý tạo lịch khám tại quầy (Walk-In)
  const handleCreateWalkIn = async () => {
    try {
      if (!walkInData.fullName || !walkInData.phone || !walkInData.date || !walkInData.time || !walkInData.doctorId) {
        showToast('Vui lòng điền đủ Tên, SĐT và thông tin khám!', 'warning');
        return;
      }
      setIsSubmittingWalkIn(true);

      // Bước 1: Tạo bệnh nhân vãng lai (không patientAccountId)
      const newPatient = await createPatient({
        fullName: walkInData.fullName,
        phone: walkInData.phone,
        cccd: walkInData.cccd || null,
        dob: walkInData.dob || '2000-01-01',
        gender: walkInData.gender,
        address: walkInData.address || '',
        relationship: 'Bản thân'
      });

      // Bước 2: Tạo lịch khám với ID bệnh nhân vừa tạo
      const formattedTime = walkInData.time.length === 5 ? `${walkInData.time}:00` : walkInData.time;

      await createAppointment({
        patientId: newPatient.id,
        doctorProfileId: parseInt(walkInData.doctorId, 10),
        appointmentDate: walkInData.date,
        appointmentTime: formattedTime,
        paymentMethod: 'CASH'
      });

      showToast('Đã tạo lịch khám vãng lai thành công!', 'success');
      setShowWalkInModal(false);
      setWalkInData({ fullName: '', phone: '', cccd: '', dob: '', gender: 'MALE', address: '', date: '', time: '', doctorId: '' });
      loadAppointments(true);
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi tạo lịch khám!';
      
      // Nếu message là một mảng (do class-validator trả về) thì lấy phần tử đầu tiên
      const displayMsg = Array.isArray(errorMessage) ? errorMessage[0] : errorMessage;
      showToast(displayMsg, 'error');
    } finally {
      setIsSubmittingWalkIn(false);
    }
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
      

      {/* HEADER SECTION WITH REFRESH BUTTON */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
          <Icons.LayoutGrid className="w-5 h-5 text-blue-600" />
          Giám sát hàng đợi phòng khám
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowWalkInModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm hover:shadow active:scale-95"
          >
            <Icons.UserPlus className="w-4 h-4" />
            <span>Thêm khách vãng lai</span>
          </button>
          <button
            onClick={() => loadAppointments(true)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-600 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm hover:shadow active:scale-95 disabled:opacity-50"
          >
            <Icons.RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Đồng bộ hàng đợi</span>
          </button>
        </div>
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
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setRescheduleItem(appt);
                                setRescheduleData({
                                  date: appt.appointmentDate || '',
                                  time: appt.appointmentTime ? appt.appointmentTime.slice(0, 5) : '',
                                  doctorId: appt.doctorProfileId || ''
                                });
                              }}
                              title="Dời lịch"
                              className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Icons.CalendarClock className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setCancelConfirmId(appt.id)}
                              title="Hủy lịch"
                              className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Icons.X className="w-4 h-4" />
                            </button>
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
              Bạn có chắc chắn muốn hủy ca khám này? Bệnh nhân sẽ bị xóa khỏi hàng đợi và không thể khôi phục.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setCancelConfirmId(null)}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
              >
                Quay lại
              </button>
              <button 
                onClick={() => handleCancelAppointment(cancelConfirmId)}
                className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-200 rounded-xl font-bold transition-all"
              >
                Hủy lịch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WALK-IN MODAL */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => !isSubmittingWalkIn && setShowWalkInModal(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Icons.UserPlus className="w-5 h-5" />
                </div>
                Tạo hồ sơ vãng lai & Đặt lịch
              </h3>
              <button 
                onClick={() => !isSubmittingWalkIn && setShowWalkInModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Cột 1: Thông tin bệnh nhân */}
              <div className="space-y-5">
                <h4 className="font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                  <Icons.User className="w-4 h-4 text-indigo-500" /> Thông tin Hành chính
                </h4>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Họ và tên <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    value={walkInData.fullName}
                    onChange={(e) => setWalkInData({...walkInData, fullName: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    placeholder="VD: Nguyễn Văn A"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Số điện thoại <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      value={walkInData.phone}
                      onChange={(e) => setWalkInData({...walkInData, phone: e.target.value})}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      placeholder="VD: 0912345678"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Ngày sinh</label>
                    <input 
                      type="date" 
                      value={walkInData.dob}
                      onChange={(e) => setWalkInData({...walkInData, dob: e.target.value})}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Giới tính</label>
                    <select 
                      value={walkInData.gender}
                      onChange={(e) => setWalkInData({...walkInData, gender: e.target.value})}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    >
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                      <option value="OTHER">Khác</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">CCCD / CMND</label>
                    <input 
                      type="text" 
                      value={walkInData.cccd}
                      onChange={(e) => setWalkInData({...walkInData, cccd: e.target.value})}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Tùy chọn"
                    />
                  </div>
                </div>
              </div>

              {/* Cột 2: Thông tin khám */}
              <div className="space-y-5">
                <h4 className="font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                  <Icons.CalendarClock className="w-4 h-4 text-blue-500" /> Thông tin Đặt Khám
                </h4>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Ngày khám <span className="text-rose-500">*</span></label>
                  <input 
                    type="date" 
                    value={walkInData.date}
                    onChange={(e) => setWalkInData({...walkInData, date: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Bác sĩ tiếp nhận <span className="text-rose-500">*</span></label>
                  <select 
                    value={walkInData.doctorId}
                    onChange={(e) => setWalkInData({...walkInData, doctorId: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">-- Chọn bác sĩ --</option>
                    {doctors.filter(doc => {
                      if (!walkInData.date) return true;
                      return doc.doctorSchedules?.some(sched => sched.date === walkInData.date);
                    }).map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.fullName} ({doc.specialty?.name})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Giờ khám <span className="text-rose-500">*</span></label>
                  <input 
                    type="time" 
                    value={walkInData.time}
                    onChange={(e) => setWalkInData({...walkInData, time: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 rounded-b-3xl">
              <button 
                onClick={() => setShowWalkInModal(false)}
                disabled={isSubmittingWalkIn}
                className="px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition-colors disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleCreateWalkIn}
                disabled={isSubmittingWalkIn}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              >
                {isSubmittingWalkIn ? (
                  <><Icons.Loader2 className="w-5 h-5 animate-spin" /> Đang xử lý...</>
                ) : (
                  <><Icons.CheckCircle2 className="w-5 h-5" /> Tạo & Đặt Lịch</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
