import React, { useEffect, useState } from 'react';
import { getDoctors } from '../../services/doctorService';
import * as Icons from 'lucide-react';
import { BASE_URL } from '../../services/apiClient';
import DoctorDetailModal from './DoctorDetailModal';

const DoctorSection = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Lọc bác sĩ đang hoạt động (isActive == 1 hoặc true) và sắp xếp theo rating từ cao đến thấp
  const processedDoctors = doctors
    .filter(doc => Number(doc.user?.isActive) === 1 || doc.user?.isActive === true)
    .sort((a, b) => (Number(b.average_rating) || 0) - (Number(a.average_rating) || 0));

  const displayedDoctors = showAll ? processedDoctors : processedDoctors.slice(0, 6);

  useEffect(() => {
    getDoctors()
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi fetch bác sĩ:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="doctors" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Bác Sĩ Nổi Bật</h2>
              <p className="text-gray-500 text-base md:text-lg max-w-xl">Đội ngũ y bác sĩ, chuyên gia y tế giỏi chuyên môn và tận tâm chăm sóc sức khỏe cho bạn.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 flex flex-col gap-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-24 h-24 md:w-28 md:h-28 bg-gray-200 rounded-xl shrink-0"></div>
                  <div className="space-y-3 flex-1 py-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="flex gap-3 mt-2">
                  <div className="h-10 bg-gray-200 rounded-xl flex-1"></div>
                  <div className="h-10 bg-gray-200 rounded-xl flex-1"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="doctors" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Bác Sĩ Nổi Bật</h2>
            <p className="text-gray-500 text-base md:text-lg max-w-xl">Đội ngũ y bác sĩ, chuyên gia y tế giỏi chuyên môn và tận tâm chăm sóc sức khỏe cho bạn.</p>
          </div>
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 font-semibold hover:text-blue-700 transition-colors cursor-pointer"
          >
            {showAll ? 'Thu gọn danh sách &uarr;' : 'Xem Tất Cả Bác Sĩ &rarr;'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedDoctors.map((doc) => {
            const imageUrl = doc.avatarUrl ? `${BASE_URL}${doc.avatarUrl}` : null;
            
            // Extract Title and Name
            const prefixes = ['BS CKII.', 'BS CKI.', 'ThS. BS.', 'PGS. TS. BS.', 'GS. TS. BS.', 'BS.', 'ThS.', 'TS.', 'BS CKII', 'BS CKI'];
            let title = 'Bác sĩ chuyên khoa';
            let name = doc.fullName;
            for (const prefix of prefixes) {
              if (name.toUpperCase().startsWith(prefix.toUpperCase())) {
                title = name.substring(0, prefix.length).trim();
                name = name.substring(prefix.length).trim();
                break;
              }
            }

            return (
              <div key={doc.id} className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group flex flex-col justify-between">
                <div className="flex gap-4 relative">
                  {/* Icon top right */}
                  <div className="absolute top-0 right-0 w-10 h-10 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-center text-blue-500 z-10 group-hover:scale-110 transition-transform">
                    {(() => {
                      const IconComponent = doc.specialty?.icon && Icons[doc.specialty.icon] ? Icons[doc.specialty.icon] : Icons.Stethoscope;
                      return <IconComponent className="w-5 h-5" />;
                    })()}
                  </div>

                  {/* Avatar */}
                  <div className="w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-xl overflow-hidden border border-blue-100 bg-blue-50 relative group-hover:shadow-md transition-shadow">
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={doc.fullName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-400">
                        <Icons.User className="w-8 h-8 stroke-[1.5]" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col pr-12 justify-center">
                    <p className="text-blue-600 font-bold text-sm mb-1">{title}</p>
                    <h3 className="text-xl font-bold text-gray-900 leading-snug">{name}</h3>
                    <p className="text-blue-500 text-sm font-medium mt-1.5">{doc.specialty?.name || 'Bác sĩ đa khoa'}</p>
                  </div>
                </div>

                {/* Ratings & Buttons */}
                <div className="flex items-center justify-between gap-4 mt-6 pt-5 border-t border-gray-100">
                  {/* Cụm Rating */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-amber-500 font-black text-lg">
                      <Icons.Star className="w-5 h-5 fill-current" />
                      <span>{Number(doc.average_rating || 5.0).toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-semibold">{doc.total_reviews || 0} đánh giá</span>
                  </div>

                  {/* Nút Xem hồ sơ */}
                  <button 
                    onClick={() => setSelectedDoctor(doc)}
                    className="flex-1 py-2.5 px-4 bg-blue-600 text-white rounded-xl font-bold text-sm flex justify-center items-center gap-2 hover:bg-blue-700 transition-all shadow-md shadow-blue-200 cursor-pointer"
                  >
                    Xem hồ sơ <Icons.ChevronRightCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL CHI TIẾT BÁC SĨ */}
      <DoctorDetailModal 
        doctor={selectedDoctor} 
        onClose={() => setSelectedDoctor(null)} 
        onBooking={(doc) => {
          // Hiện tại landing page xử lý đặt lịch bằng cách chuyển hướng 
          // (sẽ tùy logic của App, tạm thời alert nếu chưa có hàm onBooking truyền vào)
          window.location.href = '#booking-section'; // hoặc kích hoạt modal
        }}
      />
    </section>
  );
};

export default DoctorSection;