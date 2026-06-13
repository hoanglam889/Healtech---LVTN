import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { patientLogin, patientRegister } from '../../services/authService';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  
  // Login Form States
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register Form States
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDob, setRegDob] = useState('1995-01-01');
  const [regGender, setRegGender] = useState('MALE'); // 'MALE' | 'FEMALE'
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Handle patient login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginPhone.trim() || !loginPassword.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ số điện thoại và mật khẩu!');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const data = await patientLogin(loginPhone, loginPassword);
      if (data && data.success) {
        setSuccessMsg('Đăng nhập thành công!');
        setTimeout(() => {
          onLoginSuccess(data.user);
          onClose();
        }, 800);
      } else {
        setErrorMsg('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Số điện thoại hoặc mật khẩu không chính xác!');
    } finally {
      setLoading(false);
    }
  };

  // Handle patient registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim() || !regPassword.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ họ tên, số điện thoại và mật khẩu!');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        fullName: regName,
        phone: regPhone,
        dob: regDob,
        gender: regGender,
        password: regPassword
      };
      
      const data = await patientRegister(payload);
      if (data && data.success) {
        setSuccessMsg('Đăng ký tài khoản thành công! Đang tự động đăng nhập...');
        setTimeout(() => {
          onLoginSuccess(data.user);
          onClose();
        }, 1200);
      } else {
        setErrorMsg(data.message || 'Đăng ký thất bại. Vui lòng thử lại!');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Đăng ký thất bại. Số điện thoại có thể đã tồn tại!');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for evaluation
  const handleQuickFill = (phone, pass) => {
    setLoginPhone(phone);
    setLoginPassword(pass);
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop blur overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden z-10 animate-[fadeIn_0.2s_ease-out] flex flex-col max-h-[90vh]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors z-20 cursor-pointer"
        >
          <Icons.X className="w-5 h-5" />
        </button>

        {/* Tab Headers */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 p-1 mt-3 mx-4 rounded-2xl">
          <button
            onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-center text-sm font-extrabold rounded-xl transition-all cursor-pointer ${
              activeTab === 'login' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-center text-sm font-extrabold rounded-xl transition-all cursor-pointer ${
              activeTab === 'register' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Đăng ký tài khoản
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="mb-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-bold animate-[fadeIn_0.15s_ease-out]">
              <Icons.AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-600 text-xs font-bold animate-[fadeIn_0.15s_ease-out]">
              <Icons.CheckCircle className="w-5 h-5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'login' ? (
            /* ==========================================
               LOGIN FORM
               ========================================== */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Số điện thoại</label>
                <div className="relative">
                  <Icons.Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    placeholder="Nhập số điện thoại đăng nhập..."
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 outline-none pl-12 pr-4 py-3 rounded-xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400 focus:bg-white focus:border-blue-600/40 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Mật khẩu</label>
                <div className="relative">
                  <Icons.Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="Nhập mật khẩu..."
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 outline-none pl-12 pr-4 py-3 rounded-xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400 focus:bg-white focus:border-blue-600/40 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-extrabold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center justify-center gap-2 text-sm cursor-pointer mt-6"
              >
                {loading ? <Icons.Loader className="w-5 h-5 animate-spin" /> : <Icons.LogIn className="w-5 h-5" />}
                <span>Đăng nhập ngay</span>
              </button>

              {/* Quick Fill Box for Evaluation */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Tài khoản mẫu (Click để điền nhanh)</span>
                <button
                  type="button"
                  onClick={() => handleQuickFill('0987654321', '$2b$10$xP4.Wk.9y2...dummyhash987654321')}
                  className="w-full p-3 text-left bg-gray-50/80 hover:bg-blue-50/40 border border-gray-100 hover:border-blue-100 rounded-2xl flex items-center gap-2.5 transition-all text-xs font-semibold text-gray-600 cursor-pointer"
                >
                  <Icons.UserCheck className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-extrabold text-gray-900 leading-tight">Bệnh nhân Hoàng Lâm (Seeded)</p>
                    <span className="text-[9px] text-gray-400 leading-none mt-0.5 block">0987654321 / MK: $2b$10$xP4.Wk.9y2...dummyhash987654321</span>
                  </div>
                </button>
              </div>
            </form>
          ) : (
            /* ==========================================
               REGISTER FORM
               ========================================== */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Họ và tên bệnh nhân</label>
                <div className="relative">
                  <Icons.User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn A..."
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 outline-none pl-12 pr-4 py-3 rounded-xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400 focus:bg-white focus:border-blue-600/40 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Số điện thoại</label>
                <div className="relative">
                  <Icons.Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0987654321..."
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 outline-none pl-12 pr-4 py-3 rounded-xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400 focus:bg-white focus:border-blue-600/40 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Ngày sinh</label>
                  <input
                    type="date"
                    required
                    value={regDob}
                    onChange={(e) => setRegDob(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 outline-none px-4 py-3 rounded-xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-600/40 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Giới tính</label>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 outline-none px-4 py-3 rounded-xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-600/40 transition-all cursor-pointer"
                  >
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Mật khẩu</label>
                <div className="relative">
                  <Icons.Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="Mật khẩu của bạn..."
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 outline-none pl-12 pr-4 py-3 rounded-xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400 focus:bg-white focus:border-blue-600/40 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-extrabold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center justify-center gap-2 text-sm cursor-pointer mt-6"
              >
                {loading ? <Icons.Loader className="w-5 h-5 animate-spin" /> : <Icons.UserPlus className="w-5 h-5" />}
                <span>Đăng ký & Đăng nhập</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
