import React, { useState } from 'react';

const ProfileForm = ({ onAddProfile }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Thu thập dữ liệu trực tiếp khi submit form (Uncontrolled Component)
    const data = new FormData(e.currentTarget);
    const name = data.get('name')?.toString().trim();
    const phone = data.get('phone')?.toString().trim();
    const dob = data.get('dob')?.toString();
    const gender = data.get('gender')?.toString();
    const relationship = data.get('relationship')?.toString();

    // Kiểm tra các trường bắt buộc
    if (!name || !phone || !dob) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    // Tạo object hồ sơ bệnh nhân mới khớp định dạng API Backend
    const backendGender = gender === 'Nam' ? 'MALE' : gender === 'Nữ' ? 'FEMALE' : 'OTHER';
    const newProfile = {
      fullName: name,
      phone,
      dob,
      gender: backendGender,
      relationship
    };

    onAddProfile(newProfile);
    
    // Reset lại toàn bộ form về trống
    e.currentTarget.reset();
    setIsOpen(false); // Đóng form
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hồ sơ bệnh nhân</h2>
          <p className="text-sm text-gray-400 mt-1">Chọn hồ sơ có sẵn hoặc tạo mới để đặt lịch khám.</p>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
            isOpen 
              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
          }`}
        >
          {isOpen ? 'Đóng Form' : '+ Tạo hồ sơ mới'}
        </button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-6 pt-6 border-t border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-800 text-base">Nhập thông tin bệnh nhân</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Họ tên */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Họ và tên *</label>
              <input 
                type="text" 
                name="name"
                placeholder="Nguyễn Văn A" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium"
              />
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Số điện thoại *</label>
              <input 
                type="tel" 
                name="phone"
                placeholder="09XXXXXXXX" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium"
              />
            </div>

            {/* Ngày sinh */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ngày sinh *</label>
              <input 
                type="date" 
                name="dob"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium"
              />
            </div>

            {/* Giới tính */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Giới tính</label>
              <div className="flex gap-4 h-11 items-center">
                {['Nam', 'Nữ', 'Khác'].map((g) => (
                  <label key={g} className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer select-none">
                    <input 
                      type="radio" 
                      name="gender" 
                      value={g}
                      defaultChecked={g === 'Nam'}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            {/* Quan hệ */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Quan hệ với chủ tài khoản</label>
              <select 
                name="relationship"
                defaultValue="Bản thân"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium"
              >
                <option value="Bản thân">Bản thân</option>
                <option value="Bố/Mẹ">Bố/Mẹ</option>
                <option value="Vợ/Chồng">Vợ/Chồng</option>
                <option value="Con cái">Con cái</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gray-50 text-gray-500 hover:bg-gray-100 transition-all border border-gray-200 cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm cursor-pointer"
            >
              Lưu hồ sơ
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileForm;
