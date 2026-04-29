import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, BookOpen, School, Sparkles,
  ArrowLeft, ArrowRight, User, Mail, Lock, Phone,
  Eye, EyeOff, CheckCircle2, AlertCircle
} from 'lucide-react';
import useAuthStore from '../stores/authStore';
import GeometricPattern from '../components/GeometricPattern';

const jenjangOptions = [
  { key: 'TK', label: 'Taman Kanak-Kanak', icon: Sparkles, color: '#C9A84C', age: 'Usia 4-6 tahun' },
  { key: 'SD', label: 'Sekolah Dasar', icon: BookOpen, color: '#2D8A6B', age: 'Usia 6-7 tahun' },
  { key: 'SMP', label: 'Sekolah Menengah Pertama', icon: School, color: '#1A6B5A', age: 'Lulusan SD/MI' },
  { key: 'SMA', label: 'Sekolah Menengah Atas', icon: GraduationCap, color: '#E0C76A', age: 'Lulusan SMP/MTs' },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [selectedJenjang, setSelectedJenjang] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    nama_lengkap: '', email: '', no_hp: '', password: '', password_confirmation: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: null });
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.nama_lengkap.trim()) errors.nama_lengkap = 'Nama lengkap wajib diisi.';
    if (!formData.email.trim()) errors.email = 'Email wajib diisi.';
    if (!formData.no_hp.trim()) errors.no_hp = 'Nomor HP wajib diisi.';
    if (formData.password.length < 8) errors.password = 'Password minimal 8 karakter.';
    if (formData.password !== formData.password_confirmation) errors.password_confirmation = 'Konfirmasi password tidak cocok.';
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }

    const result = await register({ ...formData, jenjang_daftar: selectedJenjang });
    if (result.success) {
      setSuccessMsg('Registrasi berhasil! Mengalihkan ke halaman login...');
      setTimeout(() => navigate('/login'), 2000);
    } else if (result.errors) {
      const mapped = {};
      Object.entries(result.errors).forEach(([key, msgs]) => { mapped[key] = Array.isArray(msgs) ? msgs[0] : msgs; });
      setFieldErrors(mapped);
    }
  };

  const renderInput = (name, label, icon, type = 'text', placeholder = '') => {
    const Icon = icon;
    const isPass = type === 'password';
    const show = name === 'password' ? showPassword : showConfirm;
    const toggle = name === 'password' ? () => setShowPassword(!showPassword) : () => setShowConfirm(!showConfirm);
    return (
      <div className="form-group">
        <label className="form-label"><Icon size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.35rem' }} />{label}</label>
        <div style={{ position: 'relative' }}>
          <input type={isPass ? (show ? 'text' : 'password') : type} name={name} className="form-input" placeholder={placeholder} value={formData[name]} onChange={handleChange} style={isPass ? { paddingRight: '3rem' } : {}} />
          {isPass && <button type="button" onClick={toggle} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>}
        </div>
        {fieldErrors[name] && <div className="form-error">{fieldErrors[name]}</div>}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px', paddingBottom: '3rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', zIndex: 0 }}><GeometricPattern size={400} opacity={0.03} /></div>
      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '700px' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Daftar <span style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Akun Baru</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Buat akun untuk memulai pendaftaran peserta didik baru</p>
        </motion.div>

        {/* Step indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
          {[1, 2].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, background: step >= s ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-hover))' : 'var(--bg-tertiary)', color: step >= s ? 'var(--bg-primary)' : 'var(--text-muted)' }}>
                {step > s ? <CheckCircle2 size={16} /> : s}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: step === s ? 600 : 400, color: step >= s ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {s === 1 ? 'Pilih Jenjang' : 'Data Akun'}
              </span>
              {s < 2 && <div style={{ width: '40px', height: '2px', background: step > 1 ? 'var(--accent-primary)' : 'var(--bg-tertiary)', marginLeft: '0.5rem', borderRadius: '1px' }} />}
            </div>
          ))}
        </div>

        {/* Messages */}
        <AnimatePresence>
          {successMsg && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}><CheckCircle2 size={18} />{successMsg}</motion.div>}
          {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><AlertCircle size={18} />{error}</motion.div>}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {jenjangOptions.map((j) => (
                  <motion.div key={j.key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setSelectedJenjang(j.key); clearError(); }} className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer', border: selectedJenjang === j.key ? `2px solid ${j.color}` : '1px solid var(--glass-border)', background: selectedJenjang === j.key ? `${j.color}08` : 'var(--glass-bg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: `${j.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <j.icon size={26} color={j.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.15rem' }}>{j.key}</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{j.label}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{j.age}</p>
                      </div>
                      {selectedJenjang === j.key && <CheckCircle2 size={22} color={j.color} />}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => selectedJenjang && setStep(2)} disabled={!selectedJenjang} className="btn btn-primary" style={{ opacity: selectedJenjang ? 1 : 0.5, cursor: selectedJenjang ? 'pointer' : 'not-allowed' }}>Lanjutkan <ArrowRight size={18} /></button>
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', borderRadius: '50px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '1.5rem' }}><GraduationCap size={14} />Jenjang: {selectedJenjang}</div>
                <form onSubmit={handleSubmit}>
                  {renderInput('nama_lengkap', 'Nama Lengkap', User, 'text', 'Masukkan nama lengkap')}
                  {renderInput('email', 'Email', Mail, 'email', 'contoh@email.com')}
                  {renderInput('no_hp', 'Nomor HP', Phone, 'tel', '08xxxxxxxxxx')}
                  {renderInput('password', 'Password', Lock, 'password', 'Minimal 8 karakter')}
                  {renderInput('password_confirmation', 'Konfirmasi Password', Lock, 'password', 'Ulangi password')}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                    <button type="button" onClick={() => setStep(1)} className="btn btn-secondary"><ArrowLeft size={18} />Kembali</button>
                    <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ opacity: isLoading ? 0.7 : 1 }}>{isLoading ? 'Mendaftar...' : 'Daftar Sekarang'}</button>
                  </div>
                </form>
              </div>
              <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sudah punya akun? <Link to="/login" style={{ fontWeight: 600 }}>Masuk di sini</Link></p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
