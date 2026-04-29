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
        await api.post('/pembayaran/sync').catch(() => {});
        navigate('/pembayaran/konfirmasi');
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
        await api.post('/pembayaran/sync').catch(() => {});
        fetchInfo(); // Refresh in case status changed
      },
    });
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
      <div style={{ minHeight: '100vh', paddingTop: '85px', paddingBottom: '2rem', position: 'relative' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <PembayaranSkeleton />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
        <div>
          <AlertCircle size={48} color="var(--status-ditolak)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Data Tidak Tersedia</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
          <Link to="/beranda" className="btn btn-primary"><ArrowLeft size={18} /> Kembali</Link>
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
    <div style={{ minHeight: '100vh', paddingTop: '85px', paddingBottom: '6rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', zIndex: 0 }}><GeometricPattern size={350} opacity={0.03} /></div>
      <div className="container" style={{ maxWidth: '640px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.75rem' }}>
          <Link to="/beranda" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
            <CreditCard size={22} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--accent-primary)' }} />
            Pembayaran
          </h2>
        </motion.div>

        {error && (
          <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--status-ditolak) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--status-ditolak) 30%, transparent)', color: 'var(--status-ditolak)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
            <AlertCircle size={16} />{error}
          </div>
        )}

        {/* Biaya Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static" style={{ padding: '2rem', marginBottom: '1.25rem', textAlign: 'center', border: '1.5px solid color-mix(in srgb, var(--accent-primary) 25%, transparent)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0.75rem', borderRadius: '50px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '1rem' }}>
            <GraduationCap size={12} /> BIAYA PENDAFTARAN {pendaftaran.jenjang}
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2, marginBottom: '0.5rem' }}>
            {biaya_formatted}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Gelombang {pendaftaran.gelombang?.nama || '-'}</p>

          {/* Countdown */}
          {hasPembayaran && countdown && !countdown.expired && (
            <div style={{ marginTop: '1.25rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--status-bayar) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--status-bayar) 20%, transparent)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--status-bayar)', marginBottom: '0.5rem' }}>
                <Timer size={13} /> Batas Waktu Pembayaran
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                {[['h', 'Jam'], ['m', 'Menit'], ['s', 'Detik']].map(([k, label]) => (
                  <div key={k} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: countdown.h < 1 ? 'var(--status-ditolak)' : 'var(--text-primary)', minWidth: '45px', padding: '0.25rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                      {String(countdown[k]).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.2rem', textTransform: 'uppercase' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasPembayaran && countdown?.expired && (
            <div style={{ marginTop: '1.25rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--status-ditolak) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--status-ditolak) 20%, transparent)', color: 'var(--status-ditolak)', fontSize: '0.85rem' }}>
              <AlertCircle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.25rem' }} /> Batas waktu pembayaran telah lewat
            </div>
          )}
        </motion.div>

        {/* Detail */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Detail Pendaftaran</h4>
          {[[Hash, 'Nomor Daftar', pendaftaran.nomor_daftar], [GraduationCap, 'Jenjang', pendaftaran.jenjang], [User, 'Nama Siswa', pendaftaran.data_siswa?.nama_lengkap || '-'], [CalendarDays, 'Tanggal Submit', pendaftaran.submitted_at ? new Date(pendaftaran.submitted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-']].map(([Icon, label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--glass-border)', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Icon size={14} color="var(--accent-primary)" />{label}</span>
              <span style={{ fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </motion.div>

        {/* Metode Pembayaran Info */}
        {isSandbox && hasPembayaran && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card-static" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Metode Pembayaran Tersedia</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
              {[
                { icon: Building2, label: 'Bank Transfer', desc: 'BCA, BNI, BRI' },
                { icon: Wallet, label: 'E-Wallet', desc: 'GoPay, ShopeePay' },
                { icon: QrCode, label: 'QRIS', desc: 'Scan QR Code' },
              ].map(m => (
                <div key={m.label} style={{ padding: '0.75rem 0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', textAlign: 'center' }}>
                  <m.icon size={20} color="var(--accent-primary)" style={{ marginBottom: '0.3rem' }} />
                  <div style={{ fontSize: '0.72rem', fontWeight: 600 }}>{m.label}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{m.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Simulasi Mode info */}
        {payment_mode === 'simulasi' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--accent-primary) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-primary) 20%, transparent)', marginBottom: '1.25rem', fontSize: '0.82rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <Zap size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <div><strong style={{ color: 'var(--accent-primary)' }}>Mode Simulasi</strong><p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Pembayaran dalam mode simulasi. Klik tombol bayar untuk langsung memproses.</p></div>
          </motion.div>
        )}

        {/* Security */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <Shield size={14} color="var(--accent-primary-light)" /> Pembayaran dijamin aman & terenkripsi
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          {!hasPembayaran ? (
            /* Step 1: Initiate payment */
            <button onClick={handleInitiate} disabled={initiating} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', opacity: initiating ? 0.7 : 1 }}>
              {initiating ? <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Memproses...</> : <><CreditCard size={20} /> Bayar Sekarang — {biaya_formatted}</>}
            </button>
          ) : countdown && !countdown.expired ? (
            /* Step 2: Open payment method */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {isSandbox && hasSnapToken ? (
                /* Midtrans Snap — open popup with bank/ewallet/QRIS options */
                <button onClick={handlePaySnap} disabled={paying} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', opacity: paying ? 0.7 : 1 }}>
                  {paying ? <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Memproses...</> : <><Wallet size={20} /> Pilih Metode Pembayaran — {biaya_formatted}</>}
                </button>
              ) : (
                /* Simulasi mode fallback */
                <button onClick={handleSimulasiBayar} disabled={paying} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', opacity: paying ? 0.7 : 1 }}>
                  {paying ? <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Memproses...</> : <><Zap size={20} /> Konfirmasi Pembayaran — {biaya_formatted}</>}
                </button>
              )}

              {/* Payment URL fallback (redirect if Snap popup fails) */}
              {isSandbox && pembayaran.payment_url && (
                <a href={pembayaran.payment_url} target="_blank" rel="noopener" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
                  <CreditCard size={16} /> Buka Halaman Pembayaran
                </a>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--status-ditolak)', fontSize: '0.9rem', marginBottom: '1rem' }}>Pembayaran kadaluarsa. Hubungi panitia.</p>
              <Link to="/beranda" className="btn btn-secondary">Kembali ke Beranda</Link>
            </div>
          )}
        </motion.div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
