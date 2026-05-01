import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, UserCheck, UserX, Clock, TrendingUp, ChevronRight,
  DollarSign, BarChart3, AlertCircle, GraduationCap
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import api from '../../services/api';
import { Skeleton, SkeletonCard } from '../../components/SkeletonLoader';

const statusBadge = {
  DRAFT: { bg: 'var(--color-status-draft)', label: 'Draft' },
  SUBMITTED: { bg: 'var(--color-status-submitted)', label: 'Menunggu' },
  MENUNGGU_REVIEW: { bg: 'var(--color-status-review)', label: 'Review' },
  REVISI: { bg: 'var(--color-status-revisi)', label: 'Revisi' },
  DITERIMA: { bg: 'var(--color-status-diterima)', label: 'Diterima' },
  DITOLAK: { bg: 'var(--color-status-ditolak)', label: 'Ditolak' },
  MENUNGGU_BAYAR: { bg: 'var(--color-status-bayar)', label: 'Bayar' },
  TERDAFTAR: { bg: 'var(--color-status-terdaftar)', label: 'Terdaftar' },
};

const jenjangColors = { TK: 'var(--color-accent)', SD: '#2D8A6B', SMP: '#1A6B5A', SMA: '#E0C76A' };

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/dashboard').then(res => setData(res.data.data))
      .catch(() => setError('Gagal memuat dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <Skeleton width="220px" height="1.75rem" style={{ marginBottom: '0.5rem' }} />
        <Skeleton width="160px" height="0.85rem" style={{ marginBottom: '2rem' }} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} height="110px" />)}
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

  const { stats, per_jenjang, tren, terbaru } = data;

  const statCards = [
    { label: 'Total Pendaftar', value: stats.total_pendaftar, icon: Users, color: 'var(--color-accent)' },
    { label: 'Menunggu Review', value: stats.menunggu_review, icon: Clock, color: 'var(--color-status-submitted)' },
    { label: 'Diterima', value: stats.diterima, icon: UserCheck, color: 'var(--color-status-diterima)' },
    { label: 'Ditolak', value: stats.ditolak, icon: UserX, color: 'var(--color-status-ditolak)' },
    { label: 'Terdaftar', value: stats.terdaftar, icon: GraduationCap, color: 'var(--color-status-terdaftar)' },
    { label: 'Revenue', value: `Rp ${(stats.total_revenue || 0).toLocaleString('id-ID')}`, icon: DollarSign, color: 'var(--color-accent-light)', small: true },
  ];

  const barData = per_jenjang.map(j => ({
    jenjang: j.jenjang, 'Menunggu': j.menunggu_review, 'Diterima': j.diterima,
    'Ditolak': j.ditolak, 'Terdaftar': j.terdaftar, 'Revisi': j.revisi,
  }));

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-[1.75rem] mb-1">
          Dashboard <span className="text-accent dark:text-dark-accent">Admin</span>
        </h1>
        <p className="text-text-secondary dark:text-dark-text-secondary text-sm">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="glass-card-static p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center"
                  style={{ background: `color-mix(in srgb, ${card.color} 12%, transparent)` }}>
                  <Icon size={18} style={{ color: card.color }} />
                </div>
              </div>
              <div className={`${card.small ? 'text-lg' : 'text-3xl'} font-extrabold font-heading leading-none`}>{card.value}</div>
              <div className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">{card.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static p-6">
          <h3 className="text-base mb-5 flex items-center gap-1.5">
            <BarChart3 size={18} className="text-accent dark:text-dark-accent" /> Status per Jenjang
          </h3>
          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-default)" />
                <XAxis dataKey="jenjang" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-default)', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--color-text-primary)' }} />
                <Bar dataKey="Menunggu" stackId="a" fill="#F59E0B" radius={[0,0,0,0]} />
                <Bar dataKey="Diterima" stackId="a" fill="#10B981" />
                <Bar dataKey="Ditolak" stackId="a" fill="#EF4444" />
                <Bar dataKey="Terdaftar" stackId="a" fill="#047857" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card-static p-6">
          <h3 className="text-base mb-5 flex items-center gap-1.5">
            <TrendingUp size={18} className="text-accent dark:text-dark-accent" /> Tren 7 Hari Terakhir
          </h3>
          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tren}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-default)" />
                <XAxis dataKey="label" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-default)', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--color-text-primary)' }} />
                <Line type="monotone" dataKey="pendaftar" stroke="var(--color-accent)" strokeWidth={2} dot={{ r: 4, fill: 'var(--color-accent)' }} name="Pendaftar Baru" />
                <Line type="monotone" dataKey="submit" stroke="#2D8A6B" strokeWidth={2} dot={{ r: 4, fill: '#2D8A6B' }} name="Submit" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Jenjang Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {per_jenjang.map((j, i) => (
          <motion.div key={j.jenjang} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
            className="glass-card-static p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: jenjangColors[j.jenjang] }} />
              <span className="font-bold font-heading">Jenjang {j.jenjang}</span>
              <span className="ml-auto text-xl font-extrabold" style={{ color: jenjangColors[j.jenjang] }}>{j.total}</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[0.78rem]">
              {[
                { l: 'Menunggu', v: j.menunggu_review, c: 'var(--color-status-submitted)' },
                { l: 'Diterima', v: j.diterima, c: 'var(--color-status-diterima)' },
                { l: 'Ditolak', v: j.ditolak, c: 'var(--color-status-ditolak)' },
                { l: 'Terdaftar', v: j.terdaftar, c: 'var(--color-status-terdaftar)' },
              ].map(s => (
                <div key={s.l} className="flex justify-between py-0.5">
                  <span className="text-text-muted dark:text-dark-text-muted">{s.l}</span>
                  <span className="font-semibold" style={{ color: s.c }}>{s.v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Pendaftar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card-static p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base flex items-center gap-1.5">
            <Users size={18} className="text-accent dark:text-dark-accent" /> Pendaftar Terbaru
          </h3>
          <Link to="/admin/pendaftar" className="text-xs flex items-center gap-1 text-accent dark:text-dark-accent">
            Lihat Semua <ChevronRight size={14} />
          </Link>
        </div>

        {terbaru.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border-default dark:border-dark-border-default">
                  {['Nama', 'No Daftar', 'Jenjang', 'Status', 'Tanggal'].map(h => (
                    <th key={h} className="text-left px-2 py-2.5 text-[0.72rem] font-semibold uppercase tracking-wide text-text-muted dark:text-dark-text-muted">{h}</th>
                  ))}
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {terbaru.map(p => {
                  const badge = statusBadge[p.status] || { bg: 'var(--color-text-muted)', label: p.status };
                  return (
                    <tr key={p.id} className="border-b border-border-default dark:border-dark-border-default">
                      <td className="px-2 py-2.5 font-medium">{p.nama}</td>
                      <td className="px-2 py-2.5 font-mono text-[0.78rem] text-text-secondary dark:text-dark-text-secondary">{p.nomor_daftar}</td>
                      <td className="px-2 py-2.5">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[0.65rem] font-semibold text-white" style={{ background: jenjangColors[p.jenjang] || 'var(--color-text-muted)' }}>{p.jenjang}</span>
                      </td>
                      <td className="px-2 py-2.5">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[0.65rem] font-semibold text-white" style={{ background: badge.bg }}>{badge.label}</span>
                      </td>
                      <td className="px-2 py-2.5 text-[0.78rem] text-text-muted dark:text-dark-text-muted">{p.created_at ? new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}</td>
                      <td className="px-2 py-2.5">
                        <Link to="/admin/pendaftar" className="text-accent dark:text-dark-accent"><ChevronRight size={16} /></Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-text-muted dark:text-dark-text-muted text-center py-8">Belum ada pendaftar</p>
        )}
      </motion.div>
    </div>
  );
}
