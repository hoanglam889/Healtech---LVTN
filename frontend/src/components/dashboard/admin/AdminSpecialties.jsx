import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { getSpecialties, createSpecialty, updateSpecialty, deleteSpecialty } from '../../../services/specialtyService';
import { useToast } from '../../../contexts/ToastContext';

// Danh sách các icon chuyên khoa được hỗ trợ đẹp mắt
const AVAILABLE_ICONS = [
  { value: 'Activity', label: 'Hoạt động / Khám chung', iconName: 'Activity' },
  { value: 'HeartPulse', label: 'Tim mạch', iconName: 'HeartPulse' },
  { value: 'Brain', label: 'Thần kinh / Não bộ', iconName: 'Brain' },
  { value: 'Bone', label: 'Xương khớp / Chỉnh hình', iconName: 'Bone' },
  { value: 'Baby', label: 'Nhi khoa', iconName: 'Baby' },
  { value: 'Eye', label: 'Mắt / Nhãn khoa', iconName: 'Eye' },
  { value: 'Stethoscope', label: 'Nội tổng hợp', iconName: 'Stethoscope' },
  { value: 'Sparkles', label: 'Da liễu / Thẩm mỹ', iconName: 'Sparkles' },
  { value: 'Syringe', label: 'Tiêm chủng / Ngoại khoa', iconName: 'Syringe' },
  { value: 'Glasses', label: 'Kính mắt / Khúc xạ', iconName: 'Glasses' },
  { value: 'Shield', label: 'Y học dự phòng', iconName: 'Shield' }
];

export default function AdminSpecialties() {
  const { showToast } = useToast();
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState(null);

  // States của form nhập liệu
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Activity');
  const [description, setDescription] = useState('');

  // Load danh sách chuyên khoa từ Backend
  const loadSpecialties = async () => {
    try {
      setLoading(true);
      const data = await getSpecialties();
      setSpecialties(data || []);
    } catch (err) {
      console.error('Lỗi tải danh mục chuyên khoa:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpecialties();
  }, []);

  // Lọc tìm kiếm theo tên
  const filteredSpecialties = specialties.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mở modal thêm mới
  const handleOpenAdd = () => {
    setEditingSpecialty(null);
    setName('');
    setIcon('Activity');
    setDescription('');
    setIsModalOpen(true);
  };

  // Mở modal chỉnh sửa
  const handleOpenEdit = (spec) => {
    setEditingSpecialty(spec);
    setName(spec.name);
    setIcon(spec.icon || 'Activity');
    setDescription(spec.description || '');
    setIsModalOpen(true);
  };

  // Xóa chuyên khoa
  const handleDelete = async (spec) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa chuyên khoa "${spec.name}"? Hành động này có thể ảnh hưởng đến thông tin bác sĩ trực thuộc!`)) {
      return;
    }
    try {
      await deleteSpecialty(spec.id);
      showToast('Xóa chuyên khoa thành công!', 'success');
      loadSpecialties();
    } catch (err) {
      console.error(err);
      showToast('Có lỗi xảy ra hoặc chuyên khoa đang được sử dụng bởi bác sĩ khác nên không thể xóa!', 'error');
    }
  };

  // Xử lý gửi Form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Vui lòng điền tên chuyên khoa!', 'warning');
      return;
    }

    const payload = {
      name: name.trim(),
      icon,
      description: description.trim()
    };

    try {
      if (editingSpecialty) {
        await updateSpecialty(editingSpecialty.id, payload);
        showToast('Cập nhật chuyên khoa thành công!', 'success');
      } else {
        await createSpecialty(payload);
        showToast('Tạo chuyên khoa mới thành công!', 'success');
      }
      setIsModalOpen(false);
      loadSpecialties();
    } catch (err) {
      console.error(err);
      showToast('Có lỗi xảy ra khi lưu thông tin chuyên khoa!', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* THANH TÌM KIẾM & NÚT THÊM MỚI */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Icons.Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Tìm kiếm chuyên khoa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-xs font-semibold text-gray-700"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
        >
          <Icons.PlusCircle className="w-4 h-4" />
          <span>Thêm Chuyên Khoa Mới</span>
        </button>
      </div>

      {/* DANH SÁCH BẢNG */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-[fadeIn_0.25s_ease-out]">
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">Đang tải danh mục chuyên khoa...</p>
          </div>
        ) : filteredSpecialties.length === 0 ? (
          <div className="p-16 text-center text-gray-400 font-bold text-sm">
            Không tìm thấy chuyên khoa nào phù hợp.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-wider bg-gray-50/30">
                  <th className="py-4 px-6 w-16 text-center">Icon</th>
                  <th className="py-4 px-6">Tên chuyên khoa</th>
                  <th className="py-4 px-6">Mô tả chi tiết</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                {filteredSpecialties.map((spec) => {
                  const IconComponent = Icons[spec.icon] || Icons.Activity;
                  return (
                    <tr key={spec.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 text-center">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto">
                          <IconComponent className="w-5 h-5" />
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-900 text-base">{spec.name}</td>
                      <td className="py-4 px-6 text-xs text-gray-500 max-w-sm truncate">
                        {spec.description || <span className="italic text-gray-300">Không có mô tả</span>}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(spec)}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/30 hover:border-indigo-100 transition-all cursor-pointer"
                        >
                          Chỉnh sửa
                        </button>
                        <button
                          onClick={() => handleDelete(spec)}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg border border-red-100 text-red-500 bg-red-50 hover:bg-red-100 transition-all cursor-pointer"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL THÊM / SỬA CHUYÊN KHOA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white rounded-3xl p-6 max-w-md w-full relative z-10 shadow-2xl border border-gray-100 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <Icons.Activity className="w-5 h-5 text-indigo-600" />
                <span>{editingSpecialty ? 'Chỉnh sửa chuyên khoa' : 'Thêm chuyên khoa mới'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer">
                <Icons.X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Tên chuyên khoa *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Răng Hàm Mặt, Tai Mũi Họng..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Biểu tượng hiển thị *</label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-xs font-semibold cursor-pointer"
                >
                  {AVAILABLE_ICONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} ({opt.value})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Mô tả chi tiết</label>
                <textarea
                  rows="4"
                  placeholder="Nhập mô tả ngắn gọn về dịch vụ khám và điều trị của chuyên khoa..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-xs font-semibold resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-50 text-gray-500 hover:bg-gray-100 transition-all border border-gray-200 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all cursor-pointer"
                >
                  {editingSpecialty ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
