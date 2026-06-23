import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getSpecialties, createSpecialty, updateSpecialty, deleteSpecialty } from '../../../services/specialtyService';

const AVAILABLE_ICONS = [
  { value: 'Activity', labelKey: 'icon_activity', iconName: 'Activity' },
  { value: 'HeartPulse', labelKey: 'icon_heart', iconName: 'HeartPulse' },
  { value: 'Brain', labelKey: 'icon_brain', iconName: 'Brain' },
  { value: 'Bone', labelKey: 'icon_bone', iconName: 'Bone' },
  { value: 'Baby', labelKey: 'icon_baby', iconName: 'Baby' },
  { value: 'Eye', labelKey: 'icon_eye', iconName: 'Eye' },
  { value: 'Stethoscope', labelKey: 'icon_stethoscope', iconName: 'Stethoscope' },
  { value: 'Sparkles', labelKey: 'icon_sparkles', iconName: 'Sparkles' },
  { value: 'Syringe', labelKey: 'icon_syringe', iconName: 'Syringe' },
  { value: 'Glasses', labelKey: 'icon_glasses', iconName: 'Glasses' },
  { value: 'Shield', labelKey: 'icon_shield', iconName: 'Shield' }
];

export default function AdminSpecialties() {
  const { t } = useTranslation('admin');
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState(null);

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Activity');
  const [description, setDescription] = useState('');

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

  const filteredSpecialties = specialties.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingSpecialty(null);
    setName('');
    setIcon('Activity');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (spec) => {
    setEditingSpecialty(spec);
    setName(spec.name);
    setIcon(spec.icon || 'Activity');
    setDescription(spec.description || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (spec) => {
    if (!window.confirm(t('specialties.delete_confirm', { name: spec.name }))) return;
    try {
      await deleteSpecialty(spec.id);
      alert(t('specialties.delete_success'));
      loadSpecialties();
    } catch (err) {
      console.error(err);
      alert(t('specialties.delete_error'));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert(t('specialties.form_required'));
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
        alert(t('specialties.update_success'));
      } else {
        await createSpecialty(payload);
        alert(t('specialties.create_success'));
      }
      setIsModalOpen(false);
      loadSpecialties();
    } catch (err) {
      console.error(err);
      alert(t('specialties.save_error'));
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Icons.Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder={t('specialties.search_placeholder')}
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
          <span>{t('specialties.add_btn')}</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-[fadeIn_0.25s_ease-out]">
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">{t('specialties.loading')}</p>
          </div>
        ) : filteredSpecialties.length === 0 ? (
          <div className="p-16 text-center text-gray-400 font-bold text-sm">
            {t('specialties.empty')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-wider bg-gray-50/30">
                  <th className="py-4 px-6 w-16 text-center">{t('specialties.col_icon')}</th>
                  <th className="py-4 px-6">{t('specialties.col_name')}</th>
                  <th className="py-4 px-6">{t('specialties.col_desc')}</th>
                  <th className="py-4 px-6 text-right">{t('specialties.col_actions')}</th>
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
                        {spec.description || <span className="italic text-gray-300">{t('specialties.no_desc')}</span>}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(spec)}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/30 hover:border-indigo-100 transition-all cursor-pointer"
                        >
                          {t('specialties.edit_btn')}
                        </button>
                        <button
                          onClick={() => handleDelete(spec)}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg border border-red-100 text-red-500 bg-red-50 hover:bg-red-100 transition-all cursor-pointer"
                        >
                          {t('specialties.delete_btn')}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white rounded-3xl p-6 max-w-md w-full relative z-10 shadow-2xl border border-gray-100 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <Icons.Activity className="w-5 h-5 text-indigo-600" />
                <span>{editingSpecialty ? t('specialties.modal_edit_title') : t('specialties.modal_add_title')}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer">
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('specialties.form_name_label')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('specialties.form_name_placeholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('specialties.form_icon_label')}</label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-xs font-semibold cursor-pointer"
                >
                  {AVAILABLE_ICONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {t(`specialties.${opt.labelKey}`)} ({opt.value})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('specialties.form_desc_label')}</label>
                <textarea
                  rows="4"
                  placeholder={t('specialties.form_desc_placeholder')}
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
                  {t('specialties.cancel_btn')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all cursor-pointer"
                >
                  {editingSpecialty ? t('specialties.update_btn') : t('specialties.create_btn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
