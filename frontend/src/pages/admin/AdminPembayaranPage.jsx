import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard, Filter, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight,
  AlertCircle, DollarSign
} from 'lucide-react';
import api from '../../services/api';
import { Skeleton } from '../../components/SkeletonLoader';

const payStatusBadge = {
  PENDING: { bg: 'var(--color-status-submitted)', label: 'Pending' },
  SUKSES: { bg: 'var(--color-status-diterima)', label: 'Sukses' },
  GAGAL: { bg: 'var(--color-status-ditolak)', label: 'Gagal' },
  EXPIRED: { bg: 'var(--color-status-expired)', label: 'Expired' },
};

const jenjangColors = { TK: 'var(--color-accent)', SD: '#2D8A6B', SMP: '#1A6B5A', SMA: '#E0C76A' };

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

  const inputClassName = "px-4 py-2.5 bg-bg-tertiary dark:bg-dark-bg-tertiary border-[1.5px] border-border-default dark:border-dark-border-default rounded-md text-text-primary dark:text-dark-text-primary font-body text-[0.88rem] outline-none transition-colors focus:border-accent dark:focus:border-dark-accent w-full md:w-auto";

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl flex items-center gap-2">
          <CreditCard size={24} className="text-accent dark:text-dark-accent" /> Monitor Pembayaran
        </h1>
      </motion.div>

      {/* Filter */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card-static px-5 py-4 mb-5">
        <div className="flex gap-3 items-center flex-wrap">
          <Filter size={14} className="text-text-muted dark:text-dark-text-muted shrink-0 hidden sm:block" />
          <select value={jenjang} onChange={e => { setJenjang(e.target.value); setPage(1); }} className={`${inputClassName} py-2 min-w-[120px] cursor-pointer px-3`}>
            <option value="semua">Semua Jenjang</option>
            {['TK', 'SD', 'SMP', 'SMA'].map(j => <option key={j} value={j}>{j}</option>)}
          </select>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className={`${inputClassName} py-2 min-w-[140px] cursor-pointer px-3`}>
            <option value="semua">Semua Status</option>
            <option value="PENDING">Pending</option>
            <option value="SUKSES">Sukses</option>
            <option value="GAGAL">Gagal</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static overflow-hidden">
        {loading ? (
          <div className="p-6 flex flex-col gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
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
          <div className="text-center py-12 px-8">
            <DollarSign size={48} className="text-text-muted dark:text-dark-text-muted opacity-50 mx-auto mb-4" />
            <h4 className="text-base mb-1">Tidak ada data pembayaran</h4>
            <p className="text-text-muted dark:text-dark-text-muted text-[0.85rem]">Coba ubah filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[0.85rem]">
              <thead>
                <tr className="border-b-2 border-border-default dark:border-dark-border-default">
                  {['Nama', 'No Daftar', 'Jenjang', 'Jumlah', 'Metode', 'Status', 'Tanggal Bayar'].map(h => (
                    <th key={h} className="text-left px-3 py-3.5 text-[0.72rem] text-text-muted dark:text-dark-text-muted font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map(p => {
                  const badge = payStatusBadge[p.status] || { bg: 'var(--color-text-muted)', label: p.status };
                  return (
                    <tr key={p.id} className="border-b border-border-default dark:border-dark-border-default transition-colors hover:bg-accent/5 dark:hover:bg-dark-accent/5">
                      <td className="px-3 py-3 font-medium">{p.nama}</td>
                      <td className="px-3 py-3 font-mono text-[0.78rem] text-text-secondary dark:text-dark-text-secondary">{p.nomor_daftar}</td>
                      <td className="px-3 py-3">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[0.65rem] font-semibold text-white" style={{ background: jenjangColors[p.jenjang] || 'var(--color-text-muted)' }}>{p.jenjang}</span>
                      </td>
                      <td className="px-3 py-3 font-semibold text-accent dark:text-dark-accent whitespace-nowrap">Rp {(p.jumlah || 0).toLocaleString('id-ID')}</td>
                      <td className="px-3 py-3 text-text-secondary dark:text-dark-text-secondary text-[0.82rem] uppercase">{p.metode || '-'}</td>
                      <td className="px-3 py-3">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-[0.7rem] font-semibold text-white whitespace-nowrap" style={{ background: badge.bg }}>{badge.label}</span>
                      </td>
                      <td className="px-3 py-3 text-text-muted dark:text-dark-text-muted text-[0.8rem] whitespace-nowrap">
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
          <div className="flex justify-between items-center px-5 py-3.5 border-t border-border-default dark:border-dark-border-default text-[0.82rem]">
            <span className="text-text-muted dark:text-dark-text-muted">Hal {pagination.current_page} dari {pagination.last_page} ({pagination.total} data)</span>
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
