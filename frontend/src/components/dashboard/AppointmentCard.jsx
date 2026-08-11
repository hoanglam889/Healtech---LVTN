import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { BASE_URL } from '../../services/apiClient';

const AppointmentCard = ({ apt, onShowQr, formatDate, onCancel, onRate, onPayService, onCompleteService }) => {
  const [showTimeline, setShowTimeline] = useState(false);
  const isDone = apt.status === 'DONE';
  const isUpcoming = apt.status === 'BOOKED';
  const isCancelled = apt.status === 'CANCELLED';
  const isCheckedIn = apt.status === 'WAITING' || apt.status === 'EXAMINING';
  const isPaid = apt.invoices?.status === 'PAID';
  const isDoingService = apt.status === 'DOING_SERVICE';
  const imageUrl = apt.doctorProfile?.avatarUrl ? `${BASE_URL}${apt.doctorProfile.avatarUrl}` : null;
  const logs = apt.appointmentStatusLogs || [];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow transition-all flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-blue-50 rounded-full overflow-hidden shrink-0 flex items-center justify-center border border-blue-100 text-2xl">
            {imageUrl ? (
              <img src={imageUrl} alt={apt.doctorProfile?.fullName} className="w-full h-full object-cover" />
            ) : (
              <span>🩺</span>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-gray-800 text-base">
                BS. {apt.doctorProfile?.fullName || 'Chuyên khoa'}
              </h4>
              {isPaid && (
                <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">
                  <Icons.CheckCircle2 className="w-3 h-3" />
                  Đã thanh toán
                </span>
              )}
            </div>
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

        {/* Trạng thái và Các nút hành động */}
        <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
          <div className="flex flex-col gap-1 sm:items-end">
            {/* Trạng thái khám */}
            <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
              isUpcoming 
                ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                : isDoingService
                  ? 'bg-amber-50 text-amber-600 border border-amber-100'
                  : isCheckedIn
                    ? 'bg-purple-50 text-purple-600 border border-purple-100'
                    : isCancelled
                      ? 'bg-red-50 text-red-600 border border-red-100'
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            }`}>
              {isUpcoming ? 'Đã đặt' : isDoingService ? 'Đang làm dịch vụ' : isCheckedIn ? 'Đã check-in' : isCancelled ? 'Đã hủy' : 'Hoàn thành'}
            </span>
            {/* Trạng thái hóa đơn */}
            <span className={`text-[10px] font-bold ${isPaid ? 'text-emerald-500' : 'text-amber-500'}`}>
              {isPaid ? '✓ Đã thanh toán' : '• Trả tiền tại quầy'}
            </span>
          </div>
          
          <div className="flex gap-2 flex-wrap sm:justify-end">
            {/* Nút Xem lịch sử (Timeline) */}
            {logs.length > 0 && (
              <button
                onClick={() => setShowTimeline(!showTimeline)}
                className="text-xs font-bold text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 transition-all cursor-pointer flex items-center gap-1"
              >
                <Icons.History className="w-3.5 h-3.5" />
                <span>Lịch sử</span>
              </button>
            )}

            {isUpcoming && onCancel && (
              <button 
                onClick={() => {
                  if (isPaid) {
                    alert('Bạn không thể hủy lịch này vì đơn khám đã được thanh toán.\nVui lòng liên hệ trực tiếp với Phòng khám để được hỗ trợ đổi lịch.');
                  } else {
                    onCancel(apt.id);
                  }
                }}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${
                  isPaid 
                    ? 'text-gray-400 bg-gray-50 border-gray-100 cursor-not-allowed opacity-80' 
                    : 'text-red-500 hover:text-red-600 hover:bg-red-50/50 border-transparent hover:border-red-100 cursor-pointer'
                }`}
              >
                <Icons.X className="w-3.5 h-3.5" />
                <span>Hủy lịch</span>
              </button>
            )}
            
            {/* Nút xem QR */}
            {(isUpcoming || isCheckedIn || isDoingService) && onShowQr && (
              <button 
                onClick={() => onShowQr(apt.qrCode)}
                className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm shadow-blue-200 flex items-center gap-1"
              >
                <Icons.QrCode className="w-3.5 h-3.5" />
                <span>Mã QR</span>
              </button>
            )}

            {/* Chức năng của DOING_SERVICE */}
            {isDoingService && onPayService && !isPaid && (
              <button 
                onClick={() => onPayService(apt)}
                className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm shadow-emerald-200 flex items-center gap-1 animate-pulse"
              >
                <Icons.CreditCard className="w-3.5 h-3.5" />
                <span>Thanh toán Dịch vụ</span>
              </button>
            )}
            {isDoingService && onCompleteService && isPaid && (
              <button 
                onClick={() => onCompleteService(apt)}
                className="text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 px-4 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm shadow-amber-200 flex items-center gap-1 animate-[bounce_2s_infinite]"
              >
                <Icons.CheckCircle className="w-3.5 h-3.5" />
                <span>Đã có kết quả</span>
              </button>
            )}
            
            {/* Khu vực Đánh giá */}
            {isDone && (
              apt.rating ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg cursor-not-allowed opacity-80">
                  <span className="text-xs font-bold text-gray-500">Đã đánh giá:</span>
                  <div className="flex items-center text-amber-500 font-bold text-xs gap-0.5">
                    <span>{apt.rating.rating}</span>
                    <Icons.Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
              ) : (
                onRate && (
                  <button 
                    onClick={() => onRate(apt)}
                    className="text-xs font-bold text-amber-500 hover:text-amber-600 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-100 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Icons.Star className="w-3.5 h-3.5" />
                    <span>Đánh giá</span>
                  </button>
                )
              )
            )}
          </div>
        </div>
      </div>

      {/* Hiển thị Timeline Lịch sử */}
      {showTimeline && (
        <div className="mt-2 pt-4 border-t border-gray-100 pl-4 sm:pl-16">
          <h5 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">Nhật ký trạng thái</h5>
          <div className="space-y-4">
            {logs.map((log, index) => {
              const isLast = index === logs.length - 1;
              let statusColor = 'bg-gray-200';
              let statusIcon = <Icons.Info className="w-3 h-3 text-white" />;
              
              if (log.newStatus === 'PENDING') {
                statusColor = 'bg-gray-400';
                statusIcon = <Icons.CreditCard className="w-3 h-3 text-white" />;
              } else if (log.newStatus === 'BOOKED') {
                statusColor = 'bg-blue-500';
                statusIcon = <Icons.Check className="w-3 h-3 text-white" />;
              } else if (log.newStatus === 'WAITING') {
                statusColor = 'bg-amber-500';
                statusIcon = <Icons.Clock className="w-3 h-3 text-white" />;
              } else if (log.newStatus === 'EXAMINING') {
                statusColor = 'bg-purple-500';
                statusIcon = <Icons.Activity className="w-3 h-3 text-white" />;
              } else if (log.newStatus === 'DONE') {
                statusColor = 'bg-emerald-500';
                statusIcon = <Icons.CheckCircle className="w-3 h-3 text-white" />;
              } else if (log.newStatus === 'CANCELLED') {
                statusColor = 'bg-rose-500';
                statusIcon = <Icons.X className="w-3 h-3 text-white" />;
              }

              return (
                <div key={log.id} className="relative flex gap-4">
                  {/* Đường kẻ dọc */}
                  {!isLast && <div className="absolute left-2.5 top-6 bottom-[-16px] w-0.5 bg-gray-100"></div>}
                  
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 ${statusColor} ring-4 ring-white`}>
                    {statusIcon}
                  </div>
                  
                  <div className="flex-1 pb-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-bold text-gray-800">{log.notes || 'Cập nhật trạng thái'}</span>
                      <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                        {new Date(log.changedAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    {log.changedBy2 && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Icons.User className="w-3 h-3" />
                        Bởi: <span className="font-semibold">{log.changedBy2.fullName}</span> 
                        <span className="bg-gray-100 text-[9px] px-1 rounded uppercase">{log.changedBy2.role}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
