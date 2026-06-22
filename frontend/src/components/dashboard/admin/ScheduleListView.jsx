import React from 'react';

export default function ScheduleListView({ schedules, onDelete, formatDateLabel }) {
  if (schedules.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-16 text-center text-gray-400 font-bold text-sm">
        Chưa có lịch trực nào được phân công.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-[fadeIn_0.25s_ease-out]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-wider bg-gray-50/30">
              <th className="py-4 px-6">Bác sĩ</th>
              <th className="py-4 px-6">Chuyên khoa</th>
              <th className="py-4 px-6">Ngày trực</th>
              <th className="py-4 px-6">Ca trực nhỏ</th>
              <th className="py-4 px-6">Phòng khám</th>
              <th className="py-4 px-6 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
            {schedules.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 font-bold text-gray-900">{item.doctor}</td>
                <td className="py-4 px-6 text-xs font-semibold text-indigo-600">{item.specialty}</td>
                <td className="py-4 px-6 font-semibold text-gray-700">{formatDateLabel(item.date)} ({item.day})</td>
                <td className="py-4 px-6 text-xs text-gray-500">{item.shift}</td>
                <td className="py-4 px-6 font-mono text-xs text-gray-900">{item.clinicRoom}</td>
                <td className="py-4 px-6 text-right">
                  <button onClick={() => onDelete(item.id)} className="text-xs font-bold text-red-500 hover:text-red-650 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-100 transition-all cursor-pointer">
                    Xóa ca
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
