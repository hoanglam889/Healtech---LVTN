import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getSchedules, createSchedule, deleteSchedule, getShifts, getDoctors } from '../../services/scheduleService';
import { useToast, ConfirmModal } from '../shared/ToastProvider';
import { formatDate } from '../../utils/dateUtils';

export default function ScheduleManager() {
  const { t } = useTranslation('admin');
  const { showToast } = useToast();
  const [schedules, setSchedules] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [form, setForm] = useState({ doctorProfileId: '', shiftId: '', date: '', maxPatients: 5 });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [s, sh, d] = await Promise.all([getSchedules(), getShifts(), getDoctors()]);
      setSchedules(s);
      setShifts(sh);
      setDoctors(d);
    } catch {
      showToast(t('schedule_mgr.load_error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.doctorProfileId || !form.shiftId || !form.date) {
      showToast(t('schedule_mgr.fill_required'), 'warning');
      return;
    }
    setSaving(true);
    try {
      await createSchedule({ ...form, doctorProfileId: +form.doctorProfileId, shiftId: +form.shiftId, maxPatients: +form.maxPatients });
      showToast(t('schedule_mgr.add_success'), 'success');
      setIsAdding(false);
      setForm({ doctorProfileId: '', shiftId: '', date: '', maxPatients: 5 });
      load();
    } catch {
      showToast(t('schedule_mgr.add_error'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    const id = confirmDelete;
    setConfirmDelete(null);
    try {
      await deleteSchedule(id);
      showToast(t('schedule_mgr.delete_success'), 'success');
      load();
    } catch {
      showToast(t('schedule_mgr.delete_error'), 'error');
    }
  };

  return (
    <>
      <ConfirmModal
        isOpen={!!confirmDelete}
        message={t('schedule_mgr.delete_confirm')}
        onConfirm={doDelete}
        onCancel={() => setConfirmDelete(null)}
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">{t('schedule_mgr.title')}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{t('schedule_mgr.subtitle')}</p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Icons.Plus className="w-4 h-4" />
            {t('schedule_mgr.add_btn')}
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleAdd} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-gray-800 text-sm">{t('schedule_mgr.form_title')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">{t('schedule_mgr.form_doctor')}</label>
                <select
                  value={form.doctorProfileId}
                  onChange={(e) => setForm({ ...form, doctorProfileId: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">{t('schedule_mgr.form_doctor_placeholder')}</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>{d.fullName} ({d.specialty?.name})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">{t('schedule_mgr.form_shift')}</label>
                <select
                  value={form.shiftId}
                  onChange={(e) => setForm({ ...form, shiftId: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">{t('schedule_mgr.form_shift_placeholder')}</option>
                  {shifts.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.startTime}–{s.endTime})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">{t('schedule_mgr.form_date')}</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">{t('schedule_mgr.form_max_patients')}</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={form.maxPatients}
                  onChange={(e) => setForm({ ...form, maxPatients: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {t('schedule_mgr.cancel_btn')}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
              >
                {saving ? <Icons.Loader className="w-4 h-4 animate-spin" /> : <Icons.Save className="w-4 h-4" />}
                {t('schedule_mgr.save_btn')}
              </button>
            </div>
          </form>
        )}

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-gray-400"><Icons.Loader className="w-6 h-6 animate-spin mx-auto" /></div>
          ) : schedules.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Icons.Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">{t('schedule_mgr.empty')}</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">{t('schedule_mgr.col_doctor')}</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">{t('schedule_mgr.col_shift')}</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">{t('schedule_mgr.col_date')}</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">{t('schedule_mgr.col_max_patients')}</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {schedules.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3 font-semibold text-gray-800">{s.doctorProfile?.fullName || '—'}</td>
                    <td className="px-5 py-3 text-gray-600">{s.shift?.name} <span className="text-gray-400 text-xs">({s.shift?.startTime}–{s.shift?.endTime})</span></td>
                    <td className="px-5 py-3 font-semibold text-gray-800">{formatDate(s.date)}</td>
                    <td className="px-5 py-3 text-gray-600">{s.maxPatients}</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => setConfirmDelete(s.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Icons.Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
