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
  DRAFT: { bg: 'var(--status-draft)', label: 'Draft' },
  SUBMITTED: { bg: 'var(--status-submitted)', label: 'Menunggu' },
  MENUNGGU_REVIEW: { bg: 'var(--status-review)', label: 'Review' },
  REVISI: { bg: 'var(--status-revisi)', label: 'Revisi' },
  DITERIMA: { bg: 'var(--status-diterima)', label: 'Diterima' },
  DITOLAK: { bg: 'var(--status-ditolak)', label: 'Ditolak' },
  MENUNGGU_BAYAR: { bg: 'var(--status-bayar)', label: 'Bayar' },
  TERDAFTAR: { bg: 'var(--status-terdaftar)', label: 'Terdaftar' },
};

const jenjangColors = {
  TK: '#C9A84C',
  SD: '#2D8A6B',
  SMP: '#1A6B5A',
  SMA: '#E0C76A',
};

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/dashboard').then(res => {
      setData(res.data.data);
    }).catch(() => setError('Gagal memuat dashboard.'))
    .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <Skeleton width="220px" height="1.75rem" style={{ marginBottom: '0.5rem' }} />
        <Skeleton width="160px" height="0.85rem" style={{ marginBottom: '2rem' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} height="110px" />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <SkeletonCard height="300px" />
          <SkeletonCard height="300px" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <AlertCircle size={48} color="var(--status-ditolak)" style={{ marginBottom: '1rem' }} />
        <h3>{error || 'Data tidak tersedia'}</h3>
      </div>
    );
  }

  const { stats, per_jenjang, tren, terbaru } = data;

  const statCards = [
    { label: 'Total Pendaftar', value: stats.total_pendaftar, icon: Users, color: 'var(--accent-primary)' },
    { label: 'Menunggu Review', value: stats.menunggu_review, icon: Clock, color: 'var(--status-submitted)' },
    { label: 'Diterima', value: stats.diterima, icon: UserCheck, color: 'var(--status-diterima)' },
    { label: 'Ditolak', value: stats.ditolak, icon: UserX, color: 'var(--status-ditolak)' },
    { label: 'Terdaftar', value: stats.terdaftar, icon: GraduationCap, color: 'var(--status-terdaftar)' },
    { label: 'Revenue', value: `Rp ${(stats.total_revenue || 0).toLocaleString('id-ID')}`, icon: DollarSign, color: 'var(--accent-primary-light)', small: true },
  ];

  // Bar chart data: per jenjang
  const barData = per_jenjang.map(j => ({
    jenjang: j.jenjang,
    'Menunggu': j.menunggu_review,
    'Diterima': j.diterima,
    'Ditolak': j.ditolak,
    'Terdaftar': j.terdaftar,
    'Revisi': j.revisi,
  }));

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
          Dashboard <span style={{ color: 'var(--accent-primary)' }}>Admin</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card-static" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `color-mix(in srgb, ${card.color} 12%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={card.color} />
                </div>
              </div>
              <div style={{ fontSize: card.small ? '1.1rem' : '1.85rem', fontWeight: 800, fontFamily: 'var(--font-heading)', lineHeight: 1 }}>{card.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>{card.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="admin-chart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Stacked Bar Chart — Per Jenjang */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <BarChart3 size={18} color="var(--accent-primary)" /> Status per Jenjang
          </h3>
          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis dataKey="jenjang" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text-primary)' }} />
                <Bar dataKey="Menunggu" stackId="a" fill="#F59E0B" radius={[0,0,0,0]} />
                <Bar dataKey="Diterima" stackId="a" fill="#10B981" />
                <Bar dataKey="Ditolak" stackId="a" fill="#EF4444" />
                <Bar dataKey="Terdaftar" stackId="a" fill="#047857" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Line Chart — Tren 7 Hari */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card-static" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <TrendingUp size={18} color="var(--accent-primary)" /> Tren 7 Hari Terakhir
          </h3>
          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tren}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis dataKey="label" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text-primary)' }} />
                <Line type="monotone" dataKey="pendaftar" stroke="#C9A84C" strokeWidth={2} dot={{ r: 4, fill: '#C9A84C' }} name="Pendaftar Baru" />
                <Line type="monotone" dataKey="submit" stroke="#2D8A6B" strokeWidth={2} dot={{ r: 4, fill: '#2D8A6B' }} name="Submit" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Jenjang Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {per_jenjang.map((j, i) => (
          <motion.div key={j.jenjang} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }} className="glass-card-static" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: jenjangColors[j.jenjang] }} />
              <span style={{ fontWeight: 700, fontSize: '1rem', fontFamily: 'var(--font-heading)' }}>Jenjang {j.jenjang}</span>
              <span style={{ marginLeft: 'auto', fontSize: '1.25rem', fontWeight: 800, color: jenjangColors[j.jenjang] }}>{j.total}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem', fontSize: '0.78rem' }}>
              {[
                { l: 'Menunggu', v: j.menunggu_review, c: 'var(--status-submitted)' },
                { l: 'Diterima', v: j.diterima, c: 'var(--status-diterima)' },
                { l: 'Ditolak', v: j.ditolak, c: 'var(--status-ditolak)' },
                { l: 'Terdaftar', v: j.terdaftar, c: 'var(--status-terdaftar)' },
              ].map(s => (
                <div key={s.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{s.l}</span>
                  <span style={{ fontWeight: 600, color: s.c }}>{s.v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Pendaftar Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card-static" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Users size={18} color="var(--accent-primary)" /> Pendaftar Terbaru
          </h3>
          <Link to="/admin/pendaftar" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Lihat Semua <ChevronRight size={14} />
          </Link>
        </div>

        {terbaru.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  {['Nama', 'No Daftar', 'Jenjang', 'Status', 'Tanggal'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.65rem 0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                  <th style={{ width: '40px' }} />
                </tr>
              </thead>
              <tbody>
                {terbaru.map(p => {
                  const badge = statusBadge[p.status] || { bg: 'var(--text-muted)', label: p.status };
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '0.65rem 0.5rem', fontWeight: 500 }}>{p.nama}</td>
                      <td style={{ padding: '0.65rem 0.5rem', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.78rem' }}>{p.nomor_daftar}</td>
                      <td style={{ padding: '0.65rem 0.5rem' }}>
                        <span style={{ display: 'inline-flex', padding: '0.15rem 0.5rem', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 600, color: 'white', background: jenjangColors[p.jenjang] || 'var(--text-muted)' }}>{p.jenjang}</span>
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem' }}>
                        <span style={{ display: 'inline-flex', padding: '0.15rem 0.5rem', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 600, color: 'white', background: badge.bg }}>{badge.label}</span>
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>{p.created_at ? new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}</td>
                      <td style={{ padding: '0.65rem 0.5rem' }}>
                        <Link to={`/admin/pendaftar`} style={{ color: 'var(--accent-primary)' }}><ChevronRight size={16} /></Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Belum ada pendaftar</p>
        )}
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .admin-chart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
