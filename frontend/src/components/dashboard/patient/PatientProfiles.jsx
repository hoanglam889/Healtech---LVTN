import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { getPatientsByAccountId, deletePatient } from '../../../services/patientService';
import PatientProfileModal from './PatientProfileModal';
import { useTranslation } from 'react-i18next';
import { useToast, ConfirmModal } from '../../../components/shared/ToastProvider';
import { formatDate } from '../../../utils/dateUtils';

const RELATION_KEY_MAP = {
  'Bản thân': 'self',
  'Bố/Mẹ': 'parent',
  'Vợ/Chồng': 'spouse',
  'Con cái': 'child',
  'Khác': 'other',
};

const PatientProfiles = ({ user }) => {
  const { t } = useTranslation(['patient', 'common']);
  const { showToast } = useToast();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const loadData = () => {
    setLoading(true);
    getPatientsByAccountId(user?.id)
      .then((data) => {
        setProfiles(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const handleOpenAdd = () => {
    setEditingProfile(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (profile) => {
    setEditingProfile(profile);
    setIsModalOpen(true);
  };

  const handleDelete = (id, name) => setConfirmDelete({ id, name });

  const doDelete = () => {
    const { id } = confirmDelete;
    setConfirmDelete(null);
    deletePatient(id)
      .then(() => loadData())
      .catch(() => showToast(t('patient:profiles.delete_error'), 'error'));
  };

  return (
    <>
      <ConfirmModal
        isOpen={!!confirmDelete}
        message={t('patient:profiles.delete_confirm', { name: confirmDelete?.name })}
        onConfirm={doDelete}
        onCancel={() => setConfirmDelete(null)}
        cancelLabel={t('common:cancel')}
        confirmLabel={t('common:confirm')}
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

          {/* List */}
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
              {profiles.map((profile) => {
                const genderKey = profile.gender?.toLowerCase();
                const relationKey = RELATION_KEY_MAP[profile.relationship] || 'other';
                return (
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
                              {t(`common:relation.${relationKey}`)}
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
                          <span>{t('patient:profiles.gender_label')}: <span className="text-gray-700">{t(`common:gender.${genderKey}`, profile.gender)}</span></span>
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
    </>
  );
};

export default PatientProfiles;
