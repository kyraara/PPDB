import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
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
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0' }}>
      {ok ? <CheckCircle2 size={16} color="#10B981" /> : <XCircle size={16} color="#EF4444" />}
      <span style={{ fontSize: '0.88rem', color: ok ? 'var(--text-primary)' : '#EF4444' }}>{label}</span>
    </div>
  );

  const Section = ({ icon: Icon, title, children }) => (
    <div style={{ marginBottom: '1.25rem' }}>
      <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Icon size={16} /> {title}
      </h4>
      {children}
    </div>
  );

  const InfoRow = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--glass-border)', fontSize: '0.85rem' }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{value || '—'}</span>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>
          <FileText size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--accent-primary)' }} />
          Review Pendaftaran
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Periksa kembali semua data sebelum mengirim</p>
      </div>

      {/* Checklist */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Kelengkapan</h4>
        <CheckItem ok={hasSiswa} label="Data siswa lengkap" />
        <CheckItem ok={hasOrtu} label="Data orang tua/wali lengkap" />
        {requiredDocs.map(p => (
          <CheckItem key={p.kode} ok={uploadedCodes.includes(p.kode)} label={`Dokumen: ${p.nama}`} />
        ))}
      </div>

      {/* Data Siswa Summary */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
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
            <p style={{ color: '#EF4444', fontSize: '0.85rem' }}>Belum diisi — <a href="/formulir/data-siswa" style={{ fontWeight: 600 }}>Isi sekarang</a></p>
          )}
        </Section>
      </div>

      {/* Data Orang Tua Summary */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <Section icon={Users} title="Data Orang Tua / Wali">
          {hasOrtu ? ortu.map((o, i) => (
            <div key={i} style={{ marginBottom: i < ortu.length - 1 ? '0.75rem' : 0, paddingBottom: i < ortu.length - 1 ? '0.75rem' : 0, borderBottom: i < ortu.length - 1 ? '1px solid var(--glass-border)' : 'none' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>{o.tipe}</div>
              <InfoRow label="Nama" value={o.nama} />
              <InfoRow label="No HP" value={o.no_hp} />
              {o.pekerjaan && <InfoRow label="Pekerjaan" value={o.pekerjaan} />}
            </div>
          )) : (
            <p style={{ color: '#EF4444', fontSize: '0.85rem' }}>Belum diisi — <a href="/formulir/data-ortu" style={{ fontWeight: 600 }}>Isi sekarang</a></p>
          )}
        </Section>
      </div>

      {/* Dokumen Summary */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <Section icon={File} title="Dokumen">
          {docs.length > 0 ? docs.map(d => {
            const req = persyaratan.find(p => p.kode === d.jenis_dokumen);
            return (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                <File size={14} color="var(--accent-primary)" />
                <span style={{ flex: 1, fontSize: '0.85rem' }}>{req?.nama || d.jenis_dokumen}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.nama_file}</span>
              </div>
            );
          }) : (
            <p style={{ color: '#EF4444', fontSize: '0.85rem' }}>Belum ada dokumen — <a href="/formulir/dokumen" style={{ fontWeight: 600 }}>Upload sekarang</a></p>
          )}
          {missingDocs.length > 0 && (
            <div style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'rgba(239,68,68,0.08)', fontSize: '0.8rem', color: '#EF4444' }}>
              Belum diupload: {missingDocs.map(d => d.nama).join(', ')}
            </div>
          )}
        </Section>
      </div>

      {/* Error messages */}
      {error && (
        <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', marginBottom: '1rem', fontSize: '0.88rem' }}>
          <AlertTriangle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.35rem' }} />
          {error}
          {submitErrors.length > 0 && (
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem', fontSize: '0.82rem' }}>
              {submitErrors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          )}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <button onClick={() => navigate('/formulir/dokumen')} className="btn btn-secondary"><ArrowLeft size={18} /> Kembali</button>
        <button onClick={() => setShowConfirm(true)} disabled={!isComplete || submitting} className="btn btn-primary" style={{ opacity: !isComplete || submitting ? 0.5 : 1 }}>
          {submitting ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Mengirim...</> : <><Send size={18} /> Kirim Pendaftaran</>}
        </button>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConfirm(false)} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="glass-card" style={{ maxWidth: '420px', width: '100%', padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Send size={24} color="var(--accent-primary)" />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Kirim Pendaftaran?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Setelah dikirim, data formulir <strong>tidak bisa diubah lagi</strong>.
                {pendaftaran?.jenjang === 'TK' ? ' Pendaftaran TK akan langsung diterima.' : ' Panitia akan melakukan review dalam 1-3 hari kerja.'}
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setShowConfirm(false)} className="btn btn-secondary" style={{ flex: 1 }}>Batal</button>
                <button onClick={handleSubmit} className="btn btn-primary" style={{ flex: 1 }}><Send size={16} /> Ya, Kirim</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
}
