import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

const BANKS = [
  { code: 'VCB', name: 'Vietcombank', color: 'bg-green-600' },
  { code: 'TCB', name: 'Techcombank', color: 'bg-red-600' },
  { code: 'MB', name: 'MB Bank', color: 'bg-purple-600' },
  { code: 'ACB', name: 'ACB', color: 'bg-blue-600' },
];

export default function VNPaySimulation({ amount, orderInfo, onSuccess, onCancel }) {
  const [selectedBank, setSelectedBank] = useState('');
  const [processing, setProcessing] = useState(false);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      onSuccess();
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handlePay = () => {
    if (!selectedBank) return;
    setProcessing(true);
    setCountdown(3);
  };

  const formattedAmount = Number(amount || 150000).toLocaleString('vi-VN') + ' đ';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl">

        {/* VNPay Header */}
        <div className="bg-[#E2030C] px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-[#E2030C] font-black text-xs">VN</span>
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base leading-none">VNPay</h1>
            <p className="text-red-200 text-[10px] font-semibold mt-0.5">Cổng thanh toán trực tuyến (Mô phỏng)</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Order Info */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 font-semibold">Đơn hàng</span>
              <span className="font-bold text-gray-800">{orderInfo || 'Đặt lịch khám - Healtech'}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
              <span className="text-gray-500 font-semibold">Số tiền</span>
              <span className="font-extrabold text-blue-700 text-base">{formattedAmount}</span>
            </div>
          </div>

          {/* Bank Selection */}
          {!processing && (
            <>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Chọn ngân hàng</p>
                <div className="grid grid-cols-2 gap-2">
                  {BANKS.map((b) => (
                    <button
                      key={b.code}
                      onClick={() => setSelectedBank(b.code)}
                      className={`p-3 rounded-xl border-2 flex items-center gap-2 transition-all cursor-pointer text-sm font-bold
                        ${selectedBank === b.code
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200'
                        }`}
                    >
                      <div className={`w-6 h-6 ${b.color} rounded text-white flex items-center justify-center text-[9px] font-black shrink-0`}>
                        {b.code[0]}
                      </div>
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={onCancel}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={handlePay}
                  disabled={!selectedBank}
                  className="flex-1 py-3 rounded-xl bg-[#E2030C] text-white font-extrabold text-sm hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Thanh toán ngay
                </button>
              </div>
            </>
          )}

          {/* Processing State */}
          {processing && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                {countdown > 0 ? (
                  <Icons.Loader className="w-8 h-8 text-green-600 animate-spin" />
                ) : (
                  <Icons.CheckCircle className="w-8 h-8 text-green-600" />
                )}
              </div>
              <div>
                <p className="font-extrabold text-gray-800 text-base">
                  {countdown > 0 ? 'Đang xử lý thanh toán...' : 'Thanh toán thành công!'}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {countdown > 0
                    ? `Vui lòng chờ trong giây lát (${countdown}s)`
                    : 'Đang chuyển hướng...'}
                </p>
              </div>
              <div className="text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
                Ngân hàng: <strong>{BANKS.find((b) => b.code === selectedBank)?.name}</strong><br />
                Số tiền: <strong>{formattedAmount}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
