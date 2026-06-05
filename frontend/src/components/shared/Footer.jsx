import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 md:py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-8">
        
        {/* Cột 1: Thông tin thương hiệu */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg shadow-sm"></div>
            <span className="text-xl font-bold text-white tracking-tight">Healtech</span>
          </div>
          <p className="text-sm leading-relaxed pr-0 md:pr-4 text-gray-400">
            Đem lại trải nghiệm chăm sóc sức khỏe chất lượng cao, tinh gọn và lấy bệnh nhân làm trung tâm thông qua giải pháp công nghệ hiện đại.
          </p>
        </div>
        
        {/* Cột 2: Liên kết nhanh */}
        <div>
          <h4 className="text-white font-semibold mb-4 md:mb-6 text-sm md:text-base uppercase tracking-wider">Liên Kết Nhanh</h4>
          <ul className="space-y-2.5 text-sm">
            <li><a href="#home" className="hover:text-white hover:underline transition-all">Trang chủ</a></li>
            <li><a href="#doctors" className="hover:text-white hover:underline transition-all">Đội ngũ Bác sĩ</a></li>
            <li><a href="#specialties" className="hover:text-white hover:underline transition-all">Các Chuyên khoa</a></li>
            <li><a href="#" className="hover:text-white hover:underline transition-all">Đặt lịch khám</a></li>
          </ul>
        </div>

        {/* Cột 3: Chính sách */}
        <div>
          <h4 className="text-white font-semibold mb-4 md:mb-6 text-sm md:text-base uppercase tracking-wider">Chính Sách</h4>
          <ul className="space-y-2.5 text-sm">
            <li><a href="#" className="hover:text-white hover:underline transition-all">Chính sách bảo mật</a></li>
            <li><a href="#" className="hover:text-white hover:underline transition-all">Điều khoản dịch vụ</a></li>
            <li><a href="#" className="hover:text-white hover:underline transition-all">Chính sách Cookie</a></li>
          </ul>
        </div>

        {/* Cột 4: Đăng ký bản tin */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold mb-4 md:mb-6 text-sm md:text-base uppercase tracking-wider">Đăng Ký Bản Tin</h4>
          <p className="text-sm text-gray-400 leading-relaxed">Nhận những cẩm nang sức khỏe hữu ích được gửi trực tiếp đến email của bạn.</p>
          <div className="flex shadow-sm max-w-md">
            <input 
              type="email" 
              placeholder="Địa chỉ email..." 
              className="bg-gray-800 border-none px-4 py-3 rounded-l-xl outline-none w-full text-white text-sm focus:ring-1 focus:ring-blue-500 placeholder-gray-500" 
            />
            <button className="bg-blue-600 px-5 py-3 rounded-r-xl font-semibold text-white text-sm hover:bg-blue-700 transition-colors shrink-0 cursor-pointer">
              Gửi
            </button>
          </div>
        </div>
      </div>
      
      {/* Phần Copyright và Mạng xã hội */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 md:mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-center md:text-left">
        <p>&copy; {new Date().getFullYear()} Healtech. Bảo lưu mọi quyền.</p>
        <div className="flex gap-6 font-medium">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;