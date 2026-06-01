import React from 'react';

const articles = [
  { title: 'Tầm quan trọng của việc khám sức khỏe định kỳ', category: 'Sức khỏe', date: '12 Tháng 10, 2025' },
  { title: 'Hiểu về sức khỏe tim mạch ở độ tuổi trung niên', category: 'Tim mạch', date: '05 Tháng 10, 2025' },
  { title: 'Bí quyết để có giấc ngủ ngon và tinh thần khỏe mạnh', category: 'Tinh thần', date: '28 Tháng 09, 2025' },
];

const ArticleSection = () => {
  return (
    <section id="articles" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Bài Viết Nổi Bật</h2>
          <p className="text-gray-500 text-lg">Cập nhật kiến thức y khoa và mẹo chăm sóc sức khỏe hữu ích từ các bác sĩ chuyên khoa.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <article key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="aspect-[16/9] bg-gray-100 w-full relative">
                 <div className="absolute inset-0 flex items-center justify-center text-gray-400">Hình ảnh</div>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{article.category}</span>
                  <span className="text-sm text-gray-400 font-medium">{article.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 leading-snug mb-3 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">Khám phá chi tiết các bài viết hướng dẫn để duy trì một cơ thể dẻo dai và lối sống lành mạnh mỗi ngày...</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticleSection;