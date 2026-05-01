import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, User, Users, FileText, CheckCircle2, XCircle,
  AlertTriangle, File, Eye, Hash, GraduationCap, CalendarDays,
  Phone, MapPin, Briefcase, Loader2, MessageSquare, Clock
} from 'lucide-react';
import api from '../../services/api';
import { Skeleton, SkeletonCard } from '../../components/SkeletonLoader';

const statusBadge = {
  DRAFT: { bg: 'var(--color-status-draft)', label: 'Draft' },
  SUBMITTED: { bg: 'var(--color-status-submitted)', label: 'Menunggu Review' },
  MENUNGGU_REVIEW: { bg: 'var(--color-status-review)', label: 'Sedang Review' },
  REVISI: { bg: 'var(--color-status-revisi)', label: 'Perlu Revisi' },
  DITERIMA: { bg: 'var(--color-status-diterima)', label: 'Diterima' },
  DITOLAK: { bg: 'var(--color-status-ditolak)', label: 'Ditolak' },
  MENUNGGU_BAYAR: { bg: 'var(--color-status-bayar)', label: 'Menunggu Bayar' },
  TERDAFTAR: { bg: 'var(--color-status-terdaftar)', label: 'Terdaftar' },
};

const docStatusBadge = {
  PENDING: { bg: 'var(--color-status-submitted)', label: 'Pending' },
  VALID: { bg: 'var(--color-status-diterima)', label: 'Valid' },
  INVALID: { bg: 'var(--color-status-ditolak)', label: 'Invalid' },
};

