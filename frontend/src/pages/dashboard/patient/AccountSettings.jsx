import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import apiClient from '../../../services/apiClient';
import { useToast } from '../../../components/shared/ToastProvider';
import { useTranslation } from 'react-i18next';

export default function AccountSettings({ user }) {
  const { t } = useTranslation('patient');
  const { showToast } = useToast();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast(t('settings.err_fill_all'), 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast(t('settings.err_mismatch'), 'error');
      return;
    }
    if (newPassword.length < 1) {
      showToast(t('settings.err_empty'), 'warning');
      return;
    }

    setLoading(true);
    try {
      await apiClient.patch('/auth/change-password', { oldPassword, newPassword });
      showToast(t('settings.success'), 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err.response?.data?.message || t('settings.err_wrong_old'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{t('settings.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('settings.subtitle')}</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="font-extrabold text-gray-800 mb-4 flex items-center gap-2">
            <Icons.User className="w-5 h-5 text-blue-500" />
            {t('settings.info_title')}
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500 font-semibold">{t('settings.fullname')}</span>
              <span className="font-bold text-gray-800">{user?.fullName || '—'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500 font-semibold">{t('settings.phone')}</span>
              <span className="font-bold text-gray-800">{user?.phone || '—'}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-500 font-semibold">{t('settings.role')}</span>
              <span className="font-bold text-gray-800">
                {user?.role === 'PATIENT' ? t('settings.role_patient') : user?.role}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="font-extrabold text-gray-800 mb-5 flex items-center gap-2">
            <Icons.Lock className="w-5 h-5 text-blue-500" />
            {t('settings.change_pw_title')}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('settings.current_pw')}</label>
              <div className="relative">
                <Icons.Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder={t('settings.current_pw_placeholder')}
                  className="w-full bg-gray-50 border border-gray-200 outline-none pl-11 pr-4 py-3 rounded-xl text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-600/40 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('settings.new_pw')}</label>
              <div className="relative">
                <Icons.KeyRound className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t('settings.new_pw_placeholder')}
                  className="w-full bg-gray-50 border border-gray-200 outline-none pl-11 pr-4 py-3 rounded-xl text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-600/40 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('settings.confirm_pw')}</label>
              <div className="relative">
                <Icons.KeyRound className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('settings.confirm_pw_placeholder')}
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
              {t('settings.save_btn')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
