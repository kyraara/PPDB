import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Clock, AlertCircle, CheckCircle2, XCircle,
  CreditCard, Download, ArrowRight, Plus, CalendarDays,
  GraduationCap, Hash, Loader2, ChevronDown, ChevronUp,
  Bell, Phone
} from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import api from '../../services/api';
import GeometricPattern from '../../components/GeometricPattern';
import { BerandaSkeleton } from '../../components/SkeletonLoader';

/* ===== Status Config — uses Tailwind utility classes ===== */
const statusConfig = {
  DRAFT: {
    label: 'Belum Selesai',
    color: 'text-status-draft',
    bg: 'bg-status-draft/10',
    border: 'border-status-draft/25',
    borderLeft: 'border-l-[4px] border-l-status-draft',
    ring: 'ring-1 ring-status-draft/20',
    icon: FileText,
    cta: 'Lanjutkan Isi Formulir',
    ctaAction: 'navigate',
    ctaPath: '/formulir/data-siswa',
    desc: 'Formulir pendaftaran belum selesai diisi. Silakan lengkapi semua data yang diperlukan.',
  },
  SUBMITTED: {
    label: 'Menunggu Verifikasi',
    color: 'text-status-submitted',
    bg: 'bg-status-submitted/10',
    border: 'border-status-submitted/25',
    borderLeft: 'border-l-[4px] border-l-status-submitted',
    ring: 'ring-1 ring-status-submitted/20',
    icon: Clock,
    cta: 'Lihat Detail Formulir',
    ctaAction: 'navigate',
    ctaPath: '/formulir/review',
    desc: 'Pendaftaran Anda sudah dikirim dan sedang menunggu verifikasi oleh panitia.',
  },
  MENUNGGU_REVIEW: {
    label: 'Sedang Diproses',
    color: 'text-status-review',
    bg: 'bg-status-review/10',
    border: 'border-status-review/25',
    borderLeft: 'border-l-[4px] border-l-status-review',
    ring: 'ring-1 ring-status-review/20',
    icon: Clock,
    cta: 'Lihat Detail Formulir',
    ctaAction: 'navigate',
    ctaPath: '/formulir/review',
    desc: 'Berkas pendaftaran sedang diperiksa oleh panitia. Mohon bersabar menunggu hasil review.',
  },
  REVISI: {
    label: 'Perlu Revisi Dokumen',
    color: 'text-status-revisi',
    bg: 'bg-status-revisi/10',
    border: 'border-status-revisi/25',
    borderLeft: 'border-l-[4px] border-l-status-revisi',
    ring: 'ring-1 ring-status-revisi/20',
    icon: AlertCircle,
    cta: 'Perbaiki Dokumen Sekarang',
    ctaAction: 'navigate',
    ctaPath: '/formulir/dokumen',
    desc: 'Ada dokumen yang perlu diperbaiki. Silakan upload ulang dokumen yang ditandai.',
  },
  DITERIMA: {
    label: 'Diterima! 🎉',
    color: 'text-status-diterima',
    bg: 'bg-status-diterima/10',
    border: 'border-status-diterima/25',
    borderLeft: 'border-l-[4px] border-l-status-diterima',
    ring: 'ring-1 ring-status-diterima/20',
    icon: CheckCircle2,
    cta: 'Lanjutkan ke Pembayaran →',
    ctaAction: 'navigate',
    ctaPath: '/pembayaran',
    desc: 'Selamat! Pendaftaran Anda diterima. Segera lakukan pembayaran untuk menyelesaikan proses.',
  },
  DITOLAK: {
    label: 'Tidak Diterima',
    color: 'text-status-ditolak',
    bg: 'bg-status-ditolak/10',
    border: 'border-status-ditolak/25',
    borderLeft: 'border-l-[4px] border-l-status-ditolak',
    ring: 'ring-1 ring-status-ditolak/20',
    icon: XCircle,
    cta: 'Lihat Alasan Penolakan',
    ctaAction: 'accordion',
    ctaPath: null,
    desc: 'Mohon maaf, pendaftaran Anda tidak diterima pada gelombang ini.',
  },
  MENUNGGU_BAYAR: {
    label: 'Menunggu Pembayaran',
    color: 'text-status-bayar',
    bg: 'bg-status-bayar/10',
    border: 'border-status-bayar/25',
    borderLeft: 'border-l-[4px] border-l-status-bayar',
    ring: 'ring-1 ring-status-bayar/20',
    icon: CreditCard,
    cta: 'Selesaikan Pembayaran',
    ctaAction: 'navigate',
    ctaPath: '/pembayaran',
    desc: 'Segera selesaikan pembayaran biaya pendaftaran sebelum batas waktu.',
  },
  TERDAFTAR: {
    label: 'Terdaftar ✓',
    color: 'text-status-terdaftar',
    bg: 'bg-status-terdaftar/10',
    border: 'border-status-terdaftar/25',
    borderLeft: 'border-l-[4px] border-l-status-terdaftar',
    ring: 'ring-1 ring-status-terdaftar/20',
    icon: CheckCircle2,
    cta: 'Unduh Bukti Pendaftaran',
    ctaAction: 'download',
    ctaPath: null,
    desc: 'Selamat! Anda telah resmi terdaftar sebagai peserta didik baru.',
  },
  EXPIRED: {
    label: 'Pembayaran Kadaluarsa',
    color: 'text-status-expired',
    bg: 'bg-status-expired/10',
    border: 'border-status-expired/25',
    borderLeft: 'border-l-[4px] border-l-status-expired',
    ring: 'ring-1 ring-status-expired/20',
    icon: XCircle,
    cta: 'Hubungi Panitia',
    ctaAction: 'navigate',
    ctaPath: '/kontak',
    desc: 'Batas waktu pembayaran telah lewat. Hubungi panitia untuk informasi lebih lanjut.',
  },
};

