import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, Plus, Edit2, Trash2, X, Loader2, AlertCircle,
  CheckCircle2, ChevronDown
} from 'lucide-react';
import api from '../../services/api';
import { Skeleton, SkeletonCard } from '../../components/SkeletonLoader';

const statusStyles = {
  BUKA: { bg: 'var(--status-diterima)', label: 'Buka' },
  TUTUP: { bg: 'var(--status-ditolak)', label: 'Tutup' },
  AKAN_DATANG: { bg: 'var(--status-submitted)', label: 'Akan Datang' },
};

const jenjangColors = { TK: '#C9A84C', SD: '#2D8A6B', SMP: '#1A6B5A', SMA: '#E0C76A' };

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
          <CalendarDays size={24} color="var(--accent-primary)" /> Kelola Gelombang
        </h1>
        <button onClick={openCreate} className="btn btn-primary btn-sm">
          <Plus size={16} /> Tambah Gelombang
        </button>
      </motion.div>

      {/* Alerts */}
      {success && <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--status-diterima) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--status-diterima) 25%, transparent)', color: 'var(--status-diterima)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle2 size={14} />{success}</div>}
      {error && !showModal && <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--status-ditolak) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--status-ditolak) 25%, transparent)', color: 'var(--status-ditolak)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><AlertCircle size={14} />{error}</div>}

      {/* Filter */}
      <div className="glass-card-static" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Filter:</span>
        {['semua', 'TK', 'SD', 'SMP', 'SMA'].map(j => (
          <button key={j} onClick={() => setFilterJenjang(j)} style={{
            padding: '0.35rem 0.75rem', borderRadius: '50px', border: filterJenjang === j ? '1.5px solid var(--accent-primary)' : '1.5px solid var(--glass-border)',
            background: filterJenjang === j ? 'rgba(201,168,76,0.1)' : 'transparent', color: filterJenjang === j ? 'var(--accent-primary)' : 'var(--text-secondary)',
            cursor: 'pointer', fontSize: '0.78rem', fontWeight: filterJenjang === j ? 600 : 400, transition: 'all 0.2s',
          }}>{j === 'semua' ? 'Semua' : j}</button>
        ))}
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1,2,3,4].map(i => <Skeleton key={i} width="100%" height="3rem" />)}
          </div>
        ) : data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <CalendarDays size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h4 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>Belum ada gelombang</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Klik "Tambah Gelombang" untuk membuat gelombang baru.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
                  {['Jenjang', 'Gelombang', 'Tanggal', 'Kuota', 'Biaya', 'Status', 'Aksi'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.85rem 0.75rem', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map(g => {
                  const sBadge = statusStyles[g.status] || { bg: 'var(--text-muted)', label: g.status };
                  return (
                    <tr key={g.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ display: 'inline-flex', padding: '0.15rem 0.5rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 600, color: 'white', background: jenjangColors[g.jenjang] }}>{g.jenjang}</span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ fontWeight: 500 }}>{g.nama || `Gelombang ${g.nomor_gelombang}`}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Gel. {g.nomor_gelombang}</div>
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        {g.tanggal_buka ? new Date(g.tanggal_buka).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'} — {g.tanggal_tutup ? new Date(g.tanggal_tutup).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ fontSize: '0.82rem' }}><strong>{g.terisi}</strong> / {g.kuota}</div>
                        <div style={{ height: '4px', borderRadius: '2px', background: 'var(--bg-tertiary)', marginTop: '0.3rem', overflow: 'hidden', width: '80px' }}>
                          <div style={{ height: '100%', borderRadius: '2px', background: g.sisa <= 5 ? 'var(--status-ditolak)' : 'var(--accent-primary-light)', width: `${Math.min(100, (g.terisi / g.kuota) * 100)}%`, transition: 'width 0.5s ease' }} />
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                        Rp {g.biaya?.toLocaleString('id-ID') || 0}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ display: 'inline-flex', padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 600, color: 'white', background: sBadge.bg }}>{sBadge.label}</span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button onClick={() => openEdit(g)} style={{ padding: '0.3rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--accent-primary)', cursor: 'pointer' }}><Edit2 size={14} /></button>
                          <button onClick={() => setDeleteConfirm(g.id)} style={{ padding: '0.3rem', borderRadius: 'var(--radius-sm)', border: '1px solid color-mix(in srgb, var(--status-ditolak) 40%, transparent)', background: 'transparent', color: 'var(--status-ditolak)', cursor: 'pointer' }}><Trash2 size={14} /></button>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="glass-card" style={{ maxWidth: '520px', width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem' }}>{editId ? '✏️ Edit Gelombang' : '➕ Tambah Gelombang'}</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              {error && showModal && <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'color-mix(in srgb, var(--status-ditolak) 10%, transparent)', color: 'var(--status-ditolak)', marginBottom: '1rem', fontSize: '0.82rem' }}>{error}</div>}

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Jenjang</label>
                    <select value={form.jenjang} onChange={e => setForm(f => ({ ...f, jenjang: e.target.value }))} disabled={!!editId} style={{ ...inputStyle, cursor: editId ? 'not-allowed' : 'pointer', opacity: editId ? 0.6 : 1 }}>
                      {['TK', 'SD', 'SMP', 'SMA'].map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nomor Gelombang</label>
                    <input type="number" min="1" value={form.nomor_gelombang} onChange={e => setForm(f => ({ ...f, nomor_gelombang: parseInt(e.target.value) }))} disabled={!!editId} style={{ ...inputStyle, opacity: editId ? 0.6 : 1 }} required />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nama Gelombang</label>
                  <input type="text" value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} placeholder="contoh: Gelombang 1 - Jalur Reguler" style={inputStyle} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tanggal Buka</label>
                    <input type="date" value={form.tanggal_buka} onChange={e => setForm(f => ({ ...f, tanggal_buka: e.target.value }))} style={inputStyle} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tanggal Tutup</label>
                    <input type="date" value={form.tanggal_tutup} onChange={e => setForm(f => ({ ...f, tanggal_tutup: e.target.value }))} style={inputStyle} required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Kuota</label>
                    <input type="number" min="1" value={form.kuota} onChange={e => setForm(f => ({ ...f, kuota: parseInt(e.target.value) }))} style={inputStyle} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={inputStyle}>
                      <option value="AKAN_DATANG">Akan Datang</option>
                      <option value="BUKA">Buka</option>
                      <option value="TUTUP">Tutup</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Biaya Pendaftaran (Rp)</label>
                  <input type="number" min="0" value={form.biaya} onChange={e => setForm(f => ({ ...f, biaya: parseInt(e.target.value) }))} placeholder="contoh: 250000" style={inputStyle} required />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Batal</button>
                  <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 1, opacity: submitting ? 0.7 : 1 }}>
                    {submitting ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : editId ? 'Simpan Perubahan' : 'Tambah'}
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirm(null)} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="glass-card" style={{ maxWidth: '400px', width: '100%', padding: '2rem', textAlign: 'center' }}>
              <AlertCircle size={40} color="var(--status-ditolak)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Hapus Gelombang?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>Tindakan ini tidak bisa dibatalkan. Gelombang hanya bisa dihapus jika belum ada pendaftar.</p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setDeleteConfirm(null)} className="btn btn-secondary" style={{ flex: 1 }}>Batal</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="btn" style={{ flex: 1, background: 'var(--status-ditolak)', color: 'white', border: 'none', cursor: 'pointer' }}>Hapus</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
