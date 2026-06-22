import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { createPatient, updatePatient } from '../../../services/patientService';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../components/shared/ToastProvider';

const PatientProfileModal = ({ isOpen, onClose, editingProfile, user, onSuccess }) => {
  const { t } = useTranslation(['patient', 'common']);
  const { showToast } = useToast();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('MALE');
  const [relationship, setRelationship] = useState('Khác');
  const [cccd, setCccd] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingProfile) {
        setFullName(editingProfile.fullName || '');
        setPhone(editingProfile.phone || '');
        setDob(editingProfile.dob || '');
        setGender(editingProfile.gender || 'MALE');
        setRelationship(editingProfile.relationship || 'Khác');
        setCccd(editingProfile.cccd || '');
        setAddress(editingProfile.address || '');
      } else {
        setFullName('');
        setPhone(user?.phone || '');
        setDob('');
        setGender('MALE');
        setRelationship('Khác');
        setCccd('');
        setAddress('');
      }
    }
  }, [isOpen, editingProfile, user]);

  if (!isOpen) return null;

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
      patientAccountId: user?.id,
    };

    setIsSubmitting(true);

    if (editingProfile) {
      updatePatient(editingProfile.id, patientData)
        .then((updatedProfile) => {
          setIsSubmitting(false);
          if (onSuccess) onSuccess(updatedProfile);
          onClose();
        })
        .catch(() => {
          setIsSubmitting(false);
          showToast(t('patient:profiles.update_error'), 'error');
        });
    } else {
      createPatient(patientData)
        .then((newProfile) => {
          setIsSubmitting(false);
          if (onSuccess) onSuccess(newProfile);
          onClose();
        })
        .catch(() => {
          setIsSubmitting(false);
          showToast(t('patient:profiles.create_error'), 'error');
        });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="bg-white rounded-3xl p-6 max-w-lg w-full relative z-10 shadow-2xl border border-gray-100 animate-[fadeIn_0.2s_ease-out] flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <Icons.UserPlus className="w-5 h-5 text-blue-600" />
            <span>{editingProfile ? t('patient:profiles.modal_edit_title') : t('patient:profiles.modal_add_title')}</span>
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto py-4 pr-1 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{t('patient:profiles.fullname_label')}</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{t('patient:profiles.phone_form_label')}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09XXXXXXXX"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{t('patient:profiles.dob_form_label')}</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{t('patient:profiles.gender_label')}</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium"
              >
                <option value="MALE">{t('common:gender.male')}</option>
                <option value="FEMALE">{t('common:gender.female')}</option>
                <option value="OTHER">{t('common:gender.other')}</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{t('patient:profiles.relation_form_label')}</label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                disabled={editingProfile?.relationship === 'Bản thân'}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="Bản thân">{t('common:relation.self')}</option>
                <option value="Bố/Mẹ">{t('common:relation.parent')}</option>
                <option value="Vợ/Chồng">{t('common:relation.spouse')}</option>
                <option value="Con cái">{t('common:relation.child')}</option>
                <option value="Khác">{t('common:relation.other')}</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{t('patient:profiles.cccd_form_label')}</label>
              <input
                type="text"
                value={cccd}
                onChange={(e) => setCccd(e.target.value)}
                placeholder={t('patient:profiles.cccd_placeholder')}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{t('patient:profiles.address_form_label')}</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t('patient:profiles.address_placeholder')}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium"
              />
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gray-50 text-gray-500 hover:bg-gray-100 transition-all border border-gray-200 cursor-pointer"
            >
              {t('patient:profiles.cancel_btn')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmitting
                ? t('patient:profiles.saving')
                : editingProfile
                  ? t('patient:profiles.update_btn')
                  : t('patient:profiles.save_btn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientProfileModal;
