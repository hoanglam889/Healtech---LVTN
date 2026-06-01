import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
            <span className="text-xl font-bold text-white tracking-tight">Healtech</span>
          </div>
          <p className="text-sm leading-relaxed pr-4">Đem lại trải nghiệm chăm sóc sức khỏe chất lượng cao, tinh gọn và lấy bệnh nhân làm trung tâm thông qua giải pháp công nghệ hiện đại.</p>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-6">Liên Kết Nhanh</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#home" className="hover:text-white transition-colors">Trang chủ</a></li>
            <li><a href="#doctors" className="hover:text-white transition-colors">Đội ngũ Bác sĩ</a></li>
            <li><a href="#specialties" className="hover:text-white transition-colors">Các Chuyên khoa</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Đặt lịch khám</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Chính Sách</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Chính sách Cookie</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Đăng Ký Bản Tin</h4>
          <p className="text-sm mb-4">Nhận những cẩm nang sức khỏe hữu ích được gửi trực tiếp đến email của bạn.</p>
          <div className="flex shadow-sm">
            <input type="email" placeholder="Địa chỉ email..." className="bg-gray-800 border-none px-4 py-3 rounded-l-xl outline-none w-full text-white focus:ring-1 focus:ring-blue-500 placeholder-gray-500" />
            <button className="bg-blue-600 px-5 py-3 rounded-r-xl font-semibold text-white hover:bg-blue-700 transition-colors">Gửi</button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm">
        <p>&copy; {new Date().getFullYear()} Healtech. Bảo lưu mọi quyền.</p>
        <div className="flex gap-6 mt-4 md:mt-0 font-medium">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;