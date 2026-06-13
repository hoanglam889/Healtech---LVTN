import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import BookingStepper from '../../components/booking/BookingStepper';
import ProfileCard from '../../components/booking/ProfileCard';
import ProfileForm from '../../components/booking/ProfileForm';
import ShiftCard from '../../components/booking/ShiftCard';
import { getPatientsByAccountId, createPatient } from '../../services/patientService';
import { getSpecialties } from '../../services/specialtyService';
import { getDoctors, getDoctorById } from '../../services/doctorService';
import { createAppointment } from '../../services/appointmentService';
import { BASE_URL } from '../../services/apiClient';
import * as Icons from 'lucide-react';

const BookingPage = ({ user, onGoHome }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profiles, setProfiles] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfileId, setSelectedProfileId] = useState(null);

  // States phục vụ chọn lịch trình ở Bước 2
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // Lưu danh sách lịch trực thực tế của bác sĩ được chọn
  const [doctorSchedules, setDoctorSchedules] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  // Phương thức thanh toán dự kiến
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  // Trạng thái gửi dữ liệu lên server
  const [submitting, setSubmitting] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState(null);

  // Load toàn bộ dữ liệu từ các APIs
  useEffect(() => {
    Promise.all([getPatientsByAccountId(user?.id), getSpecialties(), getDoctors()])
      .then(([patientData, specialtyData, doctorData]) => {
        setProfiles(patientData);
        setSpecialties(specialtyData);
        setDoctors(doctorData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi tải dữ liệu đặt lịch:', err);
        setLoading(false);
      });
  }, [user?.id]);

  // Thêm hồ sơ mới vào danh sách qua API
  const handleAddProfile = (newProfileData) => {
    createPatient(newProfileData)
      .then((savedProfile) => {
        setProfiles((prev) => [...prev, savedProfile]);
        setSelectedProfileId(savedProfile.id); // Tự động chọn hồ sơ vừa tạo
      })
      .catch((err) => {
        console.error('Lỗi khi lưu hồ sơ bệnh nhân:', err);
        alert('Có lỗi xảy ra khi lưu hồ sơ. Vui lòng thử lại.');
      });
  };

  // Reset các lựa chọn lịch khám khi đổi chuyên khoa và lọc toàn bộ lịch trực thuộc khoa
  const handleSelectSpecialty = (id) => {
    setSelectedSpecialtyId(id);
    setSelectedDoctorId(null);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    
    if (id) {
      const specialtyDoctors = doctors.filter(doc => doc.specialtyId === id);
      const allSchedules = specialtyDoctors.reduce((acc, doc) => {
        if (doc.doctorSchedules) {
          const docSchedulesWithDoc = doc.doctorSchedules.map(schedule => ({
            ...schedule,
            doctor: doc
          }));
          return [...acc, ...docSchedulesWithDoc];
        }
        return acc;
      }, []);
      setDoctorSchedules(allSchedules);
    } else {
      setDoctorSchedules([]);
    }
  };

  // Reset lựa chọn giờ khám khi đổi bác sĩ
  const handleSelectDoctor = (id) => {
    setSelectedDoctorId(id);
    setSelectedTimeSlot(null);
  };

  // Kiểm tra trạng thái ca trực so với giờ hiện hành
  const checkShiftStatus = (dateStr, startTime, endTime) => {
    if (!dateStr || !startTime || !endTime) {
      return 'NORMAL';
    }
    
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const currentDateStr = `${year}-${month}-${day}`;

      // Nếu không trùng ngày hiện hành, ca khám luôn bình thường
      if (dateStr !== currentDateStr) {
        return 'NORMAL';
      }

      // Đổi giờ hiện hành và giờ ca trực ra phút để dễ so sánh
      const currentMinutes = today.getHours() * 60 + today.getMinutes();
      
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);
      
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      if (currentMinutes >= endMinutes) {
        return 'EXPIRED'; // Đã quá giờ kết thúc
      } else if (currentMinutes > startMinutes + 20) {
        return 'LATE_ALLOWED'; // Sau ca bắt đầu 20 phút nhưng chưa hết ca
      }
    } catch (e) {
      console.error('Lỗi khi tính toán thời gian ca trực:', e);
    }
    
    return 'NORMAL';
  };

  // Kiểm tra bác sĩ có ca nào nhận khám muộn trong ngày không
  const hasLateAllowedShift = (doc, dateStr) => {
    if (!doc.doctorSchedules) return false;
    return doc.doctorSchedules.some(sched => {
      if (sched.date !== dateStr) return false;
      const status = checkShiftStatus(dateStr, sched.shift?.startTime, sched.shift?.endTime);
      return status === 'LATE_ALLOWED';
    });
  };

  // Hàm định dạng ngày chọn hiển thị tiếng Việt
  const formatSelectedDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const dayName = days[date.getDay()];
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${dayName}, ${day}/${month}`;
    } catch (e) {
      return dateString;
    }
  };

  // Kiểm tra ngày khả dụng (không ở quá khứ và có bác sĩ thuộc khoa làm việc)
  const isDateAvailable = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tileDate = new Date(date);
    tileDate.setHours(0, 0, 0, 0);
    if (tileDate < today) {
      return false;
    }

    const year = tileDate.getFullYear();
    const month = String(tileDate.getMonth() + 1).padStart(2, '0');
    const day = String(tileDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return doctorSchedules.some(schedule => schedule.date === dateStr);
  };

  // Lọc các ca khám khả dụng cho ngày và bác sĩ được chọn
  const availableShifts = doctorSchedules.filter(
    (schedule) => schedule.date === selectedDate && schedule.doctorProfileId === selectedDoctorId
  );

  // Gửi thông tin đặt lịch hẹn lên Backend API
  const handleConfirmBooking = () => {
    if (!selectedTimeSlot) return;
    const startTime = selectedTimeSlot.split(' - ')[0] + ':00'; // Đưa về định dạng "HH:MM:SS"

    const appointmentData = {
      patientId: selectedProfileId,
      doctorProfileId: selectedDoctorId,
      appointmentDate: selectedDate,
      appointmentTime: startTime,
      paymentMethod: paymentMethod
    };

    setSubmitting(true);
    createAppointment(appointmentData)
      .then((res) => {
        setSubmitting(false);
        if (res.success || res.appointment) {
          setCreatedAppointment(res.appointment);
          setCurrentStep(4);
        } else {
          alert('Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.');
        }
      })
      .catch((err) => {
        setSubmitting(false);
        console.error('Lỗi đặt lịch khám:', err);
        alert('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
      });
  };

  // Lấy thông tin đã chọn để hiển thị
  const selectedProfile = profiles.find(p => p.id === selectedProfileId);
  const selectedSpecialty = specialties.find(s => s.id === selectedSpecialtyId);
  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 font-semibold text-lg animate-pulse">Đang tải dữ liệu đặt lịch...</p>
        </div>
      </div>
    );
  }

  // Hàm lùi bước thông minh theo ngữ cảnh lịch sử
  const handleGoBack = () => {
    if (currentStep === 4) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (selectedTimeSlot) {
        setSelectedTimeSlot(null); // Lùi: Xóa giờ khám
      } else if (selectedDate) {
        setSelectedDate(null); // Lùi: Xóa ngày khám
      } else if (selectedDoctorId) {
        setSelectedDoctorId(null); // Lùi: Xóa bác sĩ
      } else if (selectedSpecialtyId) {
        setSelectedSpecialtyId(null); // Lùi: Xóa chuyên khoa
      } else {
        setCurrentStep(1); // Lùi hẳn về bước 1
      }
    } else if (currentStep === 1) {
      onGoHome();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header Trang */}
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
            Đặt Lịch Khám Bệnh Online
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-sm md:text-base">
            Giải pháp đặt lịch nhanh chóng, không lo xếp hàng chờ đợi.
          </p>
        </div>

        {/* Thanh tiến trình */}
        <BookingStepper currentStep={currentStep} />

        {/* NỘI DUNG CÁC BƯỚC */}
        
        {/* BƯỚC 1: CHỌN HỒ SƠ BỆNH NHÂN */}
        {currentStep === 1 && (
          <div className="space-y-8">
            {/* Form thêm hồ sơ mới */}
            <ProfileForm onAddProfile={handleAddProfile} />

            {/* Danh sách hồ sơ hiện tại */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800">Danh sách hồ sơ bệnh nhân</h3>
              
              {profiles.length === 0 ? (
                <div className="text-center py-10 bg-white border border-dashed border-gray-200 rounded-2xl text-gray-400 font-medium">
                  Chưa có hồ sơ nào. Vui lòng bấm "Tạo hồ sơ mới" ở trên.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profiles.map((profile) => (
                    <ProfileCard 
                      key={profile.id}
                      profile={profile}
                      isSelected={selectedProfileId === profile.id}
                      onSelect={() => setSelectedProfileId(profile.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Các nút chuyển hướng */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
              <button 
                onClick={handleGoBack}
                className="px-6 py-3 bg-white text-gray-600 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer"
              >
                ← Quay lại
              </button>
              <button 
                onClick={() => setCurrentStep(2)}
                disabled={!selectedProfileId}
                className={`px-8 py-3 rounded-xl font-bold transition-all shadow-sm cursor-pointer ${
                  selectedProfileId 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Tiếp tục (Chọn lịch khám) →
              </button>
            </div>
          </div>
        )}

        {/* BƯỚC 2: CHỌN CHUYÊN KHOA, BÁC SĨ & LỊCH TRÌNH */}
        {currentStep === 2 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 flex flex-wrap items-center justify-between gap-2">
              <span>Khám cho: <span className="text-blue-600 font-bold">{selectedProfile?.fullName || selectedProfile?.name}</span></span>
              <div className="flex gap-2">
                {selectedSpecialty && (
                  <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200 uppercase tracking-wider">
                    Khoa: {selectedSpecialty.name}
                  </span>
                )}
                {selectedDate && (
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 uppercase tracking-wider">
                    Ngày: {formatSelectedDate(selectedDate)}
                  </span>
                )}
              </div>
            </h3>
            
            {/* 2.1: CHƯA CHỌN CHUYÊN KHOA */}
            {!selectedSpecialtyId && (
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 text-base md:text-lg">1. Vui lòng chọn chuyên khoa cần khám:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {specialties.map((spec) => {
                    const IconComponent = Icons[spec.icon] || Icons.Activity;
                    return (
                      <div 
                        key={spec.id}
                        onClick={() => handleSelectSpecialty(spec.id)}
                        className="p-5 bg-white border-2 border-gray-100 rounded-2xl flex flex-col items-center gap-3 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all hover:-translate-y-0.5 select-none"
                      >
                        <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                          <IconComponent className="w-7 h-7" />
                        </div>
                        <span className="font-bold text-gray-800 text-sm md:text-base">{spec.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2.2: ĐÃ CHỌN CHUYÊN KHOA, CẦN CHỌN NGÀY */}
            {selectedSpecialtyId && !selectedDate && (
              <div className="space-y-4 flex flex-col items-center">
                <h4 className="font-bold text-gray-800 text-base md:text-lg self-start">2. Chọn ngày khám:</h4>
                <Calendar
                  onChange={(val) => {
                    const year = val.getFullYear();
                    const month = String(val.getMonth() + 1).padStart(2, '0');
                    const day = String(val.getDate()).padStart(2, '0');
                    const dateStr = `${year}-${month}-${day}`;
                    setSelectedDate(dateStr);
                    setSelectedDoctorId(null);
                    setSelectedTimeSlot(null);
                  }}
                  value={selectedDate ? new Date(selectedDate) : null}
                  tileDisabled={({ date }) => !isDateAvailable(date)}
                />
              </div>
            )}

            {/* 2.3: ĐÃ CHỌN NGÀY, CẦN CHỌN BÁC SĨ */}
            {selectedSpecialtyId && selectedDate && !selectedDoctorId && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-gray-800 text-base md:text-lg">3. Chọn bác sĩ khám bệnh:</h4>
                </div>
                
                {doctors.filter(doc => 
                  doc.specialtyId === selectedSpecialtyId &&
                  doc.doctorSchedules &&
                  doc.doctorSchedules.some(schedule => schedule.date === selectedDate)
                ).length === 0 ? (
                  <p className="text-sm text-amber-600 font-medium bg-amber-50 border border-amber-100 rounded-xl p-3">
                    Không có bác sĩ nào thuộc chuyên khoa này có lịch trực vào ngày đã chọn.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {doctors.filter(doc => 
                      doc.specialtyId === selectedSpecialtyId &&
                      doc.doctorSchedules &&
                      doc.doctorSchedules.some(schedule => schedule.date === selectedDate)
                    ).map((doc) => {
                      const imageUrl = doc.avatarUrl ? `${BASE_URL}${doc.avatarUrl}` : null;
                      return (
                        <div 
                          key={doc.id}
                          onClick={() => handleSelectDoctor(doc.id)}
                          className="p-5 bg-white border-2 border-gray-100 rounded-2xl flex items-center gap-4 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all hover:-translate-y-0.5 select-none"
                        >
                          <div className="w-16 h-16 bg-blue-50 rounded-full overflow-hidden flex items-center justify-center text-3xl shrink-0 font-bold text-blue-500 border border-blue-100 relative">
                            {imageUrl ? (
                              <img src={imageUrl} alt={doc.fullName} className="w-full h-full object-cover" />
                            ) : (
                              <span>🩺</span>
                            )}
                          </div>
                          <div className="space-y-1">
                            <h5 className="font-bold text-gray-900 text-base">{doc.fullName}</h5>
                            <p className="text-xs text-gray-400 font-semibold">Kinh nghiệm: <span className="text-emerald-600 font-bold">{doc.experienceYears || 0} năm</span></p>
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
                              <span className="text-yellow-400">★</span> 
                              <span className="font-bold text-gray-700">4.9</span> 
                              (98 đánh giá)
                              {hasLateAllowedShift(doc, selectedDate) && (
                                <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 ml-1">
                                  ⚠️ Nhận khám muộn
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 2.4: ĐÃ CHỌN BÁC SĨ, CHỌN CA KHÁM */}
            {selectedSpecialtyId && selectedDate && selectedDoctorId && (
              <div className="space-y-6">
                {/* Tóm tắt bác sĩ đã chọn */}
                <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full overflow-hidden flex items-center justify-center text-xl font-bold shrink-0 relative">
                      {selectedDoctor?.avatarUrl ? (
                        <img src={`${BASE_URL}${selectedDoctor.avatarUrl}`} alt={selectedDoctor.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <span>🩺</span>
                      )}
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-900">{selectedDoctor?.fullName}</h5>
                      <p className="text-xs text-gray-400 font-semibold mt-0.5">
                        Khoa: {selectedSpecialty?.name} • Kinh nghiệm: <span className="text-emerald-600 font-bold">{selectedDoctor?.experienceYears || 0} năm</span>
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedDoctorId(null);
                      setSelectedTimeSlot(null);
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Đổi bác sĩ
                  </button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider">4. Chọn ca trực:</h4>
                  {availableShifts.length === 0 ? (
                    <p className="text-sm text-amber-600 font-medium bg-amber-50 border border-amber-100 rounded-xl p-3">
                      Bác sĩ không có ca trực nào khả dụng vào ngày đã chọn.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {availableShifts.map((sched) => {
                        const timeRange = `${sched.shift?.startTime?.substring(0, 5)} - ${sched.shift?.endTime?.substring(0, 5)}`;
                        const status = checkShiftStatus(selectedDate, sched.shift?.startTime, sched.shift?.endTime);
                        return (
                          <ShiftCard
                            key={sched.id}
                            schedule={sched}
                            status={status}
                            isSelected={selectedTimeSlot === timeRange}
                            onSelect={() => {
                              if (status !== 'EXPIRED') {
                                setSelectedTimeSlot(timeRange);
                              }
                            }}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Các nút điều hướng */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
              <button 
                onClick={handleGoBack}
                className="px-6 py-3 bg-white text-gray-600 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer"
              >
                ← Quay lại
              </button>
              <button 
                onClick={() => setCurrentStep(3)}
                disabled={!selectedSpecialtyId || !selectedDoctorId || !selectedDate || !selectedTimeSlot}
                className={`px-8 py-3 rounded-xl font-bold transition-all shadow-sm cursor-pointer ${
                  selectedSpecialtyId && selectedDoctorId && selectedDate && selectedTimeSlot
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Xác nhận đặt lịch khám →
              </button>
            </div>
          </div>
        )}

        {/* BƯỚC 3: XÁC NHẬN THÔNG TIN & PHƯƠNG THỨC THANH TOÁN */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 flex items-center gap-2">
                <Icons.CheckCircle className="text-blue-600 w-5 h-5" />
                <span>Xác nhận thông tin đăng ký khám</span>
              </h3>

              {/* Tóm tắt thông tin */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-gray-200/60 pb-1.5">
                    <Icons.User className="w-4 h-4 text-gray-400" /> Thông tin bệnh nhân
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">Họ tên:</span> <span className="font-bold text-gray-700">{selectedProfile?.fullName || selectedProfile?.name}</span></p>
                    <p><span className="text-gray-400">Điện thoại:</span> <span className="font-semibold text-gray-700">{selectedProfile?.phone}</span></p>
                    <p><span className="text-gray-400">Quan hệ:</span> <span className="font-semibold text-gray-700">{selectedProfile?.relationship || 'Bản thân'}</span></p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-gray-200/60 pb-1.5">
                    <Icons.Stethoscope className="w-4 h-4 text-gray-400" /> Thông tin lịch hẹn
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">Bác sĩ khám:</span> <span className="font-bold text-blue-600">{selectedDoctor?.fullName}</span></p>
                    <p><span className="text-gray-400">Chuyên khoa:</span> <span className="font-semibold text-gray-700">{selectedSpecialty?.name}</span></p>
                    <p><span className="text-gray-400">Thời gian:</span> <span className="font-bold text-gray-800 bg-blue-50 px-2 py-0.5 rounded text-xs">{selectedTimeSlot}</span> <span className="font-semibold text-gray-700">ngày {formatSelectedDate(selectedDate)}</span></p>
                  </div>
                </div>
              </div>

              {/* Phí khám */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex justify-between items-center text-sm md:text-base">
                <span className="font-bold text-gray-700">Giá dịch vụ khám:</span>
                <span className="font-extrabold text-emerald-600 text-lg">150.000 đ</span>
              </div>

              {/* Chọn phương thức thanh toán */}
              <div className="space-y-3">
                <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Chọn phương thức thanh toán dự kiến:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Trực tiếp tại quầy */}
                  <div
                    onClick={() => setPaymentMethod('CASH')}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 select-none ${
                      paymentMethod === 'CASH'
                        ? 'border-blue-600 bg-blue-50/10'
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className={`p-3 rounded-xl flex items-center justify-center shrink-0 ${
                      paymentMethod === 'CASH' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Icons.Banknote className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 text-left">
                      <h5 className="font-bold text-gray-800 text-sm md:text-base">Thanh toán tại quầy</h5>
                      <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                        Đóng tiền mặt hoặc quẹt thẻ trực tiếp khi đến quầy lễ tân bệnh viện để nhận phiếu khám.
                      </p>
                    </div>
                  </div>

                  {/* VNPay Online */}
                  <div
                    onClick={() => setPaymentMethod('VNPAY')}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 select-none ${
                      paymentMethod === 'VNPAY'
                        ? 'border-blue-600 bg-blue-50/10'
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className={`p-3 rounded-xl flex items-center justify-center shrink-0 ${
                      paymentMethod === 'VNPAY' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Icons.CreditCard className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 text-left">
                      <h5 className="font-bold text-gray-800 text-sm md:text-base">Thanh toán trực tuyến (VNPay)</h5>
                      <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                        Thanh toán ngay bằng ví điện tử VNPay hoặc QR ngân hàng để xác thực nhanh và giảm thời gian chờ đợi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Các nút điều hướng */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={handleGoBack}
                disabled={submitting}
                className="px-6 py-3 bg-white text-gray-600 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Quay lại
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={submitting}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-200 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? 'Đang xử lý...' : 'Xác nhận đặt lịch →'}
              </button>
            </div>
          </div>
        )}

        {/* BƯỚC 4: ĐẶT LỊCH THÀNH CÔNG */}
        {currentStep === 4 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 md:p-12 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto animate-bounce">
              ✓
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-gray-900">Đặt Lịch Thành Công!</h3>
              <p className="text-gray-500 text-sm md:text-base">
                Mã số phiếu khám của bạn là: <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {createdAppointment?.qrCode || 'HT-928347'}
                </span>
              </p>
            </div>

            <div className="max-w-md mx-auto bg-gray-50 rounded-2xl p-6 border border-gray-100 text-left space-y-3 text-sm">
              <h4 className="font-bold text-gray-800 border-b border-gray-200 pb-2">Thông tin đặt hẹn</h4>
              <p><span className="text-gray-400">Bệnh nhân:</span> <span className="font-semibold text-gray-700">{selectedProfile?.fullName || selectedProfile?.name}</span></p>
              <p><span className="text-gray-400">Điện thoại:</span> <span className="font-semibold text-gray-700">{selectedProfile?.phone}</span></p>
              <p><span className="text-gray-400">Bác sĩ khám:</span> <span className="font-semibold text-blue-600">{selectedDoctor?.fullName}</span></p>
              <p><span className="text-gray-400">Chuyên khoa:</span> <span className="font-semibold text-gray-700">{selectedSpecialty?.name}</span></p>
              <p><span className="text-gray-400">Thời gian:</span> <span className="font-semibold text-gray-700">{selectedTimeSlot} - {formatSelectedDate(selectedDate)}</span></p>
              <p><span className="text-gray-400">Phương thức thanh toán:</span> <span className="font-bold text-gray-700">
                {paymentMethod === 'CASH' ? 'Thanh toán tại quầy (Chưa thanh toán)' : 'Cổng VNPay (Đã thanh toán - Giả lập)'}
              </span></p>
            </div>

            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Thông tin chi tiết cùng số thứ tự hàng đợi đã được gửi vào số điện thoại đăng ký. Vui lòng có mặt trước ca khám 15 phút.
            </p>

            <div className="pt-4">
              <button 
                onClick={() => {
                  onGoHome();
                  // Reset tất cả state khi quay về trang chủ
                  setCurrentStep(1);
                  setSelectedSpecialtyId(null);
                  setSelectedDoctorId(null);
                  setSelectedDate(null);
                  setSelectedTimeSlot(null);
                  setSelectedProfileId(null);
                  setPaymentMethod('CASH');
                  setCreatedAppointment(null);
                }}
                className="px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm hover:shadow cursor-pointer"
              >
                Trở về Trang chủ
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookingPage;
