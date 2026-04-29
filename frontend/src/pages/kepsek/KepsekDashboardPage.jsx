import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, UserCheck, GraduationCap, DollarSign, BarChart3,
  TrendingUp, AlertCircle, CalendarDays
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '../../services/api';
import { Skeleton, SkeletonCard } from '../../components/SkeletonLoader';

const jenjangColors = { TK: '#C9A84C', SD: '#2D8A6B', SMP: '#1A6B5A', SMA: '#E0C76A' };
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[1,2,3,4,5].map(i => <SkeletonCard key={i} height="110px" />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <SkeletonCard height="320px" />
          <SkeletonCard height="320px" />
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

  const { stats, per_jenjang, distribusi, gelombang, tren_mingguan } = data;

  const statCards = [
    { label: 'Total Pendaftar', value: stats.total_pendaftar, icon: Users, color: 'var(--accent-primary)' },
    { label: 'Diterima', value: stats.total_diterima, icon: UserCheck, color: 'var(--status-diterima)' },
    { label: 'Terdaftar', value: stats.total_terdaftar, icon: GraduationCap, color: 'var(--status-terdaftar)' },
    { label: 'Ditolak', value: stats.total_ditolak, icon: AlertCircle, color: 'var(--status-ditolak)' },
    { label: 'Revenue', value: `Rp ${(stats.total_revenue || 0).toLocaleString('id-ID')}`, icon: DollarSign, color: 'var(--accent-primary-light)', small: true },
  ];

  // Bar data: stacked per jenjang
  const barData = per_jenjang.map(j => ({
    jenjang: j.jenjang,
    'Menunggu': j.menunggu_review,
    'Diterima': j.diterima,
    'Ditolak': j.ditolak,
    'Terdaftar': j.terdaftar,
    'Revisi': j.revisi,
  }));

  // Donut data
  const donutData = distribusi.filter(d => d.jumlah > 0).map(d => ({
    name: statusLabels[d.status] || d.status,
    value: d.jumlah,
    color: statusColors[d.status] || '#6B7280',
  }));

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
            Dashboard <span style={{ color: 'var(--accent-primary-light)' }}>Kepala Sekolah</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button 
          onClick={async () => {
            try {
              const res = await api.get('/kepsek/export/laporan', { responseType: 'blob' });
              const url = window.URL.createObjectURL(new Blob([res.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `Laporan_Kepsek_${new Date().getTime()}.pdf`);
              document.body.appendChild(link);
              link.click();
              link.parentNode.removeChild(link);
            } catch (e) {
              alert('Gagal mencetak laporan');
            }
          }}
          className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Cetak Laporan
        </button>
      </motion.div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card-static" style={{ padding: '1.25rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `color-mix(in srgb, ${card.color} 12%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <Icon size={18} color={card.color} />
              </div>
              <div style={{ fontSize: card.small ? '1.1rem' : '1.85rem', fontWeight: 800, fontFamily: 'var(--font-heading)', lineHeight: 1 }}>{card.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>{card.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="kepsek-chart-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Stacked Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <BarChart3 size={18} color="var(--accent-primary-light)" /> Distribusi per Jenjang
          </h3>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis dataKey="jenjang" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text-primary)' }} />
                <Bar dataKey="Menunggu" stackId="a" fill="#F59E0B" />
                <Bar dataKey="Diterima" stackId="a" fill="#10B981" />
                <Bar dataKey="Ditolak" stackId="a" fill="#EF4444" />
                <Bar dataKey="Terdaftar" stackId="a" fill="#047857" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Donut Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card-static" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <TrendingUp size={18} color="var(--accent-primary-light)" /> Distribusi Status Global
          </h3>
          {donutData.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '180px', height: '180px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donutData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                      {donutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem 1rem' }}>
                {donutData.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: d.color }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                    <span style={{ fontWeight: 600 }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Belum ada data</p>
          )}
        </motion.div>
      </div>

      {/* Tren Mingguan */}
      {tren_mingguan && tren_mingguan.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card-static" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CalendarDays size={18} color="var(--accent-primary-light)" /> Tren 4 Minggu Terakhir
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            {tren_mingguan.map((t, i) => (
              <div key={i} style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{t.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--accent-primary-light)' }}>{t.pendaftar}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>pendaftar baru</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--status-diterima)', marginTop: '0.5rem' }}>{t.diterima} diterima</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Gelombang Overview Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card-static" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
          <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CalendarDays size={18} color="var(--accent-primary-light)" /> Ringkasan Gelombang
          </h3>
        </div>
        {gelombang.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  {['Jenjang', 'Gelombang', 'Kuota', 'Terisi', 'Sisa', 'Status', 'Tutup'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gelombang.map(g => (
                  <tr key={g.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ display: 'inline-flex', padding: '0.15rem 0.5rem', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 600, color: 'white', background: jenjangColors[g.jenjang] }}>{g.jenjang}</span>
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 500 }}>{g.nama}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{g.kuota}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 600 }}>{g.terisi}</span>
                        <div style={{ height: '5px', borderRadius: '3px', background: 'var(--bg-primary)', overflow: 'hidden', width: '60px' }}>
                          <div style={{ height: '100%', borderRadius: '3px', background: g.sisa <= 5 ? 'var(--status-ditolak)' : 'var(--accent-primary-light)', width: `${Math.min(100, (g.terisi / g.kuota) * 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 600, color: g.sisa <= 5 ? 'var(--status-ditolak)' : 'var(--accent-primary-light)' }}>{g.sisa}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ display: 'inline-flex', padding: '0.15rem 0.5rem', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 600, color: 'white', background: g.status === 'BUKA' ? 'var(--status-diterima)' : g.status === 'TUTUP' ? 'var(--status-ditolak)' : 'var(--status-submitted)' }}>
                        {g.status === 'BUKA' ? 'Buka' : g.status === 'TUTUP' ? 'Tutup' : 'Akan Datang'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {g.tanggal_tutup ? new Date(g.tanggal_tutup).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada gelombang</p>
        )}
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .kepsek-chart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
