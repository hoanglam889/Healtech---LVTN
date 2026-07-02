import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { getAllRatings } from '../../../services/ratingService';

export default function AdminRatings() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('ALL'); // 'ALL' | '5' | '4' | '3' | '2' | '1'

  const loadData = () => {
    setLoading(true);
    getAllRatings()
      .then((data) => {
        setRatings(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi tải danh sách đánh giá:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Hàm định dạng ngày
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const mins = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${mins} ${day}/${month}/${year}`;
  };

  const filteredData = ratings.filter((item) => {
    if (filterRating !== 'ALL' && item.rating.toString() !== filterRating) {
      return false;
    }
    const doctorName = item.doctor_profile?.fullName?.toLowerCase() || '';
    const patientName = item.patient_account?.patients?.[0]?.fullName?.toLowerCase() || '';
    const search = searchQuery.toLowerCase().trim();
    if (search && !doctorName.includes(search) && !patientName.includes(search) && !item.appointment_id?.toString().includes(search)) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Quản lý Đánh Giá</h2>
          <p className="text-sm text-gray-500 font-semibold mt-1">
            Theo dõi tất cả các bài đánh giá từ bệnh nhân
          </p>
        </div>
        <button onClick={loadData} className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer shadow-sm">
          <Icons.RefreshCw className="w-4 h-4" /> Làm mới
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative w-full md:max-w-md">
            <Icons.Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo Tên bác sĩ, Tên bệnh nhân, Mã Lịch hẹn..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none text-sm font-semibold"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['ALL', '5', '4', '3', '2', '1'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterRating(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterRating === tab
                    ? 'bg-amber-100 text-amber-700 shadow-sm'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {tab === 'ALL' ? 'Tất cả' : `${tab} Sao`}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Mã Hẹn</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Bác Sĩ</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Người Đánh Giá</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Đánh Giá</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider min-w-[200px]">Nội Dung</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Ngày Tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400 font-medium">
                    <Icons.MessageSquare className="w-12 h-12 mx-auto text-gray-200 mb-3" />
                    Không tìm thấy bài đánh giá nào!
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                        {item.appointment?.qrCode || `#${item.appointment_id}`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">BS. {item.doctor_profile?.fullName || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{item.doctor_profile?.specialty?.name || ''}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">
                      {item.patient_account?.patients?.[0]?.fullName || 'Khách hàng ẩn danh'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-2.5 py-1 rounded-lg w-fit">
                        <Icons.Star className="w-4 h-4 fill-current" />
                        <span className="font-bold">{item.rating}.0</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-normal min-w-[250px]">
                      <p className="text-sm text-gray-600 italic">
                        "{item.comment || 'Không có bình luận'}"
                      </p>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                      {formatDate(item.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
