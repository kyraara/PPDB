import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, BookOpen, School, Sparkles,
  ArrowLeft, ArrowRight, User, Mail, Lock, Phone,
  Eye, EyeOff, CheckCircle2, AlertCircle, Check
} from 'lucide-react';
import PasswordStrengthIndicator from '../components/ui/PasswordStrengthIndicator';
import useAuthStore from '../stores/authStore';
import GeometricPattern from '../components/GeometricPattern';
import GoogleSignInButton from '../components/ui/GoogleSignInButton';

const gelombangAktif = { TK: { nomor: 1 }, SD: { nomor: 1 }, SMP: { nomor: 1 }, SMA: null };

const jenjangOptions = [
  { key: 'TK', label: 'Taman Kanak-Kanak', icon: Sparkles, age: 'Usia 4-6 tahun' },
  { key: 'SD', label: 'Sekolah Dasar', icon: BookOpen, age: 'Usia 6-7 tahun' },
  { key: 'SMP', label: 'Sekolah Menengah Pertama', icon: School, age: 'Lulusan SD/MI' },
  { key: 'SMA', label: 'Sekolah Menengah Atas', icon: GraduationCap, age: 'Lulusan SMP/MTs' },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [selectedJenjang, setSelectedJenjang] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({ nama_lengkap: '', email: '', no_hp: '', password: '', password_confirmation: '' });
  const [syaratDisetujui, setSyaratDisetujui] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
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
    if (result.success) { setIsSuccess(true); }
    else if (result.errors) {
      const mapped = {};
      Object.entries(result.errors).forEach(([key, msgs]) => { mapped[key] = Array.isArray(msgs) ? msgs[0] : msgs; });
      setFieldErrors(mapped);
    }
  };

  const handleGoogleSuccess = async (credential) => {
    clearError();
    const result = await useAuthStore.getState().loginWithGoogle(credential, selectedJenjang);
    if (result.success) {
      // Direct redirect for google login (avoids the "Akun Berhasil Dibuat" screen to act more like login)
      navigate('/beranda');
    }
  };

  const renderInput = (name, label, icon, type = 'text', placeholder = '') => {
    const Icon = icon;
    const isPass = type === 'password';
    const show = name === 'password' ? showPassword : showConfirm;
    const toggle = name === 'password' ? () => setShowPassword(!showPassword) : () => setShowConfirm(!showConfirm);
    return (
      <div className="form-group">
        <label className="form-label"><Icon size={14} className="inline align-middle mr-1.5" />{label}</label>
        <div className="relative">
          <input type={isPass ? (show ? 'text' : 'password') : type} name={name} className={`form-input ${isPass ? 'pr-12' : ''}`}
            placeholder={placeholder} value={formData[name]} onChange={handleChange} />
          {isPass && (
            <button type="button" onClick={toggle}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-text-muted dark:text-dark-text-muted">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {fieldErrors[name] && <div className="form-error">{fieldErrors[name]}</div>}
      </div>
    );
  };

  if (isSuccess) {
    return (
      <div className="min-h-[calc(100vh-70px)] flex items-center justify-center p-8 bg-bg-secondary dark:bg-dark-bg-secondary">
        <div className="text-center max-w-[440px]">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center mx-auto mb-5
                            bg-[rgba(16,185,129,0.1)] border-2 border-status-diterima">
              <CheckCircle2 size={36} className="text-status-diterima" />
            </div>
          </motion.div>
          <h2 className="font-heading mb-3 text-[1.8rem]">Akun Berhasil Dibuat!</h2>
          <p className="text-text-secondary dark:text-dark-text-secondary mb-2">Selamat datang, <strong>{formData.nama_lengkap}</strong>!</p>
          <p className="text-text-muted dark:text-dark-text-muted text-[0.88rem] mb-8">
            Akun Anda untuk jenjang <strong>{selectedJenjang}</strong> telah berhasil dibuat. Silakan masuk untuk mulai mengisi formulir pendaftaran.
          </p>
          <Link to="/login" className="btn btn-primary block text-center">Masuk ke Akun →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-70px)] flex flex-col items-center justify-center p-8 relative overflow-hidden
                    bg-bg-secondary dark:bg-dark-bg-secondary">
      <div className="absolute -top-[100px] -right-[100px] z-0"><GeometricPattern size={400} opacity={0.03} /></div>

      <div className="w-full max-w-[700px] relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-[2rem] mb-2 font-heading">
            Daftar{' '}
            <span className="bg-gradient-to-br from-accent to-accent-light dark:from-dark-accent dark:to-dark-accent-light bg-clip-text text-transparent">
              Akun Baru
            </span>
          </h1>
          <p className="text-text-secondary dark:text-dark-text-secondary">Buat akun untuk memulai pendaftaran peserta didik baru</p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex justify-center gap-4 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${step >= s
                  ? 'bg-gradient-to-br from-accent to-accent-hover dark:from-dark-accent dark:to-dark-accent-hover text-white'
                  : 'bg-bg-tertiary dark:bg-dark-bg-tertiary text-text-muted dark:text-dark-text-muted'}`}>
                {step > s ? <CheckCircle2 size={16} /> : s}
              </div>
              <span className={`text-sm ${step >= s ? 'text-text-primary dark:text-dark-text-primary font-semibold' : 'text-text-muted dark:text-dark-text-muted'}`}>
                {s === 1 ? 'Pilih Jenjang' : 'Data Akun'}
              </span>
              {s < 2 && (
                <div className={`w-10 h-0.5 ml-2 rounded-sm ${step > 1 ? 'bg-accent dark:bg-dark-accent' : 'bg-bg-tertiary dark:bg-dark-bg-tertiary'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 p-4 mb-6 rounded-md text-sm bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-status-ditolak">
              <AlertCircle size={18} />{error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {jenjangOptions.map((j) => {
                  const active = gelombangAktif[j.key];
                  const selected = selectedJenjang === j.key;
                  return (
                    <motion.div key={j.key}
                      whileHover={active ? { scale: 1.02 } : {}}
                      whileTap={active ? { scale: 0.98 } : {}}
                      onClick={() => { if (active) { setSelectedJenjang(j.key); clearError(); } }}
                      className={`relative flex items-center gap-4 p-5 rounded-lg transition-all duration-150
                        ${active ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}
                        ${selected
                          ? 'border-2 border-accent dark:border-dark-accent bg-accent-bg dark:bg-dark-accent-bg'
                          : 'border border-border-default dark:border-dark-border-default bg-surface-card dark:bg-dark-surface-card'}`}>
                      <div className={`w-11 h-11 rounded-md flex items-center justify-center shrink-0
                        ${selected
                          ? 'bg-accent dark:bg-dark-accent'
                          : 'bg-accent-bg dark:bg-dark-accent-bg'}`}>
                        <j.icon size={22} className={selected ? 'text-white' : 'text-accent dark:text-dark-accent'} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[0.95rem] font-bold mb-0.5">{j.key}</h3>
                        <p className="text-xs text-text-muted dark:text-dark-text-muted">{j.label}</p>
                        <p className="text-[0.75rem] text-text-muted dark:text-dark-text-muted">{j.age}</p>
                      </div>
                      <div className="shrink-0">
                        {active ? (
                          <span className="text-[0.7rem] font-bold px-2.5 py-1 rounded-full bg-[rgba(16,185,129,0.1)] text-[#059669] border border-[rgba(16,185,129,0.2)]">
                            ● Gel. {active.nomor} Buka
                          </span>
                        ) : (
                          <span className="text-[0.7rem] font-bold px-2.5 py-1 rounded-full bg-[rgba(239,68,68,0.08)] text-[#DC2626] border border-[rgba(239,68,68,0.15)]">Tutup</span>
                        )}
                      </div>
                      {selected && (
                        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-accent dark:bg-dark-accent flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
              <div className="mt-8 flex justify-end">
                <button onClick={() => selectedJenjang && setStep(2)} disabled={!selectedJenjang}
                  className={`btn btn-primary ${selectedJenjang ? '' : 'opacity-50 cursor-not-allowed'}`}>
                  Lanjutkan <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="glass-card p-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-6
                                bg-accent-bg dark:bg-dark-accent-bg border border-accent-bg-strong dark:border-dark-accent-bg-strong
                                text-accent dark:text-dark-accent">
                  <GraduationCap size={14} />Jenjang: {selectedJenjang}
                </div>
                
                <div className="mb-6">
                  <GoogleSignInButton 
                    onSuccess={handleGoogleSuccess} 
                    onError={() => { clearError(); useAuthStore.setState({ error: 'Google Sign-In gagal atau dibatalkan.' }) }} 
                    text="signup_with"
                  />
                </div>

                <div className="relative flex items-center my-6">
                  <div className="flex-grow border-t border-border-default dark:border-dark-border-default"></div>
                  <span className="shrink-0 px-3 text-xs text-text-muted dark:text-dark-text-muted">atau daftar manual</span>
                  <div className="flex-grow border-t border-border-default dark:border-dark-border-default"></div>
                </div>

                <form onSubmit={handleSubmit}>
                  {renderInput('nama_lengkap', 'Nama Lengkap', User, 'text', 'Masukkan nama lengkap')}
                  {renderInput('email', 'Email', Mail, 'email', 'contoh@email.com')}
                  {renderInput('no_hp', 'Nomor HP (WhatsApp aktif)', Phone, 'tel', '08xxxxxxxxxx')}
                  {renderInput('password', 'Password', Lock, 'password', 'Minimal 8 karakter')}
                  <PasswordStrengthIndicator password={formData.password} />
                  {renderInput('password_confirmation', 'Konfirmasi Password', Lock, 'password', 'Ulangi password')}

                  <label className="flex items-start gap-3 my-5 cursor-pointer">
                    <input type="checkbox" required checked={syaratDisetujui} onChange={(e) => setSyaratDisetujui(e.target.checked)}
                      className="mt-0.5 accent-accent dark:accent-dark-accent" />
                    <span className="text-sm text-text-secondary dark:text-dark-text-secondary leading-relaxed">
                      Saya menyetujui <Link to="/syarat-ketentuan" className="text-accent dark:text-dark-accent">syarat dan ketentuan</Link> PPDB Online Al Istiqomah Al Islamiyah
                    </span>
                  </label>

                  <div className="flex justify-between mt-6 gap-3">
                    <button type="button" onClick={() => setStep(1)} className="btn btn-secondary flex-1"><ArrowLeft size={18} />Kembali</button>
                    <button type="submit" disabled={isLoading || !syaratDisetujui}
                      className={`btn btn-primary flex-[2] ${isLoading || !syaratDisetujui ? 'opacity-70' : ''}`}>
                      {isLoading ? 'Mendaftar...' : 'Daftar Sekarang'}
                    </button>
                  </div>
                </form>
              </div>
              <p className="text-center mt-6 text-text-secondary dark:text-dark-text-secondary text-sm">
                Sudah punya akun? <Link to="/login" className="font-semibold">Masuk di sini</Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
