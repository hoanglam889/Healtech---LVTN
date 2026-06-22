import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ProfileForm = ({ onAddProfile }) => {
  const { t } = useTranslation(['booking', 'common']);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const name = data.get('name')?.toString().trim();
    const phone = data.get('phone')?.toString().trim();
    const dob = data.get('dob')?.toString();
    const gender = data.get('gender')?.toString();
    const relationship = data.get('relationship')?.toString();

    if (!name || !phone || !dob) {
      alert(t('booking:form_required_alert'));
      return;
    }

    const newProfile = {
      fullName: name,
      phone,
      dob,
      gender,
      relationship
    };

    onAddProfile(newProfile);
    e.currentTarget.reset();
    setIsOpen(false);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t('booking:profiles_title')}</h2>
          <p className="text-sm text-gray-400 mt-1">{t('booking:profiles_subtitle')}</p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
            isOpen
              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
          }`}
        >
          {isOpen ? t('booking:close_form_btn') : t('booking:create_profile_btn')}
        </button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-6 pt-6 border-t border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-800 text-base">{t('booking:form_patient_info')}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('booking:form_name_label')}</label>
              <input
                type="text"
                name="name"
                placeholder="Nguyễn Văn A"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('booking:form_phone_label')}</label>
              <input
                type="tel"
                name="phone"
                placeholder="09XXXXXXXX"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('booking:form_dob_label')}</label>
              <input
                type="date"
                name="dob"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('booking:form_gender_label')}</label>
              <div className="flex gap-4 h-11 items-center">
                {[
                  { value: 'MALE', label: t('common:gender.male') },
                  { value: 'FEMALE', label: t('common:gender.female') },
                  { value: 'OTHER', label: t('common:gender.other') },
                ].map((g) => (
                  <label key={g.value} className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="gender"
                      value={g.value}
                      defaultChecked={g.value === 'MALE'}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    {g.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('booking:form_relation_label')}</label>
              <select
                name="relationship"
                defaultValue="SELF"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-medium"
              >
                <option value="SELF">{t('common:relation.self')}</option>
                <option value="PARENT">{t('common:relation.parent')}</option>
                <option value="SPOUSE">{t('common:relation.spouse')}</option>
                <option value="CHILD">{t('common:relation.child')}</option>
                <option value="OTHER">{t('common:relation.other')}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gray-50 text-gray-500 hover:bg-gray-100 transition-all border border-gray-200 cursor-pointer"
            >
              {t('booking:form_cancel_btn')}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm cursor-pointer"
            >
              {t('booking:form_save_btn')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileForm;
