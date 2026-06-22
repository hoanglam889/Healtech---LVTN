import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { getPatientsByAccountId, deletePatient } from '../../../services/patientService';
import PatientProfileModal from './PatientProfileModal';

const PatientProfiles = ({ user }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Trạng thái hiển thị Modal thêm/sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);

  // Tải dữ liệu hồ sơ
  const loadData = () => {
    setLoading(true);
    getPatientsByAccountId(user?.id)
      .then((data) => {
        setProfiles(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi tải hồ sơ bệnh nhân:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  // Mở Modal Thêm mới
  const handleOpenAdd = () => {
    setEditingProfile(null);
    setIsModalOpen(true);
  };

  // Mở Modal Chỉnh sửa
  const handleOpenEdit = (profile) => {
    setEditingProfile(profile);
    setIsModalOpen(true);
  };

  // Xóa hồ sơ
  const handleDelete = (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa hồ sơ của bệnh nhân "${name}" không?`)) {
      deletePatient(id)
        .then(() => {
          loadData();
        })
        .catch((err) => {
          console.error('Lỗi khi xóa hồ sơ:', err);
          alert('Không thể xóa hồ sơ này vì đã có lịch hẹn liên kết.');
        });
    }
  };

  // Hàm định dạng ngày dd/mm/yyyy
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Tiêu đề & Nút thêm */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl flex items-center gap-2">
              <Icons.Users className="w-8 h-8 text-blue-600" />
              <span>Quản lý hồ sơ bệnh nhân</span>
            </h1>
            <p className="text-sm text-gray-400 font-semibold">Thêm và cập nhật thông tin hồ sơ y tế của bản thân và người thân.</p>
          </div>
          <button 
            onClick={handleOpenAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-blue-100 cursor-pointer flex items-center justify-center gap-2 self-start sm:self-auto"
          >
            <Icons.Plus className="w-5 h-5" />
            <span>Thêm hồ sơ mới</span>
          </button>
        </div>

        {/* Danh sách Hồ sơ */}
        {loading ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-semibold">Đang tải hồ sơ bệnh nhân...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-400 font-medium shadow-sm space-y-4">
            <Icons.User className="w-12 h-12 mx-auto text-gray-300" />
            <p>Bạn chưa tạo hồ sơ bệnh nhân nào cho tài khoản này.</p>
            <button 
              onClick={handleOpenAdd}
              className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-bold text-sm transition-all cursor-pointer"
            >
              Tạo hồ sơ đầu tiên
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => {
              const displayGender = profile.gender === 'MALE' ? 'Nam' : profile.gender === 'FEMALE' ? 'Nữ' : 'Khác';
              return (
                <div key={profile.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow transition-all relative flex flex-col justify-between gap-4">
                  <div className="space-y-4">
                    {/* Header Card */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold border border-blue-100 text-lg">
                          {profile.fullName?.charAt(0).toUpperCase() || 'P'}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{profile.fullName}</h4>
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full uppercase">
                            {profile.relationship || 'Bản thân'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Chi tiết thông tin */}
                    <div className="space-y-2 text-xs text-gray-500 font-semibold">
                      <p className="flex items-center gap-2">
                        <Icons.Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>Ngày sinh: <span className="text-gray-700">{formatDate(profile.dob)}</span></span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Icons.User className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>Giới tính: <span className="text-gray-700">{displayGender}</span></span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Icons.Phone className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>Điện thoại: <span className="text-gray-700">{profile.phone || 'Chưa cập nhật'}</span></span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Icons.CreditCard className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>Số CCCD: <span className="text-gray-700">{profile.cccd || 'Chưa cập nhật'}</span></span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Icons.MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="truncate">Địa chỉ: <span className="text-gray-700">{profile.address || 'Chưa cập nhật'}</span></span>
                      </p>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2 border-t border-gray-50 pt-4 mt-2">
                    <button 
                      onClick={() => handleOpenEdit(profile)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 border border-gray-100 hover:border-blue-100 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Icons.Edit3 className="w-3.5 h-3.5" />
                      <span>Chỉnh sửa</span>
                    </button>
                    {profile.relationship !== 'Bản thân' && (
                      <button 
                        onClick={() => handleDelete(profile.id, profile.fullName)}
                        className="py-2 px-3 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all cursor-pointer flex items-center justify-center"
                      >
                        <Icons.Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <PatientProfileModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProfile={editingProfile}
        user={user}
        onSuccess={() => loadData()}
      />
    </div>
  );
};

export default PatientProfiles;
