import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Plus, Edit2, X, Loader2, AlertCircle,
  CheckCircle2, UserX, UserCheck, Mail, Phone
} from 'lucide-react';
import api from '../../services/api';
import { Skeleton } from '../../components/SkeletonLoader';

const jenjangColors = { TK: '#C9A84C', SD: '#2D8A6B', SMP: '#1A6B5A', SMA: '#E0C76A' };

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

  const inputStyle = {
    padding: '0.65rem 1rem', background: 'var(--bg-tertiary)',
    border: '1.5px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.88rem',
    outline: 'none', width: '100%', transition: 'border 0.3s',
  };

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={24} color="var(--accent-primary)" /> Kelola Panitia
        </h1>
        <button onClick={openCreate} className="btn btn-primary btn-sm"><Plus size={16} /> Tambah Panitia</button>
      </motion.div>

      {success && <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--status-diterima) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--status-diterima) 25%, transparent)', color: 'var(--status-diterima)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle2 size={14} />{success}</div>}
      {error && !showModal && <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--status-ditolak) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--status-ditolak) 25%, transparent)', color: 'var(--status-ditolak)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><AlertCircle size={14} />{error}</div>}

      {/* Card Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {[1,2,3,4].map(i => <Skeleton key={i} width="100%" height="160px" />)}
        </div>
      ) : data.length === 0 ? (
        <div className="glass-card-static" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <Shield size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h4>Belum ada akun panitia</h4>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {data.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card-static" style={{ padding: '1.25rem', opacity: p.is_active ? 1 : 0.6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `linear-gradient(135deg, ${jenjangColors[p.jenjang] || 'var(--accent-primary)'}, color-mix(in srgb, ${jenjangColors[p.jenjang] || 'var(--accent-primary)'} 70%, #000))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>
                    {p.nama_lengkap?.[0]?.toUpperCase() || 'P'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{p.nama_lengkap}</div>
                    <span style={{ display: 'inline-flex', padding: '0.1rem 0.45rem', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 600, color: 'white', background: jenjangColors[p.jenjang] }}>Jenjang {p.jenjang}</span>
                  </div>
                </div>
                <button onClick={() => openEdit(p)} style={{ padding: '0.3rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--accent-primary)', cursor: 'pointer' }}><Edit2 size={14} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                  <Mail size={13} color="var(--text-muted)" /> {p.email}
                </div>
                {p.no_hp && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                    <Phone size={13} color="var(--text-muted)" /> {p.no_hp}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleToggleActive(p.id, p.is_active)}
                disabled={toggleLoading === p.id}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                  padding: '0.5rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500,
                  background: 'transparent', transition: 'all 0.2s',
                  border: p.is_active ? '1px solid color-mix(in srgb, var(--status-ditolak) 40%, transparent)' : '1px solid color-mix(in srgb, var(--status-diterima) 40%, transparent)',
                  color: p.is_active ? 'var(--status-ditolak)' : 'var(--status-diterima)',
                  opacity: toggleLoading === p.id ? 0.5 : 1,
                }}
              >
                {toggleLoading === p.id ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : p.is_active ? <><UserX size={14} /> Nonaktifkan</> : <><UserCheck size={14} /> Aktifkan</>}
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="glass-card" style={{ maxWidth: '480px', width: '100%', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem' }}>{editId ? '✏️ Edit Panitia' : '➕ Tambah Panitia'}</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              {error && showModal && <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'color-mix(in srgb, var(--status-ditolak) 10%, transparent)', color: 'var(--status-ditolak)', marginBottom: '1rem', fontSize: '0.82rem' }}>{error}</div>}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nama Lengkap</label>
                  <input type="text" value={form.nama_lengkap} onChange={e => setForm(f => ({ ...f, nama_lengkap: e.target.value }))} style={inputStyle} required />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} required />
                </div>

                {!editId && (
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Password</label>
                    <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Minimal 8 karakter" style={inputStyle} required />
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No HP</label>
                    <input type="text" value={form.no_hp} onChange={e => setForm(f => ({ ...f, no_hp: e.target.value }))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Jenjang</label>
                    <select value={form.jenjang} onChange={e => setForm(f => ({ ...f, jenjang: e.target.value }))} style={inputStyle}>
                      {['TK', 'SD', 'SMP', 'SMA'].map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Batal</button>
                  <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 1, opacity: submitting ? 0.7 : 1 }}>
                    {submitting ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'Simpan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