const timelineSteps = [
  { key: 'daftar', label: 'Daftar' },
  { key: 'formulir', label: 'Formulir' },
  { key: 'verifikasi', label: 'Verifikasi' },
  { key: 'bayar', label: 'Bayar' },
  { key: 'selesai', label: 'Terdaftar' },
];

function getActiveStep(status) {
  switch (status) {
    case 'DRAFT': return 1;
    case 'SUBMITTED': case 'MENUNGGU_REVIEW': case 'REVISI': return 2;
    case 'DITERIMA': case 'DITOLAK': return 3;
    case 'MENUNGGU_BAYAR': return 3;
    case 'TERDAFTAR': return 5; // Full hijau
    case 'EXPIRED': return 3;
    default: return 0;
  }
}

export default function BerandaPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [showAlasan, setShowAlasan] = useState(false);
  const [notifikasi, setNotifikasi] = useState([]);

  const fetchData = async () => {
    try {
      const [pendRes, notifRes] = await Promise.allSettled([
        api.get('/pendaftaran/saya'),
        api.get('/notifikasi?limit=3'),
      ]);
      if (pendRes.status === 'fulfilled') setData(pendRes.value.data.data);
      if (notifRes.status === 'fulfilled') setNotifikasi(notifRes.value.data.data || []);
    } catch (err) {
      setError('Gagal memuat data. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleMulaiPendaftaran = async () => {
    setCreating(true);
    setError('');
    try {
      const res = await api.post('/pendaftaran');
      if (res.data.success) {
        await fetchData();
        navigate('/formulir/data-siswa');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat pendaftaran.');
    } finally {
      setCreating(false);
    }
  };

  const handleCTA = async (st) => {
    if (st.ctaAction === 'navigate' && st.ctaPath) {
      navigate(st.ctaPath);
    } else if (st.ctaAction === 'accordion') {
      setShowAlasan(prev => !prev);
    } else if (st.ctaAction === 'download') {
      try {
        const response = await api.get(`/pendaftaran/${pendaftaran.id}/bukti`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Bukti_Pendaftaran_${pendaftaran.nomor_daftar}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } catch (err) {
        setError('Gagal mengunduh bukti pendaftaran.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-[85px] pb-8 relative overflow-hidden">
        <div className="container max-w-[640px]"><BerandaSkeleton /></div>
      </div>
    );
  }

  const pendaftaran = data?.pendaftaran;
  const st = pendaftaran ? statusConfig[pendaftaran.status] : null;
  const activeStep = pendaftaran ? getActiveStep(pendaftaran.status) : -1;
  const isFinalStatus = pendaftaran && ['TERDAFTAR', 'DITOLAK', 'EXPIRED'].includes(pendaftaran.status);

  return (
    <div className="min-h-screen pt-[85px] pb-8 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 z-0">
        <GeometricPattern size={350} opacity={0.03} />
      </div>

      <div className="container max-w-[640px] relative z-10">
        {/* Header greeting */}
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
          <h2 className="text-2xl mb-1">
            Assalamu'alaikum, <span className="text-accent dark:text-dark-accent">{user?.nama_lengkap?.split(' ')[0]}</span> 👋
          </h2>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold
                             bg-accent-bg dark:bg-dark-accent-bg border border-accent-bg-strong dark:border-dark-accent-bg-strong
                             text-accent dark:text-dark-accent">
              <GraduationCap size={12} className="inline align-middle mr-1" />
              {user?.jenjang_daftar}
            </span>
            <span className="text-text-muted dark:text-dark-text-muted text-sm">PPDB Online</span>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3 mb-5 rounded-md text-[0.88rem] text-status-ditolak bg-status-ditolak/10 border border-status-ditolak/30">
            <AlertCircle size={16} />{error}
          </div>
        )}

        {/* EMPTY STATE */}
        {!pendaftaran && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card-static py-12 px-8 text-center">
            <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center mx-auto mb-5
                            bg-accent-bg dark:bg-dark-accent-bg border-2 border-dashed border-accent-bg-strong dark:border-dark-accent-bg-strong">
              <Plus size={32} className="text-accent dark:text-dark-accent" />
            </div>
            <h3 className="text-xl mb-2">Belum Ada Pendaftaran</h3>
            <p className="text-text-secondary dark:text-dark-text-secondary text-sm mb-7 leading-relaxed max-w-[380px] mx-auto">
              Mulai proses pendaftaran untuk jenjang <strong className="text-accent dark:text-dark-accent">{user?.jenjang_daftar}</strong>. Siapkan dokumen yang diperlukan sebelum mengisi formulir.
            </p>
            <button onClick={handleMulaiPendaftaran} disabled={creating}
              className={`btn btn-primary btn-lg justify-center w-full sm:w-auto ${creating ? 'opacity-70' : ''}`}>
              {creating ? <><Loader2 size={18} className="animate-spin" />Memproses...</> : <><Plus size={18} />Mulai Pendaftaran</>}
            </button>
          </motion.div>
        )}

        {/* ACTIVE STATE */}
        {pendaftaran && st && (
          <>
            {/* Kartu Status */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className={`glass-card-static p-6 md:p-8 mb-5 border-[1.5px] ${st.border} ${st.borderLeft} ${st.ring} shadow-card`}>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 ${st.bg}`}>
                  <st.icon size={24} className={st.color} />
                </div>
                <div>
                  <div className={`text-xl font-bold font-heading ${st.color}`}>{st.label}</div>
                  <div className="text-[0.78rem] text-text-muted dark:text-dark-text-muted">{pendaftaran.nomor_daftar}</div>
                </div>
              </div>

              <p className="text-text-secondary dark:text-dark-text-secondary text-sm leading-relaxed mb-6">{st.desc}</p>

              {pendaftaran.catatan_panitia && pendaftaran.status === 'REVISI' && (
                <div className={`p-3 rounded-sm mb-6 text-sm ${st.bg} border border-solid ${st.border}`}>
                  <strong className={st.color}>Catatan Panitia:</strong>
                  <p className="text-text-secondary dark:text-dark-text-secondary mt-1">{pendaftaran.catatan_panitia}</p>
                </div>
              )}

              {st.cta && (
                <button onClick={() => handleCTA(st)} className="btn btn-primary w-full justify-center">
                  {st.ctaAction === 'download' && <Download size={18} />}
                  {st.cta}
                  {st.ctaAction === 'navigate' && <ArrowRight size={18} />}
                  {st.ctaAction === 'accordion' && (showAlasan ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
                </button>
              )}

              <AnimatePresence>
                {showAlasan && pendaftaran.status === 'DITOLAK' && pendaftaran.catatan_panitia && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-4">
                    <div className={`p-4 rounded-sm text-[0.88rem] ${st.bg} border border-solid ${st.border}`}>
                      <strong className={`text-sm ${st.color}`}>Alasan Penolakan:</strong>
                      <p className="text-text-secondary dark:text-dark-text-secondary mt-2 leading-relaxed">{pendaftaran.catatan_panitia}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Timeline Stepper */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="glass-card-static p-5 md:p-6 mb-5 overflow-x-auto">
              <h4 className="text-sm font-semibold uppercase tracking-wide mb-5
                             text-text-muted dark:text-dark-text-muted">Progress Pendaftaran</h4>
              <div className="flex items-center justify-between min-w-[350px]">
                {timelineSteps.map((step, i) => {
                  const isDone = i < activeStep;
                  const isActive = i === activeStep;
                  const isFailed = ['DITOLAK', 'EXPIRED'].includes(pendaftaran.status) && i === activeStep;
                  return (
                    <div key={step.key} className={`flex items-center ${i < timelineSteps.length - 1 ? 'flex-1' : ''}`}>
                      <div className="flex flex-col items-center gap-1">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[0.7rem] font-bold transition-all
                            ${isDone ? 'bg-accent text-bg-primary border-none' : isActive ? 'bg-transparent' : 'bg-bg-tertiary text-text-muted border border-border-default'}
                            ${isActive ? (isFailed ? 'border-2 border-status-ditolak text-status-ditolak' : 'border-2 border-accent text-accent animate-pulse-primary') : ''}
                          `}>
                          {isDone ? <CheckCircle2 size={14} /> : i + 1}
                        </div>
                        <span className={`text-[0.6rem] whitespace-nowrap ${isDone || isActive ? 'font-semibold' : 'font-normal'} ${isDone ? 'text-accent' : isActive ? (isFailed ? 'text-status-ditolak' : 'text-accent') : 'text-text-muted'}`}>
                          {step.label}
                        </span>
                      </div>
                      {i < timelineSteps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1.5 mb-5 rounded-sm transition-colors duration-300 ${isDone ? 'bg-accent' : 'bg-border-default'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Info Panel */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-3 mb-5">
              {[
                [Hash, 'Nomor Daftar', pendaftaran.nomor_daftar],
                [GraduationCap, 'Jenjang', pendaftaran.jenjang],
                [CalendarDays, 'Gelombang', pendaftaran.gelombang?.nama?.replace(/Gelombang \d+ - /, '') || '-'],
                [Clock, 'Tanggal Submit', pendaftaran.submitted_at ? new Date(pendaftaran.submitted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Belum'],
              ].map(([Icon, label, value]) => (
                <div key={label} className="glass-card-static p-3 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                                  bg-accent-bg dark:bg-dark-accent-bg">
                    <Icon size={15} className="text-accent dark:text-dark-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[0.68rem] text-text-muted dark:text-dark-text-muted uppercase tracking-wide">{label}</div>
                    <div className="text-sm font-semibold truncate">{value}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Notifikasi Terakhir */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="glass-card-static p-5 mb-5">
              <h4 className="text-sm font-semibold uppercase tracking-wide mb-3 flex items-center gap-1
                             text-text-muted dark:text-dark-text-muted">
                <Bell size={14} /> Notifikasi Terbaru
              </h4>
              {notifikasi.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {notifikasi.map(n => {
                    const typeColor = n.tipe === 'sukses' ? 'text-status-diterima' : n.tipe === 'peringatan' ? 'text-status-revisi' : 'text-accent';
                    return (
                      <div key={n.id} className={`flex gap-2 items-start p-2.5 rounded-sm border ${n.is_read ? 'bg-transparent border-border-default' : 'bg-accent/5 border-accent/15'}`}>
                        <Bell size={13} className={`shrink-0 mt-0.5 ${typeColor}`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold mb-0.5">{n.judul}</div>
                          <div className="text-xs text-text-muted dark:text-dark-text-muted truncate">{n.pesan}</div>
                        </div>
                        <span className="text-[0.65rem] text-text-muted dark:text-dark-text-muted whitespace-nowrap shrink-0">
                          {new Date(n.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-sm text-text-muted dark:text-dark-text-muted text-center py-4">Belum ada notifikasi</div>
              )}
            </motion.div>

            {/* Kontak Panitia */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="glass-card-static p-5">
              <h4 className="text-sm font-semibold uppercase tracking-wide mb-3 flex items-center gap-1
                             text-text-muted dark:text-dark-text-muted">
                <Phone size={14} /> Kontak Panitia
              </h4>
              <div className="grid gap-2 text-sm">
                {[
                  ['WhatsApp', '0812-3456-7890'],
                  ['Email', 'ppdb@alistiqomah.sch.id'],
                  ['Jam Layanan', '08:00 - 16:00 WIB'],
                ].map(([label, value], i) => (
                  <div key={label} className={`flex justify-between py-1.5 ${i < 2 ? 'border-b border-border-default dark:border-dark-border-default' : ''}`}>
                    <span className="text-text-muted dark:text-dark-text-muted">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Butuh Bantuan */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 text-text-muted dark:text-dark-text-muted text-sm">
                <span className="w-[30px] h-px bg-border-default dark:bg-dark-border-default" />
                Butuh Bantuan?
                <span className="w-[30px] h-px bg-border-default dark:bg-dark-border-default" />
              </div>
              <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-2">
                Silakan hubungi <Link to="/kontak" className="text-accent dark:text-dark-accent font-semibold hover:underline">Panitia PPDB</Link> untuk pertanyaan lebih lanjut.
              </p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
