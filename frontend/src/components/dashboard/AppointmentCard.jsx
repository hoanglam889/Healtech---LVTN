import React from 'react';
import * as Icons from 'lucide-react';
import { BASE_URL } from '../../services/apiClient';

const AppointmentCard = ({ apt, onShowQr, formatDate }) => {
  const isUpcoming = apt.status === 'BOOKED';
  const isPaid = apt.invoices?.status === 'PAID';
  const imageUrl = apt.doctorProfile?.avatarUrl ? `${BASE_URL}${apt.doctorProfile.avatarUrl}` : null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-blue-50 rounded-full overflow-hidden shrink-0 flex items-center justify-center border border-blue-100 text-2xl">
          {imageUrl ? (
            <img src={imageUrl} alt={apt.doctorProfile?.fullName} className="w-full h-full object-cover" />
          ) : (
            <span>🩺</span>
          )}
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-gray-800 text-base">
            BS. {apt.doctorProfile?.fullName || 'Chuyên khoa'}
          </h4>
          <p className="text-xs text-gray-400 font-semibold">
            Chuyên khoa: <span className="text-gray-700">{apt.doctorProfile?.specialty?.name || 'Khám tổng quát'}</span>
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 pt-1">
            <span className="flex items-center gap-1">
              <Icons.Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(apt.appointmentDate)}</span>
            </span>
            <span className="flex items-center gap-1">
              <Icons.Clock className="w-3.5 h-3.5" />
              <span>{apt.appointmentTime?.substring(0, 5)}</span>
            </span>
            <span className="font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
              Mã: {apt.qrCode}
            </span>
          </div>
        </div>
      </div>

      {/* Trạng thái và Nút xem QR */}
      <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
        <div className="flex flex-col gap-1 sm:items-end">
          {/* Trạng thái khám */}
          <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
            isUpcoming ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-green-50 text-green-600 border border-green-100'
          }`}>
            {isUpcoming ? 'Đã xác nhận' : 'Đã khám'}
          </span>
          {/* Trạng thái hóa đơn */}
          <span className={`text-[10px] font-bold ${isPaid ? 'text-emerald-500' : 'text-amber-500'}`}>
            {isPaid ? '✓ Đã thanh toán' : '• Trả tiền tại quầy'}
          </span>
        </div>
        {isUpcoming && (
          <button 
            onClick={() => onShowQr(apt.qrCode)}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-all cursor-pointer flex items-center gap-1"
          >
            <Icons.QrCode className="w-3.5 h-3.5" />
            <span>Mã QR khám</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
