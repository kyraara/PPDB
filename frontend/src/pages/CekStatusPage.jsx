import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertCircle, CheckCircle2, Clock, FileText, XCircle } from 'lucide-react';
import api from '../services/api';
import GeometricPattern from '../components/GeometricPattern';

const statusConfig = {
  DRAFT: { label: 'Belum Selesai', color: '#6B7280', icon: FileText },
  SUBMITTED: { label: 'Menunggu Verifikasi', color: '#3B82F6', icon: Clock },
  MENUNGGU_REVIEW: { label: 'Sedang Diproses', color: '#F59E0B', icon: Clock },
  REVISI: { label: 'Perlu Revisi Dokumen', color: '#F97316', icon: AlertCircle },
  DITERIMA: { label: 'Diterima', color: '#10B981', icon: CheckCircle2 },
  DITOLAK: { label: 'Tidak Diterima', color: '#EF4444', icon: XCircle },
  MENUNGGU_BAYAR: { label: 'Menunggu Pembayaran', color: '#3B82F6', icon: Clock },
  TERDAFTAR: { label: 'Terdaftar ✓', color: '#047857', icon: CheckCircle2 },
  EXPIRED: { label: 'Pembayaran Kadaluarsa', color: '#991B1B', icon: XCircle },
};

export default function CekStatusPage() {
  const [nomorDaftar, setNomorDaftar] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nomorDaftar.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await api.get(`/publik/cek-status/${nomorDaftar.trim()}`);
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally { setLoading(false); }
  };

  const st = result ? statusConfig[result.status] : null;

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px', paddingBottom: '3rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', zIndex: 0 }}><GeometricPattern size={400} opacity={0.03} /></div>
      <div className="container" style={{ maxWidth: '600px', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Cek <span style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Status</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Masukkan nomor pendaftaran untuk mengecek status</p>
        </motion.div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label"><Search size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.35rem' }} />Nomor Pendaftaran</label>
              <input type="text" className="form-input" placeholder="Contoh: PPDB-SD-2026-2-0001" value={nomorDaftar} onChange={(e) => setNomorDaftar(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>{loading ? 'Mencari...' : <><Search size={18} />Cek Status</>}</button>
          </form>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <AlertCircle size={18} />{error}
            </motion.div>
          )}
          {result && st && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card" style={{ marginTop: '1.5rem', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <st.icon size={24} color={st.color} />
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: st.color }}>{st.label}</span>
              </div>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {[
                  ['Nomor Daftar', result.nomor_daftar],
                  ['Nama Siswa', result.nama_siswa],
                  ['Jenjang', result.jenjang],
                  ['Gelombang', result.gelombang],
                  ['Tanggal Submit', result.submitted_at || '-'],
                  ['Tanggal Review', result.reviewed_at || '-'],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{label}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{val}</span>
                  </div>
                ))}
              </div>
              {result.catatan && <div style={{ marginTop: '1rem', padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.85rem', color: '#EF4444' }}><strong>Catatan:</strong> {result.catatan}</div>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
