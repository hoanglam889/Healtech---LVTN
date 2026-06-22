import React, { useState, useEffect } from 'react';
import { getAppointmentsByUserId } from '../../../services/appointmentService';
import { getPatientsByAccountId } from '../../../services/patientService';
import { formatDate } from '../../../utils/dateUtils';
import * as Icons from 'lucide-react';
import AppointmentCard from '../../../components/dashboard/AppointmentCard';
import { QRCodeSVG } from 'qrcode.react';
import PatientProfiles from './PatientProfiles';
import MyAppointments from './MyAppointments';
import HealthBook from './HealthBook';
import AccountSettings from './AccountSettings';
import { useTranslation } from 'react-i18next';

const PatientDashboard = ({ user, onBookClick, activeTab, setActiveTab }) => {
  const { t } = useTranslation('patient');
  const [appointments, setAppointments] = useState([]);
  const [patientCount, setPatientCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedQr, setSelectedQr] = useState(null);

  useEffect(() => {
    Promise.all([
      getAppointmentsByUserId(user?.id),
      getPatientsByAccountId(user?.id)
    ])
      .then(([appointmentsData, patientsData]) => {
        setAppointments(appointmentsData || []);
        setPatientCount(patientsData?.length || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user?.id]);

  const upcomingCount = appointments.filter(a => a.status === 'BOOKED').length;
  const unpaidInvoices = appointments.filter(a => a.invoices?.status === 'UNPAID').length;

  if (activeTab === 'profiles') return <PatientProfiles user={user} />;
  if (activeTab === 'appointments') return <MyAppointments user={user} onBookClick={onBookClick} />;
  if (activeTab === 'history') return <HealthBook user={user} />;
  if (activeTab === 'settings') return <AccountSettings user={user} />;

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Welcome header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl flex items-center gap-2.5">
              <span>{t('greeting')} <span className="text-blue-600 font-extrabold">{user?.fullName}</span>!</span>
              <span className="animate-waving-hand text-2xl">👋</span>
            </h1>
            <p className="text-sm text-gray-400 font-semibold">{t('welcome_back')}</p>
          </div>
          <button
            onClick={onBookClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-blue-100 cursor-pointer flex items-center justify-center gap-2 self-start md:self-auto"
          >
            <Icons.Plus className="w-5 h-5" />
            <span>{t('book_new')}</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Icons.CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{t('stat_upcoming')}</p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">
                {upcomingCount} {t('stat_upcoming_unit')}
              </h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Icons.Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{t('stat_profiles')}</p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">
                {patientCount} {t('stat_profiles_unit')}
              </h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              unpaidInvoices > 0 ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-400'
            }`}>
              <Icons.CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{t('stat_unpaid')}</p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">
                {unpaidInvoices} {t('stat_unpaid_unit')}
              </h3>
            </div>
          </div>
        </div>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Appointment list */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Icons.Clock className="w-5 h-5 text-gray-400" />
              <span>{t('appointments_list')}</span>
            </h3>

            {loading ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400 font-semibold">{t('loading_appointments')}</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-400 font-medium shadow-sm space-y-4">
                <Icons.FolderOpen className="w-12 h-12 mx-auto text-gray-300" />
                <p>{t('no_appointments')}</p>
                <button
                  onClick={onBookClick}
                  className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-bold text-sm transition-all cursor-pointer"
                >
                  {t('book_now')}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <AppointmentCard
                    key={apt.id}
                    apt={apt}
                    onShowQr={setSelectedQr}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Quick tools & tips */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
              <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider border-b border-gray-100 pb-2">{t('quick_tools')}</h4>
              <div className="space-y-2 text-sm">
                <button
                  onClick={onBookClick}
                  className="w-full text-left p-3 rounded-xl hover:bg-blue-50 text-gray-600 hover:text-blue-600 font-semibold transition-all flex items-center justify-between"
                >
                  <span>{t('book_link')}</span>
                  <Icons.ChevronRight className="w-4 h-4" />
                </button>
                <button className="w-full text-left p-3 rounded-xl hover:bg-blue-50 text-gray-600 hover:text-blue-600 font-semibold transition-all flex items-center justify-between opacity-50 cursor-not-allowed">
                  <span>{t('health_record_link')}</span>
                  <Icons.ChevronRight className="w-4 h-4" />
                </button>
                <button className="w-full text-left p-3 rounded-xl hover:bg-blue-50 text-gray-600 hover:text-blue-600 font-semibold transition-all flex items-center justify-between opacity-50 cursor-not-allowed">
                  <span>{t('support_link')}</span>
                  <Icons.ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-5 shadow-sm space-y-3">
              <h4 className="font-bold text-blue-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <Icons.Info className="w-4 h-4 text-blue-500" />
                <span>{t('tips_title')}</span>
              </h4>
              <ul className="text-xs text-blue-800/80 space-y-2 list-disc list-inside leading-relaxed font-medium">
                <li>{t('tip1')}</li>
                <li>{t('tip2')}</li>
                <li>{t('tip3')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {selectedQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedQr(null)} />
          <div className="bg-white rounded-3xl p-6 text-center max-w-sm w-full relative z-10 shadow-2xl border border-gray-100 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h4 className="font-bold text-gray-900">{t('qr_modal_title')}</h4>
              <button onClick={() => setSelectedQr(null)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer">
                <Icons.X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center p-4 rounded-2xl bg-white shadow-inner border border-gray-100 max-w-[200px] mx-auto">
                <QRCodeSVG value={selectedQr} size={168} level="H" includeMargin={false} />
              </div>
              <p className="font-mono font-bold text-gray-800 text-lg bg-gray-50 py-1.5 rounded-xl border border-gray-200/50">
                {selectedQr}
              </p>
              <p className="text-xs text-gray-400 leading-normal px-2">{t('qr_modal_note')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
