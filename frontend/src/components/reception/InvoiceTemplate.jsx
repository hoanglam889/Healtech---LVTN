import React, { forwardRef } from 'react';

const InvoiceTemplate = forwardRef(({ appointment }, ref) => {
  if (!appointment) return null;

  const totalAmount = parseFloat(appointment.invoices?.totalAmount || 150000);
  
  const formatVND = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const today = new Date();
  
  return (
    <div ref={ref} className="bg-white p-10 w-full max-w-4xl mx-auto text-gray-900 font-sans print-container">
      {/* HEADER */}
      <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-black text-blue-700 tracking-tighter">HEALTECH ERP</h1>
          <p className="text-xs text-gray-500 font-semibold mt-1">Phòng khám Đa khoa thông minh Healtech</p>
          <div className="mt-3 text-xs text-gray-600">
            <p>📍 123 Đường Sức Khỏe, Quận Y Tế, TP.HCM</p>
            <p>📞 Hotline: 1900 1234</p>
            <p>📧 Email: contact@healtech.vn</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-widest">Hóa Đơn Dịch Vụ</h2>
          <p className="text-sm font-semibold mt-2">Mã HĐ: <span className="font-bold text-gray-900">#{appointment.invoices?.id || '---'}</span></p>
          <p className="text-sm font-semibold">Ngày in: <span className="font-bold">{today.toLocaleDateString('vi-VN')} {today.toLocaleTimeString('vi-VN')}</span></p>
        </div>
      </div>

      {/* THÔNG TIN BỆNH NHÂN & LỊCH KHÁM */}
      <div className="flex gap-10 mb-8 text-sm">
        <div className="flex-1">
          <h3 className="font-bold text-gray-400 uppercase tracking-widest text-[10px] mb-2 border-b border-gray-200 pb-1">Thông tin khách hàng</h3>
          <table className="w-full">
            <tbody>
              <tr><td className="py-1 text-gray-600 font-semibold w-24">Họ và tên:</td><td className="py-1 font-bold text-gray-900 uppercase">{appointment.patient?.fullName}</td></tr>
              <tr><td className="py-1 text-gray-600 font-semibold">Số điện thoại:</td><td className="py-1 font-bold">{appointment.patient?.phone || '---'}</td></tr>
              <tr><td className="py-1 text-gray-600 font-semibold">CCCD:</td><td className="py-1 font-bold">{appointment.patient?.cccd || '---'}</td></tr>
            </tbody>
          </table>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-400 uppercase tracking-widest text-[10px] mb-2 border-b border-gray-200 pb-1">Chi tiết khám</h3>
          <table className="w-full">
            <tbody>
              <tr><td className="py-1 text-gray-600 font-semibold w-28">Mã QR Code:</td><td className="py-1 font-bold text-blue-700">{appointment.qrCode}</td></tr>
              <tr><td className="py-1 text-gray-600 font-semibold">Bác sĩ PT:</td><td className="py-1 font-bold">{appointment.doctorProfile?.fullName}</td></tr>
              <tr><td className="py-1 text-gray-600 font-semibold">Chuyên khoa:</td><td className="py-1 font-bold">{appointment.doctorProfile?.specialty?.name}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* BẢNG CHI TIẾT DỊCH VỤ */}
      <div className="mb-8 border border-gray-300 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="py-3 px-4 text-left font-bold text-gray-700">#</th>
              <th className="py-3 px-4 text-left font-bold text-gray-700">Tên dịch vụ</th>
              <th className="py-3 px-4 text-center font-bold text-gray-700">Đơn vị</th>
              <th className="py-3 px-4 text-center font-bold text-gray-700">Số lượng</th>
              <th className="py-3 px-4 text-right font-bold text-gray-700">Thành tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-4 px-4 font-semibold text-gray-600">1</td>
              <td className="py-4 px-4 font-bold text-gray-900">
                Phí khám chuyên khoa ban đầu
                <div className="text-xs font-normal text-gray-500 mt-0.5">Tiếp nhận & thăm khám cùng bác sĩ {appointment.doctorProfile?.fullName}</div>
              </td>
              <td className="py-4 px-4 text-center font-semibold text-gray-600">Lần</td>
              <td className="py-4 px-4 text-center font-bold text-gray-900">1</td>
              <td className="py-4 px-4 text-right font-bold text-gray-900">{formatVND(totalAmount)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* TỔNG KẾT & CHỮ KÝ */}
      <div className="flex justify-between items-start mt-8">
        <div className="w-1/2">
          <h3 className="font-bold text-gray-400 uppercase tracking-widest text-[10px] mb-2">Phương thức thanh toán</h3>
          <p className="font-bold text-gray-800 bg-gray-100 inline-block px-3 py-1.5 rounded-lg border border-gray-200">
            {appointment.invoices?.paymentMethod === 'VNPAY' ? 'Chuyển khoản (VNPAY/VietQR)' : 'Tiền mặt (CASH)'}
          </p>
          <div className="mt-8">
            <p className="font-semibold text-gray-800 mb-1">Khách hàng</p>
            <p className="text-xs text-gray-500 italic">(Ký và ghi rõ họ tên)</p>
            <div className="h-20"></div>
          </div>
        </div>
        <div className="w-1/2">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-600">Tổng phụ:</span>
              <span className="text-sm font-bold text-gray-900">{formatVND(totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-600">Giảm giá:</span>
              <span className="text-sm font-bold text-gray-900">0 ₫</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-300 mt-2">
              <span className="text-base font-bold text-gray-800">TỔNG CỘNG:</span>
              <span className="text-2xl font-black text-rose-600">{formatVND(totalAmount)}</span>
            </div>
          </div>
          <div className="text-right pr-4">
            <p className="font-semibold text-gray-800 mb-1">Nhân viên thu ngân</p>
            <p className="text-xs text-gray-500 italic">(Ký và ghi rõ họ tên)</p>
            <div className="h-20"></div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center text-xs text-gray-400 border-t-2 border-gray-100 pt-6 mt-6">
        <p>Cảm ơn quý khách đã sử dụng dịch vụ của Healtech!</p>
        <p className="mt-1">Vui lòng kiểm tra lại thông tin trước khi rời quầy. Hóa đơn chỉ có giá trị trong ngày.</p>
      </div>

      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 20mm;
          }
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';

export default InvoiceTemplate;
