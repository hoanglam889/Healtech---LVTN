import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createPatient, updatePatient } from '../../../services/patientService';

// Schema xác thực dữ liệu bằng Zod
const patientSchema = z.object({
  fullName: z.string().trim().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  phone: z.string().trim()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, 'Số điện thoại không hợp lệ (Gồm 10 số, bắt đầu bằng 0)'),
  dob: z.string().min(1, 'Vui lòng chọn ngày sinh'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  relationship: z.string().min(1, 'Vui lòng chọn mối quan hệ'),
  cccd: z.string().trim().optional().refine(val => !val || /^\d{12}$/.test(val), {
    message: 'CCCD phải bao gồm đúng 12 chữ số'
  }),
  address: z.string().trim().optional()
});

const PatientProfileModal = ({ isOpen, onClose, editingProfile, user, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // Khởi tạo React Hook Form
  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      dob: '',
      gender: 'MALE',
      relationship: 'Khác',
      cccd: '',
      address: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      setServerError('');
      if (editingProfile) {
        reset({
          fullName: editingProfile.fullName || '',
          phone: editingProfile.phone || '',
          dob: editingProfile.dob || '',
          gender: editingProfile.gender || 'MALE',
          relationship: editingProfile.relationship || 'Khác',
          cccd: editingProfile.cccd || '',
          address: editingProfile.address || ''
        });
      } else {
        reset({
          fullName: '',
          phone: user?.phone || '',
          dob: '',
          gender: 'MALE',
          relationship: 'Khác',
          cccd: '',
          address: ''
        });
      }
    }
  }, [isOpen, editingProfile, user, reset]);

  if (!isOpen) return null;

  const onSubmit = (data) => {
    setServerError('');
    const patientData = {
      ...data,
      cccd: data.cccd || null,
      address: data.address || null,
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
          setServerError('Không thể cập nhật hồ sơ. Vui lòng kiểm tra lại (CCCD/SĐT không được trùng).');
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
          setServerError('Không thể tạo hồ sơ mới. Vui lòng kiểm tra lại (CCCD/SĐT không được trùng).');
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

        {serverError && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 flex items-start gap-2">
            <Icons.AlertCircle className="w-5 h-5 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Scrollable form fields */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto py-4 pr-1 flex-1 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Họ tên */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Họ và tên *</label>
              <input 
                type="text" 
                {...register('fullName')}
                placeholder="Nguyễn Văn A" 
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-sm font-medium ${errors.fullName ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-blue-600'}`}
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1"><Icons.AlertCircle className="w-3.5 h-3.5" />{errors.fullName.message}</p>}
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Số điện thoại *</label>
              <input 
                type="tel" 
                {...register('phone')}
                placeholder="09XXXXXXXX" 
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-sm font-medium ${errors.phone ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-blue-600'}`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1"><Icons.AlertCircle className="w-3.5 h-3.5" />{errors.phone.message}</p>}
            </div>

            {/* Ngày sinh */}
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Ngày sinh *</label>
              <input 
                type="date" 
                {...register('dob')}
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-sm font-medium ${errors.dob ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-blue-600'}`}
              />
              {errors.dob && <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1"><Icons.AlertCircle className="w-3.5 h-3.5" />{errors.dob.message}</p>}
            </div>

            {/* Giới tính */}
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Giới tính</label>
              <select 
                {...register('gender')}
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
                {...register('relationship')}
                disabled={editingProfile?.relationship === 'Bản thân'}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {editingProfile?.relationship === 'Bản thân' && (
                  <option value="Bản thân">Bản thân</option>
                )}
                {!editingProfile && <option value="" disabled>-- Chọn quan hệ --</option>}
                <option value="Bố/Mẹ">Bố/Mẹ</option>
                <option value="Vợ/Chồng">Vợ/Chồng</option>
                <option value="Con cái">Con cái</option>
                <option value="Khác">Khác</option>
              </select>
              {errors.relationship && <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1"><Icons.AlertCircle className="w-3.5 h-3.5" />{errors.relationship.message}</p>}
            </div>

            {/* Số CCCD */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Số CCCD (Nếu có)</label>
              <input 
                type="text" 
                {...register('cccd')}
                placeholder="Nhập 12 chữ số CCCD" 
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-sm font-medium ${errors.cccd ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-blue-600'}`}
              />
              {errors.cccd && <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1"><Icons.AlertCircle className="w-3.5 h-3.5" />{errors.cccd.message}</p>}
            </div>

            {/* Địa chỉ */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Địa chỉ</label>
              <input 
                type="text" 
                {...register('address')}
                placeholder="Số nhà, Tên đường, Phường/Xã..." 
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-sm font-medium ${errors.address ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-blue-600'}`}
              />
            </div>

          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
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
              className="px-5 py-2.5 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang lưu...
                </>
              ) : editingProfile ? 'Cập nhật' : 'Lưu hồ sơ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientProfileModal;
