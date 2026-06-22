import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { staffLogin } from '../../services/authService';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../shared/LanguageSwitcher';

export default function StaffLogin({ onLoginSuccess, onGoHome }) {
  const { t } = useTranslation('auth');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone.trim() || !password.trim()) {
      setErrorMsg(t('error_fill_all'));
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const data = await staffLogin(phone, password);
      if (data && data.success) {
        if (data.access_token) localStorage.setItem('token', data.access_token);
        onLoginSuccess(data.user);
      } else {
        setErrorMsg(t('error_account_locked'));
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || t('error_invalid'));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoPhone, demoPass) => {
    setPhone(demoPhone);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-950 p-6 relative overflow-hidden font-sans">

      <div className="absolute top-[-10%] left-[-10%] w-[45%] aspect-square rounded-full bg-blue-600/15 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] aspect-square rounded-full bg-indigo-500/15 blur-[120px]"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white/5 border border-white/10 backdrop-blur-xl rounded-[40px] shadow-2xl overflow-hidden z-10">

        {/* LEFT PANEL */}
        <div className="lg:col-span-5 bg-gradient-to-b from-blue-600 to-blue-800 p-8 md:p-12 text-white flex flex-col justify-between relative">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur">
                <Icons.ShieldPlus className="w-6 h-6" />
              </div>
              <h1 className="font-extrabold text-xl tracking-tight leading-none">Healtech</h1>
            </div>

            <div className="space-y-4 pt-8">
              <h2 className="text-2xl font-extrabold leading-tight">{t('staff_portal_title')}</h2>
              <p className="text-sm text-blue-100/80 leading-relaxed font-semibold">
                {t('staff_portal_desc')}
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 space-y-4">
            <span className="text-[10px] font-bold text-blue-200/60 uppercase tracking-widest block">{t('tech_support')}</span>
            <p className="text-xs text-blue-100/70 font-semibold leading-relaxed">
              {t('tech_support_desc')}
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-7 bg-white p-8 md:p-12 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-extrabold text-gray-900 text-2xl">{t('portal_login')}</h3>
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <button
                  onClick={onGoHome}
                  className="text-xs text-blue-600 hover:text-blue-700 font-extrabold flex items-center gap-1.5 cursor-pointer bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100"
                >
                  <Icons.ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t('go_home')}</span>
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-bold animate-[fadeIn_0.15s_ease-out]">
                <Icons.AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">{t('phone')}</label>
                <div className="relative">
                  <Icons.Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('phone_staff_placeholder')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 outline-none pl-12 pr-4 py-3 rounded-xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400 focus:bg-white focus:border-blue-600/40 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">{t('password')}</label>
                <div className="relative">
                  <Icons.Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 outline-none pl-12 pr-4 py-3 rounded-xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400 focus:bg-white focus:border-blue-600/40 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-extrabold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center justify-center gap-2 text-sm cursor-pointer mt-8"
              >
                {loading ? <Icons.Loader className="w-5 h-5 animate-spin" /> : <Icons.LogIn className="w-5 h-5" />}
                <span>{t('start_shift_btn')}</span>
              </button>
            </form>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-3">{t('demo_accounts_staff')}</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickFill('008', '1')}
                className="p-3 text-left bg-gray-50/80 hover:bg-blue-50/40 border border-gray-100 hover:border-blue-100 rounded-2xl flex items-center gap-2.5 transition-all text-xs font-semibold text-gray-600 cursor-pointer"
              >
                <Icons.UserCog className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="font-extrabold text-gray-900 leading-tight">{t('receptionist')}</p>
                  <span className="text-[10px] text-gray-400 leading-none mt-0.5 block">008 / MK: 1</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('004', '1')}
                className="p-3 text-left bg-gray-50/80 hover:bg-blue-50/40 border border-gray-100 hover:border-blue-100 rounded-2xl flex items-center gap-2.5 transition-all text-xs font-semibold text-gray-600 cursor-pointer"
              >
                <Icons.Stethoscope className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="font-extrabold text-gray-900 leading-tight">{t('doctor_demo')}</p>
                  <span className="text-[10px] text-gray-400 leading-none mt-0.5 block">004 / MK: 1</span>
                </div>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
