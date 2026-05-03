import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCard, Clock, AlertCircle, CheckCircle2, ArrowLeft,
  Banknote, Shield, Timer, Loader2, Zap, GraduationCap,
  Hash, CalendarDays, User, Wallet, QrCode, Building2
} from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import api from '../../services/api';
import GeometricPattern from '../../components/GeometricPattern';
import { PembayaranSkeleton } from '../../components/SkeletonLoader';

export default function PembayaranPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initiating, setInitiating] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(null);
  const timerRef = useRef(null);
  const snapLoaded = useRef(false);

  // Load Midtrans Snap JS
  useEffect(() => {
    if (snapLoaded.current) return;
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '');
    script.async = true;
    script.onload = () => { snapLoaded.current = true; };
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  const fetchInfo = async () => {
    try {
      const pendRes = await api.get('/pendaftaran/saya');
      const pendaftaran = pendRes.data.data?.pendaftaran;
      if (!pendaftaran || !['DITERIMA', 'MENUNGGU_BAYAR', 'TERDAFTAR'].includes(pendaftaran.status)) {
        navigate('/beranda'); return;
      }
      if (pendaftaran.status === 'TERDAFTAR') {
        navigate('/pembayaran/konfirmasi'); return;
      }
      const infoRes = await api.get(`/pembayaran/${pendaftaran.id}/info`);
      setData(infoRes.data.data);
    } catch { setError('Gagal memuat data pembayaran.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchInfo(); }, []);

  useEffect(() => {
    const pembayaran = data?.pendaftaran?.pembayaran;
    if (!pembayaran?.expired_at || pembayaran.status !== 'PENDING') return;
    const update = () => {
      const diff = new Date(pembayaran.expired_at).getTime() - Date.now();
      if (diff <= 0) { setCountdown({ h: 0, m: 0, s: 0, expired: true }); return; }
      setCountdown({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
        expired: false,
      });
    };
    update();
    timerRef.current = setInterval(update, 1000);
    return () => clearInterval(timerRef.current);
  }, [data]);

  const handleInitiate = async () => {
    setInitiating(true); setError('');
    try {
      const res = await api.post(`/pembayaran/${data.pendaftaran.id}/initiate`);
      if (res.data.success) {
        // If sandbox mode and snap_token returned, open Snap immediately
        const snapToken = res.data.snap_token;
        if (snapToken && window.snap) {
          openSnap(snapToken);
        }
        await fetchInfo();
      }
    } catch (err) { setError(err.response?.data?.message || 'Gagal membuat pembayaran.'); }
    finally { setInitiating(false); }
  };

  const handlePaySnap = () => {
    const pembayaran = data?.pendaftaran?.pembayaran;
    if (!pembayaran?.snap_token) {
      setError('Token pembayaran tidak tersedia. Coba muat ulang halaman.');
      return;
    }
    openSnap(pembayaran.snap_token);
  };

  const openSnap = (token) => {
    if (!window.snap) {
      setError('Midtrans Snap belum siap. Coba muat ulang halaman.');
      return;
    }
    setPaying(true);
    window.snap.pay(token, {
      onSuccess: async () => {
        await handleSyncStatus();
      },
      onPending: async () => {
        setPaying(false);
        setError('');
        await api.post('/pembayaran/sync').catch(() => {});
        fetchInfo(); // Refresh to show pending status or redirect if success
      },
      onError: () => {
        setPaying(false);
        setError('Pembayaran gagal. Silakan coba lagi.');
      },
      onClose: async () => {
        setPaying(false);
        await handleSyncStatus();
      },
    });
  };

  const handleSyncStatus = async () => {
    setLoading(true);
    try {
      await api.post('/pembayaran/sync').catch(() => {});
      await fetchInfo();
    } finally {
      setLoading(false);
    }
  };

  const handleSimulasiBayar = async () => {
    setPaying(true); setError('');
    try {
      const res = await api.post(`/pembayaran/${data.pendaftaran.id}/simulasi`);
      if (res.data.success) navigate('/pembayaran/konfirmasi');
    } catch (err) { setError(err.response?.data?.message || 'Gagal memproses pembayaran.'); }
    finally { setPaying(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-[85px] pb-8 relative">
        <div className="container max-w-[640px]">
          <PembayaranSkeleton />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen pt-[90px] flex items-center justify-center text-center p-8">
        <div>
          <AlertCircle size={48} className="text-status-ditolak mx-auto mb-4" />
          <h3 className="mb-2 text-xl">Data Tidak Tersedia</h3>
          <p className="text-text-secondary dark:text-dark-text-secondary mb-6">{error}</p>
          <Link to="/beranda" className="btn btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={18} /> Kembali
          </Link>
        </div>
      </div>
    );
  }

  const { pendaftaran, biaya_formatted, payment_mode } = data;
  const pembayaran = pendaftaran.pembayaran;
  const hasPembayaran = pembayaran && pembayaran.status === 'PENDING';
  const isSandbox = payment_mode === 'sandbox';
  const hasSnapToken = hasPembayaran && pembayaran.snap_token;

  return (
    <div className="min-h-screen pt-[85px] pb-24 relative overflow-hidden">
      <div className="absolute top-[-80px] right-[-80px] z-0">
        <GeometricPattern size={350} opacity={0.03} />
      </div>
      <div className="container max-w-[640px] relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
          <Link to="/beranda" className="inline-flex items-center gap-1.5 text-[0.85rem] text-text-muted dark:text-dark-text-muted mb-3 hover:text-accent dark:hover:text-dark-accent transition-colors no-underline">
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>
          <h2 className="text-2xl mb-1 flex items-center gap-2">
            <CreditCard size={22} className="text-accent dark:text-dark-accent" />
            Pembayaran
          </h2>
        </motion.div>

        {error && (
          <div className="p-3 rounded-md bg-status-ditolak/10 border border-status-ditolak/30 text-status-ditolak mb-5 flex items-center gap-2 text-[0.88rem]">
            <AlertCircle size={16} />{error}
          </div>
        )}

        {/* Biaya Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static p-8 mb-5 text-center border-[1.5px] border-accent/25">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-bg border border-accent-bg-strong text-[0.72rem] font-semibold text-accent mb-4">
            <GraduationCap size={12} /> BIAYA PENDAFTARAN {pendaftaran.jenjang}
          </div>
          <div className="text-[2.5rem] font-extrabold font-heading leading-[1.2] mb-2 bg-gradient-to-br from-accent to-accent-light bg-clip-text text-transparent">
            {biaya_formatted}
          </div>
          <p className="text-text-muted dark:text-dark-text-muted text-[0.82rem]">Gelombang {pendaftaran.gelombang?.nama || '-'}</p>

          {/* Countdown */}
          {hasPembayaran && countdown && !countdown.expired && (
            <div className="mt-5 p-3 rounded-md bg-status-bayar/10 border border-status-bayar/20">
              <div className="flex items-center justify-center gap-1.5 text-[0.75rem] text-status-bayar mb-2">
                <Timer size={13} /> Batas Waktu Pembayaran
              </div>
              <div className="flex justify-center gap-2">
                {[['h', 'Jam'], ['m', 'Menit'], ['s', 'Detik']].map(([k, label]) => (
                  <div key={k} className="text-center">
                    <div className={`text-2xl font-bold font-heading min-w-[45px] p-1 bg-bg-tertiary dark:bg-dark-bg-tertiary rounded-sm ${countdown.h < 1 ? 'text-status-ditolak' : 'text-text-primary dark:text-dark-text-primary'}`}>
                      {String(countdown[k]).padStart(2, '0')}
                    </div>
                    <div className="text-[0.6rem] text-text-muted dark:text-dark-text-muted mt-1 uppercase">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasPembayaran && countdown?.expired && (
            <div className="mt-5 p-3 rounded-md bg-status-ditolak/10 border border-status-ditolak/20 text-status-ditolak text-[0.85rem] flex justify-center items-center gap-1">
              <AlertCircle size={14} /> Batas waktu pembayaran telah lewat
            </div>
          )}
        </motion.div>

        {/* Detail */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static p-6 mb-5">
          <h4 className="text-[0.85rem] text-text-muted dark:text-dark-text-muted font-semibold mb-3 uppercase tracking-wide">Detail Pendaftaran</h4>
          {[[Hash, 'Nomor Daftar', pendaftaran.nomor_daftar], [GraduationCap, 'Jenjang', pendaftaran.jenjang], [User, 'Nama Siswa', pendaftaran.data_siswa?.nama_lengkap || '-'], [CalendarDays, 'Tanggal Submit', pendaftaran.submitted_at ? new Date(pendaftaran.submitted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-']].map(([Icon, label, value]) => (
            <div key={label} className="flex justify-between items-center py-2 border-b border-border-default dark:border-dark-border-default text-[0.85rem]">
              <span className="text-text-muted dark:text-dark-text-muted flex items-center gap-1.5"><Icon size={14} className="text-accent dark:text-dark-accent" />{label}</span>
              <span className="font-medium text-text-primary dark:text-dark-text-primary">{value}</span>
            </div>
          ))}
        </motion.div>

        {/* Metode Pembayaran Info */}
        {isSandbox && hasPembayaran && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card-static p-5 mb-5">
            <h4 className="text-[0.85rem] text-text-muted dark:text-dark-text-muted font-semibold mb-3 uppercase tracking-wide">Metode Pembayaran Tersedia</h4>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { icon: Building2, label: 'Bank Transfer', desc: 'BCA, BNI, BRI' },
                { icon: Wallet, label: 'E-Wallet', desc: 'GoPay, ShopeePay' },
                { icon: QrCode, label: 'QRIS', desc: 'Scan QR Code' },
              ].map(m => (
                <div key={m.label} className="p-3 rounded-sm bg-bg-tertiary dark:bg-dark-bg-tertiary text-center flex flex-col items-center justify-center">
                  <m.icon size={20} className="text-accent dark:text-dark-accent mb-1" />
                  <div className="text-[0.72rem] font-semibold text-text-primary dark:text-dark-text-primary">{m.label}</div>
                  <div className="text-[0.62rem] text-text-muted dark:text-dark-text-muted">{m.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Simulasi Mode info */}
        {payment_mode === 'simulasi' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-3 rounded-md bg-accent/10 border border-accent/20 mb-5 text-[0.82rem] flex items-start gap-2">
            <Zap size={16} className="text-accent dark:text-dark-accent shrink-0 mt-[2px]" />
            <div>
              <strong className="text-accent dark:text-dark-accent font-semibold block">Mode Simulasi</strong>
              <p className="text-text-secondary dark:text-dark-text-secondary mt-1">Pembayaran dalam mode simulasi. Klik tombol bayar untuk langsung memproses.</p>
            </div>
          </motion.div>
        )}

        {/* Security */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-2 mb-6 text-[0.78rem] text-text-muted dark:text-dark-text-muted">
          <Shield size={14} className="text-accent-light dark:text-dark-accent-light" /> Pembayaran dijamin aman & terenkripsi
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          {!hasPembayaran ? (
            /* Step 1: Initiate payment */
            <button onClick={handleInitiate} disabled={initiating} className={`btn btn-primary btn-lg w-full justify-center flex items-center gap-2 ${initiating ? 'opacity-70 cursor-wait' : ''}`}>
              {initiating ? <><Loader2 size={20} className="animate-spin" /> Memproses...</> : <><CreditCard size={20} /> Bayar Sekarang — {biaya_formatted}</>}
            </button>
          ) : countdown && !countdown.expired ? (
            /* Step 2: Open payment method */
            <div className="flex flex-col gap-3">
              {isSandbox && hasSnapToken ? (
                /* Midtrans Snap — open popup with bank/ewallet/QRIS options */
                <button onClick={handlePaySnap} disabled={paying} className={`btn btn-primary btn-lg w-full justify-center flex items-center gap-2 ${paying ? 'opacity-70 cursor-wait' : ''}`}>
                  {paying ? <><Loader2 size={20} className="animate-spin" /> Memproses...</> : <><Wallet size={20} /> Pilih Metode Pembayaran — {biaya_formatted}</>}
                </button>
              ) : (
                /* Simulasi mode fallback */
                <button onClick={handleSimulasiBayar} disabled={paying} className={`btn btn-primary btn-lg w-full justify-center flex items-center gap-2 ${paying ? 'opacity-70 cursor-wait' : ''}`}>
                  {paying ? <><Loader2 size={20} className="animate-spin" /> Memproses...</> : <><Zap size={20} /> Konfirmasi Pembayaran — {biaya_formatted}</>}
                </button>
              )}

              {/* Payment URL fallback (redirect if Snap popup fails) */}
              {isSandbox && pembayaran.payment_url && (
                <a href={pembayaran.payment_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary w-full justify-center text-center no-underline flex items-center gap-2">
                  <CreditCard size={16} /> Buka Halaman Pembayaran
                </a>
              )}
              
              <button onClick={handleSyncStatus} disabled={loading} className="btn bg-bg-tertiary dark:bg-dark-bg-tertiary text-text-secondary border border-border-default hover:border-accent hover:text-accent w-full justify-center text-center flex items-center gap-2 mt-2">
                <Timer size={16} /> Cek Status Pembayaran
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-status-ditolak text-[0.9rem] mb-4">Pembayaran kadaluarsa. Hubungi panitia.</p>
              <Link to="/beranda" className="btn btn-secondary">Kembali ke Beranda</Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
