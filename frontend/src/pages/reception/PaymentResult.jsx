import React from 'react';
import * as Icons from 'lucide-react';

export default function PaymentResult() {
  const searchParams = new URLSearchParams(window.location.search);

  const status = searchParams.get('status');
  const invoiceId = searchParams.get('invoiceId');
  const amount = searchParams.get('amount');
  const message = searchParams.get('message');

  const isSuccess = status === 'success';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100">
        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${isSuccess ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
          {isSuccess ? <Icons.CheckCircle className="w-10 h-10" /> : <Icons.XCircle className="w-10 h-10" />}
        </div>
        
        <h2 className={`text-2xl font-black mb-2 ${isSuccess ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại!'}
        </h2>
        
        <p className="text-gray-500 font-medium mb-8">
          {message || (isSuccess ? 'Giao dịch đã được ghi nhận vào hệ thống.' : 'Đã có lỗi xảy ra hoặc bạn đã hủy giao dịch.')}
        </p>

        <div className="bg-gray-50 rounded-2xl p-5 mb-8 text-left space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-500 font-medium text-sm">Mã hóa đơn</span>
            <span className="font-bold text-gray-900">#{invoiceId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium text-sm">Số tiền</span>
            <span className="font-black text-rose-600">
              {amount ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount) : '0 ₫'}
            </span>
          </div>
        </div>

        <button
          onClick={() => window.location.href = '/staff?tab=billing'}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
        >
          <Icons.ArrowLeft className="w-5 h-5" />
          Quay lại Quầy thu ngân
        </button>
      </div>
    </div>
  );
}
