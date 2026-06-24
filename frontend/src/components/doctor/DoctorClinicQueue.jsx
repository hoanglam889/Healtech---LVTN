import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { getAllAppointments, updateAppointment } from '../../services/appointmentService';
import { getAllServices, getAppointmentServices, addAppointmentService, removeAppointmentService } from '../../services/clinicService';

export default function DoctorClinicQueue({ staffUser }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Trạng thái ca khám hiện tại
  const [examiningPatient, setExaminingPatient] = useState(null);
  
  // Tabs & Cửa sổ trượt (Drawer)
  const [activeTab, setActiveTab] = useState('exam'); // 'history' | 'exam'
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Dịch vụ
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loadingService, setLoadingService] = useState(false);

  // Form bệnh án của Bác sĩ
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  
  const [notification, setNotification] = useState(null);

  // Lấy danh mục dịch vụ gốc
  const loadAvailableServices = async () => {
    try {
      const data = await getAllServices();
      setAvailableServices(data || []);
    } catch (err) {
      console.error('Lỗi khi tải dịch vụ:', err);
    }
  };

  // Lấy dịch vụ đã kê của ca khám
  const loadSelectedServices = async (appointmentId) => {
    try {
      const data = await getAppointmentServices(appointmentId);
      setSelectedServices(data || []);
    } catch (err) {
      console.error('Lỗi khi tải dịch vụ của bệnh nhân:', err);
    }
  };

  // Load appointments
  const loadAppointments = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const data = await getAllAppointments();
      setAppointments(data || []);
      
      // Tìm ca bệnh đang khám của bác sĩ này
      const currentExam = data.find(appt => 
        appt.status === 'EXAMINING' && 
        (!staffUser?.doctorProfileId || appt.doctorProfile?.id === staffUser.doctorProfileId)
      );
      if (currentExam) {
        setExaminingPatient((prev) => {
          // Nếu đổi ca khám thì reset form và tải lại dịch vụ
          if (!prev || prev.id !== currentExam.id) {
            setSymptoms(currentExam.medicalRecords?.symptoms || '');
            setDiagnosis(currentExam.medicalRecords?.diagnosis || '');
            setNotes(currentExam.medicalRecords?.notes || '');
            loadSelectedServices(currentExam.id); // Tải dịch vụ
          }
          return currentExam;
        });
      } else {
        setExaminingPatient(null);
        setSelectedServices([]);
      }
    } catch (err) {
      console.error('Lỗi khi tải hàng đợi:', err);
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments(true);
    loadAvailableServices();

    const interval = setInterval(() => {
      loadAppointments(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Get waiting list
  const getWaitingList = () => {
    return appointments
      .filter(appt => 
        appt.status === 'WAITING' && 
        appt.priorityScore !== null && 
        appt.priorityScore !== undefined &&
        (!staffUser?.doctorProfileId || appt.doctorProfile?.id === staffUser.doctorProfileId)
      )
      .sort((a, b) => {
        const scoreA = a.priorityScore || 0;
        const scoreB = b.priorityScore || 0;
        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }
        return a.id - b.id;
      });
  };

  // Gọi khám
  const handleStartExam = async (appt) => {
    if (examiningPatient) {
      showToast('Bạn đang có một ca chẩn đoán chưa hoàn tất!', 'warning');
      return;
    }
    setLoading(true);
    try {
      const updated = await updateAppointment(appt.id, { status: 'EXAMINING' });
      setExaminingPatient(updated);
      setSymptoms('');
      setDiagnosis('');
      setNotes('');
      setActiveTab('exam');
      loadSelectedServices(updated.id);
      showToast(`Mời bệnh nhân ${appt.patient?.fullName} vào chẩn đoán!`, 'success');
      loadAppointments();
    } catch (err) {
      console.error(err);
      showToast('Lỗi khi mời bệnh nhân', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Hoàn thành khám
  const handleCompleteExam = async (e) => {
    e.preventDefault();
    if (!examiningPatient) return;
    if (!symptoms.trim() || !diagnosis.trim()) {
      showToast('Vui lòng nhập triệu chứng lâm sàng và chẩn đoán y khoa!', 'error');
      return;
    }

    setLoading(true);
    try {
      await updateAppointment(examiningPatient.id, {
        status: 'DONE',
        symptoms,
        diagnosis,
        notes
      });
      showToast(`Đã lưu bệnh án cho ${examiningPatient.patient?.fullName}!`, 'success');
      setExaminingPatient(null);
      setSymptoms('');
      setDiagnosis('');
      setNotes('');
      setSelectedServices([]);
      loadAppointments();
    } catch (err) {
      console.error(err);
      showToast('Lỗi khi hoàn thành khám', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Logic Thêm/Xóa Dịch vụ
  const handleAddService = async (serviceId) => {
    setLoadingService(true);
    try {
      await addAppointmentService({
        appointmentId: examiningPatient.id,
        serviceId: serviceId,
        quantity: 1
      });
      showToast('Đã thêm dịch vụ thành công', 'success');
      loadSelectedServices(examiningPatient.id);
    } catch (err) {
      showToast(err.response?.data?.message || 'Lỗi khi thêm dịch vụ', 'error');
    } finally {
      setLoadingService(false);
    }
  };

  const handleRemoveService = async (id) => {
    setLoadingService(true);
    try {
      await removeAppointmentService(id);
      showToast('Đã xóa dịch vụ', 'success');
      loadSelectedServices(examiningPatient.id);
    } catch (err) {
      showToast('Lỗi khi xóa dịch vụ', 'error');
    } finally {
      setLoadingService(false);
    }
  };

  const waitingList = getWaitingList();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative overflow-hidden">
      
      {/* POPUP NOTIFICATION */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-white font-bold border transition-all animate-[fadeIn_0.2s_ease-out] ${
          notification.type === 'success' ? 'bg-emerald-500 border-emerald-600' : 
          notification.type === 'warning' ? 'bg-amber-500 border-amber-600' : 'bg-rose-500 border-rose-600'
        }`}>
          <Icons.Activity className="w-5 h-5 animate-pulse" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* PANEL TRÁI (COL-4): DANH SÁCH BỆNH NHÂN CHỜ KHÁM */}
      <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-100 shadow-xl flex flex-col overflow-hidden max-h-[calc(100vh-160px)]">
        <div className="p-6 bg-gray-50/70 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div>
            <h3 className="font-extrabold text-gray-900 text-base">Hàng đợi Chờ khám</h3>
            <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mt-1 block">Bấm nút để gọi vào khám</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => loadAppointments(true)}
              disabled={loading}
              className="p-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-500 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
            >
              <Icons.RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <span className="bg-blue-100 text-blue-600 border border-blue-200 font-extrabold px-3 py-1.5 rounded-xl text-xs">
              {waitingList.length} Đợi
            </span>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {waitingList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
              <Icons.Inbox className="w-10 h-10 text-gray-300 mb-3" />
              <p className="text-xs font-bold">Hiện không có bệnh nhân chờ!</p>
            </div>
          ) : (
            waitingList.map((appt, idx) => (
              <div key={appt.id} className="p-4 bg-gray-50/60 hover:bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-start transition-all">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-blue-100 text-blue-700 text-[10px] font-extrabold rounded-md flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <p className="font-extrabold text-sm text-gray-900 leading-none">{appt.patient?.fullName}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold mt-2 block">
                    Hẹn giờ: {appt.appointmentTime?.substring(0, 5)} | SĐT: {appt.patient?.phone}
                  </span>
                </div>
                <button
                  onClick={() => handleStartExam(appt)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                >
                  <span>Mời khám</span>
                  <Icons.ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* PANEL PHẢI (COL-8): CHI TIẾT KHÁM BỆNH & TABS */}
      <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden max-h-[calc(100vh-160px)] flex flex-col">
        {examiningPatient ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* TABS HEADER */}
            <div className="flex border-b border-purple-100 bg-purple-50/30 shrink-0">
              <button 
                type="button"
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-4 text-sm font-extrabold transition-colors border-b-2 flex justify-center items-center gap-2 ${activeTab === 'history' ? 'border-purple-600 text-purple-700 bg-purple-50/50' : 'border-transparent text-gray-400 hover:text-purple-600'}`}
              >
                <Icons.History className="w-4 h-4" />
                Lịch sử khám
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('exam')}
                className={`flex-1 py-4 text-sm font-extrabold transition-colors border-b-2 flex justify-center items-center gap-2 ${activeTab === 'exam' ? 'border-purple-600 text-purple-700 bg-purple-50/50' : 'border-transparent text-gray-400 hover:text-purple-600'}`}
              >
                <Icons.Stethoscope className="w-4 h-4" />
                Khám bệnh hôm nay
              </button>
            </div>

            {/* TAB CONTENT: LỊCH SỬ KHÁM */}
            {activeTab === 'history' && (
              <div className="flex-1 p-8 overflow-y-auto bg-gray-50/30 flex flex-col items-center justify-center text-gray-400">
                <Icons.FolderOpen className="w-12 h-12 text-gray-300 mb-4" />
                <p className="font-bold text-sm text-gray-500">Khu vực hiển thị Hồ sơ y tế</p>
                <p className="text-xs mt-1">(Tính năng đang chờ API từ Backend để hiển thị dòng thời gian)</p>
              </div>
            )}

            {/* TAB CONTENT: KHÁM BỆNH & KÊ DỊCH VỤ */}
            {activeTab === 'exam' && (
              <form onSubmit={handleCompleteExam} className="flex-1 flex flex-col overflow-hidden">
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                  
                  {/* Info Row */}
                  <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <span className="text-purple-700">👤 {examiningPatient.patient?.fullName}</span>
                    <span>• Sinh: {examiningPatient.patient?.dob ? new Date(examiningPatient.patient.dob).toLocaleDateString('vi-VN') : ''}</span>
                    <span>• {examiningPatient.patient?.gender === 'MALE' ? 'Nam' : 'Nữ'}</span>
                    <span>• SĐT: {examiningPatient.patient?.phone}</span>
                  </div>

                  {/* 2 Cột Triệu chứng / Chẩn đoán */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">1. Triệu chứng lâm sàng *</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Đau đầu, sốt cao..."
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        className="w-full bg-white border border-gray-200 outline-none p-4 rounded-2xl font-semibold text-gray-800 text-sm focus:border-purple-500 transition-all resize-none shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">2. Chẩn đoán y khoa *</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Suy nhược thần kinh..."
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        className="w-full bg-white border border-gray-200 outline-none p-4 rounded-2xl font-semibold text-gray-800 text-sm focus:border-purple-500 transition-all resize-none shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Kê Dịch vụ */}
                  <div className="space-y-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">3. Dịch vụ Cận lâm sàng</label>
                      <button 
                        type="button" 
                        onClick={() => setIsDrawerOpen(true)}
                        className="text-xs font-bold bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-purple-200 transition-colors shadow-sm"
                      >
                        <Icons.Plus className="w-3.5 h-3.5" />
                        <span>Kê dịch vụ</span>
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {selectedServices.map(item => (
                        <div key={item.id} className="bg-purple-50 border border-purple-100 text-purple-800 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2 transition-all">
                          <span>{item.service?.name}</span>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveService(item.id)}
                            className="text-purple-300 hover:text-red-500 bg-white rounded-full p-0.5 shadow-sm"
                          >
                            <Icons.X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {selectedServices.length === 0 && (
                        <span className="text-xs text-gray-400 italic">Chưa có dịch vụ nào được kê cho bệnh nhân này.</span>
                      )}
                    </div>
                  </div>

                  {/* Lời dặn */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">4. Lời dặn & Đơn thuốc (Tùy chọn)</label>
                    <textarea
                      rows={2}
                      placeholder="Ghi chú thêm..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-white border border-gray-200 outline-none p-4 rounded-2xl font-semibold text-gray-800 text-sm focus:border-purple-500 transition-all resize-none shadow-sm"
                    />
                  </div>
                </div>

                {/* Footer Submit */}
                <div className="p-6 border-t border-gray-100 flex justify-between items-center shrink-0 bg-gray-50/50">
                  <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                    <Icons.Info className="w-4 h-4 text-blue-500" />
                    <span>(*) Bắt buộc điền</span>
                  </span>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-purple-600 text-white font-extrabold px-8 py-3.5 rounded-2xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 flex items-center gap-2 text-sm cursor-pointer"
                  >
                    {loading ? <Icons.Loader className="w-5 h-5 animate-spin" /> : <Icons.CheckCircle className="w-5 h-5" />}
                    <span>Hoàn tất & Lưu bệnh án</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-gray-50/50">
            <div className="w-20 h-20 bg-purple-50 text-purple-600 border border-purple-100 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
              <Icons.Stethoscope className="w-10 h-10" />
            </div>
            <h4 className="font-extrabold text-gray-800 text-lg">Phòng Khám Đang Trống</h4>
            <p className="text-sm text-gray-400 max-w-sm mt-2 font-semibold">
              Bấm "Mời khám" ở danh sách bên trái để bắt đầu.
            </p>
          </div>
        )}
      </div>

      {/* DRAWER KÊ DỊCH VỤ (OFFCANVAS) */}
      {isDrawerOpen && (
        <div className="absolute inset-0 z-50 overflow-hidden flex justify-end">
          {/* Overlay đen */}
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsDrawerOpen(false)} 
          />
          
          {/* Panel trượt từ phải ra */}
          <div className="relative w-full max-w-sm bg-white shadow-2xl h-full flex flex-col animate-[slideInRight_0.3s_ease-out]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-purple-50/50 shrink-0">
              <h3 className="font-extrabold text-purple-900 text-base flex items-center gap-2">
                <Icons.Syringe className="w-5 h-5 text-purple-600" />
                Danh mục Dịch vụ
              </h3>
              <button type="button" onClick={() => setIsDrawerOpen(false)} className="p-2 bg-white hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-500 transition-colors shadow-sm border border-gray-100">
                <Icons.X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50/30">
              {availableServices.length === 0 ? (
                <p className="text-center text-xs text-gray-400 font-bold py-10">Không có dịch vụ nào trong hệ thống.</p>
              ) : (
                availableServices.map(srv => {
                  const isAdded = selectedServices.some(s => s.serviceId === srv.id);
                  return (
                    <div key={srv.id} className={`p-4 rounded-2xl border flex justify-between items-center transition-all shadow-sm ${isAdded ? 'bg-purple-50 border-purple-200' : 'bg-white border-gray-200 hover:border-purple-400'}`}>
                      <div>
                        <p className="font-extrabold text-sm text-gray-800">{srv.name}</p>
                        <p className="text-xs text-purple-600 font-bold mt-1">{Number(srv.price).toLocaleString()} VNĐ</p>
                      </div>
                      <button 
                        type="button"
                        disabled={isAdded || loadingService}
                        onClick={() => handleAddService(srv.id)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wide transition-colors ${isAdded ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-200'}`}
                      >
                        {isAdded ? 'Đã Kê' : '+ Thêm'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
            
            <div className="p-6 border-t border-gray-100 shrink-0 bg-white">
              <button 
                type="button" 
                onClick={() => setIsDrawerOpen(false)}
                className="w-full py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors"
              >
                Đóng Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline animation keyframes for the drawer (if tailwind config doesn't have it) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}} />
    </div>
  );
}
