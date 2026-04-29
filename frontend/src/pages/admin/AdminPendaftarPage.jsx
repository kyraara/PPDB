import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight,
  Users, AlertCircle, Download
} from 'lucide-react';
import api from '../../services/api';
import { Skeleton } from '../../components/SkeletonLoader';

const statusOptions = [
  { value: 'semua', label: 'Semua Status' },
  { value: 'SUBMITTED', label: 'Menunggu Review' },
  { value: 'MENUNGGU_REVIEW', label: 'Sedang Review' },
  { value: 'DITERIMA', label: 'Diterima' },
  { value: 'DITOLAK', label: 'Ditolak' },
  { value: 'REVISI', label: 'Revisi' },
  { value: 'MENUNGGU_BAYAR', label: 'Menunggu Bayar' },
  { value: 'TERDAFTAR', label: 'Terdaftar' },
  { value: 'DRAFT', label: 'Draft' },
];

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

const jenjangColors = { TK: '#C9A84C', SD: '#2D8A6B', SMP: '#1A6B5A', SMA: '#E0C76A' };

export default function AdminPendaftarPage() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('semua');
  const [jenjang, setJenjang] = useState('semua');
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status !== 'semua') params.append('status', status);
      if (jenjang !== 'semua') params.append('jenjang', jenjang);
      if (search) params.append('search', search);
      params.append('page', page);
      params.append('per_page', 15);

      const res = await api.get(`/admin/pendaftar?${params.toString()}`);
      setData(res.data.data);
      setPagination(res.data.pagination);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [status, jenjang, page]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchData(); };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (status !== 'semua') params.append('status', status);
      if (jenjang !== 'semua') params.append('jenjang', jenjang);
      
      const response = await api.get(`/admin/export/pendaftar?${params.toString()}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Export_Pendaftar_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('Gagal mengekspor data.');
    } finally {
      setExporting(false);
    }
  };

  const inputStyle = {
    padding: '0.65rem 1rem', background: 'var(--bg-tertiary)',
    border: '1.5px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.88rem',
    outline: 'none', transition: 'border 0.3s',
  };

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={24} color="var(--accent-primary)" /> Semua Pendaftar
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Data pendaftar lintas semua jenjang</p>
        </div>
        <button onClick={handleExport} disabled={exporting || loading || data.length === 0} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={16} /> {exporting ? 'Mengekspor...' : 'Export CSV'}
        </button>
      </motion.div>

      {/* Filter bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card-static" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
        <div className="admin-filter-bar" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', gap: '0.5rem', minWidth: '200px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama / nomor daftar..." style={{ ...inputStyle, paddingLeft: '2.25rem', width: '100%' }} />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">Cari</button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={14} color="var(--text-muted)" />
            <select value={jenjang} onChange={e => { setJenjang(e.target.value); setPage(1); }} style={{ ...inputStyle, padding: '0.65rem 0.75rem', minWidth: '100px', cursor: 'pointer' }}>
              <option value="semua">Semua Jenjang</option>
              {['TK', 'SD', 'SMP', 'SMA'].map(j => <option key={j} value={j}>{j}</option>)}
            </select>
            <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} style={{ ...inputStyle, padding: '0.65rem 0.75rem', minWidth: '140px', cursor: 'pointer' }}>
              {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Skeleton width="4%" height="1rem" />
                <Skeleton width="22%" height="1rem" />
                <Skeleton width="18%" height="1rem" />
                <Skeleton width="8%" height="1.5rem" borderRadius="50px" />
                <Skeleton width="10%" height="1.5rem" borderRadius="50px" />
                <Skeleton width="13%" height="1rem" />
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <Users size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h4 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>Tidak ada pendaftar</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Coba ubah filter.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
                  {['No', 'Nama Siswa', 'Nomor Daftar', 'Jenjang', 'Status', 'Gelombang', 'Tgl Submit'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.85rem 0.75rem', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((p, i) => {
                  const badge = statusBadge[p.status] || { bg: 'var(--text-muted)', label: p.status };
                  const rowNum = ((pagination?.current_page || 1) - 1) * 15 + i + 1;
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'color-mix(in srgb, var(--accent-primary) 3%, transparent)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>{rowNum}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 500 }}>{p.nama}</td>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{p.nomor_daftar}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ display: 'inline-flex', padding: '0.15rem 0.5rem', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 600, color: 'white', background: jenjangColors[p.jenjang] || 'var(--text-muted)' }}>{p.jenjang}</span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ display: 'inline-flex', padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 600, color: 'white', background: badge.bg, whiteSpace: 'nowrap' }}>{badge.label}</span>
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{p.gelombang || '-'}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {p.submitted_at ? new Date(p.submitted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
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
            <span style={{ color: 'var(--text-muted)' }}>
              Halaman {pagination.current_page} dari {pagination.last_page} ({pagination.total} data)
            </span>
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

      <style>{`
        @media (max-width: 640px) {
          .admin-filter-bar { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
}
