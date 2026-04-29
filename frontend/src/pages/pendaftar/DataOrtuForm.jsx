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

  const inputStyle = (errKey) => ({
    width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-tertiary)',
    border: `1.5px solid ${errors[errKey] ? 'var(--status-ditolak)' : 'var(--glass-border)'}`,
    borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.92rem', outline: 'none', transition: 'border 0.3s',
  });

  const current = entries[activeTab] || entries[0];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card" style={{ padding: '2rem' }}>
      <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>
        <Users size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--accent-primary)' }} />
        Data Orang Tua / Wali
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>Minimal 1 data orang tua wajib diisi</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {entries.map((e, i) => (
          <button key={i} onClick={() => setActiveTab(i)} style={{
            padding: '0.5rem 1rem', borderRadius: '50px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, fontFamily: 'var(--font-body)', transition: 'all 0.2s',
            background: activeTab === i ? 'rgba(201,168,76,0.15)' : 'var(--bg-tertiary)',
            color: activeTab === i ? 'var(--accent-primary)' : 'var(--text-secondary)',
            border: activeTab === i ? '1px solid rgba(201,168,76,0.3)' : '1px solid var(--glass-border)',
          }}>
            {e.tipe || `Orang Tua ${i + 1}`}
          </button>
        ))}
        {entries.length < 3 && (
          <button onClick={addEntry} style={{
            padding: '0.5rem 0.75rem', borderRadius: '50px', border: '1px dashed var(--glass-border)', background: 'transparent',
            cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.25rem',
          }}>
            <Plus size={14} /> Tambah
          </button>
        )}
      </div>

      {/* Form for active tab */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {/* Tipe */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Status *</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {tipeOptions.map(opt => (
              <label key={opt.val} style={{
                flex: 1, padding: '0.6rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'center', fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s',
                background: current.tipe === opt.val ? 'rgba(201,168,76,0.1)' : 'var(--bg-tertiary)',
                border: `1.5px solid ${current.tipe === opt.val ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                color: current.tipe === opt.val ? 'var(--accent-primary)' : 'var(--text-secondary)',
              }}>
                <input type="radio" checked={current.tipe === opt.val} onChange={() => handleChange(activeTab, 'tipe', opt.val)} style={{ display: 'none' }} />
                {opt.label}
              </label>
            ))}
          </div>
          {errors[`${activeTab}.tipe`] && <span className="form-error">{errors[`${activeTab}.tipe`]}</span>}
        </div>

        {/* Nama */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Nama Lengkap *</label>
          <input value={current.nama} onChange={(e) => handleChange(activeTab, 'nama', e.target.value)} placeholder="Nama lengkap orang tua" style={inputStyle(`${activeTab}.nama`)} />
          {errors[`${activeTab}.nama`] && <span className="form-error">{errors[`${activeTab}.nama`]}</span>}
        </div>

        {/* NIK + No HP */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>NIK</label>
            <input value={current.nik} onChange={(e) => handleChange(activeTab, 'nik', e.target.value)} placeholder="16 digit" maxLength={16} style={inputStyle(`${activeTab}.nik`)} />
            {errors[`${activeTab}.nik`] && <span className="form-error">{errors[`${activeTab}.nik`]}</span>}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>No HP *</label>
            <input value={current.no_hp} onChange={(e) => handleChange(activeTab, 'no_hp', e.target.value)} placeholder="08xxxxxxxxxx" style={inputStyle(`${activeTab}.no_hp`)} />
            {errors[`${activeTab}.no_hp`] && <span className="form-error">{errors[`${activeTab}.no_hp`]}</span>}
          </div>
        </div>

        {/* Pekerjaan + Penghasilan */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Pekerjaan</label>
            <input value={current.pekerjaan} onChange={(e) => handleChange(activeTab, 'pekerjaan', e.target.value)} placeholder="Contoh: Wiraswasta" style={inputStyle(`${activeTab}.pekerjaan`)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Penghasilan</label>
            <select value={current.penghasilan} onChange={(e) => handleChange(activeTab, 'penghasilan', e.target.value)} style={{ ...inputStyle(`${activeTab}.penghasilan`), appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%238A9AB5\' d=\'M6 8L1 3h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}>
              <option value="">Pilih</option>
              {penghasilanOptions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Remove button */}
        {entries.length > 1 && (
          <button onClick={() => removeEntry(activeTab)} style={{
            display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.75rem', background: 'transparent',
            border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', color: '#EF4444', cursor: 'pointer',
            fontSize: '0.8rem', width: 'fit-content',
          }}>
            <Trash2 size={14} /> Hapus {current.tipe || 'data ini'}
          </button>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <button onClick={handleBack} className="btn btn-secondary"><ArrowLeft size={18} /> Kembali</button>
        <button onClick={handleNext} disabled={saving} className="btn btn-primary">
          {saving ? 'Menyimpan...' : 'Lanjut: Upload Dokumen'} <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}
