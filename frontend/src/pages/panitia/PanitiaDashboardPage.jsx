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
  DRAFT: 'var(--status-draft)',
  SUBMITTED: 'var(--status-submitted)',
  MENUNGGU_REVIEW: 'var(--status-review)',
  REVISI: 'var(--status-revisi)',
  DITERIMA: 'var(--status-diterima)',
  DITOLAK: 'var(--status-ditolak)',
  MENUNGGU_BAYAR: 'var(--status-bayar)',
  TERDAFTAR: 'var(--status-terdaftar)',
};

const statusLabels = {
  DRAFT: 'Draft',
  SUBMITTED: 'Menunggu',
  MENUNGGU_REVIEW: 'Review',
  REVISI: 'Revisi',
  DITERIMA: 'Diterima',
  DITOLAK: 'Ditolak',
  MENUNGGU_BAYAR: 'Bayar',
  TERDAFTAR: 'Terdaftar',
};

export default function PanitiaDashboardPage() {
  const { jenjang } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/panitia/dashboard').then(res => {
      setData(res.data.data);
    }).catch(() => setError('Gagal memuat dashboard.'))
    .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <Skeleton width="220px" height="1.75rem" style={{ marginBottom: '0.5rem' }} />
        <Skeleton width="160px" height="0.85rem" style={{ marginBottom: '2rem' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[1,2,3,4].map(i => <SkeletonCard key={i} height="120px" />)}
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

  const { stats, distribusi, terbaru, gelombang_aktif } = data;

  const statCards = [
    { label: 'Total Pendaftar', value: stats.total, icon: Users, color: 'var(--accent-primary)', sub: `+${stats.baru_hari_ini} hari ini` },
    { label: 'Menunggu Review', value: stats.menunggu_review, icon: Clock, color: 'var(--status-submitted)', sub: `${stats.submit_hari_ini} submit hari ini` },
    { label: 'Diterima', value: stats.diterima, icon: UserCheck, color: 'var(--status-diterima)', sub: `${stats.terdaftar} terdaftar` },
    { label: 'Ditolak / Revisi', value: stats.ditolak + stats.revisi, icon: UserX, color: 'var(--status-ditolak)', sub: `${stats.revisi} perlu revisi` },
  ];

  // Chart data
  const chartData = distribusi.filter(d => d.jumlah > 0).map(d => ({
    name: statusLabels[d.status] || d.status,
    value: d.jumlah,
    fill: statusColors[d.status] || 'var(--text-muted)',
  }));

  const CHART_COLORS = distribusi.filter(d => d.jumlah > 0).map(d => statusColors[d.status] || '#6B7280');

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
          Dashboard <span style={{ color: 'var(--accent-primary)' }}>{data.jenjang}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card-static" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `color-mix(in srgb, ${card.color} 12%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={card.color} />
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', lineHeight: 1 }}>{card.value}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{card.label}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>{card.sub}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Chart + Gelombang */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Donut Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <BarChart3 size={18} color="var(--accent-primary)" /> Distribusi Status
          </h3>
          {chartData.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ width: '160px', height: '160px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                      {chartData.map((entry, index) => (
                        <Cell key={index} fill={CHART_COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                {chartData.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: CHART_COLORS[i], flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{d.name}</span>
                    <span style={{ fontWeight: 600 }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Belum ada data</p>
          )}
        </motion.div>

        {/* Gelombang Aktif */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card-static" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CalendarDays size={18} color="var(--accent-primary)" /> Gelombang Aktif
          </h3>
          {gelombang_aktif ? (
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>{gelombang_aktif.nama}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* Kuota bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Kuota Terisi</span>
                    <span style={{ fontWeight: 600 }}>{gelombang_aktif.terisi} / {gelombang_aktif.kuota}</span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '4px', background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: '4px', background: gelombang_aktif.sisa <= 5 ? 'var(--status-ditolak)' : 'var(--accent-primary-light)', width: `${Math.min(100, (gelombang_aktif.terisi / gelombang_aktif.kuota) * 100)}%`, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.5rem 0', borderTop: '1px solid var(--glass-border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Sisa Kuota</span>
                  <span style={{ fontWeight: 600, color: gelombang_aktif.sisa <= 5 ? 'var(--status-ditolak)' : 'var(--accent-primary-light)' }}>{gelombang_aktif.sisa}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.5rem 0', borderTop: '1px solid var(--glass-border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Tutup</span>
                  <span style={{ fontWeight: 500 }}>{new Date(gelombang_aktif.tanggal_tutup).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Tidak ada gelombang aktif</p>
          )}
        </motion.div>
      </div>

      {/* Pendaftar Terbaru */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card-static" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileText size={18} color="var(--accent-primary)" /> Menunggu Review
          </h3>
          <Link to="/panitia/pendaftar?status=SUBMITTED" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Lihat Semua <ChevronRight size={14} />
          </Link>
        </div>

        {terbaru.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  {['Nama', 'No Daftar', 'Gelombang', 'Tanggal Submit'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.65rem 0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                  <th style={{ width: '40px' }} />
                </tr>
              </thead>
              <tbody>
                {terbaru.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '0.65rem 0.5rem', fontWeight: 500 }}>{p.nama}</td>
                    <td style={{ padding: '0.65rem 0.5rem', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.78rem' }}>{p.nomor_daftar}</td>
                    <td style={{ padding: '0.65rem 0.5rem', color: 'var(--text-secondary)' }}>{p.gelombang || '-'}</td>
                    <td style={{ padding: '0.65rem 0.5rem', color: 'var(--text-muted)' }}>{p.submitted_at ? new Date(p.submitted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}</td>
                    <td style={{ padding: '0.65rem 0.5rem' }}>
                      <Link to={`/panitia/pendaftar/${p.id}`} style={{ color: 'var(--accent-primary)' }}><ChevronRight size={16} /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Tidak ada pendaftar yang menunggu review</p>
        )}
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
