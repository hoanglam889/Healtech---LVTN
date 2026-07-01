import React, { useEffect } from 'react';
import * as Icons from 'lucide-react';
import { BASE_URL } from '../../services/apiClient';

const ArticleDetailModal = ({ article, onClose }) => {
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return `${cleanBase}${cleanUrl}`;
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!article) return null;

  const imageUrl = getImageUrl(article.imageUrl);
  
  // Format date
  const publishDate = new Date(article.createdAt).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" 
        onClick={onClose} 
      />
      
      {/* Modal Box */}
      <div className="bg-white rounded-2xl w-full max-w-4xl relative z-10 shadow-2xl flex flex-col max-h-[95vh] animate-[slideUp_0.3s_ease-out] overflow-hidden">
        
        {/* Header / Actions */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button 
            onClick={onClose}
            className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors cursor-pointer"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto custom-scrollbar flex-1">
          {/* Cover Image */}
          <div className="w-full h-64 md:h-80 bg-gray-100 relative">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={article.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200">
                <Icons.Image className="w-16 h-16 opacity-50" />
              </div>
            )}
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>

          {/* Article Header */}
          <div className="px-6 md:px-12 pt-8 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                {article.category || 'Tin tức'}
              </span>
              <span className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                <Icons.Calendar className="w-4 h-4" /> {publishDate}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              {article.title}
            </h1>
            
            <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Icons.User className="w-4 h-4" />
              </div>
              Bởi <span className="text-gray-900 font-bold">{article.authorName || 'Ban biên tập Healtech'}</span>
            </div>
          </div>

          {/* Article Body */}
          <div className="px-6 md:px-12 py-8 prose prose-blue max-w-none prose-img:rounded-xl">
            {/* Sử dụng dangerouslySetInnerHTML nếu content lưu dạng HTML */}
            <div 
              className="text-gray-700 leading-loose text-base md:text-lg article-content whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
          
          <div className="px-6 md:px-12 pb-12 pt-4">
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col md:flex-row items-center gap-6 justify-between">
              <div className="text-center md:text-left">
                <h4 className="font-bold text-gray-900 text-lg mb-1">Bạn cần tư vấn y tế?</h4>
                <p className="text-gray-600 text-sm">Hãy đặt lịch khám ngay với các chuyên gia của chúng tôi.</p>
              </div>
              <button 
                onClick={() => { onClose(); window.location.href = '#booking-section'; }}
                className="whitespace-nowrap px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2 cursor-pointer"
              >
                Đặt lịch khám <Icons.ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailModal;
