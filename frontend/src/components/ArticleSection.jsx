import React from 'react';

const articles = [
  { title: 'The Importance of Regular Health Checkups', category: 'Wellness', date: 'Oct 12, 2023' },
  { title: 'Understanding Heart Health in Your 40s', category: 'Cardiology', date: 'Oct 05, 2023' },
  { title: 'Tips for Better Sleep and Mental Health', category: 'Mental Health', date: 'Sep 28, 2023' },
];

const ArticleSection = () => {
  return (
    <section id="articles" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Latest Health Articles</h2>
          <p className="text-gray-500 text-lg">Stay informed with tips and insights from our medical experts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <article key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="aspect-[16/9] bg-gray-100 w-full relative">
                 <div className="absolute inset-0 flex items-center justify-center text-gray-400">Image</div>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{article.category}</span>
                  <span className="text-sm text-gray-400 font-medium">{article.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 leading-snug mb-3 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">Read more about how you can improve your daily lifestyle and stay healthy with actionable tips...</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticleSection;