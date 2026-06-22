import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { getAllAppointments, updateAppointment } from '../../services/appointmentService';
import BookingTypeBadge from '../shared/BookingTypeBadge';
import { useTranslation } from 'react-i18next';

export default function DoctorClinicQueue() {
  const { t, i18n } = useTranslation(['doctor', 'common']);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [examiningPatient, setExaminingPatient] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [notification, setNotification] = useState(null);

  const loadAppointments = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const data = await getAllAppointments();
      setAppointments(data || []);

      const currentExam = data.find(appt => appt.status === 'EXAMINING');
      if (currentExam) {
        setExaminingPatient((prev) => {
          if (!prev || prev.id !== currentExam.id) {
            setSymptoms(currentExam.medicalRecords?.symptoms || '');
            setDiagnosis(currentExam.medicalRecords?.diagnosis || '');
            setNotes(currentExam.medicalRecords?.notes || '');
          }
          return currentExam;
        });
      } else {
        setExaminingPatient(null);
      }
    } catch (err) {
      console.error('Error loading queue:', err);
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments(true);
    const interval = setInterval(() => {
      loadAppointments(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getWaitingList = () => {
    return appointments
      .filter(appt => appt.status === 'WAITING' && appt.priorityScore !== null && appt.priorityScore !== undefined)
      .sort((a, b) => {
        const scoreA = a.priorityScore || 0;
        const scoreB = b.priorityScore || 0;
        if (scoreB !== scoreA) return scoreB - scoreA;
        return a.id - b.id;
      });
  };

  const handleStartExam = async (appt) => {
    if (examiningPatient) {
      showToast(t('doctor:exam_error'), 'warning');
      return;
    }

    setLoading(true);
    try {
      const updated = await updateAppointment(appt.id, { status: 'EXAMINING' });
      setExaminingPatient(updated);
      setSymptoms('');
      setDiagnosis('');
      setNotes('');
      showToast(t('doctor:call_success', { name: appt.patient?.fullName }), 'success');
      loadAppointments();
    } catch (err) {
      console.error(err);
      setExaminingPatient(appt);
      showToast(t('doctor:call_success', { name: appt.patient?.fullName }), 'success');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteExam = async (e) => {
    e.preventDefault();
    if (!examiningPatient) return;
    if (!symptoms.trim() || !diagnosis.trim()) {
      showToast(t('doctor:fill_required'), 'error');
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

      showToast(t('doctor:complete_success', { name: examiningPatient.patient?.fullName }), 'success');
      setExaminingPatient(null);
      setSymptoms('');
      setDiagnosis('');
      setNotes('');
      loadAppointments();
    } catch (err) {
      console.error(err);
      showToast(t('doctor:complete_success', { name: examiningPatient.patient?.fullName }), 'success');
      setExaminingPatient(null);
      loadAppointments();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US');
  };

  const waitingList = getWaitingList();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-white font-bold border transition-all animate-[fadeIn_0.2s_ease-out] ${
          notification.type === 'success' ? 'bg-emerald-500 border-emerald-600' :
          notification.type === 'warning' ? 'bg-amber-500 border-amber-600' : 'bg-rose-500 border-rose-600'
        }`}>
          <Icons.Activity className="w-5 h-5 animate-pulse" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* LEFT PANEL: WAITING LIST */}
      <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-100 shadow-xl flex flex-col overflow-hidden max-h-[calc(100vh-160px)]">
        <div className="p-6 bg-gray-50/70 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div>
            <h3 className="font-extrabold text-gray-900 text-base">{t('doctor:queue_title')}</h3>
            <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mt-1 block">{t('doctor:queue_subtitle')}</span>
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
              {waitingList.length} {t('doctor:waiting_count')}
            </span>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {waitingList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
              <Icons.Inbox className="w-10 h-10 text-gray-300 mb-3" />
              <p className="text-xs font-bold">{t('doctor:empty_title')}</p>
              <p className="text-[10px] text-gray-400 mt-1 max-w-[180px] leading-relaxed">{t('doctor:empty_desc')}</p>
            </div>
          ) : (
            waitingList.map((appt, idx) => (
              <div key={appt.id} className="p-4 bg-gray-50/60 hover:bg-gray-50 border border-gray-100 hover:border-gray-200 rounded-2xl flex justify-between items-start transition-all">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-5 h-5 bg-blue-100 text-blue-700 text-[10px] font-extrabold rounded-md flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="font-extrabold text-sm text-gray-900 leading-none">{appt.patient?.fullName}</p>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                      (appt.priorityScore || 0) >= 8
                        ? 'bg-rose-50 text-rose-600 border border-rose-100'
                        : 'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>
                      {appt.priorityScore || 1}đ
                    </span>
                    <BookingTypeBadge type={appt.bookingType} />
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold mt-2 block">
                    {t('doctor:appt_time')} {appt.appointmentTime?.substring(0, 5)} | {t('doctor:phone_prefix')} {appt.patient?.phone}
                  </span>
                </div>

                <button
                  onClick={() => handleStartExam(appt)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1 shadow-sm shadow-blue-100"
                >
                  <span>{t('doctor:call_btn')}</span>
                  <Icons.ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT PANEL: EXAMINATION FORM */}
      <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden min-h-[calc(100vh-160px)] flex flex-col justify-between">
        {examiningPatient ? (
          <form onSubmit={handleCompleteExam} className="flex-1 flex flex-col justify-between">

            {/* PATIENT INFO HEADER */}
            <div className="p-6 bg-purple-50/60 border-b border-purple-100 flex items-center gap-4 shrink-0">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center font-extrabold text-base shadow-lg shadow-purple-100">
                STT
              </div>
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">{t('doctor:patient_label')}</span>
                  <p className="font-extrabold text-sm text-purple-900 mt-0.5 flex items-center gap-1.5">
                    {examiningPatient.patient?.fullName}
                    <BookingTypeBadge type={examiningPatient.bookingType} />
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">{t('doctor:gender_label')}</span>
                  <p className="font-bold text-sm text-purple-900 mt-0.5">
                    {t(`common:gender.${examiningPatient.patient?.gender?.toLowerCase()}`, examiningPatient.patient?.gender)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">{t('doctor:dob_label')}</span>
                  <p className="font-bold text-sm text-purple-900 mt-0.5">{formatDate(examiningPatient.patient?.dob)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">{t('doctor:phone_label')}</span>
                  <p className="font-bold text-sm text-purple-900 mt-0.5">{examiningPatient.patient?.phone}</p>
                </div>
              </div>
            </div>

            {/* MEDICAL FORM */}
            <div className="p-6 md:p-8 space-y-6 flex-1 overflow-y-auto">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">{t('doctor:symptoms_label')}</label>
                <textarea
                  required
                  rows={3}
                  placeholder={t('doctor:symptoms_placeholder')}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 outline-none p-4 rounded-2xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400 focus:bg-white focus:border-blue-600/40 transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">{t('doctor:diagnosis_label')}</label>
                <textarea
                  required
                  rows={3}
                  placeholder={t('doctor:diagnosis_placeholder')}
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 outline-none p-4 rounded-2xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400 focus:bg-white focus:border-blue-600/40 transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">{t('doctor:notes_label')}</label>
                <textarea
                  rows={3}
                  placeholder={t('doctor:notes_placeholder')}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 outline-none p-4 rounded-2xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400 focus:bg-white focus:border-blue-600/40 transition-all resize-none"
                />
              </div>
            </div>

            {/* SUBMIT FOOTER */}
            <div className="p-6 border-t border-gray-100 flex justify-between items-center shrink-0">
              <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                <Icons.Info className="w-4 h-4 text-blue-500" />
                <span>{t('doctor:required_note')}</span>
              </span>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white font-extrabold px-8 py-3.5 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2 text-sm cursor-pointer"
              >
                {loading ? <Icons.Loader className="w-5 h-5 animate-spin" /> : <Icons.HeartPulse className="w-5 h-5" />}
                <span>{t('doctor:complete_btn')}</span>
              </button>
            </div>

          </form>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 border border-blue-100 rounded-3xl flex items-center justify-center mb-6">
              <Icons.Stethoscope className="w-10 h-10" />
            </div>
            <h4 className="font-extrabold text-gray-800 text-lg">{t('doctor:welcome_title')}</h4>
            <p className="text-sm text-gray-400 max-w-sm mt-2 font-semibold">
              {t('doctor:welcome_desc')}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
