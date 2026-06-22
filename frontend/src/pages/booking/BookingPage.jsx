import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import BookingStepper from '../../components/booking/BookingStepper';
import ProfileCard from '../../components/booking/ProfileCard';
import PatientProfileModal from '../../components/dashboard/patient/PatientProfileModal';
import ShiftCard from '../../components/booking/ShiftCard';
import { getPatientsByAccountId, createPatient } from '../../services/patientService';
import { getSpecialties } from '../../services/specialtyService';
import { getDoctors, getDoctorById } from '../../services/doctorService';
import { createAppointment, getAllAppointments } from '../../services/appointmentService';
import { BASE_URL } from '../../services/apiClient';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BookingPage = ({ user, onGoHome }) => {
  const { t, i18n } = useTranslation(['booking', 'common']);
  const [currentStep, setCurrentStep] = useState(1);
  const [profiles, setProfiles] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const [doctorSchedules, setDoctorSchedules] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('CASH');

  const [submitting, setSubmitting] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState(null);
  const [allAppointments, setAllAppointments] = useState([]);

  useEffect(() => {
    Promise.all([getPatientsByAccountId(user?.id), getSpecialties(), getDoctors(), getAllAppointments()])
      .then(([patientData, specialtyData, doctorData, apptsData]) => {
        setProfiles(patientData);
        setSpecialties(specialtyData);
        setDoctors(doctorData);
        setAllAppointments(apptsData || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading booking data:', err);
        setLoading(false);
      });
  }, [user?.id]);

  const handleAddProfileSuccess = (savedProfile) => {
    setProfiles((prev) => [...prev, savedProfile]);
    setSelectedProfileId(savedProfile.id);
  };

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

  const handleSelectDoctor = (id) => {
    setSelectedDoctorId(id);
    setSelectedTimeSlot(null);
  };

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

      if (dateStr !== currentDateStr) {
        return 'NORMAL';
      }

      const currentMinutes = today.getHours() * 60 + today.getMinutes();

      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);

      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      if (currentMinutes >= endMinutes) {
        return 'EXPIRED';
      } else if (currentMinutes > startMinutes + 20) {
        return 'LATE_ALLOWED';
      }
    } catch (e) {
      console.error('Error computing shift status:', e);
    }

    return 'NORMAL';
  };

  const hasLateAllowedShift = (doc, dateStr) => {
    if (!doc.doctorSchedules) return false;
    return doc.doctorSchedules.some(sched => {
      if (sched.date !== dateStr) return false;
      const status = checkShiftStatus(dateStr, sched.shift?.startTime, sched.shift?.endTime);
      return status === 'LATE_ALLOWED';
    });
  };

  const formatSelectedDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
      const dayName = date.toLocaleDateString(locale, { weekday: 'long' });
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${dayName}, ${day}/${month}`;
    } catch (e) {
      return dateString;
    }
  };

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

  const availableShifts = doctorSchedules.filter(
    (schedule) => schedule.date === selectedDate && schedule.doctorProfileId === selectedDoctorId
  ).map(schedule => {
    const bookedCount = allAppointments.filter(a =>
      a.doctorProfileId === selectedDoctorId &&
      a.appointmentDate === selectedDate &&
      a.appointmentTime >= schedule.shift?.startTime &&
      a.appointmentTime <= schedule.shift?.endTime &&
      a.status !== 'CANCELLED'
    ).length;
    return { ...schedule, bookedCount, isFull: bookedCount >= (schedule.maxPatients || 5) };
  });

  const handleConfirmBooking = () => {
    if (!selectedTimeSlot) return;
    const startTime = selectedTimeSlot.split(' - ')[0] + ':00';

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
          alert(t('booking:alert_booking_error'));
        }
      })
      .catch((err) => {
        setSubmitting(false);
        console.error('Booking error:', err);
        alert(t('booking:alert_server_error'));
      });
  };

  const selectedProfile = profiles.find(p => p.id === selectedProfileId);
  const selectedSpecialty = specialties.find(s => s.id === selectedSpecialtyId);
  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 font-semibold text-lg animate-pulse">{t('booking:loading')}</p>
        </div>
      </div>
    );
  }

  const handleGoBack = () => {
    if (currentStep === 4) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (selectedTimeSlot) {
        setSelectedTimeSlot(null);
      } else if (selectedDate) {
        setSelectedDate(null);
      } else if (selectedDoctorId) {
        setSelectedDoctorId(null);
      } else if (selectedSpecialtyId) {
        setSelectedSpecialtyId(null);
      } else {
        setCurrentStep(1);
      }
    } else if (currentStep === 1) {
      onGoHome();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-4 md:py-6">
      <div className="max-w-4xl mx-auto px-4">

        <div className="text-center mb-4 space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">
            {t('booking:page_title')}
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-sm md:text-base">
            {t('booking:page_subtitle')}
          </p>
        </div>

        <BookingStepper currentStep={currentStep} />

        {/* STEP 1: SELECT PATIENT PROFILE */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{t('booking:profiles_title')}</h2>
                <p className="text-sm text-gray-400 mt-1">{t('booking:profiles_subtitle')}</p>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow flex items-center justify-center gap-2 shrink-0"
              >
                <Icons.Plus className="w-4 h-4" /> {t('booking:new_profile_btn')}
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800">{t('booking:profiles_list')}</h3>

              {profiles.length === 0 ? (
                <div className="text-center py-10 bg-white border border-dashed border-gray-200 rounded-2xl text-gray-400 font-medium">
                  {t('booking:no_profiles')}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <button
                onClick={handleGoBack}
                className="px-6 py-3 bg-white text-gray-600 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer"
              >
                {t('booking:back_btn')}
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
                {t('booking:continue_select')}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT SPECIALTY, DOCTOR & SCHEDULE */}
        {currentStep === 2 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 flex flex-wrap items-center justify-between gap-2">
              <span>{t('booking:examining_for')} <span className="text-blue-600 font-bold">{selectedProfile?.fullName || selectedProfile?.name}</span></span>
              <div className="flex gap-2">
                {selectedSpecialty && (
                  <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200 uppercase tracking-wider">
                    {t('booking:specialty_label')} {selectedSpecialty.name}
                  </span>
                )}
                {selectedDate && (
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 uppercase tracking-wider">
                    {t('booking:date_label')} {formatSelectedDate(selectedDate)}
                  </span>
                )}
              </div>
            </h3>

            {/* 2.1: SELECT SPECIALTY */}
            {!selectedSpecialtyId && (
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 text-sm md:text-base">{t('booking:step_select_specialty')}</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {specialties.map((spec) => {
                    const IconComponent = Icons[spec.icon] || Icons.Activity;
                    return (
                      <div
                        key={spec.id}
                        onClick={() => handleSelectSpecialty(spec.id)}
                        className="p-3 bg-white border-2 border-gray-100 rounded-xl flex flex-col items-center gap-2 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all hover:-translate-y-0.5 select-none"
                      >
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-gray-800 text-xs md:text-sm text-center">{spec.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2.2: SELECT DATE */}
            {selectedSpecialtyId && !selectedDate && (
              <div className="space-y-3 flex flex-col items-center">
                <h4 className="font-bold text-gray-800 text-sm md:text-base self-start">{t('booking:step_select_date')}</h4>
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

            {/* 2.3: SELECT DOCTOR */}
            {selectedSpecialtyId && selectedDate && !selectedDoctorId && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-gray-800 text-sm md:text-base">{t('booking:step_select_doctor')}</h4>
                </div>

                {doctors.filter(doc =>
                  doc.specialtyId === selectedSpecialtyId &&
                  doc.doctorSchedules &&
                  doc.doctorSchedules.some(schedule => schedule.date === selectedDate)
                ).length === 0 ? (
                  <p className="text-sm text-amber-600 font-medium bg-amber-50 border border-amber-100 rounded-xl p-3">
                    {t('booking:no_doctor_on_date')}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                          className="p-3 bg-white border-2 border-gray-100 rounded-xl flex items-center gap-3 hover:border-blue-500 hover:shadow-sm cursor-pointer transition-all hover:-translate-y-0.5 select-none"
                        >
                          <div className="w-12 h-12 bg-blue-50 rounded-full overflow-hidden flex items-center justify-center text-xl shrink-0 font-bold text-blue-500 border border-blue-100 relative">
                            {imageUrl ? (
                              <img src={imageUrl} alt={doc.fullName} className="w-full h-full object-cover" />
                            ) : (
                              <span>🩺</span>
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <h5 className="font-bold text-gray-900 text-sm">{doc.fullName}</h5>
                            <p className="text-xs text-gray-400 font-semibold">{t('booking:experience')} <span className="text-emerald-600 font-bold">{doc.experienceYears || 0} {t('common:years_unit')}</span></p>
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
                              <span className="text-yellow-400">★</span>
                              <span className="font-bold text-gray-700">4.9</span>
                              {t('booking:reviews_fake')}
                              {hasLateAllowedShift(doc, selectedDate) && (
                                <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 ml-1">
                                  {t('booking:late_allowed')}
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

            {/* 2.4: SELECT SHIFT */}
            {selectedSpecialtyId && selectedDate && selectedDoctorId && (
              <div className="space-y-4">
                <div className="p-3 bg-blue-50/40 border border-blue-100 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full overflow-hidden flex items-center justify-center text-lg font-bold shrink-0 relative">
                      {selectedDoctor?.avatarUrl ? (
                        <img src={`${BASE_URL}${selectedDoctor.avatarUrl}`} alt={selectedDoctor.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <span>🩺</span>
                      )}
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-900 text-sm">{selectedDoctor?.fullName}</h5>
                      <p className="text-[11px] text-gray-500 font-semibold mt-0.5">
                        {t('booking:specialty_label')} {selectedSpecialty?.name} • {t('booking:experience')} <span className="text-emerald-600 font-bold">{selectedDoctor?.experienceYears || 0} {t('common:years_unit')}</span>
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
                    {t('booking:change_doctor')}
                  </button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider">{t('booking:step_select_shift')}</h4>
                  {availableShifts.length === 0 ? (
                    <p className="text-sm text-amber-600 font-medium bg-amber-50 border border-amber-100 rounded-xl p-3">
                      {t('booking:no_shift')}
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
                              if (status !== 'EXPIRED' && !sched.isFull) {
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

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <button
                onClick={handleGoBack}
                className="px-6 py-3 bg-white text-gray-600 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer"
              >
                {t('booking:back_btn')}
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
                {t('booking:confirm_booking')}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIRM & PAYMENT */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                <Icons.CheckCircle className="text-blue-600 w-5 h-5" />
                <span>{t('booking:confirm_title')}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-gray-200/60 pb-1.5">
                    <Icons.User className="w-4 h-4 text-gray-400" /> {t('booking:patient_info')}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">{t('booking:patient_name')}</span> <span className="font-bold text-gray-700">{selectedProfile?.fullName || selectedProfile?.name}</span></p>
                    <p><span className="text-gray-400">{t('booking:patient_phone')}</span> <span className="font-semibold text-gray-700">{selectedProfile?.phone}</span></p>
                    <p><span className="text-gray-400">{t('booking:patient_relation')}</span> <span className="font-semibold text-gray-700">{t(`common:relation.${selectedProfile?.relationship?.toLowerCase()}`, t('common:relation.self'))}</span></p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-gray-200/60 pb-1.5">
                    <Icons.Stethoscope className="w-4 h-4 text-gray-400" /> {t('booking:appointment_info')}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">{t('booking:doctor_label')}</span> <span className="font-bold text-blue-600">{selectedDoctor?.fullName}</span></p>
                    <p><span className="text-gray-400">{t('booking:specialty')}</span> <span className="font-semibold text-gray-700">{selectedSpecialty?.name}</span></p>
                    <p><span className="text-gray-400">{t('booking:appointment_time')}</span> <span className="font-bold text-gray-800 bg-blue-50 px-2 py-0.5 rounded text-xs">{selectedTimeSlot}</span> <span className="font-semibold text-gray-700">{t('booking:date_on')} {formatSelectedDate(selectedDate)}</span></p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl flex justify-between items-center text-sm md:text-base">
                <span className="font-bold text-gray-700">{t('booking:service_fee')}</span>
                <span className="font-extrabold text-emerald-600 text-base">{t('common:fee')}</span>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">{t('booking:payment_method_title')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentMethod('CASH')}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 select-none ${
                      paymentMethod === 'CASH'
                        ? 'border-blue-600 bg-blue-50/10'
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg flex items-center justify-center shrink-0 ${
                      paymentMethod === 'CASH' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Icons.Banknote className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5 text-left">
                      <h5 className="font-bold text-gray-800 text-sm">{t('booking:cash_title')}</h5>
                      <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                        {t('booking:cash_desc')}
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('VNPAY')}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 select-none ${
                      paymentMethod === 'VNPAY'
                        ? 'border-blue-600 bg-blue-50/10'
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg flex items-center justify-center shrink-0 ${
                      paymentMethod === 'VNPAY' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Icons.CreditCard className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5 text-left">
                      <h5 className="font-bold text-gray-800 text-sm">{t('booking:vnpay_title')}</h5>
                      <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                        {t('booking:vnpay_desc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={handleGoBack}
                disabled={submitting}
                className="px-6 py-3 bg-white text-gray-600 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('booking:back_btn')}
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={submitting}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-200 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? t('booking:processing') : t('booking:confirm_booking')}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: BOOKING SUCCESSFUL */}
        {currentStep === 4 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-8 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto animate-bounce">
              ✓
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-gray-900">{t('booking:success_title')}</h3>
              <p className="text-gray-500 text-sm md:text-base">
                {t('booking:success_desc')} <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {createdAppointment?.qrCode || 'HT-928347'}
                </span>
              </p>
            </div>

            <div className="max-w-md mx-auto bg-gray-50 rounded-2xl p-6 border border-gray-100 text-left space-y-3 text-sm">
              <h4 className="font-bold text-gray-800 border-b border-gray-200 pb-2">{t('booking:success_summary')}</h4>
              <p><span className="text-gray-400">{t('booking:patient_name')}</span> <span className="font-semibold text-gray-700">{selectedProfile?.fullName || selectedProfile?.name}</span></p>
              <p><span className="text-gray-400">{t('booking:patient_phone')}</span> <span className="font-semibold text-gray-700">{selectedProfile?.phone}</span></p>
              <p><span className="text-gray-400">{t('booking:doctor_label')}</span> <span className="font-semibold text-blue-600">{selectedDoctor?.fullName}</span></p>
              <p><span className="text-gray-400">{t('booking:specialty')}</span> <span className="font-semibold text-gray-700">{selectedSpecialty?.name}</span></p>
              <p><span className="text-gray-400">{t('booking:appointment_time')}</span> <span className="font-semibold text-gray-700">{selectedTimeSlot} - {formatSelectedDate(selectedDate)}</span></p>
              <p><span className="text-gray-400">{t('booking:payment_method_label')}</span> <span className="font-bold text-gray-700">
                {paymentMethod === 'CASH' ? t('booking:success_payment_cash') : t('booking:success_payment_vnpay')}
              </span></p>
            </div>

            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              {t('booking:success_note')}
            </p>

            <div className="pt-4">
              <button
                onClick={() => {
                  onGoHome();
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
                {t('booking:back_home')}
              </button>
            </div>
          </div>
        )}

      </div>

      <PatientProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onSuccess={handleAddProfileSuccess}
      />
    </div>
  );
};

export default BookingPage;
