import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertCircle, CheckCircle2, Clock, FileText, XCircle } from 'lucide-react';
import api from '../services/api';
import GeometricPattern from '../components/GeometricPattern';
import { STATUS_CONFIG, STATUS_BADGE_STYLE } from '../lib/constants';

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
      setError(
        err.response?.status === 404
          ? 'Nomor pendaftaran tidak ditemukan. Periksa kembali nomor yang Anda masukkan.'
          : err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.'
      );
    } finally { setLoading(false); }
  };

  const statusCfg = result ? STATUS_CONFIG[result.status] : null;
  const badgeStyle = result ? STATUS_BADGE_STYLE[result.status] : null;

  return (
    <div className="min-h-screen pt-[90px] pb-12 relative overflow-hidden
                    flex flex-col items-center justify-start px-4"
      style={{ paddingTop: 'calc(90px + 2rem)' }}>
      <div className="absolute -top-[100px] -right-[100px] z-0">
        <GeometricPattern size={400} opacity={0.03} />
      </div>

      <div className="w-full max-w-[520px] relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4
                          bg-accent-bg dark:bg-dark-accent-bg
                          border border-border-default dark:border-dark-border-default">
            <Search size={26} className="text-accent dark:text-dark-accent" />
          </div>
          <h1 className="text-[1.8rem] font-heading mb-1">
            Cek <span className="text-accent dark:text-dark-accent">Status</span> Pendaftaran
          </h1>
          <p className="text-text-muted dark:text-dark-text-muted text-[0.9rem]">
            Masukkan nomor pendaftaran untuk melihat status terkini
          </p>
        </motion.div>

        {/* Form Card */}
        <div className="glass-card p-6 mb-6">
          <form onSubmit={handleSubmit}>
            <label className="block text-[0.88rem] font-semibold text-text-secondary dark:text-dark-text-secondary mb-2">
              Nomor Pendaftaran
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                className="form-input flex-1 font-mono tracking-wide"
                placeholder="Contoh: PPDB-SD-2026-2-0001"
                value={nomorDaftar}
                onChange={(e) => setNomorDaftar(e.target.value.toUpperCase())}
              />
              <button
                type="submit"
                disabled={loading || !nomorDaftar.trim()}
                className="btn btn-primary shrink-0 px-4"
              >
                {loading ? <div className="loading-spinner w-5 h-5" /> : <Search size={18} />}
              </button>
            </div>
          </form>
        </div>

        {/* Loading Skeleton */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="glass-card p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="animate-pulse bg-bg-tertiary dark:bg-dark-bg-tertiary rounded-full h-6 w-32" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i}>
                    <div className="animate-pulse bg-bg-tertiary dark:bg-dark-bg-tertiary rounded h-3 w-20 mb-1" />
                    <div className="animate-pulse bg-bg-tertiary dark:bg-dark-bg-tertiary rounded h-5 w-28" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && !loading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-6 p-4 rounded-lg flex items-start gap-3"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
              }}>
              <AlertCircle size={18} className="text-status-ditolak shrink-0 mt-0.5" />
              <p className="text-[0.88rem] text-status-ditolak">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hasil ditemukan */}
        <AnimatePresence>
          {result && !loading && statusCfg && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-6 p-6 rounded-xl
                         bg-surface-card dark:bg-dark-surface-card
                         border border-border-default dark:border-dark-border-default"
              style={{
                borderLeft: `4px solid ${statusCfg.color}`,
                boxShadow: `0 0 0 1px ${statusCfg.color}20`,
              }}>
              {/* Badge status */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.75rem] font-bold"
                  style={badgeStyle || {}}>
                  <span className="text-[0.6rem]">●</span>
                  {statusCfg.label}
                </span>
              </div>

              {/* Info ringkas */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Nama Calon Siswa', value: result.nama_siswa },
                  { label: 'Jenjang', value: result.jenjang },
                  { label: 'Nomor Daftar', value: result.nomor_daftar },
                  { label: 'Gelombang', value: result.gelombang },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-[0.7rem] text-text-muted dark:text-dark-text-muted font-bold uppercase tracking-wide mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-[0.9rem] font-semibold text-text-primary dark:text-dark-text-primary">
                      {item.value || '—'}
                    </p>
                  </div>
                ))}
              </div>

              {/* Catatan */}
              {result.catatan && (
                <div className="mt-4 p-3 rounded-md text-sm"
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    color: '#EF4444',
                  }}>
                  <strong>Catatan:</strong> {result.catatan}
                </div>
              )}

              {/* CTA login */}
              <div className="mt-5 pt-4 border-t border-border-subtle dark:border-dark-border-subtle text-center">
                <p className="text-[0.82rem] text-text-muted dark:text-dark-text-muted mb-2">
                  Ingin melihat detail lengkap & dokumen?
                </p>
                <Link to="/login" className="btn btn-secondary btn-sm text-[0.85rem]">
                  Masuk ke Akun Anda
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info link — selalu tampil */}
        <div className="p-5 rounded-xl flex flex-col gap-3
                        bg-surface-card dark:bg-dark-surface-card
                        border border-border-subtle dark:border-dark-border-subtle">
          <div className="flex justify-between items-center">
            <p className="text-[0.85rem] text-text-secondary dark:text-dark-text-secondary">
              Belum punya nomor pendaftaran?
            </p>
            <Link to="/daftar" className="text-[0.85rem] font-semibold text-accent dark:text-dark-accent no-underline">
              Daftar Sekarang →
            </Link>
          </div>
          <div className="h-px bg-border-subtle dark:bg-dark-border-subtle" />
          <div className="flex justify-between items-center">
            <p className="text-[0.85rem] text-text-secondary dark:text-dark-text-secondary">
              Sudah punya akun?
            </p>
            <Link to="/login" className="text-[0.85rem] font-semibold text-accent dark:text-dark-accent no-underline">
              Masuk →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
