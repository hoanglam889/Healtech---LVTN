import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAdminStats } from '../../../services/adminService';

export default function AdminOverview() {
  const { t } = useTranslation('admin');
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((data) => {
        setStatsData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi tải thống kê admin:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-xl max-w-sm mx-auto mt-20">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">{t('overview.loading')}</p>
      </div>
    );
  }

  const totalRevenue = statsData?.totalRevenue || '0 đ';
  const totalAppointments = statsData?.totalAppointments || 0;
  const totalPatients = statsData?.totalPatients || 0;
  const totalDoctors = statsData?.totalDoctors || 0;
  const recentActivities = statsData?.recentActivities || [];

  const stats = [
    { label: t('overview.stat_revenue'), value: totalRevenue, change: t('overview.stat_revenue_desc'), icon: 'DollarSign', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { label: t('overview.stat_appointments'), value: `${totalAppointments} ${t('overview.stat_appointments_unit')}`, change: t('overview.stat_appointments_desc'), icon: 'CalendarDays', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { label: t('overview.stat_patients'), value: `${totalPatients} ${t('overview.stat_patients_unit')}`, change: t('overview.stat_patients_desc'), icon: 'Users', color: 'bg-violet-50 text-violet-600 border-violet-100' },
    { label: t('overview.stat_doctors'), value: `${totalDoctors} ${t('overview.stat_doctors_unit')}`, change: t('overview.stat_doctors_desc'), icon: 'HeartPulse', color: 'bg-rose-50 text-rose-600 border-rose-100' }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = Icons[stat.icon] || Icons.HelpCircle;
          return (
            <div key={index} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${stat.color}`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{stat.value}</h3>
                <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-[fadeIn_0.3s_ease-out]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="font-extrabold text-gray-900 text-base">{t('overview.recent_title')}</h3>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">{t('overview.recent_subtitle')}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {recentActivities.length === 0 ? (
            <div className="p-12 text-center text-gray-400 font-bold text-sm">
              {t('overview.recent_empty')}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-wider bg-gray-50/30">
                  <th className="py-4 px-6">{t('overview.col_id')}</th>
                  <th className="py-4 px-6">{t('overview.col_patient')}</th>
                  <th className="py-4 px-6">{t('overview.col_doctor')}</th>
                  <th className="py-4 px-6">{t('overview.col_time')}</th>
                  <th className="py-4 px-6">{t('overview.col_specialty')}</th>
                  <th className="py-4 px-6">{t('overview.col_fee')}</th>
                  <th className="py-4 px-6 text-right">{t('overview.col_status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                {recentActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-gray-900">{act.id}</td>
                    <td className="py-4 px-6">{act.patient}</td>
                    <td className="py-4 px-6 text-gray-900">{act.doctor}</td>
                    <td className="py-4 px-6 text-xs text-gray-500">{act.time}</td>
                    <td className="py-4 px-6 text-xs font-bold text-indigo-600">{act.type}</td>
                    <td className="py-4 px-6 font-bold text-gray-900">{act.amount}</td>
                    <td className="py-4 px-6 text-right">
                      <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        act.status === 'Hoàn thành'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : act.status === 'Đã check-in'
                            ? 'bg-amber-50 text-amber-600 border border-amber-100'
                            : act.status === 'Đã hủy'
                              ? 'bg-red-50 text-red-600 border border-red-100'
                              : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {act.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
