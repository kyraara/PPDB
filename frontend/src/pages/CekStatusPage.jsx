import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertCircle, CheckCircle2, Clock, FileText, XCircle } from 'lucide-react';
import api from '../services/api';
import GeometricPattern from '../components/GeometricPattern';

const statusConfig = {
  DRAFT: { label: 'Belum Selesai', color: 'text-text-muted dark:text-dark-text-muted', icon: FileText },
  SUBMITTED: { label: 'Menunggu Verifikasi', color: 'text-status-submitted', icon: Clock },
  MENUNGGU_REVIEW: { label: 'Sedang Diproses', color: 'text-status-review', icon: Clock },
  REVISI: { label: 'Perlu Revisi Dokumen', color: 'text-status-revisi', icon: AlertCircle },
  DITERIMA: { label: 'Diterima', color: 'text-status-diterima', icon: CheckCircle2 },
  DITOLAK: { label: 'Tidak Diterima', color: 'text-status-ditolak', icon: XCircle },
  MENUNGGU_BAYAR: { label: 'Menunggu Pembayaran', color: 'text-status-bayar', icon: Clock },
  TERDAFTAR: { label: 'Terdaftar ✓', color: 'text-status-terdaftar', icon: CheckCircle2 },
  EXPIRED: { label: 'Pembayaran Kadaluarsa', color: 'text-status-expired', icon: XCircle },
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
    <div className="min-h-screen pt-[90px] pb-12 relative overflow-hidden">
      <div className="absolute -top-[100px] -right-[100px] z-0"><GeometricPattern size={400} opacity={0.03} /></div>
      <div className="container max-w-[600px] relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-[2rem] mb-2">
            Cek <span className="bg-gradient-to-br from-accent to-accent-light dark:from-dark-accent dark:to-dark-accent-light bg-clip-text text-transparent">Status</span>
          </h1>
          <p className="text-text-secondary dark:text-dark-text-secondary">Masukkan nomor pendaftaran untuk mengecek status</p>
        </motion.div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4">
              <label className="form-label"><Search size={14} className="inline align-middle mr-1.5" />Nomor Pendaftaran</label>
              <input type="text" className="form-input" placeholder="Contoh: PPDB-SD-2026-2-0001"
                value={nomorDaftar} onChange={(e) => setNomorDaftar(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? 'Mencari...' : <><Search size={18} />Cek Status</>}
            </button>
          </form>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-6 p-4 rounded-md flex items-center gap-2 text-sm bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-status-ditolak">
              <AlertCircle size={18} />{error}
            </motion.div>
          )}
          {result && st && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="glass-card mt-6 p-8">
              <div className="flex items-center justify-center gap-2 mb-6">
                <st.icon size={24} className={st.color} />
                <span className={`text-xl font-bold ${st.color}`}>{st.label}</span>
              </div>
              <div className="grid gap-3">
                {[
                  ['Nomor Daftar', result.nomor_daftar],
                  ['Nama Siswa', result.nama_siswa],
                  ['Jenjang', result.jenjang],
                  ['Gelombang', result.gelombang],
                  ['Tanggal Submit', result.submitted_at || '-'],
                  ['Tanggal Review', result.reviewed_at || '-'],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between py-2 border-b border-border-default dark:border-dark-border-default">
                    <span className="text-text-secondary dark:text-dark-text-secondary text-[0.88rem]">{label}</span>
                    <span className="font-semibold text-[0.88rem]">{val}</span>
                  </div>
                ))}
              </div>
              {result.catatan && (
                <div className="mt-4 p-3 rounded-sm text-sm bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] text-status-ditolak">
                  <strong>Catatan:</strong> {result.catatan}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
