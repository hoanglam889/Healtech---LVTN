import React from 'react';
import { useTranslation } from 'react-i18next';

const ArticleSection = () => {
  const { t } = useTranslation('landing');
  const articles = t('articles_items', { returnObjects: true });

  return (
    <section id="articles" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">{t('articles_title')}</h2>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">{t('articles_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.isArray(articles) && articles.map((article, idx) => (
            <article key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="aspect-[16/9] bg-gray-100 w-full relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">{t('articles_image_placeholder')}</div>
              </div>
              <div className="p-5 md:p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{article.category}</span>
                  <span className="text-xs text-gray-400 font-medium">{article.date}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{t('articles_excerpt')}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticleSection;
