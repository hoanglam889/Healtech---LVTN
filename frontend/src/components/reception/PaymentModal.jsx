import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, appointment, onConfirm }) {
  const [paymentMethod, setPaymentMethod] = useState('CASH'); // 'CASH' | 'VNPAY'
  const [customerPaidStr, setCustomerPaidStr] = useState('');
  
  // Reset form khi đổi hóa đơn
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (isOpen) {
      setPaymentMethod('CASH');
      setCustomerPaidStr('');
    }
  }, [isOpen, appointment]);

  if (!isOpen || !appointment) return null;

  const getAmountToPay = (appt) => {
    const total = parseFloat(appt.invoices?.totalAmount || 150000);
    if (appt.status !== 'PENDING' && total > 150000) {
      return total - 150000;
    }
    return total;
  };

  const totalAmount = getAmountToPay(appointment);
  
  // Xử lý chuỗi nhập tiền
  const customerPaid = parseFloat(customerPaidStr.replace(/\D/g, '')) || 0;
  const changeAmount = customerPaid - totalAmount;

  // Xử lý nhập tiền khách đưa
  const handleCustomerPaidChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setCustomerPaidStr(value ? parseInt(value).toLocaleString('vi-VN') : '');
  };

  const handleConfirm = () => {
    onConfirm(appointment.id, paymentMethod);
  };

  const formatVND = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Container - Medium Size (max-w-3xl) */}
      <div className="bg-white rounded-3xl w-full max-w-3xl relative z-10 shadow-2xl border border-gray-100 animate-[fadeIn_0.2s_ease-out] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-extrabold text-lg text-gray-900 flex items-center gap-2">
            <Icons.Receipt className="w-5 h-5 text-blue-600" />
            <span>Thanh toán Thu ngân</span>
          </h3>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-gray-200 rounded-xl text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - 4-8 Grid Layout */}
        <div className="flex flex-col md:flex-row h-full">
          
          {/* Left Column (4/12) - Payment Methods */}
          <div className="w-full md:w-1/3 border-r border-gray-100 bg-gray-50/30 p-6 flex flex-col gap-3">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Hình thức thanh toán</h4>
            
            {/* Tab Tiền mặt */}
            <button
              onClick={() => setPaymentMethod('CASH')}
              className={`flex flex-col gap-2 px-4 py-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                paymentMethod === 'CASH' 
                  ? 'border-blue-600 bg-blue-50/50 shadow-sm' 
                  : 'border-transparent bg-white shadow-sm hover:border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${paymentMethod === 'CASH' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Icons.Banknote className="w-5 h-5" />
                </div>
                <div>
                  <p className={`font-bold text-sm ${paymentMethod === 'CASH' ? 'text-blue-900' : 'text-gray-700'}`}>Tiền mặt</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Thanh toán trực tiếp</p>
                </div>
              </div>
            </button>

            {/* Tab Chuyển khoản */}
            <button
              onClick={() => setPaymentMethod('VNPAY')}
              className={`flex flex-col gap-2 px-4 py-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                paymentMethod === 'VNPAY' 
                  ? 'border-blue-600 bg-blue-50/50 shadow-sm' 
                  : 'border-transparent bg-white shadow-sm hover:border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${paymentMethod === 'VNPAY' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Icons.QrCode className="w-5 h-5" />
                </div>
                <div>
                  <p className={`font-bold text-sm ${paymentMethod === 'VNPAY' ? 'text-blue-900' : 'text-gray-700'}`}>Chuyển khoản</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Quét mã QR / VNPAY</p>
                </div>
              </div>
            </button>
          </div>

          {/* Right Column (8/12) - Interaction Area */}
          <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
            <div>
              {/* Thông tin chung */}
              <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-gray-500">Khách hàng:</span>
                  <span className="text-sm font-extrabold text-gray-900">{appointment.patient?.fullName}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 border-dashed">
                  <span className="text-sm font-bold text-gray-500">Dịch vụ khám:</span>
                  <span className="text-sm font-bold text-gray-700">{appointment.doctorProfile?.specialty?.name}</span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-sm font-bold text-gray-500">Tổng tiền cần thu:</span>
                  <span className="text-2xl font-black text-rose-600">{formatVND(totalAmount)}</span>
                </div>
              </div>

              {/* Khu vực thay đổi dựa theo Phương thức */}
              {paymentMethod === 'CASH' ? (
                <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tiền khách đưa (VNĐ)</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={customerPaidStr}
                        onChange={handleCustomerPaidChange}
                        placeholder="Nhập số tiền..." 
                        className="w-full bg-white border-2 border-gray-200 px-5 py-3.5 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-bold text-lg text-gray-800 transition-all"
                      />
                      <span className="absolute right-5 top-3.5 font-bold text-gray-400">₫</span>
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border-2 flex justify-between items-center transition-colors ${
                    changeAmount < 0 ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                  }`}>
                    <span className="font-bold text-sm">{changeAmount < 0 ? 'Còn thiếu:' : 'Tiền thối lại:'}</span>
                    <span className="font-black text-xl">{formatVND(Math.abs(changeAmount))}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 animate-[fadeIn_0.3s_ease-out] text-center">
                  <div className="w-24 h-24 bg-blue-50 rounded-3xl border-2 border-blue-100 border-dashed flex items-center justify-center mb-4">
                    <Icons.QrCode className="w-10 h-10 text-blue-400" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">Mã QR Thanh toán VNPAY</h4>
                  <p className="text-xs text-gray-500 font-medium max-w-[250px]">
                    (Khu vực hiển thị mã QR động API Sandbox sẽ được nhúng vào đây ở các bản cập nhật sau)
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
              <button 
                onClick={onClose}
                className="px-6 py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleConfirm}
                disabled={paymentMethod === 'CASH' && changeAmount < 0}
                className="px-8 py-3 rounded-xl font-black text-sm bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Icons.CheckCircle className="w-5 h-5" />
                <span>Xác nhận đã thanh toán</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
