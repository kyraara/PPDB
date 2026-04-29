import { useState, useEffect, useRef, useCallback } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, User, MapPin, Calendar } from 'lucide-react';

const agamaOptions = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'];

export default function DataSiswaForm() {
  const { pendaftaran, onSave, saving } = useOutletContext();
  const navigate = useNavigate();
  const autoSaveRef = useRef(null);

  const existing = pendaftaran?.data_siswa;
  const [form, setForm] = useState({
    nama_lengkap: existing?.nama_lengkap || '',
    nik: existing?.nik || '',
    nisn: existing?.nisn || '',
    tempat_lahir: existing?.tempat_lahir || '',
    tanggal_lahir: existing?.tanggal_lahir || '',
    jenis_kelamin: existing?.jenis_kelamin || '',
    agama: existing?.agama || 'Islam',
    alamat: existing?.alamat || '',
    asal_sekolah: existing?.asal_sekolah || '',
  });
  const [errors, setErrors] = useState({});

  const jenjang = pendaftaran?.jenjang;
  const showNISN = ['SMP', 'SMA'].includes(jenjang);
  const showAsalSekolah = ['SD', 'SMP', 'SMA'].includes(jenjang);

  // Auto-save every 30 seconds
  const doAutoSave = useCallback(() => {
    if (form.nama_lengkap) {
      onSave({ data_siswa: form });
    }
  }, [form, onSave]);

  useEffect(() => {
    autoSaveRef.current = setInterval(doAutoSave, 30000);
    return () => clearInterval(autoSaveRef.current);
  }, [doAutoSave]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const err = {};
    if (!form.nama_lengkap.trim()) err.nama_lengkap = 'Nama lengkap wajib diisi.';
    if (!form.tempat_lahir.trim()) err.tempat_lahir = 'Tempat lahir wajib diisi.';
    if (!form.tanggal_lahir) err.tanggal_lahir = 'Tanggal lahir wajib diisi.';
    if (!form.jenis_kelamin) err.jenis_kelamin = 'Jenis kelamin wajib dipilih.';
    if (!form.agama) err.agama = 'Agama wajib dipilih.';
    if (!form.alamat.trim()) err.alamat = 'Alamat wajib diisi.';
    if (form.nik && form.nik.length !== 16) err.nik = 'NIK harus 16 digit.';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;
    await onSave({ data_siswa: form });
    navigate('/formulir/data-ortu');
  };

  const inputStyle = (name) => ({
    width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-tertiary)', border: `1.5px solid ${errors[name] ? 'var(--status-ditolak)' : 'var(--glass-border)'}`,
    borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.92rem', outline: 'none', transition: 'border 0.3s',
  });

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card" style={{ padding: '2rem' }}>
      <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>
        <User size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--accent-primary)' }} />
        Data Calon Siswa
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>Lengkapi data pribadi calon peserta didik</p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {/* Nama */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Nama Lengkap *</label>
          <input name="nama_lengkap" value={form.nama_lengkap} onChange={handleChange} placeholder="Nama sesuai akta kelahiran" style={inputStyle('nama_lengkap')} />
          {errors.nama_lengkap && <span className="form-error">{errors.nama_lengkap}</span>}
        </div>

        {/* NIK + NISN */}
        <div style={{ display: 'grid', gridTemplateColumns: showNISN ? '1fr 1fr' : '1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>NIK</label>
            <input name="nik" value={form.nik} onChange={handleChange} placeholder="16 digit" maxLength={16} style={inputStyle('nik')} />
            {errors.nik && <span className="form-error">{errors.nik}</span>}
          </div>
          {showNISN && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>NISN</label>
              <input name="nisn" value={form.nisn} onChange={handleChange} placeholder="10 digit" maxLength={10} style={inputStyle('nisn')} />
            </div>
          )}
        </div>

        {/* Tempat + Tanggal Lahir */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              <MapPin size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.25rem' }} />Tempat Lahir *
            </label>
            <input name="tempat_lahir" value={form.tempat_lahir} onChange={handleChange} placeholder="Kota/kabupaten" style={inputStyle('tempat_lahir')} />
            {errors.tempat_lahir && <span className="form-error">{errors.tempat_lahir}</span>}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              <Calendar size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.25rem' }} />Tanggal Lahir *
            </label>
            <input type="date" name="tanggal_lahir" value={form.tanggal_lahir} onChange={handleChange} style={{ ...inputStyle('tanggal_lahir'), colorScheme: 'dark' }} />
            {errors.tanggal_lahir && <span className="form-error">{errors.tanggal_lahir}</span>}
          </div>
        </div>

        {/* Jenis Kelamin */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Jenis Kelamin *</label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[{ val: 'L', label: 'Laki-laki' }, { val: 'P', label: 'Perempuan' }].map(opt => (
              <label key={opt.val} style={{
                flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'center', fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.2s',
                background: form.jenis_kelamin === opt.val ? 'rgba(201,168,76,0.1)' : 'var(--bg-tertiary)',
                border: `1.5px solid ${form.jenis_kelamin === opt.val ? 'var(--accent-primary)' : errors.jenis_kelamin ? 'var(--status-ditolak)' : 'var(--glass-border)'}`,
                color: form.jenis_kelamin === opt.val ? 'var(--accent-primary)' : 'var(--text-secondary)',
              }}>
                <input type="radio" name="jenis_kelamin" value={opt.val} checked={form.jenis_kelamin === opt.val} onChange={handleChange} style={{ display: 'none' }} />
                {opt.label}
              </label>
            ))}
          </div>
          {errors.jenis_kelamin && <span className="form-error">{errors.jenis_kelamin}</span>}
        </div>

        {/* Agama */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Agama *</label>
          <select name="agama" value={form.agama} onChange={handleChange} style={{ ...inputStyle('agama'), appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%238A9AB5\' d=\'M6 8L1 3h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}>
            {agamaOptions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          {errors.agama && <span className="form-error">{errors.agama}</span>}
        </div>

        {/* Alamat */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Alamat Lengkap *</label>
          <textarea name="alamat" value={form.alamat} onChange={handleChange} rows={3} placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota" style={{ ...inputStyle('alamat'), resize: 'vertical' }} />
          {errors.alamat && <span className="form-error">{errors.alamat}</span>}
        </div>

        {/* Asal Sekolah */}
        {showAsalSekolah && (
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Asal Sekolah</label>
            <input name="asal_sekolah" value={form.asal_sekolah} onChange={handleChange} placeholder={jenjang === 'SD' ? 'Nama TK (opsional)' : `Nama ${jenjang === 'SMP' ? 'SD/MI' : 'SMP/MTs'} asal`} style={inputStyle('asal_sekolah')} />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
        <button onClick={handleNext} disabled={saving} className="btn btn-primary">
          {saving ? 'Menyimpan...' : 'Lanjut: Data Orang Tua'}
          <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}
