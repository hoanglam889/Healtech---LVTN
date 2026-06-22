import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation(['landing', 'nav']);

  return (
    <footer className="bg-gray-900 text-gray-400 py-8 md:py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center md:items-start gap-6">

        <div className="flex flex-col items-center md:items-start space-y-3 text-center md:text-left">
          <img
            src="/images/logo.png"
            alt="Healtech Logo"
            className="h-12 md:h-14 w-auto object-contain brightness-0 invert scale-[1.5] origin-center md:origin-left"
          />
          <p className="text-sm leading-relaxed max-w-sm text-gray-400">
            {t('landing:footer_tagline')}
          </p>
        </div>

        <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3 text-sm font-medium mt-2 md:mt-0">
          <a href="#home" className="hover:text-white transition-colors">{t('nav:home')}</a>
          <a href="#doctors" className="hover:text-white transition-colors">{t('landing:footer_link_doctors')}</a>
          <a href="#specialties" className="hover:text-white transition-colors">{t('nav:specialties')}</a>
          <a href="#" className="hover:text-white transition-colors">{t('landing:footer_link_privacy')}</a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-gray-800 flex justify-center text-xs text-gray-500">
        <p className="text-center">&copy; {new Date().getFullYear()} Healtech. {t('landing:footer_copyright')}</p>
      </div>
    </footer>
  );
};

export default Footer;