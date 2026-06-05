import React from 'react';

const HeroSection = () => {
  return (
    <section id="home" className="pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12 lg:gap-20">
        <div className="flex-1 text-center md:text-left space-y-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Chăm Sóc Sức Khỏe <br /> <span className="text-blue-600">Đơn Giản & Hiện Đại</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto md:mx-0">
            Kết nối nhanh chóng với các chuyên gia y tế hàng đầu, bỏ qua phòng chờ đông đúc nhờ hệ thống xếp hàng thông minh và quản lý sức khỏe của bạn một cách dễ dàng.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow">
              Tìm Bác Sĩ
            </button>
            <button className="bg-gray-50 text-gray-900 px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all border border-gray-200">
              Tìm Hiểu Thêm
            </button>
          </div>
        </div>
        <div className="flex-1 w-full">
          <div className="aspect-square md:aspect-[4/3] bg-blue-50 rounded-3xl overflow-hidden border border-blue-100 relative">
             <img 
               src="/images/phongkham_1.jpg" 
               alt="Phòng khám Healtech" 
               className="w-full h-full object-cover"
             />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;