import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Upload, CheckCircle2, XCircle, AlertCircle, File, Trash2, Eye, Loader2 } from 'lucide-react';
import api from '../../services/api';

const docStatusConfig = {
  PENDING: { label: 'Menunggu Verifikasi', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/15', border: 'border-[#F59E0B]/30', icon: AlertCircle },
  VALID: { label: 'Valid', color: 'text-[#10B981]', bg: 'bg-[#10B981]/15', border: 'border-[#10B981]/30', icon: CheckCircle2 },
  INVALID: { label: 'Perlu Diperbaiki', color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/15', border: 'border-[#EF4444]/30', icon: XCircle },
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
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 md:p-8">
      <h3 className="text-[1.15rem] mb-1 flex items-center gap-2">
        <Upload size={18} className="text-accent dark:text-dark-accent" />
        Upload Dokumen
      </h3>
      <p className="text-text-muted dark:text-dark-text-muted text-sm mb-6">
        Upload dokumen persyaratan sesuai jenjang {pendaftaran?.jenjang}
        {isRevisi && <span className="text-[#F97316] font-semibold ml-1">— Perbaiki dokumen yang ditandai</span>}
      </p>

      <div className="grid gap-4">
        {persyaratan.map((req) => {
          const uploaded = getUploadedDoc(req.kode);
          const status = uploaded ? docStatusConfig[uploaded.status] : null;
          const isUploading = uploading[req.kode];
          const canUpload = !isRevisi || !uploaded || uploaded.status === 'INVALID';
          const canDelete = uploaded && (!isRevisi || uploaded.status === 'INVALID');

          return (
            <div key={req.kode} className={`
              p-5 rounded-md bg-bg-tertiary dark:bg-dark-bg-tertiary border-[1.5px] transition-all duration-300
              ${uploaded ? status?.border : errors[req.kode] ? 'border-status-ditolak/30' : 'border-border-default dark:border-dark-border-default'}
            `}>
              {/* Doc header */}
              <div className="flex justify-between items-start mb-3 gap-2">
                <div>
                  <div className="text-[0.9rem] font-semibold flex items-center gap-1.5">
                    {req.nama}
                    {req.wajib && <span className="text-status-ditolak text-[0.85rem]">*</span>}
                  </div>
                  {req.keterangan && <p className="text-[0.75rem] text-text-muted dark:text-dark-text-muted mt-1">{req.keterangan}</p>}
                  <p className="text-[0.7rem] text-text-muted dark:text-dark-text-muted mt-0.5">
                    Format: {req.format_diterima.toUpperCase()} • Maks: {req.maks_ukuran_mb}MB
                  </p>
                </div>
                {status && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[0.7rem] font-semibold shrink-0 ${status.bg} ${status.color}`}>
                    <status.icon size={12} />
                    {status.label}
                  </div>
                )}
              </div>

              {/* Catatan panitia for invalid docs */}
              {uploaded?.catatan && uploaded.status === 'INVALID' && (
                <div className="p-2.5 rounded-sm bg-status-ditolak/10 border border-status-ditolak/20 mb-3 text-[0.78rem] text-status-ditolak">
                  <strong className="font-semibold">Catatan:</strong> {uploaded.catatan}
                </div>
              )}

              {/* Uploaded file info */}
              {uploaded && (
                <div className={`flex items-center gap-3 p-2.5 rounded-sm bg-bg-secondary dark:bg-dark-bg-secondary ${canUpload ? 'mb-3' : 'mb-0'}`}>
                  <File size={18} className="text-accent dark:text-dark-accent shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.8rem] font-medium truncate">{uploaded.nama_file}</p>
                    <p className="text-[0.7rem] text-text-muted dark:text-dark-text-muted">{formatSize(uploaded.ukuran_file)}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    {uploaded.mime_type?.startsWith('image/') && (
                      <button onClick={() => setPreviewUrl(`/storage/${uploaded.path_file}`)} className="bg-transparent border-none cursor-pointer text-accent dark:text-dark-accent p-1.5 hover:bg-accent/10 rounded-sm transition-colors">
                        <Eye size={16} />
                      </button>
                    )}
                    {canDelete && (
                      <button onClick={() => handleDelete(req.kode)} className="bg-transparent border-none cursor-pointer text-status-ditolak p-1.5 hover:bg-status-ditolak/10 rounded-sm transition-colors">
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
                  className={`
                    flex flex-col items-center justify-center gap-2 p-5 rounded-sm border-2 border-dashed border-border-default dark:border-dark-border-default
                    text-center transition-all duration-200
                    ${isUploading ? 'cursor-wait opacity-60' : 'cursor-pointer hover:border-text-muted dark:hover:border-dark-text-muted hover:bg-bg-secondary dark:hover:bg-dark-bg-secondary'}
                  `}
                >
                  <input type="file" onChange={handleFileInput(req.kode)} accept={req.format_diterima.split(',').map(f => `.${f.trim()}`).join(',')} className="hidden" disabled={isUploading} />
                  {isUploading ? (
                    <><Loader2 size={20} className="text-accent dark:text-dark-accent animate-spin" /><span className="text-[0.8rem] text-text-muted dark:text-dark-text-muted">Mengupload...</span></>
                  ) : (
                    <><Upload size={20} className="text-text-muted dark:text-dark-text-muted" /><span className="text-[0.8rem] text-text-muted dark:text-dark-text-muted">{uploaded ? 'Ganti file' : 'Pilih atau seret file ke sini'}</span></>
                  )}
                </label>
              )}

              {errors[req.kode] && <span className="form-error mt-1.5 block">{errors[req.kode]}</span>}
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button onClick={() => navigate('/formulir/data-ortu')} className="btn btn-secondary flex items-center gap-2"><ArrowLeft size={18} /> Kembali</button>
        <button onClick={() => navigate('/formulir/review')} className="btn btn-primary flex items-center gap-2">
          Lanjut: Review <ArrowRight size={18} />
        </button>
      </div>

      {/* Image Preview Modal */}
      {previewUrl && (
        <div onClick={() => setPreviewUrl(null)} className="fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center p-8 cursor-pointer">
          <img src={previewUrl} alt="Preview" className="max-w-[90%] max-h-[90%] rounded-lg object-contain shadow-2xl" />
        </div>
      )}
    </motion.div>
  );
}
