import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonVI from './locales/vi/common.json';
import navVI from './locales/vi/nav.json';
import authVI from './locales/vi/auth.json';
import landingVI from './locales/vi/landing.json';
import bookingVI from './locales/vi/booking.json';
import patientVI from './locales/vi/patient.json';
import staffVI from './locales/vi/staff.json';
import checkinVI from './locales/vi/checkin.json';
import queueVI from './locales/vi/queue.json';
import walkinVI from './locales/vi/walkin.json';
import doctorVI from './locales/vi/doctor.json';
import billingVI from './locales/vi/billing.json';

import commonEN from './locales/en/common.json';
import navEN from './locales/en/nav.json';
import authEN from './locales/en/auth.json';
import landingEN from './locales/en/landing.json';
import bookingEN from './locales/en/booking.json';
import patientEN from './locales/en/patient.json';
import staffEN from './locales/en/staff.json';
import checkinEN from './locales/en/checkin.json';
import queueEN from './locales/en/queue.json';
import walkinEN from './locales/en/walkin.json';
import doctorEN from './locales/en/doctor.json';
import billingEN from './locales/en/billing.json';

const savedLang = localStorage.getItem('lang') || 'vi';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      vi: {
        common: commonVI,
        nav: navVI,
        auth: authVI,
        landing: landingVI,
        booking: bookingVI,
        patient: patientVI,
        staff: staffVI,
        checkin: checkinVI,
        queue: queueVI,
        walkin: walkinVI,
        doctor: doctorVI,
        billing: billingVI,
      },
      en: {
        common: commonEN,
        nav: navEN,
        auth: authEN,
        landing: landingEN,
        booking: bookingEN,
        patient: patientEN,
        staff: staffEN,
        checkin: checkinEN,
        queue: queueEN,
        walkin: walkinEN,
        doctor: doctorEN,
        billing: billingEN,
      },
    },
    lng: savedLang,
    fallbackLng: 'vi',
    defaultNS: 'common',
    ns: ['common', 'nav', 'auth', 'landing', 'booking', 'patient', 'staff', 'checkin', 'queue', 'walkin', 'doctor', 'billing'],
    interpolation: { escapeValue: false },
  });

export default i18n;
