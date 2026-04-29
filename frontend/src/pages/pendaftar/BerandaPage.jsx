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

/* ===== Status Config — uses CSS variable tokens ===== */
const statusConfig = {
  DRAFT: {
    label: 'Belum Selesai',
    color: 'var(--status-draft)',
    bg: 'color-mix(in srgb, var(--status-draft) 10%, transparent)',
    border: 'color-mix(in srgb, var(--status-draft) 25%, transparent)',
    icon: FileText,
    cta: 'Lanjutkan Isi Formulir',
    ctaAction: 'navigate',
    ctaPath: '/formulir/data-siswa',
    desc: 'Formulir pendaftaran belum selesai diisi. Silakan lengkapi semua data yang diperlukan.',
  },
  SUBMITTED: {
    label: 'Menunggu Verifikasi',
    color: 'var(--status-submitted)',
    bg: 'color-mix(in srgb, var(--status-submitted) 10%, transparent)',
    border: 'color-mix(in srgb, var(--status-submitted) 25%, transparent)',
    icon: Clock,
    cta: 'Lihat Detail Formulir',
    ctaAction: 'navigate',
    ctaPath: '/formulir/review',
    desc: 'Pendaftaran Anda sudah dikirim dan sedang menunggu verifikasi oleh panitia.',
  },
  MENUNGGU_REVIEW: {
    label: 'Sedang Diproses',
    color: 'var(--status-review)',
    bg: 'color-mix(in srgb, var(--status-review) 10%, transparent)',
    border: 'color-mix(in srgb, var(--status-review) 25%, transparent)',
    icon: Clock,
    cta: 'Lihat Detail Formulir',
    ctaAction: 'navigate',
    ctaPath: '/formulir/review',
    desc: 'Berkas pendaftaran sedang diperiksa oleh panitia. Mohon bersabar menunggu hasil review.',
  },
  REVISI: {
    label: 'Perlu Revisi Dokumen',
    color: 'var(--status-revisi)',
    bg: 'color-mix(in srgb, var(--status-revisi) 10%, transparent)',
    border: 'color-mix(in srgb, var(--status-revisi) 25%, transparent)',
    icon: AlertCircle,
    cta: 'Perbaiki Dokumen Sekarang',
    ctaAction: 'navigate',
    ctaPath: '/formulir/dokumen',
    desc: 'Ada dokumen yang perlu diperbaiki. Silakan upload ulang dokumen yang ditandai.',
  },
  DITERIMA: {
    label: 'Diterima! 🎉',
    color: 'var(--status-diterima)',
    bg: 'color-mix(in srgb, var(--status-diterima) 10%, transparent)',
    border: 'color-mix(in srgb, var(--status-diterima) 25%, transparent)',
    icon: CheckCircle2,
    cta: 'Lanjutkan ke Pembayaran →',
    ctaAction: 'navigate',
    ctaPath: '/pembayaran',
    desc: 'Selamat! Pendaftaran Anda diterima. Segera lakukan pembayaran untuk menyelesaikan proses.',
  },
  DITOLAK: {
    label: 'Tidak Diterima',
    color: 'var(--status-ditolak)',
    bg: 'color-mix(in srgb, var(--status-ditolak) 10%, transparent)',
    border: 'color-mix(in srgb, var(--status-ditolak) 25%, transparent)',
    icon: XCircle,
    cta: 'Lihat Alasan Penolakan',
    ctaAction: 'accordion',
    ctaPath: null,
    desc: 'Mohon maaf, pendaftaran Anda tidak diterima pada gelombang ini.',
  },
  MENUNGGU_BAYAR: {
    label: 'Menunggu Pembayaran',
    color: 'var(--status-bayar)',
    bg: 'color-mix(in srgb, var(--status-bayar) 10%, transparent)',
    border: 'color-mix(in srgb, var(--status-bayar) 25%, transparent)',
    icon: CreditCard,
    cta: 'Selesaikan Pembayaran',
    ctaAction: 'navigate',
    ctaPath: '/pembayaran',
    desc: 'Segera selesaikan pembayaran biaya pendaftaran sebelum batas waktu.',
  },
  TERDAFTAR: {
    label: 'Terdaftar ✓',
    color: 'var(--status-terdaftar)',
    bg: 'color-mix(in srgb, var(--status-terdaftar) 10%, transparent)',
    border: 'color-mix(in srgb, var(--status-terdaftar) 25%, transparent)',
    icon: CheckCircle2,
    cta: 'Unduh Bukti Pendaftaran',
    ctaAction: 'download',
    ctaPath: null,
    desc: 'Selamat! Anda telah resmi terdaftar sebagai peserta didik baru.',
  },
  EXPIRED: {
    label: 'Pembayaran Kadaluarsa',
    color: 'var(--status-expired)',
    bg: 'color-mix(in srgb, var(--status-expired) 10%, transparent)',
    border: 'color-mix(in srgb, var(--status-expired) 25%, transparent)',
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
    case 'TERDAFTAR': return 4;
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
      <div style={{ minHeight: '100vh', paddingTop: '85px', paddingBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <BerandaSkeleton />
        </div>
      </div>
    );
  }

  const pendaftaran = data?.pendaftaran;
  const st = pendaftaran ? statusConfig[pendaftaran.status] : null;
  const activeStep = pendaftaran ? getActiveStep(pendaftaran.status) : -1;
  const isFinalStatus = pendaftaran && ['TERDAFTAR', 'DITOLAK', 'EXPIRED'].includes(pendaftaran.status);

  return (
    <div style={{ minHeight: '100vh', paddingTop: '85px', paddingBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', zIndex: 0 }}>
        <GeometricPattern size={350} opacity={0.03} />
      </div>

      <div className="container" style={{ maxWidth: '640px', position: 'relative', zIndex: 1 }}>
        {/* Header greeting */}
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
            Assalamu'alaikum, <span style={{ color: 'var(--accent-primary)' }}>{user?.nama_lengkap?.split(' ')[0]}</span> 👋
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ padding: '0.2rem 0.6rem', borderRadius: '50px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
              <GraduationCap size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.25rem' }} />
              {user?.jenjang_daftar}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>PPDB Online</span>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--status-ditolak) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--status-ditolak) 30%, transparent)', color: 'var(--status-ditolak)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
            <AlertCircle size={16} />{error}
          </div>
        )}

        {/* EMPTY STATE — belum ada pendaftaran */}
        {!pendaftaran && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(201,168,76,0.1)', border: '2px dashed rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <Plus size={32} color="var(--accent-primary)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Belum Ada Pendaftaran</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem', lineHeight: 1.7, maxWidth: '380px', margin: '0 auto 1.75rem' }}>
              Mulai proses pendaftaran untuk jenjang <strong style={{ color: 'var(--accent-primary)' }}>{user?.jenjang_daftar}</strong>. Siapkan dokumen yang diperlukan sebelum mengisi formulir.
            </p>
            <button onClick={handleMulaiPendaftaran} disabled={creating} className="btn btn-primary btn-lg" style={{ opacity: creating ? 0.7 : 1 }}>
              {creating ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />Memproses...</> : <><Plus size={18} />Mulai Pendaftaran</>}
            </button>
          </motion.div>
        )}

        {/* ACTIVE STATE — ada pendaftaran */}
        {pendaftaran && st && (
          <>
            {/* Kartu Status Tunggal */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static" style={{ padding: '2rem', marginBottom: '1.25rem', border: `1.5px solid ${st.border}` }}>
              {/* Status badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: st.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <st.icon size={24} color={st.color} />
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: st.color }}>{st.label}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {pendaftaran.nomor_daftar}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>{st.desc}</p>

              {/* Catatan panitia for REVISI */}
              {pendaftaran.catatan_panitia && pendaftaran.status === 'REVISI' && (
                <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: st.bg, border: `1px solid ${st.border}`, marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                  <strong style={{ color: st.color }}>Catatan Panitia:</strong>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem' }}>{pendaftaran.catatan_panitia}</p>
                </div>
              )}

              {/* Single CTA */}
              {st.cta && (
                <button
                  onClick={() => handleCTA(st)}
                  className={st.ctaAction === 'download' ? 'btn btn-primary' : 'btn btn-primary'}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {st.ctaAction === 'download' && <Download size={18} />}
                  {st.cta}
                  {st.ctaAction === 'navigate' && <ArrowRight size={18} />}
                  {st.ctaAction === 'accordion' && (showAlasan ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
                </button>
              )}

              {/* Accordion: Alasan penolakan */}
              <AnimatePresence>
                {showAlasan && pendaftaran.status === 'DITOLAK' && pendaftaran.catatan_panitia && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginTop: '1rem' }}>
                    <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: st.bg, border: `1px solid ${st.border}`, fontSize: '0.88rem' }}>
                      <strong style={{ color: st.color, fontSize: '0.82rem' }}>Alasan Penolakan:</strong>
                      <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.7 }}>{pendaftaran.catatan_panitia}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Timeline Stepper */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static" style={{ padding: '1.5rem', marginBottom: '1.25rem', overflowX: 'auto' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Progress Pendaftaran</h4>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '350px' }}>
                {timelineSteps.map((step, i) => {
                  const isDone = i < activeStep;
                  const isActive = i === activeStep;
                  const isFailed = ['DITOLAK', 'EXPIRED'].includes(pendaftaran.status) && i === activeStep;
                  return (
                    <div key={step.key} style={{ display: 'flex', alignItems: 'center', flex: i < timelineSteps.length - 1 ? 1 : 'none' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700,
                          background: isDone ? 'var(--accent-primary)' : isActive ? 'transparent' : 'var(--bg-tertiary)',
                          color: isDone ? 'var(--bg-primary)' : isActive ? (isFailed ? 'var(--status-ditolak)' : 'var(--accent-primary)') : 'var(--text-muted)',
                          border: isActive ? `2px solid ${isFailed ? 'var(--status-ditolak)' : 'var(--accent-primary)'}` : isDone ? 'none' : '1px solid var(--border-default)',
                          animation: isActive && !isFailed ? 'pulse-primary 2s ease-in-out infinite' : 'none',
                        }}>
                          {isDone ? <CheckCircle2 size={14} /> : i + 1}
                        </div>
                        <span style={{ fontSize: '0.6rem', fontWeight: isDone || isActive ? 600 : 400, color: isDone ? 'var(--accent-primary)' : isActive ? (isFailed ? 'var(--status-ditolak)' : 'var(--accent-primary)') : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {step.label}
                        </span>
                      </div>
                      {i < timelineSteps.length - 1 && (
                        <div style={{ flex: 1, height: '2px', background: isDone ? 'var(--accent-primary)' : 'var(--border-default)', margin: '0 0.35rem', marginBottom: '1.25rem', borderRadius: '1px', transition: 'background 0.3s' }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Info Panel — grid card style */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {[
                [Hash, 'Nomor Daftar', pendaftaran.nomor_daftar],
                [GraduationCap, 'Jenjang', pendaftaran.jenjang],
                [CalendarDays, 'Gelombang', pendaftaran.gelombang?.nama?.replace(/Gelombang \d+ - /, '') || '-'],
                [Clock, 'Tanggal Submit', pendaftaran.submitted_at ? new Date(pendaftaran.submitted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Belum'],
              ].map(([Icon, label, value]) => (
                <div key={label} className="glass-card-static" style={{ padding: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={15} color="var(--accent-primary)" />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Notifikasi Terakhir */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card-static" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Bell size={14} /> Notifikasi Terbaru
              </h4>
              {notifikasi.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {notifikasi.map(n => (
                    <div key={n.id} style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: n.is_read ? 'transparent' : 'color-mix(in srgb, var(--accent-primary) 5%, transparent)', border: `1px solid ${n.is_read ? 'var(--glass-border)' : 'color-mix(in srgb, var(--accent-primary) 15%, transparent)'}`, display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <Bell size={13} color={n.tipe === 'sukses' ? 'var(--status-diterima)' : n.tipe === 'peringatan' ? 'var(--status-revisi)' : 'var(--accent-primary)'} style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.15rem' }}>{n.judul}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.pesan}</div>
                      </div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>{new Date(n.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                  Belum ada notifikasi
                </div>
              )}
            </motion.div>

            {/* Extra sections for final statuses / Contact Panitia */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card-static" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Phone size={14} /> Kontak Panitia
              </h4>
              <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>WhatsApp</span>
                  <span style={{ fontWeight: 500 }}>0812-3456-7890</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Email</span>
                  <span style={{ fontWeight: 500 }}>ppdb@alistiqomah.sch.id</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Jam Layanan</span>
                  <span style={{ fontWeight: 500 }}>08:00 - 16:00 WIB</span>
                </div>
              </div>
            </motion.div>

            {/* Butuh Bantuan Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ marginTop: '2rem', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <span style={{ width: '30px', height: '1px', background: 'var(--border-default)' }} />
                Butuh Bantuan?
                <span style={{ width: '30px', height: '1px', background: 'var(--border-default)' }} />
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Silakan hubungi <a href="/kontak" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Panitia PPDB</a> untuk pertanyaan lebih lanjut.
              </p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
