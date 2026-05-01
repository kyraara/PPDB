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

  const getInputClass = (name) => `
    w-full px-4 py-3 bg-bg-tertiary dark:bg-dark-bg-tertiary border-[1.5px] rounded-md text-text-primary dark:text-dark-text-primary font-body text-[0.92rem] outline-none transition-colors
    ${errors[name] ? 'border-status-ditolak' : 'border-border-default dark:border-dark-border-default focus:border-accent dark:focus:border-dark-accent'}
  `;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 md:p-8">
      <h3 className="text-[1.15rem] mb-1 flex items-center gap-2">
        <User size={18} className="text-accent dark:text-dark-accent" />
        Data Calon Siswa
      </h3>
      <p className="text-text-muted dark:text-dark-text-muted text-sm mb-6">Lengkapi data pribadi calon peserta didik</p>

      <div className="grid gap-4">
        {/* Nama */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Nama Lengkap *</label>
          <input name="nama_lengkap" value={form.nama_lengkap} onChange={handleChange} placeholder="Nama sesuai akta kelahiran" className={getInputClass('nama_lengkap')} />
          {errors.nama_lengkap && <span className="form-error mt-1">{errors.nama_lengkap}</span>}
        </div>

        {/* NIK + NISN */}
        <div className={`grid grid-cols-1 ${showNISN ? 'md:grid-cols-2' : ''} gap-4`}>
          <div>
            <label className="block mb-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary">NIK</label>
            <input name="nik" value={form.nik} onChange={handleChange} placeholder="16 digit" maxLength={16} className={getInputClass('nik')} />
            {errors.nik && <span className="form-error mt-1">{errors.nik}</span>}
          </div>
          {showNISN && (
            <div>
              <label className="block mb-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary">NISN</label>
              <input name="nisn" value={form.nisn} onChange={handleChange} placeholder="10 digit" maxLength={10} className={getInputClass('nisn')} />
            </div>
          )}
        </div>

        {/* Tempat + Tanggal Lahir */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary flex items-center gap-1">
              <MapPin size={13} />Tempat Lahir *
            </label>
            <input name="tempat_lahir" value={form.tempat_lahir} onChange={handleChange} placeholder="Kota/kabupaten" className={getInputClass('tempat_lahir')} />
            {errors.tempat_lahir && <span className="form-error mt-1">{errors.tempat_lahir}</span>}
          </div>
          <div>
            <label className="block mb-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary flex items-center gap-1">
              <Calendar size={13} />Tanggal Lahir *
            </label>
            <input type="date" name="tanggal_lahir" value={form.tanggal_lahir} onChange={handleChange} className={`${getInputClass('tanggal_lahir')} [color-scheme:light] dark:[color-scheme:dark]`} />
            {errors.tanggal_lahir && <span className="form-error mt-1">{errors.tanggal_lahir}</span>}
          </div>
        </div>

        {/* Jenis Kelamin */}
        <div>
          <label className="block mb-2 text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Jenis Kelamin *</label>
          <div className="flex gap-3">
            {[{ val: 'L', label: 'Laki-laki' }, { val: 'P', label: 'Perempuan' }].map(opt => (
              <label key={opt.val} className={`
                flex-1 p-3 rounded-md cursor-pointer text-center text-[0.9rem] font-medium transition-colors border-[1.5px]
                ${form.jenis_kelamin === opt.val 
                  ? 'bg-accent-bg dark:bg-dark-accent-bg border-accent dark:border-dark-accent text-accent dark:text-dark-accent' 
                  : `bg-bg-tertiary dark:bg-dark-bg-tertiary text-text-secondary dark:text-dark-text-secondary hover:border-border-hover dark:hover:border-dark-border-hover ${errors.jenis_kelamin ? 'border-status-ditolak' : 'border-border-default dark:border-dark-border-default'}`
                }
              `}>
                <input type="radio" name="jenis_kelamin" value={opt.val} checked={form.jenis_kelamin === opt.val} onChange={handleChange} className="hidden" />
                {opt.label}
              </label>
            ))}
          </div>
          {errors.jenis_kelamin && <span className="form-error mt-1">{errors.jenis_kelamin}</span>}
        </div>

        {/* Agama */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Agama *</label>
          <select name="agama" value={form.agama} onChange={handleChange} className={`${getInputClass('agama')} appearance-none bg-no-repeat bg-[position:right_1rem_center] bg-[url("data:image/svg+xml,%3Csvg_xmlns='http://www.w3.org/2000/svg'_width='12'_height='12'_viewBox='0_0_12_12'%3E%3Cpath_fill='%238A9AB5'_d='M6_8L1_3h10z'/%3E%3C/svg%3E")]`}>
            {agamaOptions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          {errors.agama && <span className="form-error mt-1">{errors.agama}</span>}
        </div>

        {/* Alamat */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Alamat Lengkap *</label>
          <textarea name="alamat" value={form.alamat} onChange={handleChange} rows={3} placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota" className={`${getInputClass('alamat')} resize-y`} />
          {errors.alamat && <span className="form-error mt-1">{errors.alamat}</span>}
        </div>

        {/* Asal Sekolah */}
        {showAsalSekolah && (
          <div>
            <label className="block mb-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Asal Sekolah</label>
            <input name="asal_sekolah" value={form.asal_sekolah} onChange={handleChange} placeholder={jenjang === 'SD' ? 'Nama TK (opsional)' : `Nama ${jenjang === 'SMP' ? 'SD/MI' : 'SMP/MTs'} asal`} className={getInputClass('asal_sekolah')} />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-end mt-8">
        <button onClick={handleNext} disabled={saving} className={`btn btn-primary flex items-center gap-2 ${saving ? 'opacity-70 cursor-wait' : ''}`}>
          {saving ? 'Menyimpan...' : 'Lanjut: Data Orang Tua'}
          {!saving && <ArrowRight size={18} />}
        </button>
      </div>
    </motion.div>
  );
}
