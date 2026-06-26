import { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import { getAllAppointments, updateAppointment } from '../../services/appointmentService';
import { getInvoiceDetails, createPaymentUrl } from '../../services/invoiceService';
import PaymentModal from './PaymentModal';
import InvoiceTemplate from './InvoiceTemplate';
import { useReactToPrint } from 'react-to-print';

export default function BillingManager() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('UNPAID'); // 'UNPAID' | 'PAID'
  const [notification, setNotification] = useState(null);
  const [selectedApptToPay, setSelectedApptToPay] = useState(null);
  
  const [apptToPrint, setApptToPrint] = useState(null);
  const [invoiceDetailsToPrint, setInvoiceDetailsToPrint] = useState(null);
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const handlePrintTrigger = async (appt) => {
    try {
      // Fetch detailed invoice with breakdown before printing
      const details = await getInvoiceDetails(appt.id);
      setApptToPrint(appt);
      setInvoiceDetailsToPrint(details);
      
      // Đợi React render xong Dữ liệu mới vào Template rồi mới In
      setTimeout(() => {
        reactToPrintFn();
      }, 300);
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết hóa đơn:', err);
      showToast('Không thể lấy chi tiết hóa đơn!', 'error');
    }
  };

  // Load appointments
  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await getAllAppointments();
      setAppointments(data || []);
    } catch (err) {
      console.error('Lỗi khi tải lịch hẹn:', err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    loadAppointments();
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter bills
  const getFilteredBills = () => {
    return appointments.filter((appt) => {
      // Chỉ hiển thị hóa đơn chưa bị hủy
      if (!appt.invoices) return false;
      if (appt.status === 'CANCELLED') return false;
      if (appt.status === 'CANCELLED') return false;
      return appt.invoices.status === filterStatus;
    });
  };

  // Action: Confirm payment via Modal
  const handleConfirmPayment = async (apptId, paymentMethod) => {
    setLoading(true);
    setSelectedApptToPay(null);
    try {
      if (paymentMethod === 'VNPAY') {
        const appt = appointments.find(a => a.id === apptId);
        if (!appt || !appt.invoices) throw new Error('Không tìm thấy hóa đơn');
        
        // Gọi API tạo link VNPay
        const { url } = await createPaymentUrl(appt.invoices.id, appt.invoices.totalAmount);
        
        // Chuyển hướng sang VNPay
        window.location.href = url;
        return; // Dừng tại đây, không set loading(false) để màn hình không chớp
      } else {
        // Tiền mặt - API cũ
        await updateAppointment(apptId, { invoiceStatus: 'PAID', paymentMethod });
        showToast('Xác nhận đã thu tiền thành công!', 'success');
        loadAppointments();
      }
    } catch (err) {
      console.error(err);
      showToast('Đã xảy ra lỗi!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredBills = getFilteredBills();

  // Helper format currency
  const formatVND = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="space-y-6">
      
      {/* POPUP NOTIFICATION */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-white font-bold bg-emerald-500 border border-emerald-600 transition-all animate-[fadeIn_0.2s_ease-out]">
          <Icons.CheckCircle className="w-5 h-5" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* FILTER BUTTONS & QUICK STATS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
        
        {/* TABS LỌC TRẠNG THÁI HÓA ĐƠN */}
        <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100/60 shrink-0">
          <button
            onClick={() => setFilterStatus('UNPAID')}
            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              filterStatus === 'UNPAID'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-gray-400 hover:text-gray-800'
            }`}
          >
            Chưa Thanh Toán ({appointments.filter(a => a.invoices?.status === 'UNPAID' && a.status !== 'CANCELLED').length})
          </button>
          
          <button
            onClick={() => setFilterStatus('PAID')}
            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              filterStatus === 'PAID'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-400 hover:text-gray-800'
            }`}
          >
            Đã Thu Tiền ({appointments.filter(a => a.invoices?.status === 'PAID' && a.status !== 'CANCELLED').length})
          </button>
        </div>

        <div className="text-right sm:text-left">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Tổng tiền mặt cần thu hiện tại</span>
          <span className="font-extrabold text-xl text-rose-600 mt-1 block">
            {formatVND(
              appointments
                .filter(a => a.invoices?.status === 'UNPAID' && a.status !== 'CANCELLED')
                .reduce((sum, current) => sum + parseFloat(current.invoices?.totalAmount || 0), 0)
            )}
          </span>
        </div>
      </div>

      {/* DANH SÁCH BẢNG HÓA ĐƠN */}
      {loading && filteredBills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-3xl border border-gray-100">
          <Icons.Loader className="w-8 h-8 text-blue-600 animate-spin mb-3" />
          <p className="text-sm font-semibold text-gray-400">Đang đồng bộ dữ liệu thu chi...</p>
        </div>
      ) : filteredBills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-300">
            <Icons.Receipt className="w-8 h-8" />
          </div>
          <h4 className="font-extrabold text-gray-800 text-base">
            {filterStatus === 'UNPAID' ? 'Không có hóa đơn chưa thanh toán!' : 'Chưa có hóa đơn đã thanh toán!'}
          </h4>
          <p className="text-sm text-gray-400 max-w-sm mt-1.5 font-semibold">
            {filterStatus === 'UNPAID' 
              ? 'Tất cả các bệnh nhân chọn thanh toán tiền mặt đều đã được thu tiền hoàn chỉnh.' 
              : 'Hãy thực hiện thu ngân tiền mặt cho các bệnh nhân chờ khám.'
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="px-6 py-4.5">Mã QR / Bệnh nhân</th>
                <th className="px-6 py-4.5">Dịch vụ khám</th>
                <th className="px-6 py-4.5">Bác sĩ phụ trách</th>
                <th className="px-6 py-4.5 text-right">Tổng chi phí</th>
                <th className="px-6 py-4.5 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredBills.map((appt) => (
                <tr key={appt.id} className="hover:bg-gray-50/50 transition-colors">
                  
                  {/* CỘT MÃ LỊCH HẸN & BỆNH NHÂN */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold border border-blue-100">
                        <Icons.User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-extrabold text-gray-900">{appt.patient?.fullName}</p>
                        <span className="text-xs font-semibold text-gray-400 block mt-0.5">SĐT: {appt.patient?.phone}</span>
                      </div>
                    </div>
                  </td>

                  {/* CỘT DỊCH VỤ / NGÀY GIỜ */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-gray-800">Khám Chuyên Khoa</p>
                      <span className="text-xs text-gray-400 font-semibold block mt-0.5">
                        Ngày: {new Date(appt.appointmentDate).toLocaleDateString('vi-VN')} ({appt.appointmentTime?.substring(0, 5)})
                      </span>
                    </div>
                  </td>

                  {/* CỘT BÁC SĨ */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-gray-800">{appt.doctorProfile?.fullName}</p>
                      <span className="text-xs font-semibold text-blue-600 block mt-0.5 uppercase tracking-wider">
                        {appt.doctorProfile?.specialty?.name}
                      </span>
                    </div>
                  </td>

                  {/* CỘT TỔNG CHI PHÍ */}
                  <td className="px-6 py-4 text-right font-extrabold text-gray-900 text-base">
                    {formatVND(parseFloat(appt.invoices?.totalAmount || 150000))}
                  </td>

                  {/* CỘT ACTION */}
                  <td className="px-6 py-4 text-right">
                    {appt.invoices?.status === 'UNPAID' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handlePrintTrigger(appt)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer text-xs flex items-center gap-1.5"
                        >
                          <Icons.Printer className="w-4 h-4" />
                          <span>In hóa đơn</span>
                        </button>
                        <button
                          onClick={() => setSelectedApptToPay(appt)}
                          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 font-bold px-4.5 py-2.5 rounded-xl transition-all cursor-pointer text-xs flex items-center gap-1.5"
                        >
                          <Icons.CreditCard className="w-4 h-4" />
                          <span>Thanh toán</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-4">
                        <button
                          onClick={() => handlePrintTrigger(appt)}
                          className="text-gray-500 hover:text-blue-600 font-bold transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                        >
                          <Icons.Printer className="w-4 h-4" />
                          <span>In lại</span>
                        </button>
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                          <Icons.CheckCircle className="w-4 h-4" />
                          <span>Đã thu tiền</span>
                        </div>
                      </div>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL THANH TOÁN */}
      <PaymentModal 
        isOpen={!!selectedApptToPay}
        onClose={() => setSelectedApptToPay(null)}
        appointment={selectedApptToPay}
        onConfirm={handleConfirmPayment}
      />

      {/* ẨN COMPONENT IN HÓA ĐƠN */}
      <div style={{ display: 'none' }}>
        <InvoiceTemplate ref={contentRef} appointment={apptToPrint} invoiceDetails={invoiceDetailsToPrint} />
      </div>
    </div>
  );
}
