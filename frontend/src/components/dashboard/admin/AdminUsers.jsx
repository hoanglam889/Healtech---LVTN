import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from '../../../services/doctorService';
import { getAllPatients } from '../../../services/patientService';
import { getSpecialties } from '../../../services/specialtyService';
import { BASE_URL } from '../../../services/apiClient';
import { uploadImage } from '../../../services/uploadService';

export default function AdminUsers({ roleType }) {
  const [users, setUsers] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [roleFilter, setRoleFilter] = useState('ALL'); // 'ALL' | 'DOCTOR' | 'PATIENT'
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null); // Lưu bác sĩ đang được chỉnh sửa

  // States cho Form bác sĩ
  const [docName, setDocName] = useState('');
  const [docPhone, setDocPhone] = useState('');
  const [docPassword, setDocPassword] = useState('');
  const [docSpecialtyId, setDocSpecialtyId] = useState('');
  const [docExpYears, setDocExpYears] = useState('0');
  const [docAvatarUrl, setDocAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  // Load danh sách dữ liệu từ Backend
  const loadData = () => {
    setLoading(true);
    Promise.all([
      getDoctors(),
      getAllPatients(),
      getSpecialties()
    ])
      .then(([doctorList, patientList, specialtyList]) => {
        // Map Doctors
        const mappedDoctors = (doctorList || []).map((doc) => ({
          id: doc.id,
          fullName: doc.fullName.startsWith('BS.') ? doc.fullName : `BS. ${doc.fullName}`,
          rawName: doc.fullName.replace(/^BS\.\s*/, ''),
          phone: doc.user?.phone || 'N/A',
          role: 'DOCTOR',
          status: doc.user?.isActive ? 'ACTIVE' : 'LOCKED',
          department: doc.specialty?.name || 'Tổng quát',
          specialtyId: doc.specialtyId,
          experienceYears: doc.experienceYears || 0,
          avatarUrl: doc.avatarUrl
        }));

        // Map Patients
        const mappedPatients = (patientList || []).map((pat) => ({
          id: pat.id,
          fullName: pat.fullName,
          phone: pat.phone || 'N/A',
          role: 'PATIENT',
          status: 'ACTIVE',
          department: pat.relationship || 'Khách hàng'
        }));

        setUsers([...mappedDoctors, ...mappedPatients]);
        setSpecialties(specialtyList || []);
        if (specialtyList && specialtyList.length > 0 && !docSpecialtyId) {
          setDocSpecialtyId(specialtyList[0].id.toString());
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi tải danh sách người dùng:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Lọc danh sách hiển thị
  const filteredUsers = users.filter((u) => {
    if (roleType) {
      if (u.role !== roleType) return false;
    } else if (roleFilter !== 'ALL' && u.role !== roleFilter) {
      return false;
    }
    const nameMatch = u.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const phoneMatch = u.phone.includes(searchQuery);
    return nameMatch || phoneMatch;
  });

  // Mở Modal Thêm mới
  const handleOpenAdd = () => {
    setEditingDoctor(null);
    setDocName('');
    setDocPhone('');
    setDocPassword('');
    setDocExpYears('0');
    setDocAvatarUrl('');
    setUploading(false);
    if (specialties.length > 0) {
      setDocSpecialtyId(specialties[0].id.toString());
    }
    setIsModalOpen(true);
  };

  // Mở Modal Sửa
  const handleOpenEdit = (doctorItem) => {
    setEditingDoctor(doctorItem);
    setDocName(doctorItem.rawName);
    setDocPhone(doctorItem.phone);
    setDocPassword(''); // Mật khẩu để trống, nếu điền mới cập nhật
    setDocSpecialtyId(doctorItem.specialtyId?.toString() || '');
    setDocExpYears(doctorItem.experienceYears?.toString() || '0');
    setDocAvatarUrl(doctorItem.avatarUrl || '');
    setUploading(false);
    setIsModalOpen(true);
  };

  // Khóa / Mở khóa tài khoản Bác sĩ
  const handleToggleStatus = async (userItem) => {
    if (userItem.role !== 'DOCTOR') {
      alert('Không thể thay đổi trạng thái của tài khoản bệnh nhân!');
      return;
    }

    const nextStatusText = userItem.status === 'ACTIVE' ? 'KHOÁ' : 'MỞ KHOÁ';
    if (!window.confirm(`Bạn có chắc chắn muốn ${nextStatusText} tài khoản của ${userItem.fullName}?`)) {
      return;
    }

    try {
      if (userItem.status === 'ACTIVE') {
        await deleteDoctor(userItem.id);
      } else {
        await updateDoctor(userItem.id, { isActive: true });
      }
      alert(`${nextStatusText} tài khoản bác sĩ thành công!`);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi cập nhật trạng thái tài khoản!');
    }
  };

  const getAvatarSrc = (url) => {
    if (!url) {
      return null;
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return `${cleanBase}${cleanUrl}`;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh không được vượt quá 5MB!');
      return;
    }

    try {
      setUploading(true);
      const res = await uploadImage(file);
      setDocAvatarUrl(res.filePath);
    } catch (err) {
      console.error('Lỗi upload ảnh:', err);
      alert('Không thể tải ảnh lên. Vui lòng thử lại!');
    } finally {
      setUploading(false);
    }
  };

  // Gửi Form thêm / sửa Bác sĩ
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!docName.trim() || !docPhone.trim() || (!editingDoctor && !docPassword.trim()) || !docSpecialtyId) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc!');
      return;
    }

    try {
      const payload = {
        fullName: docName.trim(),
        phone: docPhone.trim(),
        specialtyId: +docSpecialtyId,
        experienceYears: +docExpYears,
        avatarUrl: docAvatarUrl
      };

      if (docPassword.trim()) {
        payload.password = docPassword.trim();
      }

      if (editingDoctor) {
        // Cập nhật thông tin bác sĩ
        await updateDoctor(editingDoctor.id, payload);
        alert('Cập nhật thông tin bác sĩ thành công!');
      } else {
        // Tạo mới bác sĩ
        await createDoctor(payload);
        alert('Thêm tài khoản bác sĩ mới thành công!');
      }

      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin bác sĩ!');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* SEARCH BAR & BUTTON ADD */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Icons.Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc số điện thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-xs font-semibold text-gray-700"
          />
        </div>

        {(!roleType || roleType === 'DOCTOR') && (
          <button
            onClick={handleOpenAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
          >
            <Icons.UserPlus className="w-4 h-4" />
            <span>Thêm Bác sĩ mới</span>
          </button>
        )}
      </div>

      {/* FILTER TABS */}
      {!roleType && (
        <div className="flex gap-2">
          {[
            { label: 'Tất cả tài khoản', value: 'ALL' },
            { label: 'Bác sĩ', value: 'DOCTOR' },
            { label: 'Bệnh nhân', value: 'PATIENT' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setRoleFilter(tab.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                roleFilter === tab.value
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* BẢNG HIỂN THỊ DANH SÁCH */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-[fadeIn_0.25s_ease-out]">
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">Đang tải danh sách tài khoản...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-16 text-center text-gray-400 font-bold text-sm">
            Không tìm thấy người dùng nào phù hợp.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-wider bg-gray-50/30">
                  <th className="py-4 px-6">Họ và Tên</th>
                  <th className="py-4 px-6">Số điện thoại</th>
                  <th className="py-4 px-6">Vai trò</th>
                  <th className="py-4 px-6">Khoa / Phòng ban</th>
                  <th className="py-4 px-6">Trạng thái</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={`${user.role}-${user.id}`} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 shrink-0 flex items-center justify-center bg-gray-50 relative">
                          {user.role === 'DOCTOR' ? (
                            getAvatarSrc(user.avatarUrl) ? (
                              <img
                                src={getAvatarSrc(user.avatarUrl)}
                                alt={user.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-sm">🩺</span>
                            )
                          ) : (
                            <span className="text-sm">👤</span>
                          )}
                        </div>
                        <span className="font-bold text-gray-900">{user.fullName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs">{user.phone}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        user.role === 'DOCTOR'
                          ? 'bg-rose-50 text-rose-600 border border-rose-100'
                          : 'bg-violet-50 text-violet-600 border border-violet-100'
                      }`}>
                        {user.role === 'DOCTOR' ? 'Bác sĩ' : 'Bệnh nhân'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-500">{user.department}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        user.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-gray-100 text-gray-400 border border-gray-200'
                      }`}>
                        {user.status === 'ACTIVE' ? 'Đang hoạt động' : 'Đang khóa'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {user.role === 'DOCTOR' ? (
                        <>
                          <button
                            onClick={() => handleOpenEdit(user)}
                            className="text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/30 hover:border-indigo-100 transition-all cursor-pointer"
                          >
                            Chỉnh sửa
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                              user.status === 'ACTIVE'
                                ? 'text-amber-600 bg-amber-50 border-amber-100 hover:bg-amber-100'
                                : 'text-emerald-600 bg-emerald-50 border-emerald-100 hover:bg-emerald-100'
                            }`}
                          >
                            {user.status === 'ACTIVE' ? 'Khóa' : 'Mở khóa'}
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 font-semibold italic">Mặc định hoạt động</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL THÊM / SỬA BÁC SĨ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white rounded-3xl p-6 max-w-md w-full relative z-10 shadow-2xl border border-gray-100 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <Icons.UserCog className="w-5 h-5 text-indigo-600" />
                <span>{editingDoctor ? 'Chỉnh sửa thông tin bác sĩ' : 'Thêm tài khoản bác sĩ mới'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer">
                <Icons.X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Ảnh đại diện bác sĩ */}
              <div className="flex flex-col items-center justify-center border-b border-gray-100 pb-4">
                <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-indigo-100 hover:border-indigo-600 transition-all flex items-center justify-center bg-gray-50 cursor-pointer shadow-inner">
                  {uploading ? (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : null}
                  
                  {getAvatarSrc(docAvatarUrl) ? (
                    <img
                      src={getAvatarSrc(docAvatarUrl)}
                      alt="Avatar bác sĩ"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl text-indigo-400">🩺</span>
                  )}
                  
                  <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20">
                    <Icons.Camera className="w-5 h-5 mb-1" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Đổi ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                  </label>
                </div>
                <span className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wider">Ảnh đại diện</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Họ và tên bác sĩ (Không cần điền BS.) *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Trần Quốc Huy..."
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Số điện thoại đăng nhập *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: 0912345678..."
                  value={docPhone}
                  onChange={(e) => setDocPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Mật khẩu {editingDoctor ? '(Để trống nếu không muốn đổi)' : '*'}
                </label>
                <input
                  type="password"
                  required={!editingDoctor}
                  placeholder={editingDoctor ? "Nhập mật khẩu mới..." : "Nhập mật khẩu..."}
                  value={docPassword}
                  onChange={(e) => setDocPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Chuyên khoa *</label>
                  <select
                    value={docSpecialtyId}
                    onChange={(e) => setDocSpecialtyId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-xs font-semibold cursor-pointer"
                  >
                    {specialties.map((spec) => (
                      <option key={spec.id} value={spec.id}>
                        {spec.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Số năm kinh nghiệm</label>
                  <input
                    type="number"
                    min="0"
                    value={docExpYears}
                    onChange={(e) => setDocExpYears(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-xs font-semibold"
                  />
                </div>
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
                  {editingDoctor ? 'Cập nhật' : 'Tạo tài khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
