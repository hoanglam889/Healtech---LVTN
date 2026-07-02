import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../services/apiClient';
import ArticleDetailModal from './ArticleDetailModal';

const ArticleSection = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return `${cleanBase}${cleanUrl}`;
  };

  useEffect(() => {
    axios.get(`${BASE_URL}articles?publishedOnly=true`)
      .then(res => {
        setArticles(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi fetch bài viết:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="articles" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Bài Viết Nổi Bật</h2>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">Đang tải danh sách bài viết...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                <div className="aspect-video bg-gray-200 w-full"></div>
                <div className="p-5 md:p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="articles" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Bài Viết Nổi Bật</h2>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">Cập nhật kiến thức y khoa và mẹo chăm sóc sức khỏe hữu ích từ các bác sĩ chuyên khoa.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.length > 0 ? articles.slice(0, 3).map((article) => {
            const imageUrl = getImageUrl(article.image_url);
            const publishDate = new Date(article.created_at).toLocaleDateString('vi-VN', {
              day: '2-digit', month: '2-digit', year: 'numeric'
            });

            return (
              <article 
                key={article.id} 
                onClick={() => setSelectedArticle(article)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group flex flex-col"
              >
                <div className="aspect-video bg-gray-100 w-full relative">
                  {imageUrl ? (
                    <img src={imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">Hình ảnh</div>
                  )}
                </div>
                <div className="p-5 md:p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{article.category || 'Tin tức'}</span>
                    <span className="text-xs text-gray-400 font-medium">{publishDate}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <div className="text-gray-500 text-xs leading-relaxed line-clamp-2 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: article.content.substring(0, 150) + '...' }} />
                  <div className="mt-auto pt-4 text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    Đọc tiếp &rarr;
                  </div>
                </div>
              </article>
            );
          }) : (
            <div className="col-span-3 text-center text-gray-500 py-10">Chưa có bài viết nào được đăng tải.</div>
          )}
        </div>
      </div>

      {/* Modal Chi tiết bài viết */}
      <ArticleDetailModal 
        article={selectedArticle} 
        onClose={() => setSelectedArticle(null)} 
      />
    </section>
  );
};

export default ArticleSection;