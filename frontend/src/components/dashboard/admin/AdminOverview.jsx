import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { getAdminStats } from '../../../services/adminService';

export default function AdminOverview() {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch stats from backend
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
        <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">Đang tải thống kê thực tế...</p>
      </div>
    );
  }

  const totalRevenue = statsData?.totalRevenue || '0 đ';
  const totalAppointments = statsData?.totalAppointments || 0;
  const totalPatients = statsData?.totalPatients || 0;
  const totalDoctors = statsData?.totalDoctors || 0;
  const recentActivities = statsData?.recentActivities || [];

  const stats = [
    { label: 'Doanh thu tích lũy', value: totalRevenue, change: 'Tổng tiền hóa đơn đã đóng', icon: 'DollarSign', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { label: 'Tổng ca khám bệnh', value: `${totalAppointments} ca`, change: 'Lịch hẹn đặt qua hệ thống', icon: 'CalendarDays', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { label: 'Hồ sơ bệnh nhân', value: `${totalPatients} hồ sơ`, change: 'Bệnh nhân đăng ký thông tin', icon: 'Users', color: 'bg-violet-50 text-violet-600 border-violet-100' },
    { label: 'Bác sĩ trực thuộc', value: `${totalDoctors} bác sĩ`, change: 'Hồ sơ bác sĩ chuyên khoa', icon: 'HeartPulse', color: 'bg-rose-50 text-rose-600 border-rose-100' }
  ];

  return (
    <div className="space-y-8">
      
      {/* KHỐI CHỈ SỐ NHANH THỜI GIAN THỰC */}
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

      {/* DANH SÁCH HOẠT ĐỘNG GẦN ĐÂY THỰC TẾ */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-[fadeIn_0.3s_ease-out]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="font-extrabold text-gray-900 text-base">Hoạt động khám bệnh gần đây nhất</h3>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">Top 5 ca khám được ghi nhận gần đây</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {recentActivities.length === 0 ? (
            <div className="p-12 text-center text-gray-400 font-bold text-sm">
              Chưa ghi nhận ca khám nào trong hệ thống.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-wider bg-gray-50/30">
                  <th className="py-4 px-6">Mã ca khám</th>
                  <th className="py-4 px-6">Bệnh nhân</th>
                  <th className="py-4 px-6">Bác sĩ phụ trách</th>
                  <th className="py-4 px-6">Thời gian</th>
                  <th className="py-4 px-6">Chuyên khoa</th>
                  <th className="py-4 px-6">Phí dịch vụ</th>
                  <th className="py-4 px-6 text-right">Trạng thái</th>
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
                          : act.status === 'Chờ khám' 
                            ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                            : 'bg-red-50 text-red-600 border border-red-100'
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
