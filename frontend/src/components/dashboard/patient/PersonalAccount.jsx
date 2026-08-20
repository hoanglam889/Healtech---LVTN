import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { updatePatientAccount } from '../../../services/authService';
import { useToast } from '../../../contexts/ToastContext';

export default function PersonalAccount({ user }) {
  const [email, setEmail] = useState(user?.email || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    
    // Validate
    if (newPassword && newPassword !== confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp', 'error');
      return;
    }
    if (newPassword && !oldPassword) {
      showToast('Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu', 'error');
      return;
    }

    if (newPassword) {
      const passwordRegex = /^(?=.*[a-zA-Z]).{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        showToast('Mật khẩu mới phải có ít nhất 8 ký tự và chứa ít nhất 1 chữ cái!', 'error');
        return;
      }
    }

    setLoading(true);
    try {
      const data = {};
      if (email !== user?.email) data.email = email;
      if (oldPassword && newPassword) {
        data.oldPassword = oldPassword;
        data.newPassword = newPassword;
      }

      // Chỉ gọi API nếu có thay đổi
      if (Object.keys(data).length > 0) {
        await updatePatientAccount(data);
        showToast('Cập nhật tài khoản thành công!');
        
        // Reset password fields
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast('Không có thay đổi nào để lưu', 'error');
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-4 lg:py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 lg:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Icons.UserCog className="w-5 h-5" />
              </div>
              Tài khoản cá nhân
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-1">Quản lý thông tin đăng nhập và bảo mật của bạn</p>
          </div>
        </div>



        {/* Cảnh báo SĐT */}
        <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3">
          <Icons.Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-700 font-medium leading-relaxed">
            <span className="font-bold block mb-1 text-amber-800">Lưu ý về Số điện thoại đăng nhập:</span>
            Số điện thoại được sử dụng làm danh tính chính (ID) của tài khoản. Để bảo đảm tính toàn vẹn của hồ sơ sức khỏe và lịch sử khám bệnh, bạn không thể tự thay đổi Số điện thoại. Nếu bạn làm mất số điện thoại, vui lòng liên hệ Lễ tân (090xxxxxxx) để được hỗ trợ cấp lại tài khoản.
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-xl">
          <form onSubmit={handleUpdateAccount} className="space-y-8">
            
            {/* THÔNG TIN CHUNG */}
            <div className="space-y-5">
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
                Thông tin cơ bản
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Số điện thoại đăng nhập</label>
                  <div className="relative">
                    <Icons.Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-300" />
                    <input
                      type="text"
                      value={user?.phone || 'Chưa cập nhật'}
                      disabled
                      className="w-full bg-gray-100 border border-gray-200 outline-none pl-12 pr-4 py-3 rounded-xl font-bold text-gray-500 text-sm cursor-not-allowed opacity-80"
                    />
                    <Icons.Lock className="absolute right-4 top-3.5 w-5 h-5 text-gray-300" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Địa chỉ Email</label>
                  <div className="relative">
                    <Icons.Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Nhập địa chỉ email của bạn..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 outline-none pl-12 pr-4 py-3 rounded-xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* BẢO MẬT & ĐỔI MẬT KHẨU */}
            <div className="space-y-5 pt-4">
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
                Bảo mật & Mật khẩu
              </h3>
              
              <p className="text-xs text-gray-500 font-medium">Bỏ trống các trường này nếu bạn không muốn đổi mật khẩu.</p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Mật khẩu hiện tại</label>
                  <div className="relative">
                    <Icons.Shield className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 outline-none pl-12 pr-4 py-3 rounded-xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Mật khẩu mới</label>
                    <div className="relative">
                      <Icons.Key className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 outline-none pl-12 pr-4 py-3 rounded-xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Xác nhận mật khẩu mới</label>
                    <div className="relative">
                      <Icons.CheckCircle2 className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 outline-none pl-12 pr-4 py-3 rounded-xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loading ? <Icons.Loader className="w-5 h-5 animate-spin" /> : <Icons.Save className="w-5 h-5" />}
                <span>Lưu thay đổi</span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
