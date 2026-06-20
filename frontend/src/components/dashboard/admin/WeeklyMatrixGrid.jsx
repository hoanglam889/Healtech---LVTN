import React from 'react';
import * as Icons from 'lucide-react';

export default function WeeklyMatrixGrid({ weekDays, specialties, schedules, doctors, onDelete, onQuickSchedule, sessions }) {
  if (specialties.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-16 text-center text-gray-400 font-bold text-sm">
        Chưa có chuyên khoa nào trong hệ thống. Vui lòng thêm chuyên khoa trước khi xếp lịch trực.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-[fadeIn_0.25s_ease-out]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed min-w-[950px] xl:min-w-0">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-wider bg-gray-50/50">
              <th className="py-4 px-3 sticky left-0 bg-gray-50/80 backdrop-blur-sm z-20 border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] w-36 min-w-[9rem]">
                Chuyên khoa
              </th>
              {weekDays.map(day => (
                <th key={day.dateStr} className={`py-4 px-3 min-w-[110px] xl:min-w-0 ${day.label === 'Chủ Nhật' || day.label === 'Thứ Bảy' ? 'bg-amber-50/10' : ''}`}>
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-extrabold text-xs">{day.label}</span>
                    <span className="text-[10px] font-semibold text-gray-400 mt-0.5 font-mono">{day.formatted}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {specialties.map(spec => (
              <tr key={spec.id} className="hover:bg-gray-50/30 transition-all border-b border-gray-100">
                {/* Cột chuyên khoa dính bên trái */}
                <td className="py-4 px-3 sticky left-0 bg-white z-10 font-extrabold text-gray-900 border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] w-36 min-w-[9rem]">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 flex-shrink-0">
                      <Icons.Stethoscope className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 leading-tight truncate" title={spec.name}>{spec.name}</p>
                      <p className="text-[9px] font-semibold text-gray-400 mt-0.5">
                        {doctors.filter(d => d.specialty?.id === spec.id).length} bác sĩ
                      </p>
                    </div>
                  </div>
                </td>

                {/* 7 Ô Ngày tương ứng */}
                {weekDays.map(day => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const cellDate = new Date(day.dateStr);
                  cellDate.setHours(0, 0, 0, 0);
                  const isPast = cellDate < today;

                  return (
                  <td key={day.dateStr} className={`p-3 border-r border-gray-100 align-top ${day.label === 'Chủ Nhật' || day.label === 'Thứ Bảy' ? 'bg-amber-50/5' : ''} ${isPast ? 'bg-gray-50/80 grayscale opacity-60' : ''}`}>
                    <div className="flex flex-col gap-3">
                      {sessions.map(session => {
                        const cellSchedules = schedules.filter(
                          item => item.specialtyId === spec.id && 
                                  item.date === day.dateStr && 
                                  item.shiftName?.includes(session.prefix)
                        );

                        // Gom nhóm để mỗi bác sĩ chỉ hiển thị 1 tag trong cùng 1 buổi
                        const uniqueDoctors = [];
                        const docMap = new Map();
                        cellSchedules.forEach(item => {
                          if (!docMap.has(item.doctorProfileId)) {
                            docMap.set(item.doctorProfileId, item);
                            uniqueDoctors.push(item);
                          }
                        });

                        return (
                          <div key={session.id} className="space-y-1.5 bg-gray-50/40 p-2 rounded-2xl border border-gray-100/50">
                            <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-gray-400">
                              <span>{session.name}</span>
                              <span className="text-[8px] font-semibold font-mono text-gray-300">{session.time}</span>
                            </div>

                            {uniqueDoctors.length > 0 ? (
                              <div className="space-y-1">
                                {uniqueDoctors.map(item => (
                                  <div key={item.id} className="group relative flex items-center justify-between gap-1.5 bg-white hover:bg-indigo-50/40 text-gray-700 hover:text-indigo-700 px-2 py-1 rounded-xl text-xs font-bold transition-all border border-gray-150 hover:border-indigo-200">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <div className="w-4.5 h-4.5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[8px] font-extrabold uppercase flex-shrink-0">
                                        {item.doctor ? item.doctor.replace('BS. ', '').substring(0, 1) : '?'}
                                      </div>
                                      <span className="truncate text-[10px]" title={item.doctor}>{item.doctor}</span>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); if (!isPast) onDelete(item.id); }} className={`p-0.5 rounded transition-all ${isPast ? 'text-gray-300 cursor-not-allowed' : 'text-red-400 hover:text-red-650 hover:bg-red-50 cursor-pointer opacity-0 group-hover:opacity-100'}`} title="Xóa cả ca trực">
                                      <Icons.Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                                <button onClick={() => !isPast && onQuickSchedule(day.dateStr, spec.id, session.id)} className={`w-full flex items-center justify-center gap-1 bg-white border border-dashed rounded-xl py-1 transition-all text-[9px] font-bold ${isPast ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'hover:bg-indigo-50/20 text-gray-400 hover:text-indigo-600 border-gray-250 hover:border-indigo-200 cursor-pointer'}`} title="Xếp thêm bác sĩ">
                                  <Icons.Plus className="w-2.5 h-2.5" />
                                  <span>Thêm trực</span>
                                </button>
                              </div>
                            ) : (
                              <button onClick={() => !isPast && onQuickSchedule(day.dateStr, spec.id, session.id)} className={`w-full flex items-center justify-center gap-1 rounded-xl py-1.5 px-2 transition-all text-[9px] font-bold ${isPast ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed' : 'bg-amber-50/50 hover:bg-amber-100/60 text-amber-700 border border-dashed border-amber-250 cursor-pointer hover:shadow-sm'}`} title={`Phân công bác sĩ trực ${session.name.toLowerCase()}`}>
                                <Icons.AlertTriangle className={`w-3 h-3 flex-shrink-0 ${isPast ? 'text-gray-400' : 'text-amber-500 animate-pulse'}`} />
                                <span className="truncate">Thiếu {session.name}</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </td>
                )})}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
