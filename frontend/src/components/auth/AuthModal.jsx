import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { patientLogin, patientRegister, patientVerifyOtp, forgotPassword, verifyResetOtp, resetPassword } from '../../services/authService';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register' | 'otp'
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDob, setRegDob] = useState('1995-01-01');
  const [regGender, setRegGender] = useState('MALE'); // 'MALE' | 'FEMALE'
  const [regPassword, setRegPassword] = useState('');
  
  // OTP Form States
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  // Forgot Password States
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Handle patient login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ Email và mật khẩu!');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const data = await patientLogin(loginEmail, loginPassword);
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

  // Gửi form đăng ký
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ họ tên, email và mật khẩu!');
      return;
    }

    // Validate mật khẩu: ít nhất 8 ký tự, ít nhất 1 chữ cái
    const passwordRegex = /^(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(regPassword)) {
      setErrorMsg('Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất 1 chữ cái!');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        fullName: regName,
        email: regEmail,
        dob: regDob,
        gender: regGender,
        password: regPassword
      };
      
      const data = await patientRegister(payload);
      if (data && data.success) {
        if (data.requireOtp) {
          setSuccessMsg(data.message || 'Vui lòng kiểm tra email để lấy mã xác thực.');
          setActiveTab('otp');
          setCountdown(30);
        } else {
          setSuccessMsg('Đăng ký tài khoản thành công! Đang tự động đăng nhập...');
          setTimeout(() => {
            onLoginSuccess(data.user);
            onClose();
          }, 1200);
        }
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
  const handleQuickFill = (email, pass) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setErrorMsg('Vui lòng nhập mã OTP!');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const data = await patientVerifyOtp(regEmail, otpCode);
      if (data && data.success) {
        setSuccessMsg('Xác thực thành công! Đang tự động đăng nhập...');
        setTimeout(() => {
          onLoginSuccess(data.user);
          onClose();
        }, 1200);
      } else {
        setErrorMsg(data.message || 'Xác thực thất bại!');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Mã xác thực không chính xác!');
    } finally {
      setLoading(false);
    }
  };
  // Handle Forgot Password Submit
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setErrorMsg('Vui lòng điền email!');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const data = await forgotPassword(resetEmail);
      if (data && data.success) {
        setSuccessMsg(data.message || 'Mã xác thực đã được gửi đến email của bạn.');
        setActiveTab('reset_otp');
        setCountdown(30);
      } else {
        setErrorMsg(data.message || 'Có lỗi xảy ra!');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Không tìm thấy tài khoản với email này!');
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify Reset OTP
  const handleVerifyResetOtp = async (e) => {
    e.preventDefault();
    if (!resetOtp.trim()) {
      setErrorMsg('Vui lòng nhập mã OTP!');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const data = await verifyResetOtp(resetEmail, resetOtp);
      if (data && data.success) {
        setSuccessMsg('Xác thực thành công. Vui lòng đặt mật khẩu mới.');
        setActiveTab('new_password');
      } else {
        setErrorMsg(data.message || 'Xác thực thất bại!');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Mã xác thực không chính xác!');
    } finally {
      setLoading(false);
    }
  };

  // Handle Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword.trim() || !confirmNewPassword.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ mật khẩu mới và xác nhận!');
      return;
    }

    const passwordRegex = /^(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setErrorMsg('Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất 1 chữ cái!');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp!');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const data = await resetPassword(resetEmail, resetOtp, newPassword);
      if (data && data.success) {
        setSuccessMsg('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
        setTimeout(() => {
          setActiveTab('login');
          setResetEmail('');
          setResetOtp('');
          setNewPassword('');
          setConfirmNewPassword('');
          setSuccessMsg('');
        }, 2000);
      } else {
        setErrorMsg(data.message || 'Có lỗi xảy ra!');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        fullName: regName,
        email: regEmail,
        dob: regDob,
        gender: regGender,
        password: regPassword
      };
      
      const data = await patientRegister(payload);
      if (data && data.success) {
        setSuccessMsg('Đã gửi lại mã xác thực mới vào email của bạn.');
        setCountdown(30);
      } else {
        setErrorMsg(data.message || 'Gửi lại mã thất bại. Vui lòng thử lại!');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Có lỗi xảy ra khi gửi lại mã!');
    } finally {
      setLoading(false);
    }
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
              (activeTab === 'register' || activeTab === 'otp')
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
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Email</label>
                <div className="relative">
                  <Icons.Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="Nhập email đăng nhập..."
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
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

              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => { setActiveTab('forgot_password'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Quên mật khẩu?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-extrabold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center justify-center gap-2 text-sm cursor-pointer mt-6"
              >
                {loading ? <Icons.Loader className="w-5 h-5 animate-spin" /> : <Icons.LogIn className="w-5 h-5" />}
                <span>Đăng nhập ngay</span>
              </button>


            </form>
          ) : activeTab === 'register' ? (
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
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Email</label>
                <div className="relative">
                  <Icons.Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="VD: nguyenvan@gmail.com..."
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
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
                <span>Đăng ký ngay</span>
              </button>
            </form>
          ) : activeTab === 'otp' ? (
            /* ==========================================
               OTP VERIFICATION FORM
               ========================================== */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icons.ShieldCheck className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Xác thực Email</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Vui lòng nhập mã OTP 6 số đã được gửi đến email <b>{regEmail}</b>
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block text-center">Mã xác thực OTP</label>
                <div className="relative max-w-[240px] mx-auto">
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="Nhập 6 số..."
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))} // Chỉ cho phép nhập số
                    className="w-full bg-gray-50 border border-gray-100 outline-none px-4 py-4 rounded-xl font-bold text-blue-600 text-2xl text-center tracking-[0.5em] focus:ring-2 focus:ring-blue-500/20 placeholder-gray-300 focus:bg-white focus:border-blue-600/40 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full bg-blue-600 text-white font-extrabold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center justify-center gap-2 text-sm cursor-pointer mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Icons.Loader className="w-5 h-5 animate-spin" /> : <Icons.CheckCircle className="w-5 h-5" />}
                <span>Xác nhận & Đăng nhập</span>
              </button>

              {/* Resend OTP */}
              <div className="text-center mt-3">
                <p className="text-xs text-gray-500 font-semibold mb-2">Chưa nhận được mã?</p>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || loading}
                  className={`text-sm font-bold transition-colors ${
                    countdown > 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-blue-600 hover:text-blue-800 underline'
                  }`}
                >
                  {countdown > 0 ? `Gửi lại mã sau ${countdown}s` : 'Gửi lại mã ngay'}
                </button>
              </div>

              <div className="text-center mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setCountdown(0); }}
                  className="text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
                >
                  ← Quay lại Đăng ký
                </button>
              </div>
            </form>
          ) : activeTab === 'forgot_password' ? (
            /* ==========================================
               FORGOT PASSWORD FORM
               ========================================== */
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Khôi phục mật khẩu</h3>
                <p className="text-sm text-gray-500 mt-2">Nhập email đăng ký để nhận mã OTP</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Email</label>
                <div className="relative">
                  <Icons.Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="Nhập email..."
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 outline-none pl-12 pr-4 py-3 rounded-xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400 focus:bg-white focus:border-blue-600/40 transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-extrabold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center justify-center gap-2 text-sm cursor-pointer mt-4"
              >
                {loading ? <Icons.Loader className="w-5 h-5 animate-spin" /> : <Icons.Send className="w-5 h-5" />}
                <span>Gửi mã xác thực</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="w-full text-center text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors mt-4"
              >
                Quay lại đăng nhập
              </button>
            </form>
          ) : activeTab === 'reset_otp' ? (
            /* ==========================================
               RESET OTP FORM
               ========================================== */
            <form onSubmit={handleVerifyResetOtp} className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                  <Icons.ShieldCheck className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-800 mb-2">Nhập mã xác thực</h3>
                <p className="text-sm text-gray-500">
                  Mã OTP 6 số đã được gửi đến email<br/>
                  <span className="font-bold text-gray-700">{resetEmail}</span>
                </p>
              </div>

              <div className="relative max-w-[240px] mx-auto">
                <input
                  type="text"
                  required
                  maxLength="6"
                  placeholder="------"
                  value={resetOtp}
                  onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-gray-50 border-2 border-gray-100 outline-none px-4 py-4 rounded-2xl font-bold text-center text-3xl tracking-[0.5em] text-gray-800 focus:border-blue-500 focus:bg-white transition-all placeholder-gray-300"
                />
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading || resetOtp.length !== 6}
                  className="w-full bg-blue-600 text-white font-extrabold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Icons.Loader className="w-5 h-5 animate-spin" /> : <Icons.CheckCircle className="w-5 h-5" />}
                  <span>Xác thực & Tiếp tục</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('forgot_password')}
                  className="w-full text-center text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Đổi email khác
                </button>
              </div>
            </form>
          ) : activeTab === 'new_password' ? (
            /* ==========================================
               NEW PASSWORD FORM
               ========================================== */
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Đặt lại mật khẩu</h3>
                <p className="text-sm text-gray-500 mt-2">Vui lòng nhập mật khẩu mới cho tài khoản</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Mật khẩu mới</label>
                <div className="relative">
                  <Icons.Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="Mật khẩu mới..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 outline-none pl-12 pr-4 py-3 rounded-xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400 focus:bg-white focus:border-blue-600/40 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Xác nhận mật khẩu</label>
                <div className="relative">
                  <Icons.Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="Xác nhận mật khẩu..."
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 outline-none pl-12 pr-4 py-3 rounded-xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400 focus:bg-white focus:border-blue-600/40 transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-extrabold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center justify-center gap-2 text-sm cursor-pointer mt-4"
              >
                {loading ? <Icons.Loader className="w-5 h-5 animate-spin" /> : <Icons.Save className="w-5 h-5" />}
                <span>Lưu mật khẩu mới</span>
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}
