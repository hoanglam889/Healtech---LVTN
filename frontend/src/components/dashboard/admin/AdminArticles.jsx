import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Icons from 'lucide-react';
import { BASE_URL } from '../../../services/apiClient';
import { uploadImage } from '../../../services/uploadService';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = () => {
    setLoading(true);
    axios.get(`${BASE_URL}articles`)
      .then(res => {
        setArticles(res.data || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setCurrentArticle(null);
    setTitle('');
    setCategory('');
    setContent('');
    setImageUrl('');
    setAuthorName('');
    setIsPublished(true);
    setShowModal(false);
  };

  const handleEdit = (article) => {
    setCurrentArticle(article);
    setTitle(article.title);
    setCategory(article.category);
    setContent(article.content);
    setImageUrl(article.image_url || '');
    setAuthorName(article.author_name || '');
    setIsPublished(article.is_published);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if(window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      axios.delete(`${BASE_URL}articles/${id}`)
        .then(() => fetchArticles())
        .catch(err => console.error(err));
    }
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return `${cleanBase}${cleanUrl}`;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadImage(file);
      if (res.filePath) {
        setImageUrl(res.filePath);
      }
    } catch (err) {
      console.error('Lỗi khi tải ảnh:', err);
      alert('Có lỗi xảy ra khi tải ảnh lên.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
    const payload = {
      title,
      category,
      content,
      image_url: imageUrl,
      author_name: authorName,
      is_published: isPublished,
      user_id: adminUser.id || null
    };

    if (currentArticle) {
      axios.patch(`${BASE_URL}articles/${currentArticle.id}`, payload)
        .then(() => {
          fetchArticles();
          resetForm();
        })
        .catch(err => alert('Lỗi khi cập nhật bài viết'));
    } else {
      axios.post(`${BASE_URL}articles`, payload)
        .then(() => {
          fetchArticles();
          resetForm();
        })
        .catch(err => alert('Lỗi khi tạo bài viết'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Quản lý Bài Viết (Tin tức)</h2>
          <p className="text-sm text-gray-500 mt-1">Thêm mới, sửa đổi hoặc xóa các bài viết trên Landing Page.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium cursor-pointer shadow-sm"
        >
          <Icons.Plus className="w-5 h-5" /> Thêm Bài Viết Mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm font-semibold border-b border-gray-100">
                  <th className="p-4">Tiêu đề</th>
                  <th className="p-4">Chuyên mục</th>
                  <th className="p-4 text-center">Trạng thái</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">Chưa có bài viết nào.</td>
                  </tr>
                ) : articles.map(article => (
                  <tr key={article.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-800 line-clamp-1">{article.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{new Date(article.created_at).toLocaleDateString('vi-VN')}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{article.category}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${article.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {article.is_published ? 'Đã xuất bản' : 'Bản nháp'}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2 justify-end">
                      <button onClick={() => handleEdit(article)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer" title="Sửa">
                        <Icons.Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(article.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer" title="Xóa">
                        <Icons.Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={resetForm}></div>
          <div className="bg-white rounded-2xl w-full max-w-3xl relative z-10 shadow-xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">{currentArticle ? 'Sửa bài viết' : 'Thêm bài viết mới'}</h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 cursor-pointer"><Icons.X className="w-6 h-6" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <form id="articleForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tiêu đề bài viết <span className="text-red-500">*</span></label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Chuyên mục <span className="text-red-500">*</span></label>
                    <input type="text" value={category} onChange={e => setCategory(e.target.value)} required className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tác giả</label>
                    <input type="text" value={authorName} onChange={e => setAuthorName(e.target.value)} placeholder="Tên tác giả..." className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Ảnh bìa bài viết</label>
                  <div className="flex gap-2 items-center">
                    <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="URL ảnh hoặc tải lên..." className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                    <label className="flex-shrink-0 cursor-pointer bg-blue-50 text-blue-600 px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-100 transition-colors flex items-center gap-2">
                      {isUploading ? <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div> : <Icons.Upload className="w-5 h-5" />}
                      Tải ảnh lên
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                  {imageUrl && <img src={getImageUrl(imageUrl)} alt="Preview" className="h-20 mt-2 rounded-lg object-cover border border-gray-200" />}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nội dung bài viết (Hỗ trợ tự xuống dòng) <span className="text-red-500">*</span></label>
                  <textarea value={content} onChange={e => setContent(e.target.value)} required rows="8" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm whitespace-pre-wrap"></textarea>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input type="checkbox" id="isPublished" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  <label htmlFor="isPublished" className="font-medium text-gray-700 cursor-pointer">Xuất bản công khai</label>
                </div>
              </form>
            </div>
            
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end">
              <button type="button" onClick={resetForm} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors cursor-pointer">Hủy</button>
              <button type="submit" form="articleForm" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer">Lưu Bài Viết</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArticles;
