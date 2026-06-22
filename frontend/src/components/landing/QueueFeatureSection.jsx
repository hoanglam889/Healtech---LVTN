import React from 'react';
import { useTranslation } from 'react-i18next';

const QueueFeatureSection = () => {
  const { t } = useTranslation('landing');
  const features = t('queue_features', { returnObjects: true });

  return (
    <section className="py-16 bg-blue-600 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16">
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-tight">
              {t('queue_hero_title_1')} <br /> {t('queue_hero_title_2')}
            </h2>
            <p className="text-blue-100 text-base md:text-lg max-w-lg leading-relaxed">
              {t('queue_hero_subtitle')}
            </p>
            <ul className="space-y-3 pt-1">
              {Array.isArray(features) && features.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-xs">✓</div>
                  <span className="font-medium text-sm md:text-base">{item}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm">
                {t('queue_cta')}
              </button>
            </div>
          </div>

          <div className="flex-1 w-full flex justify-center relative">
            <div className="w-64 h-[420px] bg-white rounded-[2rem] p-3 shadow-2xl relative border-8 border-blue-800 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="w-full h-full bg-gray-50 rounded-xl flex flex-col items-center justify-center text-gray-400 font-medium">
                {t('queue_app_preview')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QueueFeatureSection;
