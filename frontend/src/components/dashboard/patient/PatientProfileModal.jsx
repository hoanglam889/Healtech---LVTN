import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { createPatient, updatePatient } from '../../../services/patientService';

const PatientProfileModal = ({ isOpen, onClose, editingProfile, user, onSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('MALE');
  const [relationship, setRelationship] = useState('Khác');
  const [cccd, setCccd] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingProfile) {
        setFullName(editingProfile.fullName || '');
        setPhone(editingProfile.phone || '');
        setDob(editingProfile.dob || '');
        setGender(editingProfile.gender || 'MALE');
        setRelationship(editingProfile.relationship || 'Khác');
        setCccd(editingProfile.cccd || '');
        setAddress(editingProfile.address || '');
      } else {
        setFullName('');
        setPhone(user?.phone || '');
        setDob('');
        setGender('MALE');
        setRelationship('Khác');
        setCccd('');
        setAddress('');
      }
    }
  }, [isOpen, editingProfile, user]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !dob) {
      alert('Vui lòng nhập đầy đủ các trường bắt buộc (*).');
      return;
    }

    const patientData = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      dob,
      gender,
      relationship,
      cccd: cccd.trim() || null,
      address: address.trim() || null,
      patientAccountId: user?.id
    };

    setIsSubmitting(true);

    if (editingProfile) {
      updatePatient(editingProfile.id, patientData)
        .then((updatedProfile) => {
          setIsSubmitting(false);
          if (onSuccess) onSuccess(updatedProfile);
          onClose();
        })
        .catch((err) => {
          setIsSubmitting(false);
          console.error('Lỗi khi cập nhật hồ sơ:', err);
          alert('Không thể cập nhật hồ sơ. Vui lòng kiểm tra lại (CCCD/SĐT không được trùng).');
        });
    } else {
      createPatient(patientData)
        .then((newProfile) => {
          setIsSubmitting(false);
          if (onSuccess) onSuccess(newProfile);
          onClose();
        })
        .catch((err) => {
          setIsSubmitting(false);
          console.error('Lỗi khi tạo mới hồ sơ:', err);
          alert('Không thể tạo hồ sơ mới. Vui lòng kiểm tra lại (CCCD/SĐT không được trùng).');
        });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Form container */}
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full relative z-10 shadow-2xl border border-gray-100 animate-[fadeIn_0.2s_ease-out] flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <Icons.UserPlus className="w-5 h-5 text-blue-600" />
            <span>{editingProfile ? 'Cập nhật hồ sơ bệnh nhân' : 'Thêm hồ sơ bệnh nhân mới'}</span>
          </h3>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable form fields */}
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto py-4 pr-1 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Họ tên */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Họ và tên *</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A" 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium"
                required
              />
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Số điện thoại *</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09XXXXXXXX" 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium"
                required
              />
            </div>

            {/* Ngày sinh */}
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Ngày sinh *</label>
              <input 
                type="date" 
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium"
                required
              />
            </div>

            {/* Giới tính */}
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Giới tính</label>
              <select 
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium"
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>

            {/* Quan hệ */}
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Quan hệ với chủ tài khoản</label>
              <select 
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                disabled={editingProfile?.relationship === 'Bản thân'}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="Bản thân">Bản thân</option>
                <option value="Bố/Mẹ">Bố/Mẹ</option>
                <option value="Vợ/Chồng">Vợ/Chồng</option>
                <option value="Con cái">Con cái</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            {/* Số CCCD */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Số CCCD (Nếu có)</label>
              <input 
                type="text" 
                value={cccd}
                onChange={(e) => setCccd(e.target.value)}
                placeholder="Nhập 12 chữ số CCCD" 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium"
              />
            </div>

            {/* Địa chỉ */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Địa chỉ</label>
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Số nhà, Tên đường, Phường/Xã..." 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium"
              />
            </div>

          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gray-50 text-gray-500 hover:bg-gray-100 transition-all border border-gray-200 cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Đang lưu...' : editingProfile ? 'Cập nhật' : 'Lưu hồ sơ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientProfileModal;
