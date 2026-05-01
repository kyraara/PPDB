import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Plus, Edit2, X, Loader2, AlertCircle,
  CheckCircle2, UserX, UserCheck, Mail, Phone
} from 'lucide-react';
import api from '../../services/api';
import { Skeleton } from '../../components/SkeletonLoader';

const jenjangColors = { TK: 'var(--color-accent)', SD: '#2D8A6B', SMP: '#1A6B5A', SMA: '#E0C76A' };

const emptyForm = { nama_lengkap: '', email: '', password: '', no_hp: '', jenjang: 'TK' };

export default function PanitiaPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [toggleLoading, setToggleLoading] = useState(null);

  const fetchData = () => {
    setLoading(true);
    api.get('/admin/panitia')
      .then(res => setData(res.data.data))
      .catch(() => setError('Gagal memuat data panitia.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditId(null); setForm(emptyForm); setError(''); setShowModal(true); };
  const openEdit = (p) => {
    setEditId(p.id);
    setForm({ nama_lengkap: p.nama_lengkap, email: p.email, password: '', no_hp: p.no_hp || '', jenjang: p.jenjang || 'TK' });
    setError(''); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      if (editId) {
        const payload = { nama_lengkap: form.nama_lengkap, email: form.email, no_hp: form.no_hp, jenjang: form.jenjang };
        await api.put(`/admin/panitia/${editId}`, payload);
        setSuccess('Data panitia berhasil diperbarui.');
      } else {
        if (!form.password || form.password.length < 8) {
          setError('Password minimal 8 karakter.'); setSubmitting(false); return;
        }
        await api.post('/admin/panitia', form);
        setSuccess('Akun panitia berhasil dibuat.');
      }
      setShowModal(false); fetchData();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal menyimpan.';
      const errors = err.response?.data?.errors;
      if (errors) {
        setError(Object.values(errors).flat().join(' '));
      } else {
        setError(msg);
      }
    }
    finally { setSubmitting(false); }
  };

  const handleToggleActive = async (id, currentActive) => {
    setToggleLoading(id);
    try {
      if (currentActive) {
        await api.delete(`/admin/panitia/${id}`);
        setSuccess('Akun panitia berhasil dinonaktifkan.');
      } else {
        await api.put(`/admin/panitia/${id}`, { is_active: true });
        setSuccess('Akun panitia berhasil diaktifkan kembali.');
      }
      fetchData();
      setTimeout(() => setSuccess(''), 4000);
    } catch { setError('Gagal mengubah status akun.'); }
    finally { setToggleLoading(null); }
  };

  const inputClassName = "px-4 py-2.5 bg-bg-tertiary dark:bg-dark-bg-tertiary border-[1.5px] border-border-default dark:border-dark-border-default rounded-md text-text-primary dark:text-dark-text-primary font-body text-[0.88rem] outline-none w-full transition-colors focus:border-accent dark:focus:border-dark-accent";

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl flex items-center gap-2">
          <Shield size={24} className="text-accent dark:text-dark-accent" /> Kelola Panitia
        </h1>
        <button onClick={openCreate} className="btn btn-primary btn-sm flex items-center gap-2"><Plus size={16} /> Tambah Panitia</button>
      </motion.div>

      {success && <div className="p-3 rounded-md mb-4 text-[0.85rem] flex items-center gap-1.5 text-status-diterima border border-status-diterima/25 bg-status-diterima/10"><CheckCircle2 size={14} />{success}</div>}
      {error && !showModal && <div className="p-3 rounded-md mb-4 text-[0.85rem] flex items-center gap-1.5 text-status-ditolak border border-status-ditolak/25 bg-status-ditolak/10"><AlertCircle size={14} />{error}</div>}

      {/* Card Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} width="100%" height="160px" />)}
        </div>
      ) : data.length === 0 ? (
        <div className="glass-card-static text-center py-12 px-8">
          <Shield size={48} className="text-text-muted dark:text-dark-text-muted opacity-50 mx-auto mb-4" />
          <h4 className="text-base">Belum ada akun panitia</h4>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className={`glass-card-static p-5 transition-opacity ${p.is_active ? 'opacity-100' : 'opacity-60'}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-[0.85rem] font-bold text-white shadow-sm" style={{ background: `linear-gradient(135deg, ${jenjangColors[p.jenjang] || 'var(--color-accent)'}, color-mix(in srgb, ${jenjangColors[p.jenjang] || 'var(--color-accent)'} 70%, #000))` }}>
                    {p.nama_lengkap?.[0]?.toUpperCase() || 'P'}
                  </div>
                  <div>
                    <div className="font-semibold text-[0.95rem]">{p.nama_lengkap}</div>
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[0.65rem] font-semibold text-white mt-0.5" style={{ background: jenjangColors[p.jenjang] }}>Jenjang {p.jenjang}</span>
                  </div>
                </div>
                <button onClick={() => openEdit(p)} className="p-1.5 rounded-sm border border-border-default dark:border-dark-border-default bg-transparent text-accent dark:text-dark-accent cursor-pointer hover:bg-accent-bg dark:hover:bg-dark-accent-bg transition-colors"><Edit2 size={14} /></button>
              </div>

              <div className="flex flex-col gap-1.5 text-[0.82rem] mb-4">
                <div className="flex items-center gap-1.5 text-text-secondary dark:text-dark-text-secondary">
                  <Mail size={13} className="text-text-muted dark:text-dark-text-muted shrink-0" /> <span className="truncate">{p.email}</span>
                </div>
                {p.no_hp && (
                  <div className="flex items-center gap-1.5 text-text-secondary dark:text-dark-text-secondary">
                    <Phone size={13} className="text-text-muted dark:text-dark-text-muted shrink-0" /> {p.no_hp}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleToggleActive(p.id, p.is_active)}
                disabled={toggleLoading === p.id}
                className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-md cursor-pointer text-[0.8rem] font-medium bg-transparent transition-all duration-200
                  ${p.is_active ? 'border border-status-ditolak/40 text-status-ditolak hover:bg-status-ditolak/10' : 'border border-status-diterima/40 text-status-diterima hover:bg-status-diterima/10'}
                  ${toggleLoading === p.id ? 'opacity-50 cursor-wait' : 'opacity-100'}`}
              >
                {toggleLoading === p.id ? <Loader2 size={14} className="animate-spin" /> : p.is_active ? <><UserX size={14} /> Nonaktifkan</> : <><UserCheck size={14} /> Aktifkan</>}
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="glass-card max-w-[480px] w-full p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-heading">{editId ? '✏️ Edit Panitia' : '➕ Tambah Panitia'}</h3>
                <button onClick={() => setShowModal(false)} className="bg-transparent border-none text-text-muted dark:text-dark-text-muted cursor-pointer hover:text-text-primary dark:hover:text-dark-text-primary"><X size={20} /></button>
              </div>

              {error && showModal && <div className="p-2 rounded-sm mb-4 text-[0.82rem] text-status-ditolak bg-status-ditolak/10">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block mb-1.5 text-[0.85rem] text-text-secondary dark:text-dark-text-secondary">Nama Lengkap</label>
                  <input type="text" value={form.nama_lengkap} onChange={e => setForm(f => ({ ...f, nama_lengkap: e.target.value }))} className={inputClassName} required />
                </div>

                <div className="mb-4">
                  <label className="block mb-1.5 text-[0.85rem] text-text-secondary dark:text-dark-text-secondary">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputClassName} required />
                </div>

                {!editId && (
                  <div className="mb-4">
                    <label className="block mb-1.5 text-[0.85rem] text-text-secondary dark:text-dark-text-secondary">Password</label>
                    <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Minimal 8 karakter" className={inputClassName} required />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block mb-1.5 text-[0.85rem] text-text-secondary dark:text-dark-text-secondary">No HP</label>
                    <input type="text" value={form.no_hp} onChange={e => setForm(f => ({ ...f, no_hp: e.target.value }))} className={inputClassName} />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-[0.85rem] text-text-secondary dark:text-dark-text-secondary">Jenjang</label>
                    <select value={form.jenjang} onChange={e => setForm(f => ({ ...f, jenjang: e.target.value }))} className={inputClassName}>
                      {['TK', 'SD', 'SMP', 'SMA'].map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </div>
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
    </div>
  );
}
