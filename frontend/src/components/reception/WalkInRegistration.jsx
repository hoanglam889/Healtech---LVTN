import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import { searchPatients, createPatient } from '../../services/patientService';
import { getSpecialties } from '../../services/specialtyService';
import { getDoctors } from '../../services/doctorService';
import { createAppointment } from '../../services/appointmentService';
import { useTranslation } from 'react-i18next';

export default function WalkInRegistration() {
  const { t, i18n } = useTranslation(['walkin', 'common']);

  const STEPS = [t('walkin:step1'), t('walkin:step2'), t('walkin:step3')];

  const [step, setStep] = useState(1);
  const [notification, setNotification] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newPatient, setNewPatient] = useState({ fullName: '', dob: '', gender: 'MALE', phone: '', cccd: '', address: '' });
  const [creatingPatient, setCreatingPatient] = useState(false);
  const debounceRef = useRef(null);

  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    setLoadingSchedule(true);
    Promise.all([getSpecialties(), getDoctors()])
      .then(([specs, docs]) => {
        setSpecialties(specs || []);
        setDoctors(docs || []);
      })
      .catch(() => showToast(t('walkin:load_error'), 'error'))
      .finally(() => setLoadingSchedule(false));
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await searchPatients(searchQuery.trim());
        setSearchResults(data || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, [searchQuery]);

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    if (!newPatient.fullName || !newPatient.dob || !newPatient.gender) {
      showToast(t('walkin:save_error'), 'error');
      return;
    }
    setCreatingPatient(true);
    try {
      const saved = await createPatient(newPatient);
      setSelectedPatient(saved);
      setShowNewForm(false);
      showToast(t('walkin:saved_success', { name: saved.fullName }), 'success');
    } catch {
      showToast(t('walkin:save_fail'), 'error');
    } finally {
      setCreatingPatient(false);
    }
  };

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);
  const selectedSpecialty = specialties.find(s => s.id === selectedSpecialtyId);

  const availableShifts = (selectedDoctor?.doctorSchedules || []).filter(
    sched => sched.date === selectedDate && sched.doctorProfileId === selectedDoctorId
  );

  const filteredDoctors = selectedSpecialtyId
    ? doctors.filter(d => d.specialtyId === selectedSpecialtyId && (d.doctorSchedules || []).some(s => s.date === selectedDate))
    : doctors.filter(d => (d.doctorSchedules || []).some(s => s.date === selectedDate));

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US');
  };

  const handleSubmit = async () => {
    if (!selectedPatient || !selectedDoctorId || !selectedDate || !selectedShift) {
      showToast(t('walkin:fill_all'), 'error');
      return;
    }
    setSubmitting(true);
    try {
      const startTime = selectedShift.shift?.startTime || '08:00:00';
      const res = await createAppointment({
        patientId: selectedPatient.id,
        doctorProfileId: selectedDoctorId,
        appointmentDate: selectedDate,
        appointmentTime: startTime,
        paymentMethod: 'CASH',
        bookingType: 'OFFLINE',
        initialStatus: 'WAITING',
      });
      setResult(res);
      setStep(4);
    } catch {
      showToast(t('walkin:submit_error'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedPatient(null);
    setShowNewForm(false);
    setNewPatient({ fullName: '', dob: '', gender: 'MALE', phone: '', cccd: '', address: '' });
    setSelectedSpecialtyId(null);
    setSelectedDoctorId(null);
    setSelectedShift(null);
    setResult(null);
  };

  return (
    <div className="space-y-6 max-w-4xl">

      {/* TOAST */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-white font-bold border animate-[fadeIn_0.2s_ease-out] ${
          notification.type === 'success' ? 'bg-emerald-500 border-emerald-600' :
          notification.type === 'warning' ? 'bg-amber-500 border-amber-600' :
          'bg-rose-500 border-rose-600'
        }`}>
          {notification.type === 'success' ? <Icons.CheckCircle className="w-5 h-5" /> : <Icons.AlertCircle className="w-5 h-5" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/40 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
            <Icons.UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 text-lg">{t('walkin:title')}</h3>
            <p className="text-sm text-gray-400 font-semibold">{t('walkin:subtitle')}</p>
          </div>
        </div>

        {step <= 3 && (
          <div className="flex items-center gap-2 mt-5">
            {STEPS.map((label, i) => {
              const n = i + 1;
              const active = step === n;
              const done = step > n;
              return (
                <React.Fragment key={n}>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    done ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    active ? 'bg-blue-600 text-white' :
                    'bg-gray-50 text-gray-400 border border-gray-100'
                  }`}>
                    {done ? <Icons.Check className="w-3 h-3" /> : <span>{n}</span>}
                    <span>{label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className="flex-1 h-px bg-gray-100" />}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>

      {/* STEP 1: PATIENT SEARCH / CREATE */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-8 space-y-5">
          <h4 className="font-extrabold text-gray-900 text-base">{t('walkin:step1_title')}</h4>

          {selectedPatient ? (
            <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Icons.UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-extrabold text-emerald-900">{selectedPatient.fullName}</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                    {selectedPatient.phone && `${t('walkin:phone_label')} ${selectedPatient.phone}`}
                    {selectedPatient.dob && ` • ${t('walkin:dob_label')} ${formatDate(selectedPatient.dob)}`}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="text-xs font-bold text-gray-500 hover:text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-xl cursor-pointer">
                {t('walkin:change')}
              </button>
            </div>
          ) : (
            <>
              <div className="relative">
                <Icons.Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('walkin:search_placeholder')}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border-none outline-none pl-11 pr-4 py-3.5 rounded-2xl font-semibold text-gray-800 focus:ring-2 focus:ring-blue-500/20 text-sm placeholder-gray-400"
                />
                {searching && <Icons.Loader className="absolute right-4 top-3.5 w-4 h-4 text-gray-400 animate-spin" />}
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {searchResults.map(p => (
                    <div
                      key={p.id}
                      onClick={() => { setSelectedPatient(p); setSearchQuery(''); setSearchResults([]); }}
                      className="flex items-center gap-3 p-3.5 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-2xl cursor-pointer transition-all"
                    >
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                        {p.fullName?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900">{p.fullName}</p>
                        <p className="text-xs text-gray-400 font-semibold">
                          {p.phone || '—'}
                          {p.dob ? ` • ${formatDate(p.dob)}` : ''}
                          {p.cccd ? ` • CCCD: ${p.cccd}` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {searchQuery.trim() && !searching && searchResults.length === 0 && (
                <p className="text-sm text-gray-400 font-semibold text-center py-2">{t('walkin:no_results')}</p>
              )}

              <div className="pt-2 border-t border-gray-100">
                <button
                  onClick={() => setShowNewForm(!showNewForm)}
                  className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  <Icons.Plus className="w-4 h-4" />
                  <span>{showNewForm ? t('walkin:hide_form') : t('walkin:create_new')}</span>
                </button>

                {showNewForm && (
                  <form onSubmit={handleCreatePatient} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">{t('walkin:form_name')}</label>
                      <input
                        required
                        value={newPatient.fullName}
                        onChange={e => setNewPatient(p => ({ ...p, fullName: e.target.value }))}
                        placeholder={t('walkin:form_name_placeholder')}
                        className="w-full bg-gray-50 border border-gray-100 outline-none px-4 py-3 rounded-2xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">{t('walkin:form_dob')}</label>
                      <input
                        required
                        type="date"
                        value={newPatient.dob}
                        onChange={e => setNewPatient(p => ({ ...p, dob: e.target.value }))}
                        className="w-full bg-gray-50 border border-gray-100 outline-none px-4 py-3 rounded-2xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">{t('walkin:form_gender')}</label>
                      <select
                        value={newPatient.gender}
                        onChange={e => setNewPatient(p => ({ ...p, gender: e.target.value }))}
                        className="w-full bg-gray-50 border border-gray-100 outline-none px-4 py-3 rounded-2xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="MALE">{t('common:gender.male')}</option>
                        <option value="FEMALE">{t('common:gender.female')}</option>
                        <option value="OTHER">{t('common:gender.other')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">{t('walkin:form_phone')}</label>
                      <input
                        type="tel"
                        value={newPatient.phone}
                        onChange={e => setNewPatient(p => ({ ...p, phone: e.target.value }))}
                        placeholder={t('walkin:form_phone_placeholder')}
                        className="w-full bg-gray-50 border border-gray-100 outline-none px-4 py-3 rounded-2xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">{t('walkin:form_cccd')}</label>
                      <input
                        value={newPatient.cccd}
                        onChange={e => setNewPatient(p => ({ ...p, cccd: e.target.value }))}
                        placeholder={t('walkin:form_cccd_placeholder')}
                        className="w-full bg-gray-50 border border-gray-100 outline-none px-4 py-3 rounded-2xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div className="sm:col-span-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={creatingPatient}
                        className="bg-blue-600 text-white font-bold px-6 py-3 rounded-2xl hover:bg-blue-700 transition-colors text-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {creatingPatient ? <Icons.Loader className="w-4 h-4 animate-spin" /> : <Icons.Save className="w-4 h-4" />}
                        <span>{t('walkin:save_btn')}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              onClick={() => setStep(2)}
              disabled={!selectedPatient}
              className={`px-8 py-3.5 rounded-2xl font-bold transition-all text-sm flex items-center gap-2 cursor-pointer ${
                selectedPatient ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>{t('common:next')}</span>
              <Icons.ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DOCTOR / DATE / SHIFT */}
      {step === 2 && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-8 space-y-6">
          <h4 className="font-extrabold text-gray-900 text-base">{t('walkin:step2_title')}</h4>

          {loadingSchedule ? (
            <div className="flex items-center justify-center py-12">
              <Icons.Loader className="w-6 h-6 text-blue-600 animate-spin mr-3" />
              <span className="text-sm text-gray-400 font-semibold">{t('walkin:loading_schedule')}</span>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">{t('walkin:date_label')}</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => { setSelectedDate(e.target.value); setSelectedDoctorId(null); setSelectedShift(null); }}
                  className="bg-gray-50 border border-gray-100 outline-none px-4 py-3 rounded-2xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">{t('walkin:specialty_filter')}</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setSelectedSpecialtyId(null); setSelectedDoctorId(null); setSelectedShift(null); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      !selectedSpecialtyId ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    {t('common:all')}
                  </button>
                  {specialties.map(s => (
                    <button
                      key={s.id}
                      onClick={() => { setSelectedSpecialtyId(s.id); setSelectedDoctorId(null); setSelectedShift(null); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedSpecialtyId === s.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  {selectedDate
                    ? t('walkin:doctor_label_date', { date: formatDate(selectedDate) })
                    : t('walkin:doctor_label')}
                </label>
                {filteredDoctors.length === 0 ? (
                  <p className="text-sm text-amber-600 bg-amber-50 border border-amber-100 rounded-xl p-3 font-semibold">
                    {t('walkin:no_doctor')}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredDoctors.map(doc => (
                      <div
                        key={doc.id}
                        onClick={() => { setSelectedDoctorId(doc.id); setSelectedShift(null); }}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                          selectedDoctorId === doc.id ? 'border-blue-500 bg-blue-50/40' : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-base shrink-0">
                          🩺
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900">{doc.fullName}</p>
                          <p className="text-xs text-gray-400 font-semibold">{specialties.find(s => s.id === doc.specialtyId)?.name || '—'}</p>
                        </div>
                        {selectedDoctorId === doc.id && <Icons.CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedDoctorId && (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">{t('walkin:shift_label')}</label>
                  {availableShifts.length === 0 ? (
                    <p className="text-sm text-amber-600 bg-amber-50 border border-amber-100 rounded-xl p-3 font-semibold">
                      {t('walkin:no_shift')}
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {availableShifts.map(sched => {
                        const start = sched.shift?.startTime?.substring(0, 5);
                        const end = sched.shift?.endTime?.substring(0, 5);
                        const isSelected = selectedShift?.id === sched.id;
                        return (
                          <div
                            key={sched.id}
                            onClick={() => setSelectedShift(sched)}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-center ${
                              isSelected ? 'border-blue-500 bg-blue-50/40' : 'border-gray-100 hover:border-gray-200'
                            }`}
                          >
                            <Icons.Clock className={`w-5 h-5 mx-auto mb-1.5 ${isSelected ? 'text-blue-500' : 'text-gray-400'}`} />
                            <p className={`font-bold text-sm ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>{start} - {end}</p>
                            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{t('common:max_patients', { count: sched.maxPatients })}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-gray-100">
            <button onClick={() => setStep(1)} className="px-6 py-3.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer">
              ← {t('common:back')}
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!selectedDoctorId || !selectedShift}
              className={`px-8 py-3.5 rounded-2xl font-bold transition-all text-sm flex items-center gap-2 cursor-pointer ${
                selectedDoctorId && selectedShift ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>{t('common:confirm')}</span>
              <Icons.ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CONFIRM */}
      {step === 3 && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-8 space-y-6">
          <h4 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
            <Icons.ClipboardCheck className="w-5 h-5 text-blue-600" />
            {t('walkin:step3_title')}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
            <div className="space-y-3">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-1.5">{t('walkin:patient_info')}</h5>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">{t('checkin:full_name')}</span>
                  <span className="font-extrabold text-gray-900">{selectedPatient?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">{t('walkin:dob_label')}</span>
                  <span className="font-bold text-gray-800">{formatDate(selectedPatient?.dob) || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">{t('walkin:phone_label')}</span>
                  <span className="font-bold text-gray-800">{selectedPatient?.phone || '—'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-1.5">{t('walkin:appointment_info')}</h5>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">{t('walkin:doctor')}</span>
                  <span className="font-extrabold text-gray-900">{selectedDoctor?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">{t('walkin:specialty')}</span>
                  <span className="font-bold text-blue-600">{selectedSpecialty?.name || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">{t('walkin:date')}</span>
                  <span className="font-bold text-gray-800">{formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">{t('walkin:shift')}</span>
                  <span className="font-bold text-gray-800">
                    {selectedShift?.shift?.startTime?.substring(0, 5)} - {selectedShift?.shift?.endTime?.substring(0, 5)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-sm">
            <Icons.Banknote className="w-5 h-5 text-amber-600 shrink-0" />
            <span className="font-semibold text-amber-700">{t('walkin:payment_note')}</span>
          </div>

          <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-100 rounded-xl">
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-orange-100 text-orange-600 border border-orange-200">{t('common:booking_type.walkin')}</span>
            <span className="text-xs font-semibold text-orange-600">{t('walkin:walkin_badge_note')}</span>
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-100">
            <button onClick={() => setStep(2)} className="px-6 py-3.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer">
              ← {t('common:back')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-8 py-3.5 rounded-2xl transition-all shadow-lg shadow-orange-100 flex items-center gap-2 text-sm cursor-pointer disabled:opacity-60"
            >
              {submitting ? <Icons.Loader className="w-5 h-5 animate-spin" /> : <Icons.UserPlus className="w-5 h-5" />}
              <span>{t('walkin:submit_btn')}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SUCCESS */}
      {step === 4 && result && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 md:p-12 text-center space-y-6 animate-[fadeIn_0.3s_ease-out]">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto">
            <Icons.CheckCircle className="w-9 h-9" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-gray-900">{t('walkin:success_title')}</h3>
            <p className="text-gray-500 text-sm">{t('walkin:success_desc')}</p>
          </div>

          <div className="max-w-md mx-auto bg-gray-50 rounded-2xl p-5 border border-gray-100 text-left space-y-2 text-sm">
            <p><span className="text-gray-400">{t('walkin:patient_info')}:</span> <span className="font-bold text-gray-800">{selectedPatient?.fullName}</span></p>
            <p><span className="text-gray-400">{t('walkin:doctor')}</span> <span className="font-bold text-gray-800">{selectedDoctor?.fullName}</span></p>
            <p>
              <span className="text-gray-400">{t('walkin:qr_label')}</span>{' '}
              <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs">{result.appointment?.qrCode}</span>
            </p>
            <p>
              <span className="text-gray-400">{t('walkin:score_label')}</span>{' '}
              <span className="font-extrabold text-rose-600">{result.appointment?.priorityScore}đ</span>
            </p>
          </div>

          <button
            onClick={handleReset}
            className="px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-sm cursor-pointer"
          >
            {t('walkin:register_another')}
          </button>
        </div>
      )}
    </div>
  );
}
