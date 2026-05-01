import { useState, useEffect, useRef, useCallback } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Users, Plus, Trash2 } from 'lucide-react';

const tipeOptions = [
  { val: 'AYAH', label: 'Ayah' },
  { val: 'IBU', label: 'Ibu' },
  { val: 'WALI', label: 'Wali' },
];

const penghasilanOptions = [
  'Kurang dari Rp 1.000.000',
  'Rp 1.000.000 - Rp 3.000.000',
  'Rp 3.000.000 - Rp 5.000.000',
  'Rp 5.000.000 - Rp 10.000.000',
  'Lebih dari Rp 10.000.000',
];

const emptyOrtu = { tipe: '', nama: '', nik: '', pekerjaan: '', no_hp: '', penghasilan: '' };

export default function DataOrtuForm() {
  const { pendaftaran, onSave, saving } = useOutletContext();
  const navigate = useNavigate();
  const autoSaveRef = useRef(null);

  const existing = pendaftaran?.data_ortu || [];
  const [entries, setEntries] = useState(
    existing.length > 0
      ? existing.map(o => ({ tipe: o.tipe, nama: o.nama, nik: o.nik || '', pekerjaan: o.pekerjaan || '', no_hp: o.no_hp, penghasilan: o.penghasilan || '' }))
      : [{ ...emptyOrtu, tipe: 'AYAH' }, { ...emptyOrtu, tipe: 'IBU' }]
  );
  const [activeTab, setActiveTab] = useState(0);
  const [errors, setErrors] = useState({});

  // Auto-save every 30s
  const doAutoSave = useCallback(() => {
    const valid = entries.filter(e => e.nama);
    if (valid.length > 0) onSave({ data_ortu: valid });
  }, [entries, onSave]);

  useEffect(() => {
    autoSaveRef.current = setInterval(doAutoSave, 30000);
    return () => clearInterval(autoSaveRef.current);
  }, [doAutoSave]);

  const handleChange = (idx, field, value) => {
    setEntries(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
    if (errors[`${idx}.${field}`]) {
      setErrors(prev => { const n = { ...prev }; delete n[`${idx}.${field}`]; return n; });
    }
  };

  const addEntry = () => {
    const usedTypes = entries.map(e => e.tipe);
    const available = tipeOptions.find(t => !usedTypes.includes(t.val));
    setEntries(prev => [...prev, { ...emptyOrtu, tipe: available?.val || 'WALI' }]);
    setActiveTab(entries.length);
  };

  const removeEntry = (idx) => {
    if (entries.length <= 1) return;
    setEntries(prev => prev.filter((_, i) => i !== idx));
    setActiveTab(Math.max(0, activeTab - 1));
  };

  const validate = () => {
    const err = {};
    entries.forEach((e, i) => {
      if (!e.tipe) err[`${i}.tipe`] = 'Pilih tipe orang tua.';
      if (!e.nama.trim()) err[`${i}.nama`] = 'Nama wajib diisi.';
      if (!e.no_hp.trim()) err[`${i}.no_hp`] = 'No HP wajib diisi.';
      if (e.nik && e.nik.length !== 16) err[`${i}.nik`] = 'NIK harus 16 digit.';
    });
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;
    await onSave({ data_ortu: entries });
    navigate('/formulir/dokumen');
  };

  const handleBack = () => navigate('/formulir/data-siswa');

  const getInputClass = (errKey) => `
    w-full px-4 py-3 bg-bg-tertiary dark:bg-dark-bg-tertiary border-[1.5px] rounded-md text-text-primary dark:text-dark-text-primary font-body text-[0.92rem] outline-none transition-colors
    ${errors[errKey] ? 'border-status-ditolak' : 'border-border-default dark:border-dark-border-default focus:border-accent dark:focus:border-dark-accent'}
  `;

  const current = entries[activeTab] || entries[0];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 md:p-8">
      <h3 className="text-[1.15rem] mb-1 flex items-center gap-2">
        <Users size={18} className="text-accent dark:text-dark-accent" />
        Data Orang Tua / Wali
      </h3>
      <p className="text-text-muted dark:text-dark-text-muted text-sm mb-6">Minimal 1 data orang tua wajib diisi</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {entries.map((e, i) => (
          <button key={i} onClick={() => setActiveTab(i)} 
            className={`px-4 py-2 rounded-full border cursor-pointer text-[0.82rem] font-semibold transition-all duration-200
              ${activeTab === i 
                ? 'bg-accent-bg dark:bg-dark-accent-bg text-accent dark:text-dark-accent border-accent-bg-strong dark:border-dark-accent-bg-strong' 
                : 'bg-bg-tertiary dark:bg-dark-bg-tertiary text-text-secondary dark:text-dark-text-secondary border-border-default dark:border-dark-border-default'}`}>
            {e.tipe || `Orang Tua ${i + 1}`}
          </button>
        ))}
        {entries.length < 3 && (
          <button onClick={addEntry} 
            className="px-3 py-2 rounded-full border border-dashed border-border-default dark:border-dark-border-default bg-transparent cursor-pointer text-text-muted dark:text-dark-text-muted text-[0.82rem] flex items-center gap-1 hover:border-text-muted transition-colors">
            <Plus size={14} /> Tambah
          </button>
        )}
      </div>

      {/* Form for active tab */}
      <div className="grid gap-4">
        {/* Tipe */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Status *</label>
          <div className="flex gap-2">
            {tipeOptions.map(opt => (
              <label key={opt.val} className={`
                flex-1 p-2.5 rounded-md cursor-pointer text-center text-[0.85rem] font-medium transition-colors border-[1.5px]
                ${current.tipe === opt.val 
                  ? 'bg-accent-bg dark:bg-dark-accent-bg border-accent dark:border-dark-accent text-accent dark:text-dark-accent' 
                  : 'bg-bg-tertiary dark:bg-dark-bg-tertiary border-border-default dark:border-dark-border-default text-text-secondary dark:text-dark-text-secondary hover:border-border-hover dark:hover:border-dark-border-hover'}
              `}>
                <input type="radio" checked={current.tipe === opt.val} onChange={() => handleChange(activeTab, 'tipe', opt.val)} className="hidden" />
                {opt.label}
              </label>
            ))}
          </div>
          {errors[`${activeTab}.tipe`] && <span className="form-error mt-1">{errors[`${activeTab}.tipe`]}</span>}
        </div>

        {/* Nama */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Nama Lengkap *</label>
          <input value={current.nama} onChange={(e) => handleChange(activeTab, 'nama', e.target.value)} placeholder="Nama lengkap orang tua" className={getInputClass(`${activeTab}.nama`)} />
          {errors[`${activeTab}.nama`] && <span className="form-error mt-1">{errors[`${activeTab}.nama`]}</span>}
        </div>

        {/* NIK + No HP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary">NIK</label>
            <input value={current.nik} onChange={(e) => handleChange(activeTab, 'nik', e.target.value)} placeholder="16 digit" maxLength={16} className={getInputClass(`${activeTab}.nik`)} />
            {errors[`${activeTab}.nik`] && <span className="form-error mt-1">{errors[`${activeTab}.nik`]}</span>}
          </div>
          <div>
            <label className="block mb-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary">No HP *</label>
            <input value={current.no_hp} onChange={(e) => handleChange(activeTab, 'no_hp', e.target.value)} placeholder="08xxxxxxxxxx" className={getInputClass(`${activeTab}.no_hp`)} />
            {errors[`${activeTab}.no_hp`] && <span className="form-error mt-1">{errors[`${activeTab}.no_hp`]}</span>}
          </div>
        </div>

        {/* Pekerjaan + Penghasilan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Pekerjaan</label>
            <input value={current.pekerjaan} onChange={(e) => handleChange(activeTab, 'pekerjaan', e.target.value)} placeholder="Contoh: Wiraswasta" className={getInputClass(`${activeTab}.pekerjaan`)} />
          </div>
          <div>
            <label className="block mb-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Penghasilan</label>
            <select value={current.penghasilan} onChange={(e) => handleChange(activeTab, 'penghasilan', e.target.value)} className={`${getInputClass(`${activeTab}.penghasilan`)} appearance-none bg-no-repeat bg-[position:right_1rem_center] bg-[url("data:image/svg+xml,%3Csvg_xmlns='http://www.w3.org/2000/svg'_width='12'_height='12'_viewBox='0_0_12_12'%3E%3Cpath_fill='%238A9AB5'_d='M6_8L1_3h10z'/%3E%3C/svg%3E")]`}>
              <option value="">Pilih</option>
              {penghasilanOptions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Remove button */}
        {entries.length > 1 && (
          <button onClick={() => removeEntry(activeTab)} className="flex items-center gap-1.5 px-3 py-2 bg-transparent border border-status-ditolak/30 rounded-sm text-status-ditolak cursor-pointer text-[0.8rem] w-fit mt-2 hover:bg-status-ditolak/5 transition-colors">
            <Trash2 size={14} /> Hapus {current.tipe || 'data ini'}
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button onClick={handleBack} className="btn btn-secondary flex items-center gap-2"><ArrowLeft size={18} /> Kembali</button>
        <button onClick={handleNext} disabled={saving} className={`btn btn-primary flex items-center gap-2 ${saving ? 'opacity-70 cursor-wait' : ''}`}>
          {saving ? 'Menyimpan...' : 'Lanjut: Upload Dokumen'} {!saving && <ArrowRight size={18} />}
        </button>
      </div>
    </motion.div>
  );
}
