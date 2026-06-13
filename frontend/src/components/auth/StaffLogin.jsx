import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { staffLogin } from '../../services/authService';

export default function StaffLogin({ onLoginSuccess, onGoHome }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle submit credentials
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone.trim() || !password.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ số điện thoại và mật khẩu!');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const data = await staffLogin(phone, password);
      if (data && data.success) {
        onLoginSuccess(data.user);
      } else {
        setErrorMsg('Thông tin đăng nhập không hợp lệ hoặc tài khoản bị khóa.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill template credentials for demo evaluation
  const handleQuickFill = (demoPhone, demoPass) => {
    setPhone(demoPhone);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-950 p-6 relative overflow-hidden font-sans">
      
      {/* TRANG TRÍ GRAPHICS BẰNG CSS GRADIENTS */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] aspect-square rounded-full bg-blue-600/15 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] aspect-square rounded-full bg-indigo-500/15 blur-[120px]"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white/5 border border-white/10 backdrop-blur-xl rounded-[40px] shadow-2xl overflow-hidden z-10">
        
        {/* PANEL TRÁI: GIỚI THIỆU PHÂN HỆ */}
        <div className="lg:col-span-5 bg-gradient-to-b from-blue-600 to-blue-800 p-8 md:p-12 text-white flex flex-col justify-between relative">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur">
                <Icons.ShieldPlus className="w-6 h-6" />
              </div>
              <h1 className="font-extrabold text-xl tracking-tight leading-none">Healtech</h1>
            </div>

            <div className="space-y-4 pt-8">
              <h2 className="text-2xl font-extrabold leading-tight">Cổng Nhân Viên & Bác Sĩ Nội Bộ</h2>
              <p className="text-sm text-blue-100/80 leading-relaxed font-semibold">
                Chào mừng bạn đến với phân hệ quản lý hành chính y khoa Healtech ERP. Vui lòng đăng nhập bằng tài khoản được cấp để bắt đầu ca trực.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 space-y-4">
            <span className="text-[10px] font-bold text-blue-200/60 uppercase tracking-widest block">Thông tin hỗ trợ kỹ thuật</span>
            <p className="text-xs text-blue-100/70 font-semibold leading-relaxed">
              Mọi sự cố về tài khoản và phân quyền, vui lòng liên hệ phòng Công nghệ thông tin (Số máy lẻ: #101).
            </p>
          </div>
        </div>

        {/* PANEL PHẢI: FORM ĐĂNG NHẬP */}
        <div className="lg:col-span-7 bg-white p-8 md:p-12 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-extrabold text-gray-900 text-2xl">Đăng nhập cổng</h3>
              <button
                onClick={onGoHome}
                className="text-xs text-blue-600 hover:text-blue-700 font-extrabold flex items-center gap-1.5 cursor-pointer bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100"
              >
                <Icons.ArrowLeft className="w-3.5 h-3.5" />
                <span>Về trang chủ</span>
              </button>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-bold animate-[fadeIn_0.15s_ease-out]">
                <Icons.AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Số điện thoại</label>
                <div className="relative">
                  <Icons.Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Nhập số điện thoại nhân viên..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 outline-none pl-12 pr-4 py-3 rounded-xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400 focus:bg-white focus:border-blue-600/40 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Mật khẩu</label>
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
                <span>Bắt đầu ca trực</span>
              </button>
            </form>
          </div>

          {/* NUT CHỌN TÀI KHOẢN MẪU ĐỂ CHẤM ĐỒ ÁN NHANH */}
          <div className="mt-10 pt-6 border-t border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-3">Tài khoản thử nghiệm (Click để điền nhanh)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickFill('0900000000', '123')}
                className="p-3 text-left bg-gray-50/80 hover:bg-blue-50/40 border border-gray-100 hover:border-blue-100 rounded-2xl flex items-center gap-2.5 transition-all text-xs font-semibold text-gray-600 cursor-pointer"
              >
                <Icons.UserCog className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="font-extrabold text-gray-900 leading-tight">Mẫu Lễ Tân</p>
                  <span className="text-[10px] text-gray-400 leading-none mt-0.5 block">0900000000 / MK: 123</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('0000004', 'dummy_password')}
                className="p-3 text-left bg-gray-50/80 hover:bg-blue-50/40 border border-gray-100 hover:border-blue-100 rounded-2xl flex items-center gap-2.5 transition-all text-xs font-semibold text-gray-600 cursor-pointer"
              >
                <Icons.Stethoscope className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="font-extrabold text-gray-900 leading-tight">Mẫu Bác sĩ Mỹ Ái</p>
                  <span className="text-[10px] text-gray-400 leading-none mt-0.5 block">0000004 / MK: dummy_password</span>
                </div>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
