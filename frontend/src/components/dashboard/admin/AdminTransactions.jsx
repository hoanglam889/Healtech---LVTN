import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAllAppointments, updateAppointment } from '../../../services/appointmentService';

export default function AdminTransactions() {
  const { t } = useTranslation('admin');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'PAID' | 'UNPAID' | 'CANCELLED'

  const loadData = () => {
    setLoading(true);
    getAllAppointments()
      .then((data) => {
        setAppointments(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi tải danh sách lịch hẹn:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm(t('transactions.cancel_confirm', { id }))) return;
    try {
      await updateAppointment(id, { status: 'CANCELLED' });
      alert(t('transactions.cancel_success'));
      loadData();
    } catch (err) {
      console.error(err);
      alert(t('transactions.cancel_error'));
    }
  };

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

  const filteredData = appointments.filter((item) => {
    if (filter === 'PAID' && (item.invoices?.status !== 'PAID' || item.status === 'CANCELLED')) return false;
    if (filter === 'UNPAID' && (item.invoices?.status !== 'UNPAID' || item.status === 'CANCELLED')) return false;
    if (filter === 'CANCELLED' && item.status !== 'CANCELLED') return false;

    const patientName = item.patient?.fullName?.toLowerCase() || '';
    const docName = item.doctorProfile?.fullName?.toLowerCase() || '';
    const apptCode = item.qrCode?.toLowerCase() || '';
    const search = searchQuery.toLowerCase().trim();

    return patientName.includes(search) || docName.includes(search) || apptCode.includes(search) || item.id.toString() === search;
  });

  const filterOptions = [
    { label: t('transactions.filter_all'), value: 'ALL' },
    { label: t('transactions.filter_paid'), value: 'PAID' },
    { label: t('transactions.filter_unpaid'), value: 'UNPAID' },
    { label: t('transactions.filter_cancelled'), value: 'CANCELLED' },
  ];

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Icons.Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder={t('transactions.search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-xs font-semibold text-gray-700"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          {filterOptions.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === btn.value
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-[fadeIn_0.25s_ease-out]">
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">{t('transactions.loading')}</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-16 text-center text-gray-400 font-bold text-sm">
            {t('transactions.empty')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-wider bg-gray-50/30">
                  <th className="py-4 px-6">{t('transactions.col_code')}</th>
                  <th className="py-4 px-6">{t('transactions.col_patient')}</th>
                  <th className="py-4 px-6">{t('transactions.col_doctor')}</th>
                  <th className="py-4 px-6">{t('transactions.col_date')}</th>
                  <th className="py-4 px-6">{t('transactions.col_time')}</th>
                  <th className="py-4 px-6">{t('transactions.col_cost')}</th>
                  <th className="py-4 px-6">{t('transactions.col_exam_status')}</th>
                  <th className="py-4 px-6">{t('transactions.col_invoice')}</th>
                  <th className="py-4 px-6 text-right">{t('transactions.col_actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                {filteredData.map((item) => {
                  const isUpcoming = item.status === 'BOOKED';
                  const isCheckedIn = item.status === 'WAITING' || item.status === 'EXAMINING';
                  const isDone = item.status === 'DONE';
                  const isCancelled = item.status === 'CANCELLED';

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-gray-900 text-xs">
                        {item.qrCode || `HT-APPT-${item.id}`}
                      </td>
                      <td className="py-4 px-6">{item.patient?.fullName || 'N/A'}</td>
                      <td className="py-4 px-6 text-gray-900">
                        {item.doctorProfile?.fullName ? `BS. ${item.doctorProfile.fullName}` : 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-xs text-gray-500">{formatDate(item.appointmentDate)}</td>
                      <td className="py-4 px-6 text-xs font-semibold text-gray-700">
                        {item.appointmentTime?.substring(0, 5) || ''}
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-900">
                        {item.invoices?.totalAmount
                          ? `${parseFloat(item.invoices.totalAmount).toLocaleString('vi-VN')} đ`
                          : '150.000 đ'}
                      </td>

                      <td className="py-4 px-6">
                        <span className={`inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          isDone
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : isCancelled
                              ? 'bg-red-50 text-red-600 border border-red-100'
                              : isCheckedIn
                                ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                : 'bg-blue-50 text-blue-600 border border-blue-100'
                        }`}>
                          {isDone ? t('transactions.status_done') : isCancelled ? t('transactions.status_cancelled') : isCheckedIn ? t('transactions.status_checked_in') : t('transactions.status_booked')}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span className={`inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          isCancelled
                            ? 'bg-red-50 text-red-600 border border-red-100'
                            : item.invoices?.status === 'PAID'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {isCancelled ? t('transactions.invoice_cancelled') : item.invoices?.status === 'PAID' ? t('transactions.invoice_paid') : t('transactions.invoice_unpaid')}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        {isUpcoming ? (
                          <button
                            onClick={() => handleCancel(item.id)}
                            className="text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-100 transition-all cursor-pointer"
                          >
                            {t('transactions.cancel_btn')}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 font-semibold italic">{t('transactions.not_available')}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
