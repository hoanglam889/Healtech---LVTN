import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 md:py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
        
        {/* Thông tin thương hiệu */}
        <div className="flex flex-col items-center md:items-start space-y-3 text-center md:text-left">
          <img 
            src="/images/logo2.png" 
            alt="Healtech Logo" 
            className="h-12 md:h-14 w-auto object-contain" 
          />
          <p className="text-sm leading-relaxed max-w-sm text-gray-400">
            Trải nghiệm chăm sóc sức khỏe chất lượng cao, tinh gọn và lấy bệnh nhân làm trung tâm.
          </p>
        </div>

        {/* Liên kết cơ bản */}
        <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3 text-sm font-medium mt-2 md:mt-0">
          <a href="#home" className="hover:text-white transition-colors">Trang chủ</a>
          <a href="#doctors" className="hover:text-white transition-colors">Đội ngũ Bác sĩ</a>
          <a href="#specialties" className="hover:text-white transition-colors">Chuyên khoa</a>
          <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
        </div>
      </div>
      
      {/* Phần Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-gray-800 flex justify-center text-xs text-gray-500">
        <p className="text-center">&copy; {new Date().getFullYear()} Healtech. Bảo lưu mọi quyền.</p>
      </div>
    </footer>
  );
};

export default Footer;