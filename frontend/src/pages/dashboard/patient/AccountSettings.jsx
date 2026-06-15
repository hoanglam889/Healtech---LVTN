import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import apiClient from '../../../services/apiClient';
import { useToast } from '../../../components/shared/ToastProvider';

export default function AccountSettings({ user }) {
  const { showToast } = useToast();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast('Vui lòng điền đầy đủ thông tin.', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Mật khẩu mới và xác nhận mật khẩu không khớp!', 'error');
      return;
    }
    if (newPassword.length < 1) {
      showToast('Mật khẩu mới không được để trống.', 'warning');
      return;
    }

    setLoading(true);
    try {
      await apiClient.patch('/auth/change-password', { oldPassword, newPassword });
      showToast('Đổi mật khẩu thành công!', 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Mật khẩu cũ không chính xác hoặc có lỗi xảy ra.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Tài khoản cá nhân</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý thông tin và bảo mật tài khoản của bạn</p>
        </div>

        {/* Account Info Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="font-extrabold text-gray-800 mb-4 flex items-center gap-2">
            <Icons.User className="w-5 h-5 text-blue-500" />
            Thông tin tài khoản
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500 font-semibold">Họ và tên</span>
              <span className="font-bold text-gray-800">{user?.fullName || '—'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500 font-semibold">Số điện thoại</span>
              <span className="font-bold text-gray-800">{user?.phone || '—'}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-500 font-semibold">Vai trò</span>
              <span className="font-bold text-gray-800">{user?.role === 'PATIENT' ? 'Bệnh nhân' : user?.role}</span>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="font-extrabold text-gray-800 mb-5 flex items-center gap-2">
            <Icons.Lock className="w-5 h-5 text-blue-500" />
            Đổi mật khẩu
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mật khẩu hiện tại</label>
              <div className="relative">
                <Icons.Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại..."
                  className="w-full bg-gray-50 border border-gray-200 outline-none pl-11 pr-4 py-3 rounded-xl text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-600/40 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mật khẩu mới</label>
              <div className="relative">
                <Icons.KeyRound className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới..."
                  className="w-full bg-gray-50 border border-gray-200 outline-none pl-11 pr-4 py-3 rounded-xl text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-600/40 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Xác nhận mật khẩu mới</label>
              <div className="relative">
                <Icons.KeyRound className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới..."
                  className="w-full bg-gray-50 border border-gray-200 outline-none pl-11 pr-4 py-3 rounded-xl text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-600/40 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-extrabold py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer mt-2"
            >
              {loading ? <Icons.Loader className="w-4 h-4 animate-spin" /> : <Icons.Save className="w-4 h-4" />}
              Lưu thay đổi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
