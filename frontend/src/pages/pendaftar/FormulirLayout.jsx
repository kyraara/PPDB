import { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Users, Upload, ClipboardCheck, CheckCircle2, Loader2, Save } from 'lucide-react';
import api from '../../services/api';
import { FormSkeleton, Skeleton } from '../../components/SkeletonLoader';

const steps = [
  { key: 'data-siswa', label: 'Data Siswa', icon: FileText, path: '/formulir/data-siswa' },
  { key: 'data-ortu', label: 'Data Orang Tua', icon: Users, path: '/formulir/data-ortu' },
  { key: 'dokumen', label: 'Dokumen', icon: Upload, path: '/formulir/dokumen' },
  { key: 'review', label: 'Review', icon: ClipboardCheck, path: '/formulir/review' },
];

export default function FormulirLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pendaftaran, setPendaftaran] = useState(null);
  const [persyaratan, setPersyaratan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const currentStepIdx = steps.findIndex(s => location.pathname.includes(s.key));

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get('/pendaftaran/saya');
      if (res.data.data?.pendaftaran) {
        setPendaftaran(res.data.data.pendaftaran);
        setPersyaratan(res.data.data.persyaratan_dokumen || []);
      } else {
        navigate('/beranda');
      }
    } catch {
      navigate('/beranda');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Auto-save handler — called by child forms
  const handleSave = useCallback(async (payload) => {
    if (!pendaftaran) return;
    setSaving(true);
    try {
      const res = await api.put(`/pendaftaran/${pendaftaran.id}`, payload);
      if (res.data.success) {
        setPendaftaran(res.data.data);
        setLastSaved(new Date());
      }
    } catch (err) {
      console.error('Auto-save failed:', err);
    } finally {
      setSaving(false);
    }
  }, [pendaftaran]);

  const refreshData = useCallback(async () => {
    const res = await api.get('/pendaftaran/saya');
    if (res.data.data?.pendaftaran) {
      setPendaftaran(res.data.data.pendaftaran);
      setPersyaratan(res.data.data.persyaratan_dokumen || []);
    }
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '85px', paddingBottom: '2rem' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < 4 ? 1 : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                    <Skeleton width="36px" height="36px" borderRadius="50%" />
                    <Skeleton width="45px" height="0.55rem" />
                  </div>
                  {i < 4 && <Skeleton width="100%" height="2px" style={{ margin: '0 0.5rem', marginBottom: '1.2rem' }} />}
                </div>
              ))}
            </div>
            <Skeleton width="100%" height="2rem" borderRadius="var(--radius-sm)" />
          </div>
          <FormSkeleton />
        </div>
      </div>
    );
  }

  if (!pendaftaran || !['DRAFT', 'REVISI'].includes(pendaftaran.status)) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.75rem' }}>Formulir Tidak Tersedia</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Formulir hanya bisa diisi saat status pendaftaran adalah Draft atau Revisi.</p>
          <Link to="/beranda" className="btn btn-primary">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '85px', paddingBottom: '2rem' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        {/* Step indicator */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            {steps.map((step, i) => {
              const isDone = i < currentStepIdx;
              const isActive = i === currentStepIdx;
              const Icon = step.icon;
              return (
                <div key={step.key} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
                  <Link to={step.path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isDone ? 'var(--accent-primary)' : isActive ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-hover))' : 'var(--bg-tertiary)',
                      color: isDone || isActive ? 'var(--bg-primary)' : 'var(--text-muted)',
                      boxShadow: isActive ? '0 0 0 4px rgba(201,168,76,0.15)' : 'none',
                      transition: 'all 0.3s',
                    }}>
                      {isDone ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                    </div>
                    <span style={{ fontSize: '0.65rem', fontWeight: isActive ? 700 : 500, color: isDone ? 'var(--accent-primary)' : isActive ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {step.label}
                    </span>
                  </Link>
                  {i < steps.length - 1 && (
                    <div style={{ flex: 1, height: '2px', background: isDone ? 'var(--accent-primary)' : 'var(--bg-tertiary)', margin: '0 0.5rem', marginBottom: '1.2rem', borderRadius: '1px' }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Save status bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>
              Step {currentStepIdx + 1} dari {steps.length}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: saving ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
              {saving ? (
                <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Menyimpan...</>
              ) : lastSaved ? (
                <><Save size={12} /> Tersimpan {lastSaved.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</>
              ) : (
                <><Save size={12} /> Simpan otomatis aktif</>
              )}
            </div>
          </div>
        </motion.div>

        {/* Step content */}
        <Outlet context={{ pendaftaran, persyaratan, onSave: handleSave, saving, refreshData }} />
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
