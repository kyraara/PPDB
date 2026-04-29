import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Download, Home, Hash, GraduationCap,
  CalendarDays, CreditCard, Banknote, ArrowLeft, Loader2
} from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import api from '../../services/api';
import GeometricPattern from '../../components/GeometricPattern';
import { PembayaranSkeleton } from '../../components/SkeletonLoader';

export default function KonfirmasiPembayaranPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Sync dengan Midtrans dulu jika webhook gagal masuk (kasus localhost)
        await api.post('/pembayaran/sync').catch(() => {});

        const res = await api.get('/pendaftaran/saya');
        const pendaftaran = res.data.data?.pendaftaran;
        if (!pendaftaran || pendaftaran.status !== 'TERDAFTAR') {
          navigate('/beranda');
          return;
        }
        setData(pendaftaran);
      } catch {
        navigate('/beranda');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '85px', paddingBottom: '2rem' }}>
        <div className="container" style={{ maxWidth: '640px' }}><PembayaranSkeleton /></div>
      </div>
    );
  }

  if (!data) return null;

  const pembayaran = data.pembayaran;

  return (
    <div style={{ minHeight: '100vh', paddingTop: '85px', paddingBottom: '6rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', zIndex: 0 }}><GeometricPattern size={350} opacity={0.03} /></div>

      <div className="container" style={{ maxWidth: '640px', position: 'relative', zIndex: 1 }}>
        {/* Success animation */}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 12 }}
            style={{ width: '88px', height: '88px', borderRadius: '50%', background: 'color-mix(in srgb, var(--status-terdaftar) 12%, transparent)', border: '3px solid var(--status-terdaftar)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}
          >
            <CheckCircle2 size={44} color="var(--status-terdaftar)" />
          </motion.div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
            Pembayaran <span style={{ color: 'var(--status-terdaftar)' }}>Berhasil!</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '380px', margin: '0 auto', lineHeight: 1.7 }}>
            Selamat! Anda telah resmi terdaftar sebagai peserta didik baru di Yayasan Al Istiqomah Al Islamiyah.
          </p>
        </motion.div>

        {/* Bukti Pembayaran Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card-static" style={{ padding: '2rem', marginBottom: '1.25rem', border: '1.5px solid color-mix(in srgb, var(--status-terdaftar) 25%, transparent)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.85rem', borderRadius: '50px', background: 'color-mix(in srgb, var(--status-terdaftar) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--status-terdaftar) 25%, transparent)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--status-terdaftar)' }}>
              <CheckCircle2 size={12} /> TERDAFTAR
            </div>
          </div>

          {/* Detail rows */}
          {[
            [Hash, 'Nomor Daftar', data.nomor_daftar],
            [GraduationCap, 'Jenjang', data.jenjang],
            [Banknote, 'Jumlah Bayar', pembayaran ? `Rp ${Number(pembayaran.jumlah).toLocaleString('id-ID')}` : '-'],
            [CreditCard, 'Metode', pembayaran?.metode === 'simulasi' ? 'Sandbox (Simulasi)' : (pembayaran?.metode || '-')],
            [CalendarDays, 'Tanggal Bayar', pembayaran?.paid_at ? new Date(pembayaran.paid_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'],
            [Hash, 'ID Transaksi', pembayaran?.transaction_id || '-'],
          ].map(([Icon, label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0', borderBottom: '1px solid var(--glass-border)', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Icon size={14} color="var(--accent-primary)" />{label}
              </span>
              <span style={{ fontWeight: 500, textAlign: 'right', maxWidth: '55%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
            </div>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => alert('Fitur unduh PDF akan tersedia segera.')}
          >
            <Download size={20} /> Unduh Bukti Pendaftaran (PDF)
          </button>
          <Link to="/beranda" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            <Home size={18} /> Kembali ke Beranda
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
