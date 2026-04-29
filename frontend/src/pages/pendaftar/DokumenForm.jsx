import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Upload, CheckCircle2, XCircle, AlertCircle, File, Trash2, Eye, Loader2 } from 'lucide-react';
import api from '../../services/api';

const docStatusConfig = {
  PENDING: { label: 'Menunggu Verifikasi', color: '#F59E0B', icon: AlertCircle },
  VALID: { label: 'Valid', color: '#10B981', icon: CheckCircle2 },
  INVALID: { label: 'Perlu Diperbaiki', color: '#EF4444', icon: XCircle },
};

export default function DokumenForm() {
  const { pendaftaran, persyaratan, refreshData } = useOutletContext();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState({});
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);

  const uploadedDocs = pendaftaran?.dokumen || [];
  const isRevisi = pendaftaran?.status === 'REVISI';

  const getUploadedDoc = (kode) => uploadedDocs.find(d => d.jenis_dokumen === kode);

  const handleUpload = async (kode, file) => {
    const req = persyaratan.find(p => p.kode === kode);
    if (!req) return;

    // Client-side validation
    const maxBytes = req.maks_ukuran_mb * 1024 * 1024;
    const allowedExts = req.format_diterima.split(',').map(f => f.trim().toLowerCase());
    const ext = file.name.split('.').pop().toLowerCase();

    if (!allowedExts.includes(ext)) {
      setErrors(prev => ({ ...prev, [kode]: `Format file harus: ${req.format_diterima}` }));
      return;
    }
    if (file.size > maxBytes) {
      setErrors(prev => ({ ...prev, [kode]: `Ukuran file maksimal ${req.maks_ukuran_mb}MB` }));
      return;
    }

    setErrors(prev => { const n = { ...prev }; delete n[kode]; return n; });
    setUploading(prev => ({ ...prev, [kode]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post(`/pendaftaran/${pendaftaran.id}/dokumen/${kode}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await refreshData();
    } catch (err) {
      setErrors(prev => ({ ...prev, [kode]: err.response?.data?.message || 'Upload gagal.' }));
    } finally {
      setUploading(prev => ({ ...prev, [kode]: false }));
    }
  };

  const handleDelete = async (kode) => {
    try {
      await api.delete(`/pendaftaran/${pendaftaran.id}/dokumen/${kode}`);
      await refreshData();
    } catch (err) {
      setErrors(prev => ({ ...prev, [kode]: err.response?.data?.message || 'Gagal menghapus.' }));
    }
  };

  const handleDrop = (kode) => (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) handleUpload(kode, file);
  };

  const handleFileInput = (kode) => (e) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(kode, file);
    e.target.value = '';
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card" style={{ padding: '2rem' }}>
      <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>
        <Upload size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--accent-primary)' }} />
        Upload Dokumen
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
        Upload dokumen persyaratan sesuai jenjang {pendaftaran?.jenjang}
        {isRevisi && <span style={{ color: '#F97316', fontWeight: 600 }}> — Perbaiki dokumen yang ditandai</span>}
      </p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {persyaratan.map((req) => {
          const uploaded = getUploadedDoc(req.kode);
          const status = uploaded ? docStatusConfig[uploaded.status] : null;
          const isUploading = uploading[req.kode];
          const canUpload = !isRevisi || !uploaded || uploaded.status === 'INVALID';
          const canDelete = uploaded && (!isRevisi || uploaded.status === 'INVALID');

          return (
            <div key={req.kode} style={{
              padding: '1.25rem', borderRadius: 'var(--radius-md)',
              background: 'var(--bg-tertiary)',
              border: `1.5px solid ${uploaded ? (status?.color + '30') : errors[req.kode] ? 'rgba(239,68,68,0.3)' : 'var(--glass-border)'}`,
              transition: 'all 0.3s',
            }}>
              {/* Doc header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {req.nama}
                    {req.wajib && <span style={{ color: 'var(--status-ditolak)', fontSize: '0.85rem' }}>*</span>}
                  </div>
                  {req.keterangan && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{req.keterangan}</p>}
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    Format: {req.format_diterima.toUpperCase()} • Maks: {req.maks_ukuran_mb}MB
                  </p>
                </div>
                {status && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.5rem', borderRadius: '50px', background: `${status.color}15`, fontSize: '0.7rem', fontWeight: 600, color: status.color, flexShrink: 0 }}>
                    <status.icon size={12} />
                    {status.label}
                  </div>
                )}
              </div>

              {/* Catatan panitia for invalid docs */}
              {uploaded?.catatan && uploaded.status === 'INVALID' && (
                <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: '0.75rem', fontSize: '0.78rem', color: '#EF4444' }}>
                  <strong>Catatan:</strong> {uploaded.catatan}
                </div>
              )}

              {/* Uploaded file info */}
              {uploaded && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', marginBottom: canUpload ? '0.75rem' : 0 }}>
                  <File size={18} color="var(--accent-primary)" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{uploaded.nama_file}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formatSize(uploaded.ukuran_file)}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    {uploaded.mime_type?.startsWith('image/') && (
                      <button onClick={() => setPreviewUrl(`/storage/${uploaded.path_file}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)', padding: '0.35rem' }}>
                        <Eye size={16} />
                      </button>
                    )}
                    {canDelete && (
                      <button onClick={() => handleDelete(req.kode)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '0.35rem' }}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Upload dropzone */}
              {canUpload && (
                <label
                  onDrop={handleDrop(req.kode)}
                  onDragOver={(e) => e.preventDefault()}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '2px dashed var(--glass-border)',
                    cursor: isUploading ? 'wait' : 'pointer', textAlign: 'center', transition: 'all 0.2s',
                    opacity: isUploading ? 0.6 : 1,
                  }}
                >
                  <input type="file" onChange={handleFileInput(req.kode)} accept={req.format_diterima.split(',').map(f => `.${f.trim()}`).join(',')} style={{ display: 'none' }} disabled={isUploading} />
                  {isUploading ? (
                    <><Loader2 size={20} color="var(--accent-primary)" style={{ animation: 'spin 1s linear infinite' }} /><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mengupload...</span></>
                  ) : (
                    <><Upload size={20} color="var(--text-muted)" /><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{uploaded ? 'Ganti file' : 'Pilih atau seret file ke sini'}</span></>
                  )}
                </label>
              )}

              {errors[req.kode] && <span className="form-error" style={{ marginTop: '0.35rem', display: 'block' }}>{errors[req.kode]}</span>}
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <button onClick={() => navigate('/formulir/data-ortu')} className="btn btn-secondary"><ArrowLeft size={18} /> Kembali</button>
        <button onClick={() => navigate('/formulir/review')} className="btn btn-primary">
          Lanjut: Review <ArrowRight size={18} />
        </button>
      </div>

      {/* Image Preview Modal */}
      {previewUrl && (
        <div onClick={() => setPreviewUrl(null)} style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', cursor: 'pointer',
        }}>
          <img src={previewUrl} alt="Preview" style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: 'var(--radius-lg)', objectFit: 'contain' }} />
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
}
