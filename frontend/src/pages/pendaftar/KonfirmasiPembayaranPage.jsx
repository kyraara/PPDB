import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Download, Home, Hash, GraduationCap,
  CalendarDays, CreditCard, Banknote
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
        await api.post('/pembayaran/sync').catch(() => {});
        const res = await api.get('/pendaftaran/saya');
        const pendaftaran = res.data.data?.pendaftaran;
        if (!pendaftaran || pendaftaran.status !== 'TERDAFTAR') { navigate('/beranda'); return; }
        setData(pendaftaran);
      } catch { navigate('/beranda'); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen pt-[85px] pb-8">
        <div className="container max-w-[640px]"><PembayaranSkeleton /></div>
      </div>
    );
  }

  if (!data) return null;
  const pembayaran = data.pembayaran;

  return (
    <div className="min-h-screen pt-[85px] pb-24 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 z-0"><GeometricPattern size={350} opacity={0.03} /></div>

      <div className="container max-w-[640px] relative z-10">
        {/* Success animation */}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="text-center mb-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 12 }}
            className="w-[88px] h-[88px] rounded-full flex items-center justify-center mx-auto mb-5 bg-status-terdaftar/10 border-[3px] border-status-terdaftar"
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 400, damping: 10 }}>
              <CheckCircle2 size={44} className="text-status-terdaftar" />
            </motion.div>
          </motion.div>
          <h2 className="text-[1.75rem] mb-2">
            Pembayaran <span className="text-status-terdaftar">Berhasil!</span>
          </h2>
          <p className="text-text-secondary dark:text-dark-text-secondary text-[0.95rem] max-w-[380px] mx-auto leading-relaxed">
            Selamat! Anda telah resmi terdaftar sebagai peserta didik baru di Yayasan Al Istiqomah Al Islamiyah.
          </p>
        </motion.div>

        {/* Bukti Pembayaran */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card-static p-8 mb-5 border-[1.5px] border-status-terdaftar/25">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-status-terdaftar bg-status-terdaftar/10 border border-status-terdaftar/25">
              <CheckCircle2 size={12} /> TERDAFTAR
            </div>
          </div>

          {[
            [Hash, 'Nomor Daftar', data.nomor_daftar],
            [GraduationCap, 'Jenjang', data.jenjang],
            [Banknote, 'Jumlah Bayar', pembayaran ? `Rp ${Number(pembayaran.jumlah).toLocaleString('id-ID')}` : null],
            [CreditCard, 'Metode', pembayaran?.metode === 'simulasi' ? 'Sandbox (Simulasi)' : pembayaran?.metode],
            [CalendarDays, 'Tanggal Bayar', pembayaran?.paid_at ? new Date(pembayaran.paid_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : null],
            [Hash, 'ID Transaksi', pembayaran?.transaction_id],
          ]
          .filter(item => item[2])
          .map(([Icon, label, value]) => (
            <div key={label} className="flex justify-between items-center py-2 text-sm border-b border-border-default dark:border-dark-border-default">
              <span className="flex items-center gap-1.5 text-text-muted dark:text-dark-text-muted">
                <Icon size={14} className="text-accent dark:text-dark-accent" />{label}
              </span>
              <span className="font-medium text-right max-w-[55%] truncate">{value}</span>
            </div>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button className="btn btn-primary justify-center py-3 flex items-center gap-2"
            onClick={() => alert('Fitur unduh PDF akan tersedia segera.')}>
            <Download size={18} /> Unduh Bukti (PDF)
          </button>
          <Link to="/beranda" className="btn btn-secondary justify-center py-3 flex items-center gap-2">
            <Home size={18} /> Beranda
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