export default function PendaftarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('siswa');
  const [showStatusModal, setShowStatusModal] = useState(null); // 'DITERIMA' | 'DITOLAK' | 'REVISI'
  const [catatan, setCatatan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchDetail = async () => {
    try {
      const res = await api.get(`/panitia/pendaftar/${id}`);
      setData(res.data.data);
    } catch { setError('Gagal memuat data pendaftar.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDetail(); }, [id]);

  const handleUpdateStatus = async () => {
    if (['DITOLAK', 'REVISI'].includes(showStatusModal) && !catatan.trim()) {
      setError('Catatan wajib diisi untuk status ' + showStatusModal); return;
    }
    setSubmitting(true); setError('');
    try {
      const res = await api.patch(`/panitia/pendaftar/${id}/status`, {
        status: showStatusModal, catatan_panitia: catatan || null,
      });
      if (res.data.success) {
        setSuccess(res.data.message);
        setShowStatusModal(null);
        setCatatan('');
        setData(prev => ({ ...prev, pendaftaran: res.data.data }));
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) { setError(err.response?.data?.message || 'Gagal mengubah status.'); }
    finally { setSubmitting(false); }
  };

  const handleUpdateDoc = async (dokId, newStatus, note) => {
    try {
      await api.patch(`/panitia/pendaftar/${id}/dokumen/${dokId}`, {
        status: newStatus, catatan: note || null,
      });
      fetchDetail();
    } catch {}
  };

  if (loading) {
    return (
      <div>
        <Skeleton width="120px" height="0.85rem" style={{ marginBottom: '1.5rem' }} />
        <SkeletonCard height="200px" />
        <div className="mt-5"><SkeletonCard height="300px" /></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16 px-8">
        <AlertTriangle size={48} className="text-status-ditolak mx-auto mb-4" />
        <h3 className="text-lg">Pendaftar tidak ditemukan</h3>
        <Link to="/panitia/pendaftar" className="btn btn-secondary mt-4 inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Kembali
        </Link>
      </div>
    );
  }

  const { pendaftaran: p, persyaratan_dokumen: persyaratan } = data;
  const siswa = p.data_siswa;
  const ortu = p.data_ortu || [];
  const docs = p.dokumen || [];
  const badge = statusBadge[p.status] || { bg: 'var(--color-text-muted)', label: p.status };
  const canReview = ['SUBMITTED', 'MENUNGGU_REVIEW'].includes(p.status);

  const tabs = [
    { key: 'siswa', label: 'Data Siswa', icon: User },
    { key: 'ortu', label: 'Data Orang Tua', icon: Users },
    { key: 'dokumen', label: 'Dokumen', icon: FileText, count: docs.length },
  ];

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex justify-between items-start py-2 border-b border-border-default dark:border-dark-border-default text-[0.85rem]">
      <span className="text-text-muted dark:text-dark-text-muted flex items-center gap-1.5 min-w-[120px]">
        {Icon && <Icon size={13} className="text-accent dark:text-dark-accent" />}{label}
      </span>
      <span className="font-medium text-right flex-1 ml-4 text-text-primary dark:text-dark-text-primary">{value || '—'}</span>
    </div>
  );

  return (
    <div>
      {/* Breadcrumb */}
      <Link to="/panitia/pendaftar" className="inline-flex items-center gap-1.5 text-[0.85rem] text-text-muted dark:text-dark-text-muted hover:text-accent dark:hover:text-dark-accent transition-colors mb-5 no-underline">
        <ArrowLeft size={16} /> Kembali ke Daftar
      </Link>

      {/* Header Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static p-6 mb-5">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div className="flex-1">
            <h2 className="text-[1.35rem] font-heading font-bold mb-1.5">{siswa?.nama_lengkap || 'Nama belum diisi'}</h2>
            <div className="flex flex-wrap gap-3 text-[0.82rem] text-text-secondary dark:text-dark-text-secondary">
              <span className="flex items-center gap-1"><Hash size={13} className="text-accent dark:text-dark-accent" />{p.nomor_daftar}</span>
              <span className="flex items-center gap-1"><GraduationCap size={13} className="text-accent dark:text-dark-accent" />{p.jenjang}</span>
              <span className="flex items-center gap-1"><CalendarDays size={13} className="text-accent dark:text-dark-accent" />{p.gelombang?.nama || '-'}</span>
            </div>
          </div>
          <span className="inline-flex px-3.5 py-1 rounded-full text-[0.78rem] font-semibold text-white" style={{ background: badge.bg }}>{badge.label}</span>
        </div>

        {/* Catatan panitia sebelumnya */}
        {p.catatan_panitia && (
          <div className="mt-4 p-3 rounded-md bg-accent-bg/50 border border-accent-bg-strong text-[0.82rem]">
            <div className="flex items-center gap-1.5 text-accent dark:text-dark-accent font-semibold mb-1">
              <MessageSquare size={13} /> Catatan Panitia
            </div>
            <p className="text-text-secondary dark:text-dark-text-secondary">{p.catatan_panitia}</p>
          </div>
        )}

        {p.reviewed_at && (
          <div className="mt-2 text-[0.72rem] text-text-muted dark:text-dark-text-muted flex items-center gap-1">
            <Clock size={11} /> Direview {new Date(p.reviewed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            {p.reviewer && <> oleh {p.reviewer.nama_lengkap}</>}
          </div>
        )}
      </motion.div>

      {/* Success / Error */}
      {success && <div className="p-3 rounded-md mb-4 text-[0.85rem] flex items-center gap-1.5 text-status-diterima border border-status-diterima/25 bg-status-diterima/10"><CheckCircle2 size={14} />{success}</div>}
      {error && <div className="p-3 rounded-md mb-4 text-[0.85rem] flex items-center gap-1.5 text-status-ditolak border border-status-ditolak/25 bg-status-ditolak/10"><AlertTriangle size={14} />{error}</div>}

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 no-scrollbar">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} 
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-md border-[1.5px] cursor-pointer text-[0.82rem] whitespace-nowrap transition-all duration-200
                ${active 
                  ? 'border-accent dark:border-dark-accent bg-accent-bg dark:bg-dark-accent-bg text-accent dark:text-dark-accent font-semibold' 
                  : 'border-border-default dark:border-dark-border-default bg-transparent text-text-secondary dark:text-dark-text-secondary font-normal hover:bg-bg-tertiary dark:hover:bg-dark-bg-tertiary'}`}>
              <Icon size={15} />{tab.label}
              {tab.count !== undefined && <span className={`text-[0.7rem] w-4.5 h-4.5 rounded-full flex items-center justify-center ${active ? 'bg-accent dark:bg-dark-accent text-[#0B1A0F]' : 'bg-text-muted dark:bg-dark-text-muted text-white'}`}>{tab.count}</span>}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="glass-card-static p-6 mb-5">
        {activeTab === 'siswa' && (
          siswa ? (
            <div>
              <InfoRow icon={User} label="Nama Lengkap" value={siswa.nama_lengkap} />
              <InfoRow icon={Hash} label="NIK" value={siswa.nik} />
              {siswa.nisn && <InfoRow icon={Hash} label="NISN" value={siswa.nisn} />}
              <InfoRow icon={CalendarDays} label="TTL" value={`${siswa.tempat_lahir}, ${new Date(siswa.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`} />
              <InfoRow label="Jenis Kelamin" value={siswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} />
              <InfoRow label="Agama" value={siswa.agama} />
              <InfoRow icon={MapPin} label="Alamat" value={siswa.alamat} />
              {siswa.asal_sekolah && <InfoRow icon={GraduationCap} label="Asal Sekolah" value={siswa.asal_sekolah} />}
            </div>
          ) : <p className="text-text-muted dark:text-dark-text-muted">Data siswa belum diisi.</p>
        )}

        {activeTab === 'ortu' && (
          ortu.length > 0 ? ortu.map((o, i) => (
            <div key={i} className={`mb-5 pb-5 ${i < ortu.length - 1 ? 'border-b-2 border-border-default dark:border-dark-border-default' : 'mb-0 pb-0'}`}>
              <div className="text-[0.8rem] font-semibold text-accent dark:text-dark-accent mb-2 uppercase tracking-wide">{o.tipe}</div>
              <InfoRow icon={User} label="Nama" value={o.nama} />
              <InfoRow icon={Phone} label="No HP" value={o.no_hp} />
              {o.pekerjaan && <InfoRow icon={Briefcase} label="Pekerjaan" value={o.pekerjaan} />}
              {o.alamat && <InfoRow icon={MapPin} label="Alamat" value={o.alamat} />}
            </div>
          )) : <p className="text-text-muted dark:text-dark-text-muted">Data orang tua belum diisi.</p>
        )}

        {activeTab === 'dokumen' && (
          <div>
            {persyaratan.map(req => {
              const doc = docs.find(d => d.jenis_dokumen === req.kode);
              const dBadge = doc ? (docStatusBadge[doc.status] || docStatusBadge.PENDING) : null;
              return (
                <div key={req.kode} className="py-3 border-b border-border-default dark:border-dark-border-default">
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <File size={14} className="text-accent dark:text-dark-accent" />
                      <span className="font-medium text-[0.88rem]">{req.nama}</span>
                      {req.wajib && <span className="text-[0.6rem] text-status-ditolak font-semibold">WAJIB</span>}
                    </div>
                    {doc && (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[0.65rem] font-semibold text-white" style={{ background: dBadge.bg }}>{dBadge.label}</span>
                    )}
                  </div>

                  {doc ? (
                    <div className="ml-5">
                      <div className="flex items-center gap-3 flex-wrap text-[0.78rem] text-text-muted dark:text-dark-text-muted mb-2">
                        <span>{doc.nama_file}</span>
                        <span>{(doc.ukuran_file / 1024).toFixed(0)} KB</span>
                        <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${doc.path_file}`} target="_blank" rel="noopener" className="flex items-center gap-1 text-accent dark:text-dark-accent hover:underline">
                          <Eye size={12} /> Lihat
                        </a>
                      </div>
                      {doc.catatan && <div className="text-[0.78rem] text-status-revisi mb-1.5">Catatan: {doc.catatan}</div>}

                      {/* Review actions */}
                      {canReview && (
                        <div className="flex gap-1.5 mt-1.5">
                          <button onClick={() => handleUpdateDoc(doc.id, 'VALID', null)} disabled={doc.status === 'VALID'} 
                            className={`px-2.5 py-1 rounded-sm border border-status-diterima text-[0.72rem] flex items-center gap-1 transition-colors
                              ${doc.status === 'VALID' ? 'bg-status-diterima/15 text-status-diterima cursor-default' : 'bg-transparent text-status-diterima cursor-pointer hover:bg-status-diterima/10'}`}>
                            <CheckCircle2 size={11} /> Valid
                          </button>
                          <button onClick={() => { const note = prompt('Catatan (opsional):'); handleUpdateDoc(doc.id, 'INVALID', note); }} disabled={doc.status === 'INVALID'} 
                            className={`px-2.5 py-1 rounded-sm border border-status-ditolak text-[0.72rem] flex items-center gap-1 transition-colors
                              ${doc.status === 'INVALID' ? 'bg-status-ditolak/15 text-status-ditolak cursor-default' : 'bg-transparent text-status-ditolak cursor-pointer hover:bg-status-ditolak/10'}`}>
                            <XCircle size={11} /> Invalid
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="ml-5 text-[0.78rem] text-text-muted dark:text-dark-text-muted italic">Belum diupload</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Status Actions */}
      {canReview && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static p-6">
          <h4 className="text-[0.85rem] text-text-muted dark:text-dark-text-muted font-semibold mb-4 uppercase tracking-wide">Tindakan</h4>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => setShowStatusModal('DITERIMA')} className="btn btn-sm bg-status-diterima text-white border-none hover:bg-status-diterima/90 flex items-center gap-1.5">
              <CheckCircle2 size={15} /> Terima
            </button>
            <button onClick={() => setShowStatusModal('REVISI')} className="btn btn-sm bg-transparent text-status-revisi border-[1.5px] border-status-revisi hover:bg-status-revisi/10 flex items-center gap-1.5">
              <AlertTriangle size={15} /> Minta Revisi
            </button>
            <button onClick={() => setShowStatusModal('DITOLAK')} className="btn btn-sm bg-transparent text-status-ditolak border-[1.5px] border-status-ditolak hover:bg-status-ditolak/10 flex items-center gap-1.5">
              <XCircle size={15} /> Tolak
            </button>
          </div>
        </motion.div>
      )}

      {/* Status Change Modal */}
      <AnimatePresence>
        {showStatusModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowStatusModal(null); setError(''); }} className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="glass-card max-w-[460px] w-full p-8">
              <h3 className="text-lg font-heading mb-2">
                {showStatusModal === 'DITERIMA' && '✅ Terima Pendaftar'}
                {showStatusModal === 'REVISI' && '⚠️ Minta Revisi'}
                {showStatusModal === 'DITOLAK' && '❌ Tolak Pendaftar'}
              </h3>
              <p className="text-text-secondary dark:text-dark-text-secondary text-[0.88rem] mb-5">
                {showStatusModal === 'DITERIMA' && 'Pendaftar akan diterima dan diminta melakukan pembayaran.'}
                {showStatusModal === 'REVISI' && 'Pendaftar akan diminta memperbaiki dokumen. Catatan wajib diisi.'}
                {showStatusModal === 'DITOLAK' && 'Pendaftar akan ditolak. Catatan/alasan wajib diisi.'}
              </p>

              {error && <div className="p-2 rounded-sm mb-4 text-[0.82rem] text-status-ditolak bg-status-ditolak/10">{error}</div>}

              <div className="mb-5">
                <label className="block mb-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                  Catatan {['DITOLAK', 'REVISI'].includes(showStatusModal) ? '(wajib)' : '(opsional)'}
                </label>
                <textarea
                  value={catatan}
                  onChange={e => setCatatan(e.target.value)}
                  rows={3}
                  placeholder={showStatusModal === 'REVISI' ? 'Jelaskan dokumen apa yang perlu diperbaiki...' : showStatusModal === 'DITOLAK' ? 'Jelaskan alasan penolakan...' : 'Catatan tambahan...'}
                  className="w-full px-4 py-3 bg-bg-tertiary dark:bg-dark-bg-tertiary border-[1.5px] border-border-default dark:border-dark-border-default rounded-md text-text-primary dark:text-dark-text-primary font-body text-[0.88rem] resize-y outline-none focus:border-accent dark:focus:border-dark-accent transition-colors"
                />
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setShowStatusModal(null); setError(''); setCatatan(''); }} className="btn btn-secondary flex-1">Batal</button>
                <button onClick={handleUpdateStatus} disabled={submitting} className={`btn flex-1 text-white border-none flex items-center justify-center ${submitting ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`} style={{
                  background: showStatusModal === 'DITERIMA' ? 'var(--color-status-diterima)' : showStatusModal === 'REVISI' ? 'var(--color-status-revisi)' : 'var(--color-status-ditolak)',
                }}>
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Konfirmasi'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
