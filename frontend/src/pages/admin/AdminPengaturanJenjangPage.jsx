import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, Image as ImageIcon, Trash2, Plus, RotateCcw, CreditCard, Target, BookOpen, Trophy } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const STORAGE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

/* ─── TagInput — for kegiatan & fasilitas ─── */
function TagInput({ value = [], onChange, placeholder }) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = input.trim();
      if (tag && !value.includes(tag)) {
        onChange([...value, tag]);
        setInput('');
      }
    }
  };

  const removeTag = (tag) => onChange(value.filter(t => t !== tag));

  return (
    <div className="p-2 rounded-lg flex flex-wrap gap-1.5 min-h-[48px]
                    bg-bg-tertiary dark:bg-dark-bg-tertiary
                    border border-border-default dark:border-dark-border-default
                    focus-within:border-accent dark:focus-within:border-dark-accent
                    transition-colors duration-200">
      {value.map(tag => (
        <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.82rem] font-semibold
                                   bg-accent-bg dark:bg-dark-accent-bg
                                   border border-border-default dark:border-dark-border-default
                                   text-accent dark:text-dark-accent">
          {tag}
          <button onClick={() => removeTag(tag)} type="button"
            className="bg-transparent border-none cursor-pointer text-accent dark:text-dark-accent text-[0.9rem] leading-none p-0
                       hover:text-status-ditolak transition-colors duration-200">
            ×
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : 'Tambah lagi...'}
        className="border-none bg-transparent outline-none text-[0.88rem] min-w-[120px] flex-1
                   text-text-primary dark:text-dark-text-primary
                   placeholder:text-text-muted dark:placeholder:text-dark-text-muted"
      />
    </div>
  );
}

