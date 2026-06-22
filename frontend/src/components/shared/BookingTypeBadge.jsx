import React from 'react';
import { useTranslation } from 'react-i18next';

export default function BookingTypeBadge({ type }) {
  const { t } = useTranslation('common');

  if (type === 'OFFLINE') {
    return (
      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-orange-50 text-orange-600 border border-orange-100">
        {t('booking_type.walkin')}
      </span>
    );
  }
  return (
    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
      {t('booking_type.online')}
    </span>
  );
}
