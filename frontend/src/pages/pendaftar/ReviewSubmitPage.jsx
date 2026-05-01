import { useState } from 'react';
import { useOutletContext, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Send, User, Users, FileText, CheckCircle2, XCircle,
  AlertTriangle, GraduationCap, File, Loader2
} from 'lucide-react';
import api from '../../services/api';

export default function ReviewSubmitPage() {
  const { pendaftaran, persyaratan } = useOutletContext();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [submitErrors, setSubmitErrors] = useState([]);

  const siswa = pendaftaran?.data_siswa;
  const ortu = pendaftaran?.data_ortu || [];
  const docs = pendaftaran?.dokumen || [];

  // Check completeness
  const hasSiswa = !!siswa?.nama_lengkap;
  const hasOrtu = ortu.length > 0;
  const requiredDocs = persyaratan.filter(p => p.wajib);
  const uploadedCodes = docs.map(d => d.jenis_dokumen);
  const missingDocs = requiredDocs.filter(p => !uploadedCodes.includes(p.kode));
  const isComplete = hasSiswa && hasOrtu && missingDocs.length === 0;

  const handleSubmit = async () => {
    setShowConfirm(false);
    setSubmitting(true);
    setError('');
    setSubmitErrors([]);

    try {
      const res = await api.post(`/pendaftaran/${pendaftaran.id}/submit`);
      if (res.data.success) {
        navigate('/beranda');
      }
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setSubmitErrors(data.errors);
      }
      setError(data?.message || 'Gagal mengirim pendaftaran.');
    } finally {
      setSubmitting(false);
    }
  };

  const CheckItem = ({ ok, label }) => (
    <div className="flex items-center gap-2 py-2">
      {ok ? <CheckCircle2 size={16} className="text-[#10B981] shrink-0" /> : <XCircle size={16} className="text-status-ditolak shrink-0" />}
      <span className={`text-[0.88rem] ${ok ? 'text-text-primary dark:text-dark-text-primary' : 'text-status-ditolak'}`}>{label}</span>
    </div>
  );

  const Section = ({ icon: Icon, title, children }) => (
    <div className="mb-5">
      <h4 className="text-[0.9rem] font-semibold text-accent dark:text-dark-accent mb-3 flex items-center gap-1.5">
        <Icon size={16} /> {title}
      </h4>
      {children}
    </div>
  );

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-border-default dark:border-dark-border-default text-[0.85rem]">
      <span className="text-text-muted dark:text-dark-text-muted shrink-0 pr-4">{label}</span>
      <span className="font-medium text-right max-w-[60%]">{value || '—'}</span>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      {/* Header */}
      <div className="glass-card p-6 md:p-8 mb-4">
        <h3 className="text-[1.15rem] mb-1 flex items-center gap-2">
          <FileText size={18} className="text-accent dark:text-dark-accent" />
          Review Pendaftaran
        </h3>
        <p className="text-text-muted dark:text-dark-text-muted text-[0.82rem]">Periksa kembali semua data sebelum mengirim</p>
      </div>

      {/* Checklist */}
      <div className="glass-card p-5 mb-4">
        <h4 className="text-[0.85rem] font-semibold text-text-muted dark:text-dark-text-muted mb-2 uppercase tracking-wide">Kelengkapan</h4>
        <CheckItem ok={hasSiswa} label="Data siswa lengkap" />
        <CheckItem ok={hasOrtu} label="Data orang tua/wali lengkap" />
        {requiredDocs.map(p => (
          <CheckItem key={p.kode} ok={uploadedCodes.includes(p.kode)} label={`Dokumen: ${p.nama}`} />
        ))}
      </div>

      {/* Data Siswa Summary */}
      <div className="glass-card p-5 mb-4">
        <Section icon={User} title="Data Siswa">
          {hasSiswa ? (
            <div>
              <InfoRow label="Nama Lengkap" value={siswa.nama_lengkap} />
              <InfoRow label="NIK" value={siswa.nik} />
              {siswa.nisn && <InfoRow label="NISN" value={siswa.nisn} />}
              <InfoRow label="Tempat, Tanggal Lahir" value={`${siswa.tempat_lahir}, ${new Date(siswa.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`} />
              <InfoRow label="Jenis Kelamin" value={siswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} />
              <InfoRow label="Agama" value={siswa.agama} />
              <InfoRow label="Alamat" value={siswa.alamat} />
              {siswa.asal_sekolah && <InfoRow label="Asal Sekolah" value={siswa.asal_sekolah} />}
            </div>
          ) : (
            <p className="text-status-ditolak text-[0.85rem]">Belum diisi — <Link to="/formulir/data-siswa" className="font-semibold text-status-ditolak hover:underline">Isi sekarang</Link></p>
          )}
        </Section>
      </div>

      {/* Data Orang Tua Summary */}
      <div className="glass-card p-5 mb-4">
        <Section icon={Users} title="Data Orang Tua / Wali">
          {hasOrtu ? ortu.map((o, i) => (
            <div key={i} className={i < ortu.length - 1 ? 'mb-3 pb-3 border-b border-border-default dark:border-dark-border-default' : ''}>
              <div className="text-[0.82rem] font-semibold text-accent dark:text-dark-accent mb-1.5">{o.tipe}</div>
              <InfoRow label="Nama" value={o.nama} />
              <InfoRow label="No HP" value={o.no_hp} />
              {o.pekerjaan && <InfoRow label="Pekerjaan" value={o.pekerjaan} />}
            </div>
          )) : (
            <p className="text-status-ditolak text-[0.85rem]">Belum diisi — <Link to="/formulir/data-ortu" className="font-semibold text-status-ditolak hover:underline">Isi sekarang</Link></p>
          )}
        </Section>
      </div>

      {/* Dokumen Summary */}
      <div className="glass-card p-5 mb-4">
        <Section icon={File} title="Dokumen">
          {docs.length > 0 ? docs.map(d => {
            const req = persyaratan.find(p => p.kode === d.jenis_dokumen);
            return (
              <div key={d.id} className="flex items-center gap-2 py-1.5 border-b border-border-default dark:border-dark-border-default">
                <File size={14} className="text-accent dark:text-dark-accent shrink-0" />
                <span className="flex-1 text-[0.85rem] truncate pr-2">{req?.nama || d.jenis_dokumen}</span>
                <span className="text-[0.75rem] text-text-muted dark:text-dark-text-muted truncate max-w-[40%]">{d.nama_file}</span>
              </div>
            );
          }) : (
            <p className="text-status-ditolak text-[0.85rem]">Belum ada dokumen — <Link to="/formulir/dokumen" className="font-semibold text-status-ditolak hover:underline">Upload sekarang</Link></p>
          )}
          {missingDocs.length > 0 && (
            <div className="mt-2 p-2 rounded-sm bg-status-ditolak/10 text-[0.8rem] text-status-ditolak">
              Belum diupload: {missingDocs.map(d => d.nama).join(', ')}
            </div>
          )}
        </Section>
      </div>

      {/* Error messages */}
      {error && (
        <div className="p-3.5 rounded-md bg-status-ditolak/10 border border-status-ditolak/30 text-status-ditolak mb-4 text-[0.88rem]">
          <div className="flex items-start gap-1.5">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <div>
              <span>{error}</span>
              {submitErrors.length > 0 && (
                <ul className="mt-2 pl-5 text-[0.82rem] space-y-1">
                  {submitErrors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button onClick={() => navigate('/formulir/dokumen')} className="btn btn-secondary flex items-center gap-2"><ArrowLeft size={18} /> Kembali</button>
        <button onClick={() => setShowConfirm(true)} disabled={!isComplete || submitting} className={`btn btn-primary flex items-center gap-2 ${!isComplete || submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {submitting ? <><Loader2 size={18} className="animate-spin" /> Mengirim...</> : <><Send size={18} /> Kirim Pendaftaran</>}
        </button>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConfirm(false)} className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="glass-card max-w-[420px] w-full p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-accent-bg dark:bg-dark-accent-bg flex items-center justify-center mx-auto mb-4">
                <Send size={24} className="text-accent dark:text-dark-accent" />
              </div>
              <h3 className="text-[1.15rem] mb-2 font-heading">Kirim Pendaftaran?</h3>
              <p className="text-text-secondary dark:text-dark-text-secondary text-[0.88rem] mb-6 leading-relaxed">
                Setelah dikirim, data formulir <strong>tidak bisa diubah lagi</strong>.
                {pendaftaran?.jenjang === 'TK' ? ' Pendaftaran TK akan langsung diterima.' : ' Panitia akan melakukan review dalam 1-3 hari kerja.'}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="btn btn-secondary flex-1">Batal</button>
                <button onClick={handleSubmit} className="btn btn-primary flex-1 flex items-center justify-center gap-2"><Send size={16} /> Ya, Kirim</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
