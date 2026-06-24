import React, { forwardRef } from 'react';

const InvoiceTemplate = forwardRef(({ appointment, invoiceDetails }, ref) => {
  if (!appointment) return null;

  const totalAmount = invoiceDetails?.totalAmount || appointment.invoices?.totalAmount || 150000;
  
  const formatVND = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const today = new Date();
  
  // Extract breakdown or use default
  const baseFee = invoiceDetails?.breakdown?.examFee || {
    name: 'Phí khám chuyên khoa ban đầu',
    price: 150000
  };
  const servicesList = invoiceDetails?.breakdown?.services || [];
  
  return (
    <div ref={ref} className="bg-white p-6 w-full max-w-3xl mx-auto text-gray-900 font-sans print-container">
      {/* HEADER */}
      <div className="flex justify-between items-start border-b-2 border-gray-900 pb-4 mb-4">
        <div>
          <h1 className="text-2xl font-black text-blue-700 tracking-tighter">HEALTECH ERP</h1>
          <p className="text-[10px] text-gray-500 font-semibold mt-1">Phòng khám Đa khoa thông minh Healtech</p>
          <div className="mt-2 text-[10px] text-gray-600">
            <p>📍 123 Đường Sức Khỏe, Quận Y Tế, TP.HCM</p>
            <p>📞 Hotline: 1900 1234</p>
            <p>📧 Email: contact@healtech.vn</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-800 uppercase tracking-widest">Hóa Đơn Dịch Vụ</h2>
          <p className="text-xs font-semibold mt-1">Mã HĐ: <span className="font-bold text-gray-900">#{appointment.invoices?.id || '---'}</span></p>
          <p className="text-xs font-semibold">Ngày in: <span className="font-bold">{today.toLocaleDateString('vi-VN')} {today.toLocaleTimeString('vi-VN')}</span></p>
        </div>
      </div>

      {/* THÔNG TIN BỆNH NHÂN & LỊCH KHÁM */}
      <div className="flex gap-6 mb-6 text-xs">
        <div className="flex-1">
          <h3 className="font-bold text-gray-400 uppercase tracking-widest text-[9px] mb-1.5 border-b border-gray-200 pb-1">Thông tin khách hàng</h3>
          <table className="w-full">
            <tbody>
              <tr><td className="py-0.5 text-gray-600 font-semibold w-20">Họ và tên:</td><td className="py-0.5 font-bold text-gray-900 uppercase">{appointment.patient?.fullName}</td></tr>
              <tr><td className="py-0.5 text-gray-600 font-semibold">SĐT:</td><td className="py-0.5 font-bold">{appointment.patient?.phone || '---'}</td></tr>
              <tr><td className="py-0.5 text-gray-600 font-semibold">CCCD:</td><td className="py-0.5 font-bold">{appointment.patient?.cccd || '---'}</td></tr>
            </tbody>
          </table>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-400 uppercase tracking-widest text-[9px] mb-1.5 border-b border-gray-200 pb-1">Chi tiết khám</h3>
          <table className="w-full">
            <tbody>
              <tr><td className="py-0.5 text-gray-600 font-semibold w-24">Mã QR Code:</td><td className="py-0.5 font-bold text-blue-700">{appointment.qrCode}</td></tr>
              <tr><td className="py-0.5 text-gray-600 font-semibold">Bác sĩ:</td><td className="py-0.5 font-bold">{appointment.doctorProfile?.fullName}</td></tr>
              <tr><td className="py-0.5 text-gray-600 font-semibold">Chuyên khoa:</td><td className="py-0.5 font-bold">{appointment.doctorProfile?.specialty?.name}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* BẢNG CHI TIẾT DỊCH VỤ */}
      <div className="mb-6 border border-gray-300 rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="py-2 px-3 text-left font-bold text-gray-700 w-10">#</th>
              <th className="py-2 px-3 text-left font-bold text-gray-700">Tên dịch vụ</th>
              <th className="py-2 px-3 text-center font-bold text-gray-700 w-16">Đơn vị</th>
              <th className="py-2 px-3 text-center font-bold text-gray-700 w-16">SL</th>
              <th className="py-2 px-3 text-right font-bold text-gray-700 w-28">Thành tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* ROW 1: Phí khám ban đầu */}
            <tr>
              <td className="py-2 px-3 font-semibold text-gray-600">1</td>
              <td className="py-2 px-3 font-bold text-gray-900">
                {baseFee.name}
                <div className="text-[10px] font-normal text-gray-500 mt-0.5">Tiếp nhận & thăm khám</div>
              </td>
              <td className="py-2 px-3 text-center font-semibold text-gray-600">Lần</td>
              <td className="py-2 px-3 text-center font-bold text-gray-900">1</td>
              <td className="py-2 px-3 text-right font-bold text-gray-900">{formatVND(baseFee.price)}</td>
            </tr>

            {/* ROW N: Các dịch vụ cận lâm sàng */}
            {servicesList.map((srv, index) => (
              <tr key={srv.id}>
                <td className="py-2 px-3 font-semibold text-gray-600">{index + 2}</td>
                <td className="py-2 px-3 font-bold text-gray-900">{srv.name}</td>
                <td className="py-2 px-3 text-center font-semibold text-gray-600">Lần</td>
                <td className="py-2 px-3 text-center font-bold text-gray-900">{srv.quantity}</td>
                <td className="py-2 px-3 text-right font-bold text-gray-900">{formatVND(srv.snapshotPrice * srv.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TỔNG KẾT & CHỮ KÝ */}
      <div className="flex justify-between items-start mt-6">
        <div className="w-1/2">
          <h3 className="font-bold text-gray-400 uppercase tracking-widest text-[9px] mb-1.5">Phương thức thanh toán</h3>
          <p className="font-bold text-gray-800 text-xs bg-gray-100 inline-block px-3 py-1.5 rounded-lg border border-gray-200">
            {appointment.invoices?.paymentMethod === 'VNPAY' ? 'Chuyển khoản (VNPAY/VietQR)' : 'Tiền mặt (CASH)'}
          </p>
          <div className="mt-8">
            <p className="font-semibold text-gray-800 text-xs mb-1">Khách hàng</p>
            <p className="text-[10px] text-gray-500 italic">(Ký và ghi rõ họ tên)</p>
          </div>
        </div>
        <div className="w-1/2">
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-gray-600">Tổng phụ:</span>
              <span className="text-xs font-bold text-gray-900">{formatVND(totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-gray-600">Giảm giá:</span>
              <span className="text-xs font-bold text-gray-900">0 ₫</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-300 mt-2">
              <span className="text-sm font-bold text-gray-800">TỔNG CỘNG:</span>
              <span className="text-lg font-black text-rose-600">{formatVND(totalAmount)}</span>
            </div>
          </div>
          <div className="text-right pr-4">
            <p className="font-semibold text-gray-800 text-xs mb-1">Nhân viên thu ngân</p>
            <p className="text-[10px] text-gray-500 italic">(Ký và ghi rõ họ tên)</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center text-[10px] text-gray-400 border-t border-gray-200 pt-4 mt-8">
        <p>Cảm ơn quý khách đã sử dụng dịch vụ của Healtech!</p>
        <p>Vui lòng kiểm tra lại thông tin trước khi rời quầy. Hóa đơn chỉ có giá trị trong ngày.</p>
      </div>

      <style>{`
        @media print {
          @page {
            size: auto; /* Để máy in tự nhận diện (thường là A4) */
            margin: 10mm; /* Margin vừa đủ nhỏ để không tràn trang */
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Gỡ bỏ shadow và các yếu tố viền rườm rà lúc in */
          .print-container {
            box-shadow: none !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* Ép không được ngắt trang ở giữa bảng */
          table, tr, td, th {
            page-break-inside: avoid;
          }
          /* Ẩn các cuộn trang dư thừa */
          html, body {
            overflow: visible;
            height: auto;
          }
        }
      `}</style>
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';

export default InvoiceTemplate;
