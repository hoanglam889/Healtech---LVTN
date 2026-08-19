import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Icons from 'lucide-react';
import { BASE_URL } from '../../../services/apiClient';
import { useToast } from '../../../contexts/ToastContext';
import { useConfirm } from '../../../contexts/ConfirmContext';

const AdminServices = () => {
  const { confirm } = useConfirm();
  const { showToast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentService, setCurrentService] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    setLoading(true);
    axios.get(`${BASE_URL}services`)
      .then(res => {
        setServices(res.data || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setCurrentService(null);
    setName('');
    setDescription('');
    setPrice('');
    setShowModal(false);
  };

  const handleEdit = (service) => {
    setCurrentService(service);
    setName(service.name);
    setDescription(service.description);
    setPrice(service.price);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if(await confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      axios.delete(`${BASE_URL}services/${id}`)
        .then(() => fetchServices())
        .catch(err => console.error(err));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Gói dữ liệu gửi xuống API
    const payload = {
      name,
      description,
      price: Number(price), // Đảm bảo giá tiền là kiểu số
      isActive: true
    };

    if (currentService) {
      // Nhánh Sửa (Update)
      axios.patch(`${BASE_URL}services/${currentService.id}`, payload)
        .then(() => {
          fetchServices();
          resetForm();
        })
        .catch(err => showToast('Lỗi khi cập nhật dịch vụ', 'error'));
    } else {
      // Nhánh Thêm Mới (Create)
      axios.post(`${BASE_URL}services`, payload)
        .then(() => {
          fetchServices();
          resetForm();
        })
        .catch(err => showToast('Lỗi khi tạo dịch vụ', 'error'));
    }
  };

  // Helper format currency
  const formatVND = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Quản lý Dịch vụ khám</h2>
          <p className="text-sm text-gray-500 mt-1">Thêm mới, sửa đổi hoặc xóa các dịch vụ tại phòng khám.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium cursor-pointer shadow-sm"
        >
          <Icons.Plus className="w-5 h-5" /> Thêm Dịch vụ mới
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
                  <th className="p-4">Mã</th>
                  <th className="p-4">Tên dịch vụ</th>
                  <th className="p-4">Mô tả</th>
                  <th className="p-4 text-right">Giá</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {services.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">Chưa có dịch vụ nào.</td>
                  </tr>
                ) : services.map(service => (
                  <tr key={service.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-4 font-bold text-gray-800">#{service.id}</td>
                    <td className="p-4 font-bold text-gray-800">{service.name}</td>
                    <td className="p-4 text-sm text-gray-600">{service.description}</td>
                    <td className="p-4 text-right font-extrabold text-blue-600">{formatVND(service.price)}</td>
                    <td className="p-4 flex gap-2 justify-end">
                      <button onClick={() => handleEdit(service)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer" title="Sửa">
                        <Icons.Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(service.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer" title="Xóa">
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
          <div className="bg-white rounded-2xl w-full max-w-lg relative z-10 shadow-xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">{currentService ? 'Sửa Dịch vụ' : 'Thêm Dịch vụ mới'}</h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 cursor-pointer"><Icons.X className="w-6 h-6" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <form id="serviceForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tên dịch vụ <span className="text-red-500">*</span></label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="VD: Siêu âm 4D" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Giá tiền (VNĐ) <span className="text-red-500">*</span></label>
                  <input type="number" value={price} onChange={e => setPrice(e.target.value)} required min="0" placeholder="VD: 250000" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả dịch vụ</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} rows="3" placeholder="Chi tiết dịch vụ..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm"></textarea>
                </div>
              </form>
            </div>
            
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end">
              <button type="button" onClick={resetForm} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors cursor-pointer">Hủy</button>
              <button type="submit" form="serviceForm" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer">Lưu Dịch vụ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