/* ─── DynamicList — for misi, tujuan & prestasi ─── */
function DynamicList({ value = [], onChange, placeholder, addLabel = 'Tambah' }) {
  const add = () => onChange([...value, '']);
  const update = (i, v) => onChange(value.map((item, idx) => idx === i ? v : item));
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-2.5">
      {value.map((item, i) => (
        <div key={i} className="flex gap-2 items-center group">
          <span className="text-[0.75rem] font-bold text-text-muted dark:text-dark-text-muted w-5 shrink-0 text-center">{i + 1}</span>
          <input
            value={item}
            onChange={e => update(i, e.target.value)}
            placeholder={placeholder}
            className="form-input flex-1"
          />
          <button onClick={() => remove(i)} type="button"
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 cursor-pointer
                       bg-status-ditolak/10 border border-status-ditolak/20 text-status-ditolak
                       hover:bg-status-ditolak/20 transition-colors duration-200
                       opacity-0 group-hover:opacity-100">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button onClick={add} type="button"
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer
                   bg-accent-bg dark:bg-dark-accent-bg
                   border border-dashed border-accent/40 dark:border-dark-accent/40
                   text-accent dark:text-dark-accent
                   hover:bg-accent-bg-strong dark:hover:bg-dark-accent-bg-strong
                   hover:border-accent dark:hover:border-dark-accent
                   transition-all duration-200">
        <Plus size={15} /> {addLabel}
      </button>
    </div>
  );
}

/* ─── ObjectList — for kegiatan & fasilitas ─── */
function ObjectList({ value = [], onChange, title, type = 'kegiatan' }) {
  const add = () => {
    const newItem = { id: Date.now().toString(), nama: '', deskripsi: '', foto_url: '' };
    if (type === 'kegiatan') newItem.kategori = 'Pilihan';
    onChange([...value, newItem]);
  };
  const update = (i, field, v) => {
    onChange(value.map((item, idx) => idx === i ? { ...item, [field]: v } : item));
  };
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));

  const handleUpload = async (i, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    const loadId = toast.loading('Mengunggah gambar...');
    try {
      const res = await api.post('/admin/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        toast.success('Gambar berhasil diunggah', { id: loadId });
        update(i, 'foto_url', res.data.url);
      }
    } catch (error) {
      toast.error('Gagal mengunggah gambar', { id: loadId });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {value.map((item, i) => (
        <div key={i} className="p-5 rounded-xl border border-border-default dark:border-dark-border-default
                                bg-surface-card dark:bg-dark-surface-card relative
                                hover:border-border-strong dark:hover:border-dark-border-strong
                                transition-colors duration-200 group/card">
          {/* Header: number + delete */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-wider
                             text-text-muted dark:text-dark-text-muted">
              <span className="w-6 h-6 rounded-full bg-accent-bg dark:bg-dark-accent-bg
                               flex items-center justify-center text-accent dark:text-dark-accent text-[0.7rem]">
                {i + 1}
              </span>
              {title} #{i + 1}
            </span>
            <button onClick={() => remove(i)} type="button"
              className="p-1.5 rounded-lg text-status-ditolak cursor-pointer border-none bg-transparent
                         hover:bg-status-ditolak/10 transition-colors duration-200
                         opacity-0 group-hover/card:opacity-100">
              <Trash2 size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-group">
              <label className="form-label">Nama</label>
              <input value={item.nama || ''} onChange={e => update(i, 'nama', e.target.value)} className="form-input" placeholder={`Nama ${title}`} />
            </div>
            {type === 'kegiatan' && (
              <div className="form-group">
                <label className="form-label">Kategori</label>
                <select value={item.kategori || 'Pilihan'} onChange={e => update(i, 'kategori', e.target.value)} className="form-input">
                  <option value="Wajib">Wajib</option>
                  <option value="Unggulan">Unggulan</option>
                  <option value="Pilihan">Pilihan</option>
                </select>
              </div>
            )}
          </div>

          <div className="form-group mb-4">
            <label className="form-label">Deskripsi</label>
            <textarea value={item.deskripsi || ''} onChange={e => update(i, 'deskripsi', e.target.value)} className="form-input min-h-[60px]" placeholder="Deskripsi singkat..." />
          </div>

          <div>
            <label className="form-label mb-2">Foto / Gambar</label>
            <div className="flex items-center gap-3">
              {item.foto_url && (
                <img src={`${STORAGE_URL}/storage/${item.foto_url}`} alt="Preview"
                  className="w-14 h-14 rounded-lg object-cover border border-border-default dark:border-dark-border-default shadow-sm" />
              )}
              <label className="btn btn-secondary btn-sm cursor-pointer">
                <Upload size={14} /> {item.foto_url ? 'Ganti Foto' : 'Upload Foto'}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(i, e)} />
              </label>
              {item.foto_url && (
                <button type="button" onClick={() => update(i, 'foto_url', '')}
                  className="text-xs text-status-ditolak font-semibold cursor-pointer border-none bg-transparent
                             hover:underline">Hapus Foto</button>
              )}
            </div>
          </div>
        </div>
      ))}
      <button onClick={add} type="button"
        className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-[0.85rem] font-semibold cursor-pointer
                   bg-accent-bg dark:bg-dark-accent-bg border border-dashed border-accent/40 dark:border-dark-accent/40
                   text-accent dark:text-dark-accent
                   hover:bg-accent-bg-strong dark:hover:bg-dark-accent-bg-strong
                   hover:border-accent dark:hover:border-dark-accent
                   transition-all duration-200">
        <Plus size={15} /> Tambah {title}
      </button>
    </div>
  );
}

/* ─── Section wrapper ─── */
function FormSection({ icon: Icon, title, description, children }) {
  return (
    <div className="p-6 rounded-xl mb-5
                    bg-surface-card dark:bg-dark-surface-card
                    border border-border-default dark:border-dark-border-default">
      <div className="flex items-start gap-3 mb-5 pb-4
                      border-b border-border-subtle dark:border-dark-border-subtle">
        {Icon && (
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0
                          bg-accent-bg dark:bg-dark-accent-bg">
            <Icon size={18} className="text-accent dark:text-dark-accent" />
          </div>
        )}
        <div>
          <h3 className="text-[0.95rem] font-bold text-text-primary dark:text-dark-text-primary">
            {title}
          </h3>
          {description && (
            <p className="text-[0.8rem] text-text-muted dark:text-dark-text-muted mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

/* ─── Main Page ─── */
export default function AdminPengaturanJenjangPage() {
  const [jenjangData, setJenjangData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/admin/pengaturan-jenjang');
      if (res.data.success) {
        // Normalisasi data: jika kegiatan/fasilitas masih berupa array of string, ubah ke array of object
        const normalizedData = res.data.data.map(jenjang => {
          let kegiatan = jenjang.kegiatan || [];
          if (kegiatan.length > 0 && typeof kegiatan[0] === 'string') {
            kegiatan = kegiatan.map((k, i) => ({ id: i.toString(), nama: k, deskripsi: '', foto_url: '', kategori: 'Pilihan' }));
          }
          let fasilitas = jenjang.fasilitas || [];
          if (fasilitas.length > 0 && typeof fasilitas[0] === 'string') {
            fasilitas = fasilitas.map((f, i) => ({ id: i.toString(), nama: f, deskripsi: '', foto_url: '' }));
          }
          return { ...jenjang, kegiatan, fasilitas };
        });

        setJenjangData(normalizedData);
        setOriginalData(JSON.parse(JSON.stringify(normalizedData)));
        if (!activeTab && normalizedData.length > 0) {
          setActiveTab(normalizedData[0].kode);
        }
      }
    } catch (error) {
      toast.error('Gagal mengambil data pengaturan jenjang');
    } finally {
      setLoading(false);
    }
  };

  const activeItem = jenjangData.find(j => j.kode === activeTab);

  const handleChange = (field, value) => {
    setJenjangData(prev => prev.map(item =>
      item.kode === activeTab ? { ...item, [field]: value } : item
    ));
  };

  const handleReset = () => {
    const orig = originalData.find(j => j.kode === activeTab);
    if (orig) {
      setJenjangData(prev => prev.map(item =>
        item.kode === activeTab ? JSON.parse(JSON.stringify(orig)) : item
      ));
      toast.success('Form dikembalikan ke data semula');
    }
  };

  const handleSave = async () => {
    if (!activeItem) return;
    setSaving(true);
    try {
      const payload = {
        nama: activeItem.nama,
        nama_lengkap: activeItem.nama_lengkap || '',
        deskripsi: activeItem.deskripsi || '',
        highlight: activeItem.highlight || '',
        visi: activeItem.visi || '',
        misi: activeItem.misi || [],
        tujuan: activeItem.tujuan || [],
        kegiatan: activeItem.kegiatan || [],
        fasilitas: activeItem.fasilitas || [],
        prestasi: activeItem.prestasi || [],
        biaya_pendaftaran: activeItem.biaya_pendaftaran || null,
        keterangan_biaya: activeItem.keterangan_biaya || '',
        aktif: activeItem.aktif ?? true,
        urutan: activeItem.urutan || 0,
      };
      const res = await api.put(`/admin/pengaturan-jenjang/${activeTab}`, payload);
      if (res.data.success) {
        toast.success(`Perubahan Jenjang ${activeTab} berhasil disimpan!`);
        // Update original data snapshot
        setOriginalData(prev => prev.map(item =>
          item.kode === activeTab ? JSON.parse(JSON.stringify(activeItem)) : item
        ));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `Gagal menyimpan pengaturan ${activeTab}`);
    } finally {
      setSaving(false);
    }
  };

  const handleUploadLogo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran logo maksimal 2MB');
      return;
    }

    const formData = new FormData();
    formData.append('logo', file);

    const loadId = toast.loading('Mengunggah logo...');
    try {
      const res = await api.post(`/admin/pengaturan-jenjang/${activeTab}/logo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        toast.success('Logo berhasil diperbarui', { id: loadId });
        fetchData();
      }
    } catch (error) {
      toast.error('Gagal mengunggah logo', { id: loadId });
    }
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteLogo = async () => {
    const loadId = toast.loading('Menghapus logo...');
    try {
      const res = await api.delete(`/admin/pengaturan-jenjang/${activeTab}/logo`);
      if (res.data.success) {
        toast.success('Logo berhasil dihapus', { id: loadId });
        fetchData();
      }
    } catch (error) {
      toast.error('Gagal menghapus logo', { id: loadId });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><div className="loading-spinner w-8 h-8" /></div>;
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-[1.75rem] font-heading font-bold mb-1 text-text-primary dark:text-dark-text-primary">
          Pengaturan <span className="text-accent dark:text-dark-accent">Jenjang</span>
        </h1>
        <p className="text-[0.9rem] text-text-secondary dark:text-dark-text-secondary">
          Atur profil lengkap untuk setiap jenjang pendidikan. Data ini ditampilkan di halaman publik.
        </p>
      </motion.div>

      {/* ── Tab Navigation ── */}
      <div className="flex gap-1 mb-6 p-1.5 rounded-xl
                      bg-bg-secondary dark:bg-dark-bg-secondary
                      border border-border-default dark:border-dark-border-default">
        {jenjangData.map(j => (
          <button key={j.kode} onClick={() => setActiveTab(j.kode)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold cursor-pointer transition-all duration-200 border-none
              ${activeTab === j.kode
                ? 'bg-accent dark:bg-dark-accent text-white shadow-md'
                : 'bg-transparent text-text-secondary dark:text-dark-text-secondary hover:bg-bg-tertiary dark:hover:bg-dark-bg-tertiary'
              }`}>
            {j.kode.toUpperCase()}
            {!j.aktif && <span className="ml-1.5 text-[0.65rem] font-medium opacity-50">(nonaktif)</span>}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      {activeItem && (
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}>

          {/* Identitas Jenjang */}
          <FormSection icon={ImageIcon} title="Identitas Jenjang" description="Nama, logo, dan informasi dasar jenjang">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden shrink-0
                              bg-bg-tertiary dark:bg-dark-bg-tertiary
                              border border-border-default dark:border-dark-border-default">
                {activeItem.logo_path ? (
                  <img src={`${STORAGE_URL}/storage/${activeItem.logo_path}`}
                    alt={`Logo ${activeItem.kode}`} className="w-full h-full object-contain p-1" />
                ) : (
                  <ImageIcon size={28} className="text-text-muted dark:text-dark-text-muted" />
                )}
              </div>
              <div className="flex gap-2">
                <label className="btn btn-secondary btn-sm cursor-pointer">
                  <Upload size={14} /> Ganti Logo
                  <input ref={fileInputRef} type="file" className="hidden" accept="image/*"
                    onChange={handleUploadLogo} />
                </label>
                {activeItem.logo_path && (
                  <button onClick={handleDeleteLogo} type="button"
                    className="btn btn-sm bg-transparent border border-status-ditolak text-status-ditolak cursor-pointer
                               hover:bg-status-ditolak/10 transition-colors duration-200">
                    <Trash2 size={14} /> Hapus
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Nama Jenjang</label>
                <input type="text" className="form-input" value={activeItem.nama}
                  onChange={e => handleChange('nama', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Nama Lengkap</label>
                <input type="text" className="form-input" value={activeItem.nama_lengkap || ''}
                  onChange={e => handleChange('nama_lengkap', e.target.value)}
                  placeholder="Contoh: SDIT Al Istiqomah" />
              </div>
              <div className="form-group">
                <label className="form-label">Highlight (Teks Badge)</label>
                <input type="text" className="form-input" value={activeItem.highlight || ''}
                  onChange={e => handleChange('highlight', e.target.value)}
                  placeholder="Contoh: Seleksi Berkas" />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <label className="form-label mb-0">Status Aktif</label>
                <button type="button" onClick={() => handleChange('aktif', !activeItem.aktif)}
                  className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors duration-200 border-none
                    ${activeItem.aktif ? 'bg-accent dark:bg-dark-accent' : 'bg-border-default dark:bg-dark-border-default'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200
                    ${activeItem.aktif ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                </button>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                  ${activeItem.aktif
                    ? 'bg-status-diterima/15 text-status-diterima'
                    : 'bg-status-ditolak/15 text-status-ditolak'}`}>
                  {activeItem.aktif ? 'Aktif' : 'Non-aktif'}
                </span>
              </div>
            </div>

            <div className="form-group mt-4">
              <label className="form-label">Deskripsi Singkat</label>
              <textarea className="form-input min-h-[100px]" value={activeItem.deskripsi || ''}
                onChange={e => handleChange('deskripsi', e.target.value)}
                placeholder="Deskripsi akan muncul di halaman depan dan profil jenjang" />
            </div>
          </FormSection>

          {/* Visi, Misi & Tujuan */}
          <FormSection icon={Target} title="Visi, Misi & Tujuan" description="Landasan pendidikan yang ditampilkan di halaman profil">
            <div className="form-group mb-5">
              <label className="form-label">Visi</label>
              <textarea className="form-input min-h-[80px]" value={activeItem.visi || ''}
                onChange={e => handleChange('visi', e.target.value)}
                placeholder="Visi jenjang pendidikan ini" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label mb-2">Misi</label>
                <DynamicList
                  value={activeItem.misi || []}
                  onChange={v => handleChange('misi', v)}
                  placeholder="Masukkan poin misi"
                  addLabel="Tambah Misi"
                />
              </div>
              <div>
                <label className="form-label mb-2">Tujuan</label>
                <DynamicList
                  value={activeItem.tujuan || []}
                  onChange={v => handleChange('tujuan', v)}
                  placeholder="Masukkan poin tujuan"
                  addLabel="Tambah Tujuan"
                />
              </div>
            </div>
          </FormSection>

          {/* Kegiatan & Ekskul */}
          <FormSection icon={BookOpen} title="Kegiatan & Ekstrakurikuler" description="Program dan kegiatan siswa beserta foto">
            <ObjectList
              value={activeItem.kegiatan || []}
              onChange={v => handleChange('kegiatan', v)}
              title="Kegiatan"
              type="kegiatan"
            />
          </FormSection>

          {/* Fasilitas */}
          <FormSection icon={ImageIcon} title="Fasilitas" description="Sarana dan prasarana sekolah">
            <ObjectList
              value={activeItem.fasilitas || []}
              onChange={v => handleChange('fasilitas', v)}
              title="Fasilitas"
              type="fasilitas"
            />
          </FormSection>

          {/* Prestasi */}
          <FormSection icon={Trophy} title="Prestasi & Pencapaian" description="Capaian siswa di berbagai kompetisi">
            <DynamicList
              value={activeItem.prestasi || []}
              onChange={v => handleChange('prestasi', v)}
              placeholder="Contoh: Juara 1 Olimpiade Sains Kota 2024"
              addLabel="Tambah Prestasi"
            />
          </FormSection>

          {/* Biaya Pendaftaran */}
          <FormSection icon={CreditCard} title="Biaya Pendaftaran" description="Nominal dan keterangan biaya pendaftaran">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Biaya (Rp)</label>
                <input type="number" className="form-input" min="0"
                  value={activeItem.biaya_pendaftaran || ''}
                  onChange={e => handleChange('biaya_pendaftaran', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="Contoh: 450000" />
              </div>
              <div className="form-group">
                <label className="form-label">Keterangan Biaya</label>
                <input type="text" className="form-input"
                  value={activeItem.keterangan_biaya || ''}
                  onChange={e => handleChange('keterangan_biaya', e.target.value)}
                  placeholder="Contoh: Dibayarkan setelah dinyatakan diterima" />
              </div>
            </div>
          </FormSection>

          {/* ── Sticky Save Button ── */}
          <div className="sticky bottom-0 z-10 -mx-6 px-6 py-4 flex justify-end gap-3
                          bg-bg-primary/95 dark:bg-dark-bg-primary/95 backdrop-blur-sm
                          border-t border-border-default dark:border-dark-border-default">
            <button onClick={handleReset} type="button"
              className="btn btn-secondary gap-2">
              <RotateCcw size={16} /> Reset ke Semula
            </button>
            <button onClick={handleSave} disabled={saving} type="button"
              className="btn btn-primary gap-2">
              {saving ? <div className="loading-spinner w-4 h-4" /> : <Save size={18} />}
              Simpan Perubahan {activeTab.toUpperCase()}
            </button>
          </div>

        </motion.div>
      )}
    </div>
  );
}
