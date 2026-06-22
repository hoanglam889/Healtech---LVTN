import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { getAllAppointments, updateAppointment } from '../../services/appointmentService';
import BookingTypeBadge from '../shared/BookingTypeBadge';
import WalkInRegistration from './WalkInRegistration';
import { useTranslation } from 'react-i18next';

export default function CheckinPanel() {
  const { t, i18n } = useTranslation(['checkin', 'common']);
  const [activeTab, setActiveTab] = useState('checkin');
  const [searchCode, setSearchCode] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [matchedAppt, setMatchedAppt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');
  const [notification, setNotification] = useState(null);

  const loadAppointments = async () => {
    try {
      const data = await getAllAppointments();
      setAppointments(data || []);
    } catch (err) {
      console.error('Error loading appointments:', err);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    let html5QrCode = null;
    if (isScanning) {
      setScanMessage(t('checkin:camera_starting'));
      const timer = setTimeout(() => {
        const readerElement = document.getElementById('reader');
        if (!readerElement) return;

        html5QrCode = new Html5Qrcode("reader");
        const config = { fps: 10, qrbox: { width: 220, height: 220 } };

        html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            html5QrCode.stop().then(() => {
              setIsScanning(false);
              setSearchCode(decodedText);
              handleSearch(decodedText);
            }).catch(err => {
              console.error("Error stopping camera:", err);
              setIsScanning(false);
            });
          },
          () => {}
        ).then(() => {
          setScanMessage(t('checkin:camera_scanning'));
        }).catch(err => {
          console.error("Error starting camera:", err);
          setScanMessage(t('checkin:camera_no_device'));
        });
      }, 500);

      return () => {
        clearTimeout(timer);
        if (html5QrCode) {
          if (html5QrCode.isScanning) {
            html5QrCode.stop().catch(e => console.error("Error stopping camera on unmount:", e));
          }
        }
      };
    }
  }, [isScanning]);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSearch = async (code) => {
    const query = (code || searchCode).trim().toUpperCase();
    if (!query) return;

    setLoading(true);
    try {
      const data = await getAllAppointments();
      setAppointments(data || []);

      const found = data.find(
        (appt) => appt.qrCode.toUpperCase() === query || appt.qrCode.endsWith(query)
      );

      if (found) {
        setMatchedAppt(found);
        showToast(t('checkin:found'), 'success');
      } else {
        setMatchedAppt(null);
        showToast(t('checkin:not_found'), 'error');
      }
    } catch (err) {
      console.error(err);
      showToast(t('checkin:error_load'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckinConfirm = async () => {
    if (!matchedAppt) return;
    setLoading(true);

    try {
      const updated = await updateAppointment(matchedAppt.id, { status: 'WAITING' });
      setMatchedAppt(updated);
      showToast(t('checkin:checkin_success', { score: updated.priorityScore }), 'success');
      loadAppointments();
    } catch (err) {
      console.error('Check-in error:', err);
      showToast(t('checkin:checkin_error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    return t(`common:status.${status?.toLowerCase()}`, status);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US');
  };

  return (
    <div className="space-y-6 max-w-4xl">

      {/* TAB SWITCHER */}
      <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100">
        <button
          onClick={() => setActiveTab('checkin')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'checkin' ? 'bg-white text-blue-600 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Icons.QrCode className="w-4 h-4" />
          <span>{t('checkin:tab_checkin')}</span>
        </button>
        <button
          onClick={() => setActiveTab('walkin')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'walkin' ? 'bg-white text-orange-500 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Icons.UserPlus className="w-4 h-4" />
          <span>{t('checkin:tab_walkin')}</span>
        </button>
      </div>

      {/* WALK-IN TAB */}
      {activeTab === 'walkin' && <WalkInRegistration />}

      {/* QR CHECK-IN TAB */}
      {activeTab === 'checkin' && <>

      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-white font-bold border transition-all animate-[fadeIn_0.2s_ease-out] ${
          notification.type === 'success' ? 'bg-emerald-500 border-emerald-600' :
          notification.type === 'warning' ? 'bg-amber-500 border-amber-600' :
          'bg-rose-500 border-rose-600'
        }`}>
          {notification.type === 'success' ? <Icons.CheckCircle className="w-5 h-5" /> : <Icons.AlertCircle className="w-5 h-5" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* SEARCH PANEL */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/40 p-6 md:p-8">
        <h3 className="font-extrabold text-gray-900 text-lg mb-2">{t('checkin:title')}</h3>
        <p className="text-sm text-gray-400 font-semibold mb-6">{t('checkin:subtitle')}</p>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Icons.Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('checkin:input_placeholder')}
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-gray-50 border-none outline-none pl-12 pr-4 py-3.5 rounded-2xl font-semibold text-gray-800 focus:ring-2 focus:ring-blue-500/20 text-sm md:text-base placeholder-gray-400"
            />
          </div>

          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="bg-blue-600 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-blue-700 transition-colors cursor-pointer text-sm shrink-0 flex items-center justify-center gap-2"
          >
            {loading ? <Icons.Loader className="w-5 h-5 animate-spin" /> : <Icons.ArrowRight className="w-5 h-5" />}
            <span>{t('checkin:search_btn')}</span>
          </button>

          <button
            onClick={() => setIsScanning(true)}
            className="bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold px-6 py-3.5 rounded-2xl hover:bg-emerald-100 transition-colors cursor-pointer text-sm shrink-0 flex items-center justify-center gap-2"
          >
            <Icons.QrCode className="w-5 h-5" />
            <span>{t('checkin:scan_btn')}</span>
          </button>
        </div>
      </div>

      {/* CAMERA SCANNER MODAL */}
      {isScanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-md">
          <div className="bg-gray-900 w-[450px] rounded-3xl border border-gray-800 shadow-2xl p-6 relative text-center text-white overflow-hidden">
            <button
              onClick={() => setIsScanning(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white bg-gray-800 p-2 rounded-xl cursor-pointer z-20"
            >
              <Icons.X className="w-5 h-5" />
            </button>

            <h4 className="font-extrabold text-base tracking-wide uppercase text-emerald-400 mb-4 flex items-center justify-center gap-2">
              <Icons.Camera className="w-5 h-5 animate-pulse" />
              <span>{t('checkin:camera_title')}</span>
            </h4>

            <div className="w-full aspect-square bg-gray-950 rounded-2xl border-2 border-gray-800 relative flex flex-col items-center justify-center overflow-hidden">
              <div id="reader" className="absolute inset-0 w-full h-full"></div>
              <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-emerald-500 pointer-events-none z-10"></div>
              <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-emerald-500 pointer-events-none z-10"></div>
              <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-emerald-500 pointer-events-none z-10"></div>
              <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-emerald-500 pointer-events-none z-10"></div>
              <div className="absolute left-6 right-6 h-0.5 bg-emerald-500 shadow-[0_0_8px_#10b981] animate-[scan_2s_infinite_ease-in-out] pointer-events-none z-10"></div>
            </div>

            <p className="mt-6 font-bold text-sm text-gray-300 px-4">{scanMessage}</p>
          </div>
        </div>
      )}

      {/* MATCHED APPOINTMENT CARD */}
      {matchedAppt && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-8 space-y-6 animate-[fadeIn_0.3s_ease-out]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">{t('checkin:qr_code')}</span>
              <h4 className="font-extrabold text-xl text-gray-900 mt-1 flex items-center gap-2">
                <Icons.QrCode className="w-6 h-6 text-blue-600" />
                <span>{matchedAppt.qrCode}</span>
              </h4>
            </div>

            <div className="flex gap-2 flex-wrap items-center">
              <BookingTypeBadge type={matchedAppt.bookingType} />
              <span className={`px-4 py-2 rounded-xl font-bold text-xs border uppercase tracking-wider ${
                matchedAppt.status === 'BOOKED' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                matchedAppt.status === 'WAITING' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                matchedAppt.status === 'EXAMINING' ? 'bg-purple-50 border-purple-100 text-purple-600' :
                matchedAppt.status === 'DONE' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                'bg-gray-50 border-gray-100 text-gray-400'
              }`}>
                {getStatusLabel(matchedAppt.status)}
              </span>

              {matchedAppt.invoices && (
                <span className={`px-4 py-2 rounded-xl font-bold text-xs border uppercase tracking-wider ${
                  matchedAppt.invoices.status === 'PAID' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'
                }`}>
                  {t(`common:payment.${matchedAppt.invoices.status?.toLowerCase()}`, matchedAppt.invoices.status)}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* PATIENT INFO */}
            <div className="space-y-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-100/50">
              <h5 className="font-extrabold text-sm text-gray-800 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
                <Icons.User className="w-4.5 h-4.5 text-blue-600" />
                <span>{t('checkin:patient_info')}</span>
              </h5>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">{t('checkin:full_name')}</span>
                  <span className="font-extrabold text-gray-900">{matchedAppt.patient?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">{t('checkin:gender')}</span>
                  <span className="font-bold text-gray-800">{t(`common:gender.${matchedAppt.patient?.gender?.toLowerCase()}`, matchedAppt.patient?.gender)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">{t('checkin:dob')}</span>
                  <span className="font-bold text-gray-800">{formatDate(matchedAppt.patient?.dob)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">{t('checkin:phone')}</span>
                  <span className="font-bold text-gray-800">{matchedAppt.patient?.phone}</span>
                </div>
              </div>
            </div>

            {/* APPOINTMENT INFO */}
            <div className="space-y-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-100/50">
              <h5 className="font-extrabold text-sm text-gray-800 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
                <Icons.Calendar className="w-4.5 h-4.5 text-blue-600" />
                <span>{t('checkin:service_info')}</span>
              </h5>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">{t('checkin:specialty')}</span>
                  <span className="font-bold text-blue-600">{matchedAppt.doctorProfile?.specialty?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">{t('checkin:doctor')}</span>
                  <span className="font-extrabold text-gray-900">{matchedAppt.doctorProfile?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">{t('checkin:appointment_date')}</span>
                  <span className="font-bold text-gray-800">{formatDate(matchedAppt.appointmentDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">{t('checkin:appointment_time')}</span>
                  <span className="font-bold text-gray-800">{matchedAppt.appointmentTime?.substring(0, 5)}</span>
                </div>
              </div>
            </div>

          </div>

          {/* ACTION FOOTER */}
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            {matchedAppt.status === 'BOOKED' ? (
              <button
                onClick={handleCheckinConfirm}
                disabled={loading}
                className="bg-blue-600 text-white font-extrabold px-8 py-3.5 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 cursor-pointer text-sm flex items-center gap-2 animate-bounce"
              >
                {loading ? <Icons.Loader className="w-5 h-5 animate-spin" /> : <Icons.Check className="w-5 h-5" />}
                <span>{t('checkin:checkin_btn')}</span>
              </button>
            ) : matchedAppt.status === 'WAITING' ? (
              <div className="flex items-center gap-3 text-amber-600 font-bold bg-amber-50 border border-amber-100 px-5 py-3 rounded-2xl text-sm">
                <Icons.Clock className="w-5 h-5" />
                <span>{t('checkin:already_waiting')} <b className="text-base text-rose-600">{matchedAppt.priorityScore}đ</b></span>
              </div>
            ) : matchedAppt.status === 'EXAMINING' ? (
              <div className="flex items-center gap-2 text-purple-600 font-bold bg-purple-50 border border-purple-100 px-5 py-3 rounded-2xl text-sm">
                <Icons.Activity className="w-5 h-5 animate-pulse" />
                <span>{t('checkin:examining')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-5 py-3 rounded-2xl text-sm">
                <Icons.CheckCircle className="w-5 h-5" />
                <span>{t('checkin:done')}</span>
              </div>
            )}
          </div>

        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { top: 24px; }
          50% { top: calc(100% - 28px); }
          100% { top: 24px; }
        }
      `}</style>

      </> /* end checkin tab */ }

    </div>
  );
}
