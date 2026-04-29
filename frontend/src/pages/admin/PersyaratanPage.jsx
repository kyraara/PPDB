import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Plus, Edit2, Trash2, X, Loader2, AlertCircle,
  CheckCircle2, ToggleLeft, ToggleRight
} from 'lucide-react';
import api from '../../services/api';
import { Skeleton } from '../../components/SkeletonLoader';

const jenjangColors = { TK: '#C9A84C', SD: '#2D8A6B', SMP: '#1A6B5A', SMA: '#E0C76A' };

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

  const inputStyle = {
    padding: '0.65rem 1rem', background: 'var(--bg-tertiary)',
    border: '1.5px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.88rem',
    outline: 'none', width: '100%', transition: 'border 0.3s',
  };

  // Group by jenjang for display
  const grouped = {};
  data.forEach(p => {
    if (!grouped[p.jenjang]) grouped[p.jenjang] = [];
    grouped[p.jenjang].push(p);
  });

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={24} color="var(--accent-primary)" /> Persyaratan Dokumen
        </h1>
        <button onClick={openCreate} className="btn btn-primary btn-sm"><Plus size={16} /> Tambah</button>
      </motion.div>

      {success && <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--status-diterima) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--status-diterima) 25%, transparent)', color: 'var(--status-diterima)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle2 size={14} />{success}</div>}
      {error && !showModal && <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--status-ditolak) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--status-ditolak) 25%, transparent)', color: 'var(--status-ditolak)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><AlertCircle size={14} />{error}</div>}

      {/* Filter */}
      <div className="glass-card-static" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Filter:</span>
        {['semua', 'TK', 'SD', 'SMP', 'SMA'].map(j => (
          <button key={j} onClick={() => setFilterJenjang(j)} style={{
            padding: '0.35rem 0.75rem', borderRadius: '50px', border: filterJenjang === j ? '1.5px solid var(--accent-primary)' : '1.5px solid var(--glass-border)',
            background: filterJenjang === j ? 'rgba(201,168,76,0.1)' : 'transparent', color: filterJenjang === j ? 'var(--accent-primary)' : 'var(--text-secondary)',
            cursor: 'pointer', fontSize: '0.78rem', fontWeight: filterJenjang === j ? 600 : 400,
          }}>{j === 'semua' ? 'Semua' : j}</button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1,2,3].map(i => <Skeleton key={i} width="100%" height="3rem" />)}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="glass-card-static" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <FileText size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h4>Belum ada persyaratan dokumen</h4>
        </div>
      ) : (
        Object.entries(grouped).map(([jenjang, items]) => (
          <motion.div key={jenjang} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static" style={{ marginBottom: '1.25rem', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: jenjangColors[jenjang] }} />
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Jenjang {jenjang}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{items.length} dokumen</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    {['#', 'Kode', 'Nama', 'Format', 'Maks', 'Wajib', 'Aksi'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '0.65rem 0.75rem', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '0.65rem 0.75rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>{p.urutan}</td>
                      <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--accent-primary)' }}>{p.kode}</td>
                      <td style={{ padding: '0.65rem 0.75rem', fontWeight: 500 }}>
                        {p.nama}
                        {p.keterangan && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.keterangan}</div>}
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{p.format_diterima}</td>
                      <td style={{ padding: '0.65rem 0.75rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{p.maks_ukuran_mb} MB</td>
                      <td style={{ padding: '0.65rem 0.75rem' }}>
                        {p.wajib ? (
                          <span style={{ color: 'var(--status-ditolak)', fontSize: '0.72rem', fontWeight: 600 }}>WAJIB</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Opsional</span>
                        )}
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button onClick={() => openEdit(p)} style={{ padding: '0.3rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--accent-primary)', cursor: 'pointer' }}><Edit2 size={14} /></button>
                          <button onClick={() => setDeleteConfirm(p.id)} style={{ padding: '0.3rem', borderRadius: 'var(--radius-sm)', border: '1px solid color-mix(in srgb, var(--status-ditolak) 40%, transparent)', background: 'transparent', color: 'var(--status-ditolak)', cursor: 'pointer' }}><Trash2 size={14} /></button>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="glass-card" style={{ maxWidth: '520px', width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem' }}>{editId ? '✏️ Edit Persyaratan' : '➕ Tambah Persyaratan'}</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              {error && showModal && <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'color-mix(in srgb, var(--status-ditolak) 10%, transparent)', color: 'var(--status-ditolak)', marginBottom: '1rem', fontSize: '0.82rem' }}>{error}</div>}

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Jenjang</label>
                    <select value={form.jenjang} onChange={e => setForm(f => ({ ...f, jenjang: e.target.value }))} style={inputStyle}>
                      {['TK', 'SD', 'SMP', 'SMA'].map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Kode</label>
                    <input type="text" value={form.kode} onChange={e => setForm(f => ({ ...f, kode: e.target.value }))} placeholder="akta_lahir" style={inputStyle} required />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nama Dokumen</label>
                  <input type="text" value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} placeholder="Akta Kelahiran" style={inputStyle} required />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Keterangan (opsional)</label>
                  <input type="text" value={form.keterangan} onChange={e => setForm(f => ({ ...f, keterangan: e.target.value }))} placeholder="Scan atau foto yang jelas" style={inputStyle} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Format</label>
                    <input type="text" value={form.format_diterima} onChange={e => setForm(f => ({ ...f, format_diterima: e.target.value }))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Maks (MB)</label>
                    <input type="number" min="1" max="20" value={form.maks_ukuran_mb} onChange={e => setForm(f => ({ ...f, maks_ukuran_mb: parseInt(e.target.value) }))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Urutan</label>
                    <input type="number" min="0" value={form.urutan} onChange={e => setForm(f => ({ ...f, urutan: parseInt(e.target.value) }))} style={inputStyle} />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <button type="button" onClick={() => setForm(f => ({ ...f, wajib: !f.wajib }))} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: form.wajib ? 'var(--status-ditolak)' : 'var(--text-muted)', fontSize: '0.88rem' }}>
                    {form.wajib ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                    {form.wajib ? 'Wajib diupload' : 'Opsional'}
                  </button>
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

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirm(null)} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="glass-card" style={{ maxWidth: '400px', width: '100%', padding: '2rem', textAlign: 'center' }}>
              <AlertCircle size={40} color="var(--status-ditolak)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Hapus Persyaratan?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>Persyaratan ini akan dihapus secara permanen.</p>
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
