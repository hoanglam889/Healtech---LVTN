import React, { useEffect } from 'react';
import * as Icons from 'lucide-react';
import { BASE_URL } from '../../services/apiClient';

const DoctorDetailModal = ({ doctor, onClose, onBooking }) => {
  useEffect(() => {
    // Ngăn chặn cuộn trang phía sau khi mở modal
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!doctor) return null;

  const imageUrl = doctor.avatarUrl ? `${BASE_URL}${doctor.avatarUrl}` : null;
  const specialtyName = doctor.specialty?.name || 'Bác sĩ đa khoa';
  
  // Extract Title and Name
  const prefixes = ['BS CKII.', 'BS CKI.', 'ThS. BS.', 'PGS. TS. BS.', 'GS. TS. BS.', 'BS.', 'ThS.', 'TS.', 'BS CKII', 'BS CKI'];
  let title = 'Bác sĩ chuyên khoa';
  let name = doctor.fullName;
  for (const prefix of prefixes) {
    if (name.toUpperCase().startsWith(prefix.toUpperCase())) {
      title = name.substring(0, prefix.length).trim();
      name = name.substring(prefix.length).trim();
      break;
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" 
        onClick={onClose} 
      />
      
      {/* Modal Box */}
      <div className="bg-white rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl flex flex-col max-h-[90vh] animate-[slideUp_0.3s_ease-out] overflow-hidden">
        
        {/* Header (Close Button) */}
        <div className="absolute top-4 right-4 z-20">
          <button 
            onClick={onClose}
            className="p-2 bg-white/80 hover:bg-gray-100 backdrop-blur-sm rounded-full text-gray-500 hover:text-gray-900 transition-colors shadow-sm cursor-pointer"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area - Scrollable */}
        <div className="overflow-y-auto custom-scrollbar flex-1">
          {/* Top Cover/Avatar Area */}
          <div className="relative bg-gradient-to-b from-blue-50 to-white pt-12 pb-6 px-6 md:px-10 flex flex-col items-center text-center">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-blue-100 relative z-10 mb-5">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={doctor.fullName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-blue-400">
                  <Icons.User className="w-16 h-16 stroke-[1.5]" />
                </div>
              )}
            </div>
            <p className="text-blue-600 font-bold text-sm md:text-base uppercase tracking-wider mb-2">{title}</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug mb-3">{name}</h2>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-100">
              <Icons.Stethoscope className="w-4 h-4" />
              <span>{specialtyName}</span>
            </div>
          </div>

          {/* Details Area */}
          <div className="px-6 md:px-10 pb-10 space-y-8">
            {/* Stats row */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
              <div className="flex-1 min-w-[120px] bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-100">
                <span className="text-xl font-black text-blue-600">{doctor.experienceYears || 0}+</span>
                <span className="text-xs text-gray-500 font-semibold mt-1 uppercase">Năm kinh nghiệm</span>
              </div>
              <div className="flex-1 min-w-[120px] bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-100">
                <span className="text-xl font-black text-amber-500">5.0</span>
                <div className="flex text-amber-400 mt-1">
                  {[1, 2, 3, 4, 5].map(i => <Icons.Star key={i} className="w-3 h-3 fill-current" />)}
                </div>
                <span className="text-[10px] text-gray-500 font-semibold mt-1 uppercase">Đánh giá</span>
              </div>
              <div className="flex-1 min-w-[120px] bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-100">
                <Icons.BadgeCheck className="w-7 h-7 text-emerald-500 mb-1" />
                <span className="text-[10px] text-gray-500 font-semibold uppercase">Chứng chỉ y tế</span>
              </div>
            </div>

            {/* About text */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Icons.FileText className="w-5 h-5 text-blue-600" />
                Giới thiệu chuyên môn
              </h3>
              <div className="text-gray-600 text-sm leading-relaxed space-y-4">
                <p>
                  {title} {name} là một trong những chuyên gia y tế hàng đầu trong lĩnh vực {specialtyName.toLowerCase()}. 
                  Với hơn {doctor.experienceYears || 0} năm cống hiến cho sự nghiệp chăm sóc sức khỏe bệnh nhân, bác sĩ luôn được đánh giá cao về trình độ chuyên môn cũng như sự tận tâm trong công việc.
                </p>
                <p>
                  Tốt nghiệp loại xuất sắc tại trường đại học Y khoa danh tiếng, bác sĩ đã không ngừng học hỏi, tu nghiệp trong và ngoài nước để áp dụng những phương pháp điều trị tiên tiến nhất vào thực tiễn khám chữa bệnh.
                </p>
                <p>
                  Tôn chỉ làm việc của bác sĩ là: <strong>"Sức khỏe của bệnh nhân là ưu tiên số một, sự hài lòng của bệnh nhân là thước đo thành công."</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50 flex gap-3 sticky bottom-0">
          <button 
            onClick={onClose}
            className="px-6 py-3 md:py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:text-gray-900 transition-colors flex-1 cursor-pointer"
          >
            Đóng lại
          </button>
          <button 
            onClick={() => { onClose(); onBooking(doctor); }}
            className="px-6 py-3 md:py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 flex-[2] flex justify-center items-center gap-2 cursor-pointer"
          >
            Đặt lịch khám ngay <Icons.CalendarDays className="w-5 h-5" />
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default DoctorDetailModal;
