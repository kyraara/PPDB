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
      <div className="min-h-screen pt-[85px] pb-8">
        <div className="container max-w-[720px]">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              {[1,2,3,4].map(i => (
                <div key={i} className={`flex items-center ${i < 4 ? 'flex-1' : ''}`}>
                  <div className="flex flex-col items-center gap-1">
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
      <div className="min-h-[calc(100vh-70px)] flex items-center justify-center text-center p-8 bg-bg-secondary dark:bg-dark-bg-secondary">
        <div className="max-w-[400px]">
          <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center mx-auto mb-6
                          bg-accent-bg dark:bg-dark-accent-bg border-2 border-accent-bg-strong dark:border-dark-accent-bg-strong">
            <FileText size={32} className="text-accent dark:text-dark-accent" />
          </div>
          <h2 className="mb-3 font-heading text-2xl">Akses Ditutup</h2>
          <p className="text-text-secondary dark:text-dark-text-secondary mb-8 leading-relaxed">
            Formulir hanya bisa diisi saat status pendaftaran Anda adalah <strong>Belum Selesai</strong> atau <strong>Perlu Revisi</strong>.
          </p>
          <Link to="/beranda" className="btn btn-primary inline-block">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[85px] pb-8">
      <div className="container max-w-[720px]">
        {/* Step indicator */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, i) => {
              const isDone = i < currentStepIdx;
              const isActive = i === currentStepIdx;
              const Icon = step.icon;
              return (
                <div key={step.key} className={`flex items-center ${i < steps.length - 1 ? 'flex-1' : ''}`}>
                  <Link to={step.path} className="flex flex-col items-center gap-1 no-underline">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300
                        ${isDone || isActive
                          ? 'bg-accent dark:bg-dark-accent text-white border-none'
                          : 'bg-surface-card dark:bg-dark-surface-card text-text-muted dark:text-dark-text-muted border border-border-default dark:border-dark-border-default'
                        }`}
                      style={isActive ? { boxShadow: '0 0 0 4px var(--color-accent-bg)' } : undefined}
                    >
                      {isDone ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                    </div>
                    <span className={`text-[0.65rem] whitespace-nowrap
                      ${isDone ? 'text-accent dark:text-dark-accent font-medium' : ''}
                      ${isActive ? 'text-text-primary dark:text-dark-text-primary font-bold' : ''}
                      ${!isDone && !isActive ? 'text-text-muted dark:text-dark-text-muted font-medium' : ''}`}>
                      {step.label}
                    </span>
                  </Link>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 mb-5 rounded-sm
                      ${isDone
                        ? 'bg-accent dark:bg-dark-accent'
                        : 'bg-bg-tertiary dark:bg-dark-bg-tertiary'}`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Save status bar */}
          <div className="flex items-center justify-between px-3 py-2 rounded-sm bg-bg-secondary dark:bg-dark-bg-secondary text-xs">
            <span className="text-text-muted dark:text-dark-text-muted">
              Step {currentStepIdx + 1} dari {steps.length}
            </span>
            <div className={`flex items-center gap-1 ${saving ? 'text-accent dark:text-dark-accent' : 'text-text-muted dark:text-dark-text-muted'}`}>
              {saving ? (
                <><Loader2 size={12} className="animate-spin" /> Menyimpan...</>
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
    </div>
  );
}
