import React, { useEffect, useState } from 'react';
import { getDoctors } from '../../services/doctorService';
import { User, Star } from 'lucide-react';
import { BASE_URL } from '../../services/apiClient';

const DoctorSection = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <section id="doctors" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Bác Sĩ Nổi Bật</h2>
              <p className="text-gray-500 text-lg max-w-xl">Đội ngũ y bác sĩ, chuyên gia y tế giỏi chuyên môn và tận tâm chăm sóc sức khỏe cho bạn.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex flex-col gap-5 animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-3xl"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="doctors" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Bác Sĩ Nổi Bật</h2>
            <p className="text-gray-500 text-lg max-w-xl">Đội ngũ y bác sĩ, chuyên gia y tế giỏi chuyên môn và tận tâm chăm sóc sức khỏe cho bạn.</p>
          </div>
          <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            Xem Tất Cả Bác Sĩ &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doc) => {
            const imageUrl = doc.avatarUrl ? `${BASE_URL}${doc.avatarUrl}` : null;
            return (
              <div key={doc.id} className="group flex flex-col gap-5 cursor-pointer">
                <div className="aspect-[3/4] bg-blue-50/50 rounded-3xl overflow-hidden relative border border-blue-50/30 transition-transform group-hover:scale-[1.02]">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={doc.fullName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-blue-100 to-indigo-50 text-blue-400 gap-2">
                      <User className="w-12 h-12 stroke-[1.5]" />
                      <span className="text-xs font-medium text-blue-500/80">Chưa cập nhật ảnh</span>
                    </div>
                  )}
                  {doc.experienceYears !== null && (
                    <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                      {doc.experienceYears} năm kinh nghiệm
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{doc.fullName}</h3>
                  <p className="text-blue-600 font-medium mt-1">{doc.specialty?.name || 'Bác sĩ đa khoa'}</p>
                  <div className="flex items-center gap-1.5 mt-3 text-sm text-gray-500">
                    <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                    <span className="font-semibold text-gray-700">4.9</span> 
                    (98 đánh giá)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DoctorSection;