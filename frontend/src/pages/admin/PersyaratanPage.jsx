import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Plus, Edit2, Trash2, X, Loader2, AlertCircle,
  CheckCircle2, ToggleLeft, ToggleRight
} from 'lucide-react';
import api from '../../services/api';
import { Skeleton } from '../../components/SkeletonLoader';

const jenjangColors = { TK: 'var(--color-accent)', SD: '#2D8A6B', SMP: '#1A6B5A', SMA: '#E0C76A' };

const emptyForm = {
  jenjang: 'TK', kode: '', nama: '', keterangan: '', wajib: true,
  format_diterima: 'pdf,jpg,jpeg,png', maks_ukuran_mb: 2, urutan: 0,
};

export default function PersyaratanPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterJenjang, setFilterJenjang] = useState('semua');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchData = () => {
    setLoading(true);
    api.get('/admin/persyaratan-dokumen', { params: { jenjang: filterJenjang } })
      .then(res => setData(res.data.data))
      .catch(() => setError('Gagal memuat data.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [filterJenjang]);

  const openCreate = () => { setEditId(null); setForm(emptyForm); setError(''); setShowModal(true); };
  const openEdit = (p) => {
    setEditId(p.id);
    setForm({
      jenjang: p.jenjang, kode: p.kode, nama: p.nama, keterangan: p.keterangan || '',
      wajib: p.wajib, format_diterima: p.format_diterima || 'pdf,jpg,jpeg,png',
      maks_ukuran_mb: p.maks_ukuran_mb || 2, urutan: p.urutan || 0,
    });
    setError(''); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      if (editId) {
        await api.put(`/admin/persyaratan-dokumen/${editId}`, form);
        setSuccess('Persyaratan berhasil diperbarui.');
      } else {
        await api.post('/admin/persyaratan-dokumen', form);
        setSuccess('Persyaratan berhasil ditambahkan.');
      }
      setShowModal(false); fetchData();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) { setError(err.response?.data?.message || 'Gagal menyimpan.'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/persyaratan-dokumen/${id}`);
      setSuccess('Persyaratan berhasil dihapus.');
      setDeleteConfirm(null); fetchData();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) { setError(err.response?.data?.message || 'Gagal menghapus.'); setDeleteConfirm(null); }
  };

  const inputClassName = "px-4 py-2.5 bg-bg-tertiary dark:bg-dark-bg-tertiary border-[1.5px] border-border-default dark:border-dark-border-default rounded-md text-text-primary dark:text-dark-text-primary font-body text-[0.88rem] outline-none w-full transition-colors focus:border-accent dark:focus:border-dark-accent";

  // Group by jenjang for display
  const grouped = {};
  data.forEach(p => {
    if (!grouped[p.jenjang]) grouped[p.jenjang] = [];
    grouped[p.jenjang].push(p);
  });

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl flex items-center gap-2">
          <FileText size={24} className="text-accent dark:text-dark-accent" /> Persyaratan Dokumen
        </h1>
        <button onClick={openCreate} className="btn btn-primary btn-sm flex items-center gap-2">
          <Plus size={16} /> Tambah
        </button>
      </motion.div>

      {success && <div className="p-3 rounded-md mb-4 text-[0.85rem] flex items-center gap-1.5 text-status-diterima border border-status-diterima/25 bg-status-diterima/10"><CheckCircle2 size={14} />{success}</div>}
      {error && !showModal && <div className="p-3 rounded-md mb-4 text-[0.85rem] flex items-center gap-1.5 text-status-ditolak border border-status-ditolak/25 bg-status-ditolak/10"><AlertCircle size={14} />{error}</div>}

      {/* Filter */}
      <div className="glass-card-static px-5 py-3.5 mb-5 flex items-center gap-3 flex-wrap">
        <span className="text-[0.82rem] text-text-muted dark:text-dark-text-muted">Filter:</span>
        {['semua', 'TK', 'SD', 'SMP', 'SMA'].map(j => (
          <button key={j} onClick={() => setFilterJenjang(j)}
            className={`px-3 py-1.5 rounded-full border-[1.5px] cursor-pointer text-[0.78rem] transition-all duration-200
              ${filterJenjang === j 
                ? 'border-accent dark:border-dark-accent bg-accent-bg dark:bg-dark-accent-bg text-accent dark:text-dark-accent font-semibold' 
                : 'border-border-default dark:border-dark-border-default bg-transparent text-text-secondary dark:text-dark-text-secondary font-normal hover:bg-bg-tertiary dark:hover:bg-dark-bg-tertiary'}`}>
            {j === 'semua' ? 'Semua' : j}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {[1,2,3].map(i => <Skeleton key={i} width="100%" height="3rem" />)}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="glass-card-static text-center py-12 px-8">
          <FileText size={48} className="text-text-muted dark:text-dark-text-muted opacity-50 mx-auto mb-4" />
          <h4 className="text-base">Belum ada persyaratan dokumen</h4>
        </div>
      ) : (
        Object.entries(grouped).map(([jenjang, items]) => (
          <motion.div key={jenjang} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static mb-5 overflow-hidden">
            <div className="px-5 py-4 border-b border-border-default dark:border-dark-border-default flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: jenjangColors[jenjang] }} />
              <span className="font-bold text-[0.95rem]">Jenjang {jenjang}</span>
              <span className="text-[0.72rem] text-text-muted dark:text-dark-text-muted ml-auto">{items.length} dokumen</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[0.85rem]">
                <thead>
                  <tr className="border-b border-border-default dark:border-dark-border-default">
                    {['#', 'Kode', 'Nama', 'Format', 'Maks', 'Wajib', 'Aksi'].map(h => (
                      <th key={h} className="text-left px-3 py-2.5 text-[0.72rem] text-text-muted dark:text-dark-text-muted font-semibold uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map(p => (
                    <tr key={p.id} className="border-b border-border-default dark:border-dark-border-default">
                      <td className="px-3 py-2.5 text-text-muted dark:text-dark-text-muted text-[0.78rem]">{p.urutan}</td>
                      <td className="px-3 py-2.5 font-mono text-[0.78rem] text-accent dark:text-dark-accent">{p.kode}</td>
                      <td className="px-3 py-2.5 font-medium">
                        {p.nama}
                        {p.keterangan && <div className="text-[0.72rem] text-text-muted dark:text-dark-text-muted mt-0.5">{p.keterangan}</div>}
                      </td>
                      <td className="px-3 py-2.5 text-[0.78rem] text-text-secondary dark:text-dark-text-secondary">{p.format_diterima}</td>
                      <td className="px-3 py-2.5 text-[0.78rem] text-text-secondary dark:text-dark-text-secondary">{p.maks_ukuran_mb} MB</td>
                      <td className="px-3 py-2.5">
                        {p.wajib ? (
                          <span className="text-status-ditolak text-[0.72rem] font-semibold">WAJIB</span>
                        ) : (
                          <span className="text-text-muted dark:text-dark-text-muted text-[0.72rem]">Opsional</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-1.5">
                          <button onClick={() => openEdit(p)} className="p-1.5 rounded-sm border border-border-default dark:border-dark-border-default bg-transparent text-accent dark:text-dark-accent cursor-pointer hover:bg-accent-bg dark:hover:bg-dark-accent-bg transition-colors"><Edit2 size={14} /></button>
                          <button onClick={() => setDeleteConfirm(p.id)} className="p-1.5 rounded-sm border bg-transparent cursor-pointer transition-colors text-status-ditolak hover:bg-status-ditolak/10" style={{ border: '1px solid color-mix(in srgb, var(--color-status-ditolak) 40%, transparent)' }}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ))
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="glass-card max-w-[520px] w-full p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-heading">{editId ? '✏️ Edit Persyaratan' : '➕ Tambah Persyaratan'}</h3>
                <button onClick={() => setShowModal(false)} className="bg-transparent border-none text-text-muted dark:text-dark-text-muted cursor-pointer hover:text-text-primary dark:hover:text-dark-text-primary"><X size={20} /></button>
              </div>

              {error && showModal && <div className="p-2 rounded-sm mb-4 text-[0.82rem] text-status-ditolak bg-status-ditolak/10">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1.5 text-[0.85rem] text-text-secondary dark:text-dark-text-secondary">Jenjang</label>
                    <select value={form.jenjang} onChange={e => setForm(f => ({ ...f, jenjang: e.target.value }))} className={inputClassName}>
                      {['TK', 'SD', 'SMP', 'SMA'].map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1.5 text-[0.85rem] text-text-secondary dark:text-dark-text-secondary">Kode</label>
                    <input type="text" value={form.kode} onChange={e => setForm(f => ({ ...f, kode: e.target.value }))} placeholder="akta_lahir" className={inputClassName} required />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block mb-1.5 text-[0.85rem] text-text-secondary dark:text-dark-text-secondary">Nama Dokumen</label>
                  <input type="text" value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} placeholder="Akta Kelahiran" className={inputClassName} required />
                </div>

                <div className="mb-4">
                  <label className="block mb-1.5 text-[0.85rem] text-text-secondary dark:text-dark-text-secondary">Keterangan (opsional)</label>
                  <input type="text" value={form.keterangan} onChange={e => setForm(f => ({ ...f, keterangan: e.target.value }))} placeholder="Scan atau foto yang jelas" className={inputClassName} />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block mb-1.5 text-[0.85rem] text-text-secondary dark:text-dark-text-secondary">Format</label>
                    <input type="text" value={form.format_diterima} onChange={e => setForm(f => ({ ...f, format_diterima: e.target.value }))} className={inputClassName} />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-[0.85rem] text-text-secondary dark:text-dark-text-secondary">Maks (MB)</label>
                    <input type="number" min="1" max="20" value={form.maks_ukuran_mb} onChange={e => setForm(f => ({ ...f, maks_ukuran_mb: parseInt(e.target.value) }))} className={inputClassName} />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-[0.85rem] text-text-secondary dark:text-dark-text-secondary">Urutan</label>
                    <input type="number" min="0" value={form.urutan} onChange={e => setForm(f => ({ ...f, urutan: parseInt(e.target.value) }))} className={inputClassName} />
                  </div>
                </div>

                <div className="mb-6">
                  <button type="button" onClick={() => setForm(f => ({ ...f, wajib: !f.wajib }))} className={`flex items-center gap-2 bg-transparent border-none cursor-pointer text-[0.88rem] ${form.wajib ? 'text-status-ditolak' : 'text-text-muted dark:text-dark-text-muted'}`}>
                    {form.wajib ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                    {form.wajib ? 'Wajib diupload' : 'Opsional'}
                  </button>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary flex-1">Batal</button>
                  <button type="submit" disabled={submitting} className={`btn btn-primary flex-1 flex items-center justify-center gap-2 ${submitting ? 'opacity-70' : ''}`}>
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Simpan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirm(null)} className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="glass-card max-w-[400px] w-full p-8 text-center">
              <AlertCircle size={40} className="text-status-ditolak mx-auto mb-4" />
              <h3 className="text-lg font-heading mb-2">Hapus Persyaratan?</h3>
              <p className="text-text-secondary dark:text-dark-text-secondary text-[0.88rem] mb-6">Persyaratan ini akan dihapus secara permanen.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="btn btn-secondary flex-1">Batal</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="btn flex-1 bg-status-ditolak text-white border-none cursor-pointer hover:bg-status-ditolak/90">Hapus</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
