import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { getAdminSchedules, createAdminSchedule, deleteAdminSchedule, getAdminShifts } from '../../../services/adminService';
import { getDoctors } from '../../../services/doctorService';

export default function AdminSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // States cho Form xếp ca trực mới
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedShiftId, setSelectedShiftId] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [maxPatients, setMaxPatients] = useState('5');

  // Load danh sách dữ liệu từ Backend
  const loadData = () => {
    setLoading(true);
    Promise.all([
      getAdminSchedules(),
      getAdminShifts(),
      getDoctors()
    ])
      .then(([scheduleList, shiftList, doctorList]) => {
        setSchedules(scheduleList || []);
        setShifts(shiftList || []);
        
        // Chỉ hiện những bác sĩ đang hoạt động (isActive = true)
        const activeDocs = (doctorList || []).filter(d => d.user?.isActive);
        setDoctors(activeDocs);

        if (activeDocs.length > 0 && !selectedDoctorId) {
          setSelectedDoctorId(activeDocs[0].id.toString());
        }
        if (shiftList.length > 0 && !selectedShiftId) {
          setSelectedShiftId(shiftList[0].id.toString());
        }
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

  // Xử lý Xóa lịch trực
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ca trực này không?')) {
      return;
    }

    try {
      await deleteAdminSchedule(id);
      alert('Xóa ca trực bác sĩ thành công!');
      loadData();
    } catch (err) {
      console.error(err);
      alert('Không thể xóa ca trực này!');
    }
  };

  // Gửi Form xếp ca trực
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId || !selectedShiftId || !selectedDate) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    try {
      await createAdminSchedule({
        doctorProfileId: +selectedDoctorId,
        shiftId: +selectedShiftId,
        date: selectedDate,
        maxPatients: +maxPatients
      });

      alert('Xếp lịch trực cho bác sĩ thành công!');
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Không thể xếp lịch trực cho bác sĩ!');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER TÌM KIẾM VÀ NÚT TẠO MỚI */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h3 className="font-extrabold text-gray-900 text-sm md:text-base">Phân công Lịch trực bác sĩ</h3>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Xếp lịch làm việc thực tế cho các bác sĩ trong hệ thống</p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
        >
          <Icons.CalendarPlus className="w-4 h-4" />
          <span>Xếp lịch ca trực</span>
        </button>
      </div>

      {/* BẢNG LỊCH TRỰC DỮ LIỆU THẬT */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-[fadeIn_0.25s_ease-out]">
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">Đang tải phân lịch trực...</p>
          </div>
        ) : schedules.length === 0 ? (
          <div className="p-16 text-center text-gray-400 font-bold text-sm">
            Chưa phân ca trực cho bác sĩ nào trong tuần.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-wider bg-gray-50/30">
                  <th className="py-4 px-6">Bác sĩ</th>
                  <th className="py-4 px-6">Chuyên khoa</th>
                  <th className="py-4 px-6">Ngày trực</th>
                  <th className="py-4 px-6">Ca trực</th>
                  <th className="py-4 px-6">Phòng khám</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                {schedules.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-900">{item.doctor}</td>
                    <td className="py-4 px-6 text-xs font-semibold text-indigo-600">{item.specialty}</td>
                    <td className="py-4 px-6 font-semibold text-gray-700">{item.day}</td>
                    <td className="py-4 px-6 text-xs text-gray-500">{item.shift}</td>
                    <td className="py-4 px-6 font-mono text-xs text-gray-900">{item.clinicRoom}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-100 transition-all cursor-pointer"
                      >
                        Xóa lịch
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL THÊM CA TRỰC BÁC SĨ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white rounded-3xl p-6 max-w-md w-full relative z-10 shadow-2xl border border-gray-100 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <Icons.CalendarDays className="w-5 h-5 text-indigo-600" />
                <span>Thêm ca trực bác sĩ mới</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer">
                <Icons.X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Chọn bác sĩ trực *</label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-xs font-semibold cursor-pointer"
                >
                  {doctors.length === 0 ? (
                    <option value="">Không có bác sĩ hoạt động</option>
                  ) : (
                    doctors.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.fullName} ({d.specialty?.name || 'Chưa gán khoa'})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Ngày làm việc *</label>
                <input
                  type="date"
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Chọn ca trực *</label>
                <select
                  value={selectedShiftId}
                  onChange={(e) => setSelectedShiftId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-xs font-semibold cursor-pointer"
                >
                  {shifts.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.startTime.substring(0, 5)} - {s.endTime.substring(0, 5)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Số bệnh nhân tối đa / Ca *</label>
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
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-50 text-gray-500 hover:bg-gray-100 transition-all border border-gray-200 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={doctors.length === 0}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all cursor-pointer disabled:opacity-50"
                >
                  Thêm ca trực
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
