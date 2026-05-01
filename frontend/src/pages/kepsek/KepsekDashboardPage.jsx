import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, UserCheck, GraduationCap, DollarSign, BarChart3,
  TrendingUp, AlertCircle, CalendarDays
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell
} from 'recharts';
import api from '../../services/api';
import { Skeleton, SkeletonCard } from '../../components/SkeletonLoader';

const jenjangColors = { TK: 'var(--color-accent)', SD: '#2D8A6B', SMP: '#1A6B5A', SMA: '#E0C76A' };
const statusColors = {
  DRAFT: '#6B7280', SUBMITTED: '#F59E0B', MENUNGGU_REVIEW: '#F59E0B',
  REVISI: '#F97316', DITERIMA: '#10B981', DITOLAK: '#EF4444',
  MENUNGGU_BAYAR: '#3B82F6', TERDAFTAR: '#047857',
};
const statusLabels = {
  DRAFT: 'Draft', SUBMITTED: 'Menunggu', MENUNGGU_REVIEW: 'Review',
  REVISI: 'Revisi', DITERIMA: 'Diterima', DITOLAK: 'Ditolak',
  MENUNGGU_BAYAR: 'Bayar', TERDAFTAR: 'Terdaftar',
};

export default function KepsekDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/kepsek/dashboard').then(res => setData(res.data.data))
      .catch(() => setError('Gagal memuat dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <Skeleton width="260px" height="1.75rem" style={{ marginBottom: '0.5rem' }} />
        <Skeleton width="180px" height="0.85rem" style={{ marginBottom: '2rem' }} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {[1,2,3,4,5].map(i => <SkeletonCard key={i} height="110px" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SkeletonCard height="320px" /><SkeletonCard height="320px" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-16 px-8">
        <AlertCircle size={48} className="text-status-ditolak mx-auto mb-4" />
        <h3>{error || 'Data tidak tersedia'}</h3>
      </div>
    );
  }

  const { stats, per_jenjang, distribusi, gelombang, tren_mingguan } = data;

  const statCards = [
    { label: 'Total Pendaftar', value: stats.total_pendaftar, icon: Users, color: 'var(--color-accent)' },
    { label: 'Diterima', value: stats.total_diterima, icon: UserCheck, color: 'var(--color-status-diterima)' },
    { label: 'Terdaftar', value: stats.total_terdaftar, icon: GraduationCap, color: 'var(--color-status-terdaftar)' },
    { label: 'Ditolak', value: stats.total_ditolak, icon: AlertCircle, color: 'var(--color-status-ditolak)' },
    { label: 'Revenue', value: `Rp ${(stats.total_revenue || 0).toLocaleString('id-ID')}`, icon: DollarSign, color: 'var(--color-accent-light)', small: true },
  ];

  const barData = per_jenjang.map(j => ({
    jenjang: j.jenjang, 'Menunggu': j.menunggu_review, 'Diterima': j.diterima,
    'Ditolak': j.ditolak, 'Terdaftar': j.terdaftar, 'Revisi': j.revisi,
  }));

  const donutData = distribusi.filter(d => d.jumlah > 0).map(d => ({
    name: statusLabels[d.status] || d.status, value: d.jumlah, color: statusColors[d.status] || '#6B7280',
  }));

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-[1.75rem] mb-1">
            Dashboard <span className="text-accent-light">Kepala Sekolah</span>
          </h1>
          <p className="text-text-secondary dark:text-dark-text-secondary text-sm">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button onClick={async () => {
          try {
            const res = await api.get('/kepsek/export/laporan', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a'); link.href = url;
            link.setAttribute('download', `Laporan_Kepsek_${new Date().getTime()}.pdf`);
            document.body.appendChild(link); link.click(); link.parentNode.removeChild(link);
          } catch { alert('Gagal mencetak laporan'); }
        }} className="btn btn-primary btn-sm flex items-center gap-2">
          Cetak Laporan
        </button>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="glass-card-static p-5">
              <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center mb-3"
                style={{ background: `color-mix(in srgb, ${card.color} 12%, transparent)` }}>
                <Icon size={18} style={{ color: card.color }} />
              </div>
              <div className={`${card.small ? 'text-lg' : 'text-3xl'} font-extrabold font-heading leading-none`}>{card.value}</div>
              <div className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">{card.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-5 mb-8">
        {/* Stacked Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static p-6">
          <h3 className="text-base mb-5 flex items-center gap-1.5">
            <BarChart3 size={18} className="text-accent-light" /> Distribusi per Jenjang
          </h3>
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-default)" />
                <XAxis dataKey="jenjang" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-default)', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--color-text-primary)' }} />
                <Bar dataKey="Menunggu" stackId="a" fill="#F59E0B" />
                <Bar dataKey="Diterima" stackId="a" fill="#10B981" />
                <Bar dataKey="Ditolak" stackId="a" fill="#EF4444" />
                <Bar dataKey="Terdaftar" stackId="a" fill="#047857" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Donut Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card-static p-6">
          <h3 className="text-base mb-5 flex items-center gap-1.5">
            <TrendingUp size={18} className="text-accent-light" /> Distribusi Status Global
          </h3>
          {donutData.length > 0 ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-[180px] h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donutData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                      {donutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-default)', borderRadius: '8px', fontSize: '0.82rem' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                {donutData.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2 h-2 rounded-sm" style={{ background: d.color }} />
                    <span className="text-text-secondary dark:text-dark-text-secondary">{d.name}</span>
                    <span className="font-semibold">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-text-muted dark:text-dark-text-muted text-center py-8">Belum ada data</p>
          )}
        </motion.div>
      </div>

      {/* Tren Mingguan */}
      {tren_mingguan && tren_mingguan.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card-static p-6 mb-8">
          <h3 className="text-base mb-5 flex items-center gap-1.5">
            <CalendarDays size={18} className="text-accent-light" /> Tren 4 Minggu Terakhir
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {tren_mingguan.map((t, i) => (
              <div key={i} className="p-4 rounded-md text-center bg-bg-tertiary dark:bg-dark-bg-tertiary">
                <div className="text-[0.72rem] text-text-muted dark:text-dark-text-muted mb-2">{t.label}</div>
                <div className="text-2xl font-extrabold font-heading text-accent-light">{t.pendaftar}</div>
                <div className="text-[0.72rem] text-text-secondary dark:text-dark-text-secondary mt-1">pendaftar baru</div>
                <div className="text-sm font-semibold text-status-diterima mt-2">{t.diterima} diterima</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Gelombang Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card-static overflow-hidden">
        <div className="px-6 py-5 border-b border-border-default dark:border-dark-border-default">
          <h3 className="text-base flex items-center gap-1.5">
            <CalendarDays size={18} className="text-accent-light" /> Ringkasan Gelombang
          </h3>
        </div>
        {gelombang.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border-default dark:border-dark-border-default">
                  {['Jenjang', 'Gelombang', 'Kuota', 'Terisi', 'Sisa', 'Status', 'Tutup'].map(h => (
                    <th key={h} className="text-left px-3 py-3 text-[0.72rem] font-semibold uppercase text-text-muted dark:text-dark-text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gelombang.map(g => (
                  <tr key={g.id} className="border-b border-border-default dark:border-dark-border-default">
                    <td className="px-3 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[0.65rem] font-semibold text-white" style={{ background: jenjangColors[g.jenjang] }}>{g.jenjang}</span>
                    </td>
                    <td className="px-3 py-3 font-medium">{g.nama}</td>
                    <td className="px-3 py-3 font-semibold">{g.kuota}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{g.terisi}</span>
                        <div className="h-[5px] rounded-sm overflow-hidden w-[60px] bg-bg-primary dark:bg-dark-bg-primary">
                          <div className="h-full rounded-sm" style={{
                            background: g.sisa <= 5 ? 'var(--color-status-ditolak)' : 'var(--color-accent-light)',
                            width: `${Math.min(100, (g.terisi / g.kuota) * 100)}%`
                          }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 font-semibold" style={{ color: g.sisa <= 5 ? 'var(--color-status-ditolak)' : 'var(--color-accent-light)' }}>{g.sisa}</td>
                    <td className="px-3 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[0.65rem] font-semibold text-white"
                        style={{ background: g.status === 'BUKA' ? 'var(--color-status-diterima)' : g.status === 'TUTUP' ? 'var(--color-status-ditolak)' : 'var(--color-status-submitted)' }}>
                        {g.status === 'BUKA' ? 'Buka' : g.status === 'TUTUP' ? 'Tutup' : 'Akan Datang'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-text-muted dark:text-dark-text-muted">
                      {g.tanggal_tutup ? new Date(g.tanggal_tutup).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-text-muted dark:text-dark-text-muted text-center py-8">Belum ada gelombang</p>
        )}
      </motion.div>
    </div>
  );
}
