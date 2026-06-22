import React from 'react';
import { useTranslation } from 'react-i18next';

const ContactSection = () => {
  const { t } = useTranslation('landing');

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16 lg:gap-24">
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">{t('contact_title')}</h2>
          <p className="text-gray-500 text-lg leading-relaxed">{t('contact_description')}</p>

          <div className="space-y-8 mt-12">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shrink-0">📍</div>
              <div className="pt-1">
                <h4 className="font-semibold text-gray-900 mb-1">{t('contact_address_label')}</h4>
                <p className="text-gray-500">{t('contact_address_line1')}<br />{t('contact_address_line2')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shrink-0">📞</div>
              <div className="pt-1">
                <h4 className="font-semibold text-gray-900 mb-1">{t('contact_phone_label')}</h4>
                <p className="text-gray-500">{t('contact_phone')}<br />{t('contact_hours')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <form className="bg-white p-8 md:p-10 rounded-3xl shadow-lg shadow-gray-100/50 border border-gray-100 space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('contact_form_firstname')}</label>
                <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder={t('contact_form_firstname_placeholder')} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('contact_form_lastname')}</label>
                <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder={t('contact_form_lastname_placeholder')} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('contact_form_email')}</label>
              <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder={t('contact_form_email_placeholder')} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('contact_form_message')}</label>
              <textarea rows="4" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none" placeholder={t('contact_form_message_placeholder')}></textarea>
            </div>
            <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-sm">
              {t('contact_form_submit')}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
