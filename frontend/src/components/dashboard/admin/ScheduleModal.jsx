import React from 'react';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ScheduleModal({
  isOpen,
  onClose,
  onSubmit,
  specialties,
  doctors,
  selectedSpecialtyId,
  setSelectedSpecialtyId,
  selectedDoctorId,
  setSelectedDoctorId,
  selectedDate,
  setSelectedDate,
  selectedShiftId,
  setSelectedShiftId,
  maxPatients,
  setMaxPatients,
  sessions
}) {
  const { t } = useTranslation('admin');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-3xl p-6 max-w-md w-full relative z-10 shadow-2xl border border-gray-100">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
          <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
            <Icons.CalendarDays className="w-5 h-5 text-indigo-600" />
            <span>{t('schedule_modal.title')}</span>
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('schedule_modal.specialty_label')}</label>
            <select
              value={selectedSpecialtyId}
              onChange={(e) => setSelectedSpecialtyId(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-xs font-semibold cursor-pointer"
            >
              <option value="">{t('schedule_modal.specialty_placeholder')}</option>
              {specialties.map(spec => (
                <option key={spec.id} value={spec.id}>{spec.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('schedule_modal.doctor_label')}</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              disabled={!selectedSpecialtyId}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-xs font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {doctors.filter(d => d.specialty?.id === +selectedSpecialtyId).length === 0 ? (
                <option value="">{t('schedule_modal.no_doctor')}</option>
              ) : (
                doctors
                  .filter(d => d.specialty?.id === +selectedSpecialtyId)
                  .map(d => (
                    <option key={d.id} value={d.id}>{d.fullName}</option>
                  ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('schedule_modal.date_label')}</label>
            <input
              type="date"
              required
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('schedule_modal.shift_label')}</label>
            <select
              value={selectedShiftId}
              onChange={(e) => setSelectedShiftId(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-xs font-semibold cursor-pointer"
            >
              {sessions.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.time})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('schedule_modal.max_patients_label')}</label>
            <input
              type="number"
              required
              min="1"
              value={maxPatients}
              onChange={(e) => setMaxPatients(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-xs font-semibold"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-50 text-gray-500 hover:bg-gray-100 transition-all border border-gray-200 cursor-pointer">
              {t('schedule_modal.cancel_btn')}
            </button>
            <button type="submit" disabled={!selectedDoctorId} className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all cursor-pointer disabled:opacity-50">
              {t('schedule_modal.submit_btn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
