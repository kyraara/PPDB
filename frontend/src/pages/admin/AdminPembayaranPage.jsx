import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard, Filter, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight,
  AlertCircle, DollarSign
} from 'lucide-react';
import api from '../../services/api';
import { Skeleton } from '../../components/SkeletonLoader';

const payStatusBadge = {
  PENDING: { bg: 'var(--status-submitted)', label: 'Pending' },
  SUKSES: { bg: 'var(--status-diterima)', label: 'Sukses' },
  GAGAL: { bg: 'var(--status-ditolak)', label: 'Gagal' },
  EXPIRED: { bg: 'var(--status-expired)', label: 'Expired' },
};

const jenjangColors = { TK: '#C9A84C', SD: '#2D8A6B', SMP: '#1A6B5A', SMA: '#E0C76A' };

export default function PembayaranPage() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('semua');
  const [jenjang, setJenjang] = useState('semua');
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status !== 'semua') params.append('status', status);
      if (jenjang !== 'semua') params.append('jenjang', jenjang);
      params.append('page', page);
      params.append('per_page', 15);

      const res = await api.get(`/admin/pembayaran?${params.toString()}`);
      setData(res.data.data);
      setPagination(res.data.pagination);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [status, jenjang, page]);

  const inputStyle = {
    padding: '0.65rem 1rem', background: 'var(--bg-tertiary)',
    border: '1.5px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.88rem',
    outline: 'none', transition: 'border 0.3s',
  };

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CreditCard size={24} color="var(--accent-primary)" /> Monitor Pembayaran
        </h1>
      </motion.div>

      {/* Filter */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card-static" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Filter size={14} color="var(--text-muted)" />
          <select value={jenjang} onChange={e => { setJenjang(e.target.value); setPage(1); }} style={{ ...inputStyle, padding: '0.65rem 0.75rem', minWidth: '120px', cursor: 'pointer' }}>
            <option value="semua">Semua Jenjang</option>
            {['TK', 'SD', 'SMP', 'SMA'].map(j => <option key={j} value={j}>{j}</option>)}
          </select>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} style={{ ...inputStyle, padding: '0.65rem 0.75rem', minWidth: '140px', cursor: 'pointer' }}>
            <option value="semua">Semua Status</option>
            <option value="PENDING">Pending</option>
            <option value="SUKSES">Sukses</option>
            <option value="GAGAL">Gagal</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Skeleton width="20%" height="1rem" />
                <Skeleton width="20%" height="1rem" />
                <Skeleton width="12%" height="1.5rem" borderRadius="50px" />
                <Skeleton width="15%" height="1rem" />
                <Skeleton width="12%" height="1.5rem" borderRadius="50px" />
                <Skeleton width="15%" height="1rem" />
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <DollarSign size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h4 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>Tidak ada data pembayaran</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Coba ubah filter.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
                  {['Nama', 'No Daftar', 'Jenjang', 'Jumlah', 'Metode', 'Status', 'Tanggal Bayar'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.85rem 0.75rem', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map(p => {
                  const badge = payStatusBadge[p.status] || { bg: 'var(--text-muted)', label: p.status };
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 500 }}>{p.nama}</td>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{p.nomor_daftar}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ display: 'inline-flex', padding: '0.15rem 0.5rem', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 600, color: 'white', background: jenjangColors[p.jenjang] || 'var(--text-muted)' }}>{p.jenjang}</span>
                      </td>
                      <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)' }}>Rp {(p.jumlah || 0).toLocaleString('id-ID')}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.82rem', textTransform: 'uppercase' }}>{p.metode || '-'}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ display: 'inline-flex', padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 600, color: 'white', background: badge.bg }}>{badge.label}</span>
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {p.paid_at ? new Date(p.paid_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.25rem', borderTop: '1px solid var(--glass-border)', fontSize: '0.82rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Hal {pagination.current_page} dari {pagination.last_page} ({pagination.total} data)</span>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {[
                { icon: ChevronsLeft, onClick: () => setPage(1), disabled: page <= 1 },
                { icon: ChevronLeft, onClick: () => setPage(p => Math.max(1, p - 1)), disabled: page <= 1 },
                { icon: ChevronRight, onClick: () => setPage(p => Math.min(pagination.last_page, p + 1)), disabled: page >= pagination.last_page },
                { icon: ChevronsRight, onClick: () => setPage(pagination.last_page), disabled: page >= pagination.last_page },
              ].map(({ icon: Icon, onClick, disabled }, i) => (
                <button key={i} onClick={onClick} disabled={disabled} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'transparent', color: disabled ? 'var(--text-muted)' : 'var(--accent-primary)', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.4 : 1 }}>
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
