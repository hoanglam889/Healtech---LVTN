import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAdminSchedules, createAdminSchedule, deleteAdminSchedule, getAdminShifts } from '../../../services/adminService';
import { getDoctors } from '../../../services/doctorService';
import { getSpecialties } from '../../../services/specialtyService';
import WeeklyMatrixGrid from './WeeklyMatrixGrid';
import ScheduleListView from './ScheduleListView';
import ScheduleModal from './ScheduleModal';

const SESSION_DEFS = [
  { id: 'Sáng', time: '08:00 - 12:00', prefix: 'Sáng', nameKey: 'schedules.session_morning' },
  { id: 'Chiều', time: '13:00 - 17:00', prefix: 'Chiều', nameKey: 'schedules.session_afternoon' },
  { id: 'Tối', time: '17:00 - 21:00', prefix: 'Tối', nameKey: 'schedules.session_evening' },
];

const DAY_KEYS = [
  'schedules.day_mon', 'schedules.day_tue', 'schedules.day_wed',
  'schedules.day_thu', 'schedules.day_fri', 'schedules.day_sat', 'schedules.day_sun',
];

export default function AdminSchedules() {
  const { t } = useTranslation('admin');
  const [schedules, setSchedules] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const [weekViewDate, setWeekViewDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });

  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState('');
  const [selectedShiftId, setSelectedShiftId] = useState('Sáng');
  const [selectedDate, setSelectedDate] = useState('');
  const [maxPatients, setMaxPatients] = useState('5');

  const sessions = SESSION_DEFS.map(s => ({ ...s, name: t(s.nameKey) }));

  const loadData = () => {
    setLoading(true);
    Promise.all([getAdminSchedules(), getAdminShifts(), getDoctors(), getSpecialties()])
      .then(([scheduleList, shiftList, doctorList, specialtyList]) => {
        setSchedules(scheduleList || []);
        setShifts(shiftList || []);
        setSpecialties(specialtyList || []);
        setDoctors((doctorList || []).filter(d => d.user?.isActive));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi tải lịch trực:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedSpecialtyId) {
      const filtered = doctors.filter(d => d.specialty?.id === +selectedSpecialtyId);
      const isDocInSelectedSpecialty = filtered.some(d => d.id.toString() === selectedDoctorId);
      if (!isDocInSelectedSpecialty) {
        setSelectedDoctorId(filtered.length > 0 ? filtered[0].id.toString() : '');
      }
    }
  }, [selectedSpecialtyId, doctors]);

  const handleNavigateWeek = (daysOffset) => {
    const parts = weekViewDate.split('-');
    const current = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    current.setDate(current.getDate() + daysOffset);
    setWeekViewDate(`${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`);
  };

  const handleResetWeek = () => {
    const today = new Date();
    setWeekViewDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
  };

  const getDaysOfWeek = (currentDateStr) => {
    const parts = currentDateStr.split('-');
    const current = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(current.setDate(diff));

    const labels = DAY_KEYS.map(key => t(key));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return { dateStr, label: labels[i], formatted: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`, isWeekend: i >= 5 };
    });
  };

  const weekDays = getDaysOfWeek(weekViewDate);
  const formatDateLabel = (dateStr) => {
    const parts = dateStr.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };
  const weekRangeLabel = `${formatDateLabel(weekDays[0].dateStr)} - ${formatDateLabel(weekDays[6].dateStr)}`;

  const handleDelete = async (id) => {
    if (!window.confirm(t('schedules.delete_confirm'))) return;
    try {
      await deleteAdminSchedule(id);
      loadData();
    } catch (err) {
      console.error(err);
      alert(t('schedules.delete_error'));
    }
  };

  const handleQuickSchedule = (dateStr, specialtyId, sessionId) => {
    setSelectedDate(dateStr);
    setSelectedSpecialtyId(specialtyId.toString());
    setSelectedShiftId(sessionId);
    setIsModalOpen(true);
  };

  const handleOpenNewScheduleModal = () => {
    setSelectedDate(weekViewDate);
    setSelectedSpecialtyId(specialties.length > 0 ? specialties[0].id.toString() : '');
    setSelectedShiftId('Sáng');
    setMaxPatients('5');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId || !selectedShiftId || !selectedDate) {
      alert(t('schedules.fill_required'));
      return;
    }
    try {
      await createAdminSchedule({
        doctorProfileId: +selectedDoctorId,
        shiftId: selectedShiftId,
        date: selectedDate,
        maxPatients: +maxPatients
      });
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || t('schedules.submit_error'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h3 className="font-extrabold text-gray-900 text-sm md:text-base flex items-center gap-2">
            <Icons.CalendarDays className="w-5 h-5 text-indigo-600" />
            <span>{t('schedules.title')}</span>
          </h3>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">{t('schedules.subtitle')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
            <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5 ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
              <Icons.LayoutGrid className="w-3.5 h-3.5" />
              <span>{t('schedules.view_grid')}</span>
            </button>
            <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5 ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
              <Icons.List className="w-3.5 h-3.5" />
              <span>{t('schedules.view_list')}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
            <button onClick={() => handleNavigateWeek(-7)} className="p-1.5 hover:bg-white rounded-lg text-gray-500 hover:text-indigo-600 transition-all cursor-pointer"><Icons.ChevronLeft className="w-4 h-4" /></button>
            <button onClick={handleResetWeek} className="px-2.5 py-1 text-[11px] font-bold text-gray-600 hover:text-indigo-600 hover:bg-white rounded-lg transition-all cursor-pointer">{t('schedules.this_week')}</button>
            <button onClick={() => handleNavigateWeek(7)} className="p-1.5 hover:bg-white rounded-lg text-gray-500 hover:text-indigo-600 transition-all cursor-pointer"><Icons.ChevronRight className="w-4 h-4" /></button>
            <span className="text-[11px] font-extrabold text-indigo-600 px-2 font-mono">{weekRangeLabel}</span>
          </div>

          <button onClick={handleOpenNewScheduleModal} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-1.5 ml-auto cursor-pointer">
            <Icons.CalendarPlus className="w-4 h-4" />
            <span>{t('schedules.add_shift_btn')}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-16 text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">{t('schedules.loading')}</p>
        </div>
      ) : viewMode === 'grid' ? (
        <WeeklyMatrixGrid
          weekDays={weekDays}
          specialties={specialties}
          schedules={schedules}
          doctors={doctors}
          onDelete={handleDelete}
          onQuickSchedule={handleQuickSchedule}
          sessions={sessions}
        />
      ) : (
        <ScheduleListView
          schedules={schedules}
          onDelete={handleDelete}
          formatDateLabel={formatDateLabel}
        />
      )}

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        specialties={specialties}
        doctors={doctors}
        selectedSpecialtyId={selectedSpecialtyId}
        setSelectedSpecialtyId={setSelectedSpecialtyId}
        selectedDoctorId={selectedDoctorId}
        setSelectedDoctorId={setSelectedDoctorId}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedShiftId={selectedShiftId}
        setSelectedShiftId={setSelectedShiftId}
        maxPatients={maxPatients}
        setMaxPatients={setMaxPatients}
        sessions={sessions}
      />
    </div>
  );
}
