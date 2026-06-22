import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { getPatientsByAccountId, createPatient, updatePatient, deletePatient } from '../../../services/patientService';
import { useToast, ConfirmModal } from '../../../components/shared/ToastProvider';
import { formatDate } from '../../../utils/dateUtils';
import { useTranslation } from 'react-i18next';

const PatientProfiles = ({ user }) => {
  const { t } = useTranslation(['patient', 'common']);
  const { showToast } = useToast();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('MALE');
  const [relationship, setRelationship] = useState('SELF');
  const [cccd, setCccd] = useState('');
  const [address, setAddress] = useState('');

  const loadData = () => {
    setLoading(true);
    getPatientsByAccountId(user?.id)
      .then((data) => { setProfiles(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [user?.id]);

  const handleOpenAdd = () => {
    setEditingProfile(null);
    setFullName('');
    setPhone(user?.phone || '');
    setDob('');
    setGender('MALE');
    setRelationship('SELF');
    setCccd('');
    setAddress('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (profile) => {
    setEditingProfile(profile);
    setFullName(profile.fullName || '');
    setPhone(profile.phone || '');
    setDob(profile.dob || '');
    setGender(profile.gender || 'MALE');
    setRelationship(profile.relationship || 'SELF');
    setCccd(profile.cccd || '');
    setAddress(profile.address || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !dob) {
      showToast(t('patient:profiles.form_required'), 'warning');
      return;
    }

    const patientData = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      dob,
      gender,
      relationship,
      cccd: cccd.trim() || null,
      address: address.trim() || null,
      patientAccountId: user?.id
    };

    if (editingProfile) {
      updatePatient(editingProfile.id, patientData)
        .then(() => { setIsModalOpen(false); loadData(); })
        .catch(() => showToast(t('patient:profiles.update_error'), 'error'));
    } else {
      createPatient(patientData)
        .then(() => { setIsModalOpen(false); loadData(); })
        .catch(() => showToast(t('patient:profiles.create_error'), 'error'));
    }
  };

  const handleDelete = (id, name) => setConfirmDelete({ id, name });

  const doDelete = () => {
    const { id } = confirmDelete;
    setConfirmDelete(null);
    deletePatient(id)
      .then(() => loadData())
      .catch(() => showToast(t('patient:profiles.delete_error'), 'error'));
  };

  const getRelationLabel = (rel) => {
    const map = {
      SELF: t('common:relation.self'),
      PARENT: t('common:relation.parent'),
      SPOUSE: t('common:relation.spouse'),
      CHILD: t('common:relation.child'),
      OTHER: t('common:relation.other'),
    };
    return map[rel] || rel;
  };

  const isSelf = (rel) => rel === 'SELF';

  return (
    <>
    <ConfirmModal
      isOpen={!!confirmDelete}
      message={t('patient:profiles.delete_confirm', { name: confirmDelete?.name })}
      onConfirm={doDelete}
      onCancel={() => setConfirmDelete(null)}
    />
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl flex items-center gap-2">
              <Icons.Users className="w-8 h-8 text-blue-600" />
              <span>{t('patient:profiles.title')}</span>
            </h1>
            <p className="text-sm text-gray-400 font-semibold">{t('patient:profiles.subtitle')}</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-blue-100 cursor-pointer flex items-center justify-center gap-2 self-start sm:self-auto"
          >
            <Icons.Plus className="w-5 h-5" />
            <span>{t('patient:profiles.add_btn')}</span>
          </button>
        </div>

        {loading ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-semibold">{t('patient:profiles.loading')}</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-400 font-medium shadow-sm space-y-4">
            <Icons.User className="w-12 h-12 mx-auto text-gray-300" />
            <p>{t('patient:profiles.empty')}</p>
            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-bold text-sm transition-all cursor-pointer"
            >
              {t('patient:profiles.create_first')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <div key={profile.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow transition-all relative flex flex-col justify-between gap-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold border border-blue-100 text-lg">
                        {profile.fullName?.charAt(0).toUpperCase() || 'P'}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{profile.fullName}</h4>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full uppercase">
                          {getRelationLabel(profile.relationship)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-gray-500 font-semibold">
                    <p className="flex items-center gap-2">
                      <Icons.Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{t('patient:profiles.dob_label')}: <span className="text-gray-700">{formatDate(profile.dob)}</span></span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Icons.User className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{t('patient:profiles.gender_label')}: <span className="text-gray-700">{t(`common:gender.${profile.gender?.toLowerCase()}`, profile.gender)}</span></span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Icons.Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{t('patient:profiles.phone_label')}: <span className="text-gray-700">{profile.phone || t('patient:profiles.not_updated')}</span></span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Icons.CreditCard className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{t('patient:profiles.cccd_label')}: <span className="text-gray-700">{profile.cccd || t('patient:profiles.not_updated')}</span></span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Icons.MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="truncate">{t('patient:profiles.address_label')}: <span className="text-gray-700">{profile.address || t('patient:profiles.not_updated')}</span></span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 border-t border-gray-50 pt-4 mt-2">
                  <button
                    onClick={() => handleOpenEdit(profile)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 border border-gray-100 hover:border-blue-100 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Icons.Edit3 className="w-3.5 h-3.5" />
                    <span>{t('patient:profiles.edit_btn')}</span>
                  </button>
                  {!isSelf(profile.relationship) && (
                    <button
                      onClick={() => handleDelete(profile.id, profile.fullName)}
                      className="py-2 px-3 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all cursor-pointer flex items-center justify-center"
                    >
                      <Icons.Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />

          <div className="bg-white rounded-3xl p-6 max-w-lg w-full relative z-10 shadow-2xl border border-gray-100 animate-[fadeIn_0.2s_ease-out] flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <Icons.UserPlus className="w-5 h-5 text-blue-600" />
                <span>{editingProfile ? t('patient:profiles.modal_edit_title') : t('patient:profiles.modal_add_title')}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer">
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto py-4 pr-1 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{t('patient:profiles.fullname_label')}</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium" required />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{t('patient:profiles.phone_form_label')}</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09XXXXXXXX"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium" required />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{t('patient:profiles.dob_form_label')}</label>
                  <input type="date" value={dob} onChange={(e) => setDob(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium" required />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{t('patient:profiles.gender_label')}</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium">
                    <option value="MALE">{t('common:gender.male')}</option>
                    <option value="FEMALE">{t('common:gender.female')}</option>
                    <option value="OTHER">{t('common:gender.other')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{t('patient:profiles.relation_form_label')}</label>
                  <select value={relationship} onChange={(e) => setRelationship(e.target.value)}
                    disabled={isSelf(editingProfile?.relationship)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed">
                    <option value="SELF">{t('common:relation.self')}</option>
                    <option value="PARENT">{t('common:relation.parent')}</option>
                    <option value="SPOUSE">{t('common:relation.spouse')}</option>
                    <option value="CHILD">{t('common:relation.child')}</option>
                    <option value="OTHER">{t('common:relation.other')}</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{t('patient:profiles.cccd_form_label')}</label>
                  <input type="text" value={cccd} onChange={(e) => setCccd(e.target.value)} placeholder={t('patient:profiles.cccd_placeholder')}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{t('patient:profiles.address_form_label')}</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t('patient:profiles.address_placeholder')}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gray-50 text-gray-500 hover:bg-gray-100 transition-all border border-gray-200 cursor-pointer">
                  {t('patient:profiles.cancel_btn')}
                </button>
                <button type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm cursor-pointer">
                  {editingProfile ? t('patient:profiles.update_btn') : t('patient:profiles.save_btn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default PatientProfiles;
