import React from 'react';

const specialties = [
  { name: 'Tim mạch', icon: '❤️' },
  { name: 'Thần kinh', icon: '🧠' },
  { name: 'Nhi khoa', icon: '👶' },
  { name: 'Cơ xương khớp', icon: '🦴' },
  { name: 'Nha khoa', icon: '🦷' },
  { name: 'Da liễu', icon: '✨' },
];

const SpecialtySection = () => {
  return (
    <section id="specialties" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Các Chuyên Khoa Y Tế</h2>
          <p className="text-gray-500 text-lg">Dịch vụ khám chữa bệnh toàn diện đa chuyên khoa, đáp ứng chính xác nhu cầu sức khỏe của bạn.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {specialties.map((spec, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-4 hover:shadow-md transition-all cursor-pointer hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
                {spec.icon}
              </div>
              <span className="font-semibold text-gray-800">{spec.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialtySection;