import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, Plus, Edit2, Trash2, X, Loader2, AlertCircle,
  CheckCircle2, ChevronDown
} from 'lucide-react';
import api from '../../services/api';
import { Skeleton, SkeletonCard } from '../../components/SkeletonLoader';

const statusStyles = {
  BUKA: { bg: 'var(--color-status-diterima)', label: 'Buka' },
  TUTUP: { bg: 'var(--color-status-ditolak)', label: 'Tutup' },
  AKAN_DATANG: { bg: 'var(--color-status-submitted)', label: 'Akan Datang' },
};

const jenjangColors = { TK: 'var(--color-accent)', SD: '#2D8A6B', SMP: '#1A6B5A', SMA: '#E0C76A' };

const emptyForm = {
  jenjang: 'TK', nomor_gelombang: 1, nama: '', tanggal_buka: '', tanggal_tutup: '', kuota: 30, status: 'AKAN_DATANG', biaya: 250000,
};

export default function GelombangPage() {
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
    api.get('/admin/gelombang', { params: { jenjang: filterJenjang } })
      .then(res => setData(res.data.data))
      .catch(() => setError('Gagal memuat data gelombang.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [filterJenjang]);

  const openCreate = () => { setEditId(null); setForm(emptyForm); setError(''); setShowModal(true); };
  const openEdit = (g) => {
    setEditId(g.id);
    setForm({
      jenjang: g.jenjang, nomor_gelombang: g.nomor_gelombang, nama: g.nama || '',
      tanggal_buka: g.tanggal_buka?.split('T')[0] || '', tanggal_tutup: g.tanggal_tutup?.split('T')[0] || '',
      kuota: g.kuota, status: g.status, biaya: g.biaya || 0,
    });
    setError(''); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      if (editId) {
        await api.put(`/admin/gelombang/${editId}`, form);
        setSuccess('Gelombang berhasil diperbarui.');
      } else {
        await api.post('/admin/gelombang', form);
        setSuccess('Gelombang berhasil ditambahkan.');
      }
      setShowModal(false); fetchData();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) { setError(err.response?.data?.message || 'Gagal menyimpan.'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/gelombang/${id}`);
      setSuccess('Gelombang berhasil dihapus.');
      setDeleteConfirm(null); fetchData();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) { setError(err.response?.data?.message || 'Gagal menghapus.'); setDeleteConfirm(null); }
  };

  const inputClassName = "px-4 py-2.5 bg-bg-tertiary dark:bg-dark-bg-tertiary border-[1.5px] border-border-default dark:border-dark-border-default rounded-md text-text-primary dark:text-dark-text-primary font-body text-[0.88rem] outline-none w-full transition-colors focus:border-accent dark:focus:border-dark-accent";

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl flex items-center gap-2">
          <CalendarDays size={24} className="text-accent dark:text-dark-accent" /> Kelola Gelombang
        </h1>
        <button onClick={openCreate} className="btn btn-primary btn-sm flex items-center gap-2">
          <Plus size={16} /> Tambah Gelombang
        </button>
      </motion.div>

      {/* Alerts */}
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

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static overflow-hidden">
        {loading ? (
          <div className="p-6 flex flex-col gap-3">
            {[1,2,3,4].map(i => <Skeleton key={i} width="100%" height="3rem" />)}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12 px-8">
            <CalendarDays size={48} className="text-text-muted dark:text-dark-text-muted opacity-50 mx-auto mb-4" />
            <h4 className="text-base mb-1">Belum ada gelombang</h4>
            <p className="text-text-muted dark:text-dark-text-muted text-[0.85rem]">Klik "Tambah Gelombang" untuk membuat gelombang baru.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[0.85rem]">
              <thead>
                <tr className="border-b-2 border-border-default dark:border-dark-border-default">
                  {['Jenjang', 'Gelombang', 'Tanggal', 'Kuota', 'Biaya', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="text-left px-3 py-3.5 text-[0.72rem] text-text-muted dark:text-dark-text-muted font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map(g => {
                  const sBadge = statusStyles[g.status] || { bg: 'var(--color-text-muted)', label: g.status };
                  return (
                    <tr key={g.id} className="border-b border-border-default dark:border-dark-border-default">
                      <td className="px-3 py-3">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[0.7rem] font-semibold text-white" style={{ background: jenjangColors[g.jenjang] }}>{g.jenjang}</span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-medium">{g.nama || `Gelombang ${g.nomor_gelombang}`}</div>
                        <div className="text-[0.72rem] text-text-muted dark:text-dark-text-muted">Gel. {g.nomor_gelombang}</div>
                      </td>
                      <td className="px-3 py-3 text-[0.82rem] text-text-secondary dark:text-dark-text-secondary whitespace-nowrap">
                        {g.tanggal_buka ? new Date(g.tanggal_buka).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'} — {g.tanggal_tutup ? new Date(g.tanggal_tutup).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-[0.82rem]"><strong>{g.terisi}</strong> / {g.kuota}</div>
                        <div className="h-1 rounded-sm bg-bg-tertiary dark:bg-dark-bg-tertiary mt-1 overflow-hidden w-20">
                          <div className="h-full rounded-sm transition-all duration-500" 
                            style={{ 
                              background: g.sisa <= 5 ? 'var(--color-status-ditolak)' : 'var(--color-accent-light)', 
                              width: `${Math.min(100, (g.terisi / g.kuota) * 100)}%` 
                            }} />
                        </div>
                      </td>
                      <td className="px-3 py-3 text-[0.85rem] whitespace-nowrap">
                        Rp {g.biaya?.toLocaleString('id-ID') || 0}
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-[0.7rem] font-semibold text-white" style={{ background: sBadge.bg }}>{sBadge.label}</span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-1.5">
                          <button onClick={() => openEdit(g)} className="p-1.5 rounded-sm border border-border-default dark:border-dark-border-default bg-transparent text-accent dark:text-dark-accent cursor-pointer hover:bg-accent-bg dark:hover:bg-dark-accent-bg transition-colors"><Edit2 size={14} /></button>
                          <button onClick={() => setDeleteConfirm(g.id)} className="p-1.5 rounded-sm border bg-transparent cursor-pointer transition-colors text-status-ditolak hover:bg-status-ditolak/10" style={{ border: '1px solid color-mix(in srgb, var(--color-status-ditolak) 40%, transparent)' }}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="glass-card max-w-[520px] w-full p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-heading">{editId ? '✏️ Edit Gelombang' : '➕ Tambah Gelombang'}</h3>
                <button onClick={() => setShowModal(false)} className="bg-transparent border-none text-text-muted dark:text-dark-text-muted cursor-pointer hover:text-text-primary dark:hover:text-dark-text-primary"><X size={20} /></button>
              </div>

              {error && showModal && <div className="p-2 rounded-sm mb-4 text-[0.82rem] text-status-ditolak bg-status-ditolak/10">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1.5 text-[0.85rem] text-text-secondary dark:text-dark-text-secondary">Jenjang</label>
                    <select value={form.jenjang} onChange={e => setForm(f => ({ ...f, jenjang: e.target.value }))} disabled={!!editId} className={`${inputClassName} ${editId ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                      {['TK', 'SD', 'SMP', 'SMA'].map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1.5 text-[0.85rem] text-text-secondary dark:text-dark-text-secondary">Nomor Gelombang</label>
                    <input type="number" min="1" value={form.nomor_gelombang} onChange={e => setForm(f => ({ ...f, nomor_gelombang: parseInt(e.target.value) }))} disabled={!!editId} className={`${inputClassName} ${editId ? 'opacity-60' : ''}`} required />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block mb-1.5 text-[0.85rem] text-text-secondary dark:text-dark-text-secondary">Nama Gelombang</label>
                  <input type="text" value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} placeholder="contoh: Gelombang 1 - Jalur Reguler" className={inputClassName} />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1.5 text-[0.85rem] text-text-secondary dark:text-dark-text-secondary">Tanggal Buka</label>
                    <input type="date" value={form.tanggal_buka} onChange={e => setForm(f => ({ ...f, tanggal_buka: e.target.value }))} className={inputClassName} required />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-[0.85rem] text-text-secondary dark:text-dark-text-secondary">Tanggal Tutup</label>
                    <input type="date" value={form.tanggal_tutup} onChange={e => setForm(f => ({ ...f, tanggal_tutup: e.target.value }))} className={inputClassName} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block mb-1.5 text-[0.85rem] text-text-secondary dark:text-dark-text-secondary">Kuota</label>
                    <input type="number" min="1" value={form.kuota} onChange={e => setForm(f => ({ ...f, kuota: parseInt(e.target.value) }))} className={inputClassName} required />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-[0.85rem] text-text-secondary dark:text-dark-text-secondary">Status</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={inputClassName}>
                      <option value="AKAN_DATANG">Akan Datang</option>
                      <option value="BUKA">Buka</option>
                      <option value="TUTUP">Tutup</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-1.5 text-[0.85rem] text-text-secondary dark:text-dark-text-secondary">Biaya Pendaftaran (Rp)</label>
                  <input type="number" min="0" value={form.biaya} onChange={e => setForm(f => ({ ...f, biaya: parseInt(e.target.value) }))} placeholder="contoh: 250000" className={inputClassName} required />
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary flex-1">Batal</button>
                  <button type="submit" disabled={submitting} className={`btn btn-primary flex-1 flex items-center justify-center gap-2 ${submitting ? 'opacity-70' : ''}`}>
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : editId ? 'Simpan Perubahan' : 'Tambah'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirm(null)} className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="glass-card max-w-[400px] w-full p-8 text-center">
              <AlertCircle size={40} className="text-status-ditolak mx-auto mb-4" />
              <h3 className="text-lg font-heading mb-2">Hapus Gelombang?</h3>
              <p className="text-text-secondary dark:text-dark-text-secondary text-[0.88rem] mb-6">Tindakan ini tidak bisa dibatalkan. Gelombang hanya bisa dihapus jika belum ada pendaftar.</p>
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
