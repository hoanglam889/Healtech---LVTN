import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { getAllAppointments, updateAppointment } from '../../services/appointmentService';
import { socket } from '../../services/socket';

export default function AppointmentMonitor() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);

  // Load appointments
  const loadAppointments = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const data = await getAllAppointments();
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      if (showSpinner) setLoading(false);
    }
  };


  useEffect(() => {
    loadAppointments();
    
    socket.on('appointment_created', () => {
      console.log('⚡ Monitor nhận: appointment_created');
      loadAppointments(false);
    });

    socket.on('appointment_updated', () => {
      console.log('⚡ Monitor nhận: appointment_updated');
      loadAppointments(false);
    });

    return () => {
      socket.off('appointment_created');
      socket.off('appointment_updated');
    };
  }, []);

  // Update clock every 10 seconds for the "late" timer
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setNow(new Date());
    }, 10000);
    return () => clearInterval(clockInterval);
  }, []);

  // Filter ONLY booked appointments (not checked in yet)
  const getBookedAppointments = () => {
    return appointments.filter((appt) => appt.status === 'BOOKED');
  };

  // Group by doctor
  const groupedAppointments = getBookedAppointments().reduce((acc, appt) => {
    const doctorName = appt.doctorProfile?.user?.fullName || 'Bác sĩ chưa xác định';
    const specialtyName = appt.doctorProfile?.specialty?.name || 'Khoa chưa xác định';
    const key = `${doctorName} - ${specialtyName}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(appt);
    return acc;
  }, {});

  // Handle Cancel Appointment
  const handleCancel = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn HỦY lịch hẹn này? Thao tác không thể hoàn tác.')) return;
    try {
      await updateAppointment(id, { status: 'CANCELLED' });
      loadAppointments(true);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi hủy lịch hẹn!');
    }
  };

  const calculateLateMinutes = (apptDate, apptTime) => {
    if (!apptDate || !apptTime) return 0;
    // apptDate format: YYYY-MM-DD, apptTime format: HH:mm:ss
    const dateTimeStr = `${apptDate.split('T')[0]}T${apptTime}`;
    const apptDateTime = new Date(dateTimeStr);
    
    // Diff in minutes
    const diffMs = now - apptDateTime;
    return Math.floor(diffMs / 60000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Icons.Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const bookedList = getBookedAppointments();

  return (
    <div className="h-full flex flex-col bg-gray-50/50">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Giám sát Lịch hẹn 📅</h2>
          <p className="text-gray-500 mt-1">Phát hiện bệnh nhân trễ giờ hoặc chưa tới Check-in</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <Icons.Clock className="w-5 h-5 text-blue-500" />
          <span className="font-bold text-gray-700">
            {now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {bookedList.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Icons.CalendarCheck className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Tất cả đều ổn!</h3>
          <p className="text-gray-500">Không có lịch hẹn nào đang trong trạng thái chờ Check-in.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
          {Object.entries(groupedAppointments).map(([groupName, appts]) => (
            <div key={groupName} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 overflow-hidden">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icons.Stethoscope className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{groupName.split(' - ')[0]}</h3>
                  <p className="text-sm font-semibold text-blue-600">{groupName.split(' - ')[1]}</p>
                </div>
                <div className="ml-auto bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded-lg text-sm">
                  {appts.length} lịch hẹn
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {appts.map((appt) => {
                  const lateMins = calculateLateMinutes(appt.appointmentDate, appt.appointmentTime);
                  const isVeryLate = lateMins >= 30;
                  const isPaid = appt.invoices?.status === 'PAID';

                  return (
                    <div 
                      key={appt.id} 
                      className={`relative rounded-2xl border-2 transition-all duration-300 p-5 ${
                        isVeryLate 
                          ? 'bg-rose-50 border-rose-200 shadow-md shadow-rose-100/50' 
                          : 'bg-white border-gray-100 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-50'
                      }`}
                    >
                      {/* Cảnh báo trễ */}
                      {isVeryLate && (
                        <div className="absolute -top-3 -right-3 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                          <Icons.AlertTriangle className="w-3 h-3" />
                          Trễ {lateMins} phút
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-bold text-gray-900 text-lg">{appt.patient?.fullName}</span>
                            {appt.patient?.gender === 'MALE' ? (
                              <Icons.User className="w-4 h-4 text-blue-500" />
                            ) : (
                              <Icons.User className="w-4 h-4 text-pink-500" />
                            )}
                            {isPaid && (
                              <span className="ml-1 bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">
                                <Icons.CheckCircle2 className="w-3 h-3" />
                                Đã thanh toán
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Icons.Hash className="w-3.5 h-3.5" />
                            Mã Đặt: <span className="font-bold text-gray-700">{appt.qrCode}</span>
                          </div>
                        </div>
                        <div className={`text-xl font-black ${isVeryLate ? 'text-rose-600' : 'text-blue-600'}`}>
                          {appt.appointmentTime?.slice(0, 5) || '--:--'}
                        </div>
                      </div>

                      <div className="space-y-2 mb-5 bg-white/50 p-3 rounded-xl">
                        <div className="flex items-center gap-2 text-sm">
                          <Icons.Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            SĐT Liên hệ:{' '}
                            <span className="font-bold text-gray-900">
                              {appt.patient?.patientAccount?.phone || 'Chưa cập nhật'}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Icons.UserCircle className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            Bệnh nhân:{' '}
                            <span className="font-bold text-gray-900">
                              {appt.patient?.fullName} ({appt.patient?.relationship})
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {appt.appointmentStatusLogs?.length > 0 && (
                          <button
                            onClick={() => setExpandedHistoryId(expandedHistoryId === appt.id ? null : appt.id)}
                            className="flex-1 font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700"
                          >
                            <Icons.History className="w-4 h-4" />
                            Lịch sử
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (isPaid) {
                              alert('Không thể hủy lịch này vì bệnh nhân đã thanh toán (VNPAY).\nVui lòng liên hệ bệnh nhân để đổi lịch thay vì hủy.');
                            } else {
                              handleCancel(appt.id);
                            }
                          }}
                          className={`flex-1 font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm ${
                            isPaid
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-80'
                              : isVeryLate
                                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200'
                                : 'bg-gray-100 hover:bg-rose-500 hover:text-white text-gray-700'
                          }`}
                        >
                          <Icons.XCircle className="w-4 h-4" />
                          Hủy lịch
                        </button>
                      </div>

                      {/* Hiển thị Timeline Lịch sử */}
                      {expandedHistoryId === appt.id && appt.appointmentStatusLogs?.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <h5 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">Nhật ký trạng thái</h5>
                          <div className="space-y-4">
                            {appt.appointmentStatusLogs.map((log, index) => {
                              const isLast = index === appt.appointmentStatusLogs.length - 1;
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
                                  {!isLast && <div className="absolute left-2.5 top-6 bottom-[-16px] w-0.5 bg-gray-100"></div>}
                                  
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 ${statusColor} ring-4 ring-white`}>
                                    {statusIcon}
                                  </div>
                                  
                                  <div className="flex-1 pb-1">
                                    <div className="flex flex-col gap-0.5 mb-1">
                                      <span className="text-sm font-bold text-gray-800 leading-tight">{log.notes || 'Cập nhật trạng thái'}</span>
                                      <span className="text-[10px] font-semibold text-gray-400">
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
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
