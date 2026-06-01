import React from 'react';

const ContactSection = () => {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16 lg:gap-24">
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Liên Hệ Với Chúng Tôi</h2>
          <p className="text-gray-500 text-lg leading-relaxed">Bạn có thắc mắc về các dịch vụ y tế hoặc cần hỗ trợ đặt lịch khám? Đội ngũ CSKH luôn sẵn sàng hỗ trợ bạn nhanh nhất có thể.</p>
          
          <div className="space-y-8 mt-12">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shrink-0">📍</div>
              <div className="pt-1">
                <h4 className="font-semibold text-gray-900 mb-1">Địa Chỉ Phòng Khám</h4>
                <p className="text-gray-500">123 Đường Y Tế, Phường Bến Nghé<br />Quận 1, TP. Hồ Chí Minh</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shrink-0">📞</div>
              <div className="pt-1">
                <h4 className="font-semibold text-gray-900 mb-1">Số Điện Thoại</h4>
                <p className="text-gray-500">0123-456-789<br />Thứ 2 - Thứ 6: 08:00 - 18:00</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <form className="bg-white p-8 md:p-10 rounded-3xl shadow-lg shadow-gray-100/50 border border-gray-100 space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tên</label>
                <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder="Lâm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Họ</label>
                <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder="Nguyễn" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Địa Chỉ Email</label>
              <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder="lam@example.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Lời nhắn</label>
              <textarea rows="4" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none" placeholder="Hãy mô tả thắc mắc hoặc yêu cầu hỗ trợ của bạn..."></textarea>
            </div>
            <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-sm">
              Gửi Tin Nhắn
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;