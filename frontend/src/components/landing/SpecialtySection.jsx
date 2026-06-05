import React, { useEffect, useState } from 'react';
import { getSpecialties } from '../../services/specialtyService';
import * as Icons from 'lucide-react';

const SpecialtySection = () => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSpecialties()
      .then((data) => {
        setSpecialties(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi fetch chuyên khoa:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Đang tải danh sách chuyên khoa...
      </div>
    );
  }

  return (
    <section id="specialties" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Các Chuyên Khoa Y Tế</h2>
          <p className="text-gray-500 text-lg">Dịch vụ khám chữa bệnh toàn diện đa chuyên khoa, đáp ứng chính xác nhu cầu sức khỏe của bạn.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {specialties.map((spec) => {
            const IconComponent = Icons[spec.icon] || Icons.Activity;

            return (
              <div key={spec.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-4 hover:shadow-md transition-all cursor-pointer hover:-translate-y-1">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <IconComponent className="w-7 h-7" />
                </div>
                <span className="font-semibold text-gray-800">{spec.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SpecialtySection;