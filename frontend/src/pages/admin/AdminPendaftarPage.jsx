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

  const inputClassName = "px-4 py-2.5 bg-bg-tertiary dark:bg-dark-bg-tertiary border-[1.5px] border-border-default dark:border-dark-border-default rounded-md text-text-primary dark:text-dark-text-primary font-body text-[0.88rem] outline-none transition-colors focus:border-accent dark:focus:border-dark-accent w-full";

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl flex items-center gap-2">
            <Users size={24} className="text-accent dark:text-dark-accent" /> Semua Pendaftar
          </h1>
          <p className="text-text-secondary dark:text-dark-text-secondary text-[0.85rem] mt-1">Data pendaftar lintas semua jenjang</p>
        </div>
        <button onClick={handleExport} disabled={exporting || loading || data.length === 0} className="btn btn-secondary btn-sm flex items-center gap-2">
          <Download size={16} /> {exporting ? 'Mengekspor...' : 'Export CSV'}
        </button>
      </motion.div>

      {/* Filter bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card-static px-5 py-4 mb-5">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2 w-full min-w-[200px]">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-dark-text-muted" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama / nomor daftar..." className={`${inputClassName} pl-9`} />
            </div>
            <button type="submit" className="btn btn-primary btn-sm shrink-0">Cari</button>
          </form>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter size={14} className="text-text-muted dark:text-dark-text-muted shrink-0" />
            <select value={jenjang} onChange={e => { setJenjang(e.target.value); setPage(1); }} className={`${inputClassName} py-2 min-w-[100px] cursor-pointer w-full md:w-auto px-3`}>
              <option value="semua">Semua Jenjang</option>
              {['TK', 'SD', 'SMP', 'SMA'].map(j => <option key={j} value={j}>{j}</option>)}
            </select>
            <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className={`${inputClassName} py-2 min-w-[140px] cursor-pointer w-full md:w-auto px-3`}>
              {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static overflow-hidden">
        {loading ? (
          <div className="p-6 flex flex-col gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
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
          <div className="text-center py-12 px-8">
            <Users size={48} className="text-text-muted dark:text-dark-text-muted opacity-50 mx-auto mb-4" />
            <h4 className="text-base mb-1">Tidak ada pendaftar</h4>
            <p className="text-text-muted dark:text-dark-text-muted text-[0.85rem]">Coba ubah filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[0.85rem]">
              <thead>
                <tr className="border-b-2 border-border-default dark:border-dark-border-default">
                  {['No', 'Nama Siswa', 'Nomor Daftar', 'Jenjang', 'Status', 'Gelombang', 'Tgl Submit'].map(h => (
                    <th key={h} className="text-left px-3 py-3.5 text-[0.72rem] text-text-muted dark:text-dark-text-muted font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((p, i) => {
                  const badge = statusBadge[p.status] || { bg: 'var(--color-text-muted)', label: p.status };
                  const rowNum = ((pagination?.current_page || 1) - 1) * 15 + i + 1;
                  return (
                    <tr key={p.id} className="border-b border-border-default dark:border-dark-border-default transition-colors hover:bg-accent/5 dark:hover:bg-dark-accent/5">
                      <td className="px-3 py-3 text-text-muted dark:text-dark-text-muted text-[0.78rem]">{rowNum}</td>
                      <td className="px-3 py-3 font-medium">{p.nama}</td>
                      <td className="px-3 py-3 font-mono text-[0.78rem] text-text-secondary dark:text-dark-text-secondary">{p.nomor_daftar}</td>
                      <td className="px-3 py-3">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[0.65rem] font-semibold text-white" style={{ background: jenjangColors[p.jenjang] || 'var(--color-text-muted)' }}>{p.jenjang}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-[0.7rem] font-semibold text-white whitespace-nowrap" style={{ background: badge.bg }}>{badge.label}</span>
                      </td>
                      <td className="px-3 py-3 text-text-secondary dark:text-dark-text-secondary text-[0.82rem]">{p.gelombang || '-'}</td>
                      <td className="px-3 py-3 text-text-muted dark:text-dark-text-muted text-[0.8rem] whitespace-nowrap">
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
          <div className="flex justify-between items-center px-5 py-3.5 border-t border-border-default dark:border-dark-border-default text-[0.82rem]">
            <span className="text-text-muted dark:text-dark-text-muted">
              Halaman {pagination.current_page} dari {pagination.last_page} ({pagination.total} data)
            </span>
            <div className="flex gap-1.5">
              {[
                { icon: ChevronsLeft, onClick: () => setPage(1), disabled: page <= 1 },
                { icon: ChevronLeft, onClick: () => setPage(p => Math.max(1, p - 1)), disabled: page <= 1 },
                { icon: ChevronRight, onClick: () => setPage(p => Math.min(pagination.last_page, p + 1)), disabled: page >= pagination.last_page },
                { icon: ChevronsRight, onClick: () => setPage(pagination.last_page), disabled: page >= pagination.last_page },
              ].map(({ icon: Icon, onClick, disabled }, i) => (
                <button key={i} onClick={onClick} disabled={disabled} 
                  className={`w-8 h-8 flex items-center justify-center rounded-sm border border-border-default dark:border-dark-border-default bg-transparent transition-colors
                    ${disabled ? 'text-text-muted dark:text-dark-text-muted cursor-default opacity-40' : 'text-accent dark:text-dark-accent cursor-pointer hover:bg-accent-bg dark:hover:bg-dark-accent-bg'}`}>
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
