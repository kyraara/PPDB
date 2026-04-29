import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, User, Users, FileText, CheckCircle2, XCircle,
  AlertTriangle, File, Eye, Hash, GraduationCap, CalendarDays,
  Phone, MapPin, Briefcase, Loader2, MessageSquare, Clock
} from 'lucide-react';
import api from '../../services/api';
import { Skeleton, SkeletonText, SkeletonCard } from '../../components/SkeletonLoader';

const statusBadge = {
  DRAFT: { bg: 'var(--status-draft)', label: 'Draft' },
  SUBMITTED: { bg: 'var(--status-submitted)', label: 'Menunggu Review' },
  MENUNGGU_REVIEW: { bg: 'var(--status-review)', label: 'Sedang Review' },
  REVISI: { bg: 'var(--status-revisi)', label: 'Perlu Revisi' },
  DITERIMA: { bg: 'var(--status-diterima)', label: 'Diterima' },
  DITOLAK: { bg: 'var(--status-ditolak)', label: 'Ditolak' },
  MENUNGGU_BAYAR: { bg: 'var(--status-bayar)', label: 'Menunggu Bayar' },
  TERDAFTAR: { bg: 'var(--status-terdaftar)', label: 'Terdaftar' },
};

const docStatusBadge = {
  PENDING: { bg: 'var(--status-submitted)', label: 'Pending' },
  VALID: { bg: 'var(--status-diterima)', label: 'Valid' },
  INVALID: { bg: 'var(--status-ditolak)', label: 'Invalid' },
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
        <div style={{ marginTop: '1.25rem' }}><SkeletonCard height="300px" /></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <AlertTriangle size={48} color="var(--status-ditolak)" style={{ marginBottom: '1rem' }} />
        <h3>Pendaftar tidak ditemukan</h3>
        <Link to="/panitia/pendaftar" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          <ArrowLeft size={16} /> Kembali
        </Link>
      </div>
    );
  }

  const { pendaftaran: p, persyaratan_dokumen: persyaratan } = data;
  const siswa = p.data_siswa;
  const ortu = p.data_ortu || [];
  const docs = p.dokumen || [];
  const badge = statusBadge[p.status] || { bg: 'var(--text-muted)', label: p.status };
  const canReview = ['SUBMITTED', 'MENUNGGU_REVIEW'].includes(p.status);

  const tabs = [
    { key: 'siswa', label: 'Data Siswa', icon: User },
    { key: 'ortu', label: 'Data Orang Tua', icon: Users },
    { key: 'dokumen', label: 'Dokumen', icon: FileText, count: docs.length },
  ];

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.55rem 0', borderBottom: '1px solid var(--glass-border)', fontSize: '0.85rem' }}>
      <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: '120px' }}>
        {Icon && <Icon size={13} color="var(--accent-primary)" />}{label}
      </span>
      <span style={{ fontWeight: 500, textAlign: 'right', flex: 1, marginLeft: '1rem' }}>{value || '—'}</span>
    </div>
  );

  return (
    <div>
      {/* Breadcrumb */}
      <Link to="/panitia/pendaftar" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
        <ArrowLeft size={16} /> Kembali ke Daftar
      </Link>

      {/* Header Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>{siswa?.nama_lengkap || 'Nama belum diisi'}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Hash size={13} color="var(--accent-primary)" />{p.nomor_daftar}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><GraduationCap size={13} color="var(--accent-primary)" />{p.jenjang}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><CalendarDays size={13} color="var(--accent-primary)" />{p.gelombang?.nama || '-'}</span>
            </div>
          </div>
          <span style={{ display: 'inline-flex', padding: '0.3rem 0.85rem', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 600, color: 'white', background: badge.bg }}>{badge.label}</span>
        </div>

        {/* Catatan panitia sebelumnya */}
        {p.catatan_panitia && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'color-mix(in srgb, var(--accent-primary) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-primary) 15%, transparent)', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '0.3rem' }}>
              <MessageSquare size={13} /> Catatan Panitia
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>{p.catatan_panitia}</p>
          </div>
        )}

        {p.reviewed_at && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={11} /> Direview {new Date(p.reviewed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            {p.reviewer && <> oleh {p.reviewer.nama_lengkap}</>}
          </div>
        )}
      </motion.div>

      {/* Success / Error */}
      {success && <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--status-diterima) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--status-diterima) 25%, transparent)', color: 'var(--status-diterima)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle2 size={14} />{success}</div>}
      {error && <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--status-ditolak) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--status-ditolak) 25%, transparent)', color: 'var(--status-ditolak)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><AlertTriangle size={14} />{error}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto' }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-md)', border: active ? '1.5px solid var(--accent-primary)' : '1.5px solid var(--glass-border)',
              background: active ? 'rgba(201,168,76,0.1)' : 'transparent', color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: '0.82rem', fontWeight: active ? 600 : 400, whiteSpace: 'nowrap', transition: 'all 0.2s',
            }}>
              <Icon size={15} />{tab.label}
              {tab.count !== undefined && <span style={{ fontSize: '0.7rem', background: active ? 'var(--accent-primary)' : 'var(--text-muted)', color: active ? '#0B1A0F' : 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{tab.count}</span>}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="glass-card-static" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
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
          ) : <p style={{ color: 'var(--text-muted)' }}>Data siswa belum diisi.</p>
        )}

        {activeTab === 'ortu' && (
          ortu.length > 0 ? ortu.map((o, i) => (
            <div key={i} style={{ marginBottom: i < ortu.length - 1 ? '1.25rem' : 0, paddingBottom: i < ortu.length - 1 ? '1.25rem' : 0, borderBottom: i < ortu.length - 1 ? '2px solid var(--glass-border)' : 'none' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{o.tipe}</div>
              <InfoRow icon={User} label="Nama" value={o.nama} />
              <InfoRow icon={Phone} label="No HP" value={o.no_hp} />
              {o.pekerjaan && <InfoRow icon={Briefcase} label="Pekerjaan" value={o.pekerjaan} />}
              {o.alamat && <InfoRow icon={MapPin} label="Alamat" value={o.alamat} />}
            </div>
          )) : <p style={{ color: 'var(--text-muted)' }}>Data orang tua belum diisi.</p>
        )}

        {activeTab === 'dokumen' && (
          <div>
            {persyaratan.map(req => {
              const doc = docs.find(d => d.jenis_dokumen === req.kode);
              const dBadge = doc ? (docStatusBadge[doc.status] || docStatusBadge.PENDING) : null;
              return (
                <div key={req.kode} style={{ padding: '0.85rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <File size={14} color="var(--accent-primary)" />
                      <span style={{ fontWeight: 500, fontSize: '0.88rem' }}>{req.nama}</span>
                      {req.wajib && <span style={{ fontSize: '0.6rem', color: 'var(--status-ditolak)', fontWeight: 600 }}>WAJIB</span>}
                    </div>
                    {doc && (
                      <span style={{ display: 'inline-flex', padding: '0.15rem 0.5rem', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 600, color: 'white', background: dBadge.bg }}>{dBadge.label}</span>
                    )}
                  </div>

                  {doc ? (
                    <div style={{ marginLeft: '1.35rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        <span>{doc.nama_file}</span>
                        <span>{(doc.ukuran_file / 1024).toFixed(0)} KB</span>
                        <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${doc.path_file}`} target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--accent-primary)', fontSize: '0.78rem' }}>
                          <Eye size={12} /> Lihat
                        </a>
                      </div>
                      {doc.catatan && <div style={{ fontSize: '0.78rem', color: 'var(--status-revisi)', marginBottom: '0.35rem' }}>Catatan: {doc.catatan}</div>}

                      {/* Review actions */}
                      {canReview && (
                        <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.35rem' }}>
                          <button onClick={() => handleUpdateDoc(doc.id, 'VALID', null)} disabled={doc.status === 'VALID'} style={{ padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--status-diterima)', background: doc.status === 'VALID' ? 'color-mix(in srgb, var(--status-diterima) 15%, transparent)' : 'transparent', color: 'var(--status-diterima)', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <CheckCircle2 size={11} /> Valid
                          </button>
                          <button onClick={() => { const note = prompt('Catatan (opsional):'); handleUpdateDoc(doc.id, 'INVALID', note); }} disabled={doc.status === 'INVALID'} style={{ padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--status-ditolak)', background: doc.status === 'INVALID' ? 'color-mix(in srgb, var(--status-ditolak) 15%, transparent)' : 'transparent', color: 'var(--status-ditolak)', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <XCircle size={11} /> Invalid
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ marginLeft: '1.35rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Belum diupload</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Status Actions */}
      {canReview && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tindakan</h4>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={() => setShowStatusModal('DITERIMA')} className="btn btn-sm" style={{ background: 'var(--status-diterima)', color: 'white', border: 'none', cursor: 'pointer' }}>
              <CheckCircle2 size={15} /> Terima
            </button>
            <button onClick={() => setShowStatusModal('REVISI')} className="btn btn-sm" style={{ background: 'transparent', color: 'var(--status-revisi)', border: '1.5px solid var(--status-revisi)', cursor: 'pointer' }}>
              <AlertTriangle size={15} /> Minta Revisi
            </button>
            <button onClick={() => setShowStatusModal('DITOLAK')} className="btn btn-sm" style={{ background: 'transparent', color: 'var(--status-ditolak)', border: '1.5px solid var(--status-ditolak)', cursor: 'pointer' }}>
              <XCircle size={15} /> Tolak
            </button>
          </div>
        </motion.div>
      )}

      {/* Status Change Modal */}
      <AnimatePresence>
        {showStatusModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowStatusModal(null); setError(''); }} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="glass-card" style={{ maxWidth: '460px', width: '100%', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                {showStatusModal === 'DITERIMA' && '✅ Terima Pendaftar'}
                {showStatusModal === 'REVISI' && '⚠️ Minta Revisi'}
                {showStatusModal === 'DITOLAK' && '❌ Tolak Pendaftar'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                {showStatusModal === 'DITERIMA' && 'Pendaftar akan diterima dan diminta melakukan pembayaran.'}
                {showStatusModal === 'REVISI' && 'Pendaftar akan diminta memperbaiki dokumen. Catatan wajib diisi.'}
                {showStatusModal === 'DITOLAK' && 'Pendaftar akan ditolak. Catatan/alasan wajib diisi.'}
              </p>

              {error && <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'color-mix(in srgb, var(--status-ditolak) 10%, transparent)', color: 'var(--status-ditolak)', marginBottom: '1rem', fontSize: '0.82rem' }}>{error}</div>}

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  Catatan {['DITOLAK', 'REVISI'].includes(showStatusModal) ? '(wajib)' : '(opsional)'}
                </label>
                <textarea
                  value={catatan}
                  onChange={e => setCatatan(e.target.value)}
                  rows={3}
                  placeholder={showStatusModal === 'REVISI' ? 'Jelaskan dokumen apa yang perlu diperbaiki...' : showStatusModal === 'DITOLAK' ? 'Jelaskan alasan penolakan...' : 'Catatan tambahan...'}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-tertiary)', border: '1.5px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.88rem', resize: 'vertical', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => { setShowStatusModal(null); setError(''); setCatatan(''); }} className="btn btn-secondary" style={{ flex: 1 }}>Batal</button>
                <button onClick={handleUpdateStatus} disabled={submitting} className="btn" style={{
                  flex: 1, cursor: submitting ? 'wait' : 'pointer', color: 'white', border: 'none', opacity: submitting ? 0.7 : 1,
                  background: showStatusModal === 'DITERIMA' ? 'var(--status-diterima)' : showStatusModal === 'REVISI' ? 'var(--status-revisi)' : 'var(--status-ditolak)',
                }}>
                  {submitting ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'Konfirmasi'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
