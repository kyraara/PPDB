import { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, UserCheck, UserX, Clock, FileText, TrendingUp,
  ChevronRight, CalendarDays, BarChart3, AlertCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../../services/api';
import { Skeleton, SkeletonText, SkeletonCard } from '../../components/SkeletonLoader';

const statusColors = {
  DRAFT: 'var(--color-status-draft)', SUBMITTED: 'var(--color-status-submitted)',
  MENUNGGU_REVIEW: 'var(--color-status-review)', REVISI: 'var(--color-status-revisi)',
  DITERIMA: 'var(--color-status-diterima)', DITOLAK: 'var(--color-status-ditolak)',
  MENUNGGU_BAYAR: 'var(--color-status-bayar)', TERDAFTAR: 'var(--color-status-terdaftar)',
};

const statusLabels = {
  DRAFT: 'Draft', SUBMITTED: 'Menunggu', MENUNGGU_REVIEW: 'Review', REVISI: 'Revisi',
  DITERIMA: 'Diterima', DITOLAK: 'Ditolak', MENUNGGU_BAYAR: 'Bayar', TERDAFTAR: 'Terdaftar',
};

export default function PanitiaDashboardPage() {
  const { jenjang } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/panitia/dashboard').then(res => setData(res.data.data))
      .catch(() => setError('Gagal memuat dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <Skeleton width="220px" height="1.75rem" style={{ marginBottom: '0.5rem' }} />
        <Skeleton width="160px" height="0.85rem" style={{ marginBottom: '2rem' }} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <SkeletonCard key={i} height="120px" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SkeletonCard height="300px" /><SkeletonCard height="300px" />
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

  const { stats, distribusi, terbaru, gelombang_aktif } = data;

  const statCards = [
    { label: 'Total Pendaftar', value: stats.total, icon: Users, color: 'var(--color-accent)', sub: `+${stats.baru_hari_ini} hari ini` },
    { label: 'Menunggu Review', value: stats.menunggu_review, icon: Clock, color: 'var(--color-status-submitted)', sub: `${stats.submit_hari_ini} submit hari ini` },
    { label: 'Diterima', value: stats.diterima, icon: UserCheck, color: 'var(--color-status-diterima)', sub: `${stats.terdaftar} terdaftar` },
    { label: 'Ditolak / Revisi', value: stats.ditolak + stats.revisi, icon: UserX, color: 'var(--color-status-ditolak)', sub: `${stats.revisi} perlu revisi` },
  ];

  const chartData = distribusi.filter(d => d.jumlah > 0).map(d => ({
    name: statusLabels[d.status] || d.status,
    value: d.jumlah,
    fill: statusColors[d.status] || 'var(--color-text-muted)',
  }));
  const CHART_COLORS = distribusi.filter(d => d.jumlah > 0).map(d => statusColors[d.status] || '#6B7280');

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-[1.75rem] mb-1">
          Dashboard <span className="text-accent dark:text-dark-accent">{data.jenjang}</span>
        </h1>
        <p className="text-text-secondary dark:text-dark-text-secondary text-sm">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card-static p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center"
                  style={{ background: `color-mix(in srgb, ${card.color} 12%, transparent)` }}>
                  <Icon size={20} style={{ color: card.color }} />
                </div>
              </div>
              <div className="text-[2rem] font-extrabold font-heading leading-none">{card.value}</div>
              <div className="text-[0.78rem] text-text-secondary dark:text-dark-text-secondary mt-1">{card.label}</div>
              <div className="text-[0.68rem] text-text-muted dark:text-dark-text-muted mt-1">{card.sub}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Chart + Gelombang */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* Donut Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static p-6">
          <h3 className="text-base mb-4 flex items-center gap-1.5">
            <BarChart3 size={18} className="text-accent dark:text-dark-accent" /> Distribusi Status
          </h3>
          {chartData.length > 0 ? (
            <div className="flex items-center gap-6">
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                      {chartData.map((entry, index) => (<Cell key={index} fill={CHART_COLORS[index]} />))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-default)', borderRadius: '8px', fontSize: '0.82rem' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                {chartData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-[0.78rem]">
                    <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: CHART_COLORS[i] }} />
                    <span className="text-text-secondary dark:text-dark-text-secondary flex-1">{d.name}</span>
                    <span className="font-semibold">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-text-muted dark:text-dark-text-muted text-center py-8">Belum ada data</p>
          )}
        </motion.div>

        {/* Gelombang Aktif */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card-static p-6">
          <h3 className="text-base mb-4 flex items-center gap-1.5">
            <CalendarDays size={18} className="text-accent dark:text-dark-accent" /> Gelombang Aktif
          </h3>
          {gelombang_aktif ? (
            <div>
              <div className="text-lg font-semibold mb-4">{gelombang_aktif.nama}</div>
              <div className="flex flex-col gap-3">
                <div>
                  <div className="flex justify-between text-[0.78rem] mb-1">
                    <span className="text-text-muted dark:text-dark-text-muted">Kuota Terisi</span>
                    <span className="font-semibold">{gelombang_aktif.terisi} / {gelombang_aktif.kuota}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden bg-bg-tertiary dark:bg-dark-bg-tertiary">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{
                        background: gelombang_aktif.sisa <= 5 ? 'var(--color-status-ditolak)' : 'var(--color-accent-light)',
                        width: `${Math.min(100, (gelombang_aktif.terisi / gelombang_aktif.kuota) * 100)}%`
                      }} />
                  </div>
                </div>
                <div className="flex justify-between text-sm py-2 border-t border-border-default dark:border-dark-border-default">
                  <span className="text-text-muted dark:text-dark-text-muted">Sisa Kuota</span>
                  <span className="font-semibold" style={{ color: gelombang_aktif.sisa <= 5 ? 'var(--color-status-ditolak)' : 'var(--color-accent-light)' }}>{gelombang_aktif.sisa}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-t border-border-default dark:border-dark-border-default">
                  <span className="text-text-muted dark:text-dark-text-muted">Tutup</span>
                  <span className="font-medium">{new Date(gelombang_aktif.tanggal_tutup).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-text-muted dark:text-dark-text-muted text-center py-8">Tidak ada gelombang aktif</p>
          )}
        </motion.div>
      </div>

      {/* Pendaftar Terbaru */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card-static p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base flex items-center gap-1.5">
            <FileText size={18} className="text-accent dark:text-dark-accent" /> Menunggu Review
          </h3>
          <Link to="/panitia/pendaftar?status=SUBMITTED" className="text-xs flex items-center gap-1 text-accent dark:text-dark-accent">
            Lihat Semua <ChevronRight size={14} />
          </Link>
        </div>

        {terbaru.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border-default dark:border-dark-border-default">
                  {['Nama', 'No Daftar', 'Gelombang', 'Tanggal Submit'].map(h => (
                    <th key={h} className="text-left px-2 py-2.5 text-[0.72rem] font-semibold uppercase tracking-wide text-text-muted dark:text-dark-text-muted">{h}</th>
                  ))}
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {terbaru.map(p => (
                  <tr key={p.id} className="border-b border-border-default dark:border-dark-border-default">
                    <td className="px-2 py-2.5 font-medium">{p.nama}</td>
                    <td className="px-2 py-2.5 font-mono text-[0.78rem] text-text-secondary dark:text-dark-text-secondary">{p.nomor_daftar}</td>
                    <td className="px-2 py-2.5 text-text-secondary dark:text-dark-text-secondary">{p.gelombang || '-'}</td>
                    <td className="px-2 py-2.5 text-text-muted dark:text-dark-text-muted">{p.submitted_at ? new Date(p.submitted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}</td>
                    <td className="px-2 py-2.5">
                      <Link to={`/panitia/pendaftar/${p.id}`} className="text-accent dark:text-dark-accent"><ChevronRight size={16} /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-text-muted dark:text-dark-text-muted text-center py-8">Tidak ada pendaftar yang menunggu review</p>
        )}
      </motion.div>
    </div>
  );
}
