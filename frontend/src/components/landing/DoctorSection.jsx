import React from 'react';

const doctors = [
  { name: 'BS. Sarah Jenkins', specialty: 'Chuyên gia Tim mạch', rating: 4.9, reviews: 124 },
  { name: 'BS. Michael Chen', specialty: 'Chuyên gia Thần kinh', rating: 4.8, reviews: 98 },
  { name: 'BS. Emily Brooks', specialty: 'Chuyên gia Nhi khoa', rating: 5.0, reviews: 210 },
  { name: 'BS. James Wilson', specialty: 'Chuyên gia Cơ xương khớp', rating: 4.7, reviews: 85 },
];

const DoctorSection = () => {
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
          {doctors.map((doc, idx) => (
            <div key={idx} className="group flex flex-col gap-5 cursor-pointer">
              <div className="aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden relative transition-transform group-hover:scale-[1.02]">
                 <div className="absolute inset-0 flex items-center justify-center text-gray-400">Hình ảnh</div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{doc.name}</h3>
                <p className="text-blue-600 font-medium mt-1">{doc.specialty}</p>
                <div className="flex items-center gap-1.5 mt-3 text-sm text-gray-500">
                  <span className="text-yellow-400 text-base">★</span> 
                  <span className="font-semibold text-gray-700">{doc.rating}</span> 
                  ({doc.reviews} đánh giá)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorSection;