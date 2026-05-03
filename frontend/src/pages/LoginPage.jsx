import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import GeometricPattern from '../components/GeometricPattern';
import GoogleSignInButton from '../components/ui/GoogleSignInButton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const getDashboardPath = (role) => {
    switch (role) {
      case 'admin': return '/admin/dashboard';
      case 'panitia': return '/panitia/dashboard';
      case 'kepala_sekolah': return '/kepsek/dashboard';
      default: return '/beranda';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const result = await login(email, password);
    if (result.success) navigate(getDashboardPath(result.user.role));
  };

  const handleGoogleSuccess = async (credential) => {
    clearError();
    const result = await useAuthStore.getState().loginWithGoogle(credential);
    if (result.success) navigate(getDashboardPath(result.user.role));
  };

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center relative overflow-hidden p-8
                    bg-bg-secondary dark:bg-dark-bg-secondary">
      <div className="absolute -top-[100px] -right-[100px] z-0"><GeometricPattern size={400} opacity={0.03} /></div>
      <div className="absolute -bottom-[100px] -left-[100px] z-0"><GeometricPattern size={350} opacity={0.03} /></div>

      {/* Green gradient orb */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[60px] z-0"
        style={{ background: 'radial-gradient(circle, rgba(45,138,107,0.08) 0%, transparent 70%)' }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-[440px]">

        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/images/logo.png" alt="Logo Al Istiqomah"
            className="block mx-auto mb-4 w-[72px] h-[72px] object-contain"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(45,138,107,0.3))' }} />
          <h1 className="text-[1.75rem] mb-1">
            Masuk ke{' '}
            <span className="bg-gradient-to-br from-accent to-accent-light dark:from-dark-accent dark:to-dark-accent-light bg-clip-text text-transparent">
              PPDB Online
            </span>
          </h1>
          <p className="text-text-secondary dark:text-dark-text-secondary text-sm">Yayasan Al Istiqomah Al Islamiyah</p>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-xl shadow-md relative z-10
                        bg-surface-card dark:bg-dark-surface-card
                        border border-border-default dark:border-dark-border-default">
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 p-3 mb-5 rounded-md text-[0.88rem]
                           bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-status-ditolak">
                <AlertCircle size={16} />{error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label"><Mail size={14} className="inline align-middle mr-1.5" />Email</label>
              <input type="email" className="form-input" placeholder="Masukkan email Anda"
                value={email} onChange={(e) => { setEmail(e.target.value); clearError(); }} required />
            </div>

            <div className="form-group">
              <label className="form-label"><Lock size={14} className="inline align-middle mr-1.5" />Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} className="form-input pr-12"
                  placeholder="Masukkan password" value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); }} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer
                             text-text-muted dark:text-dark-text-muted">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="text-right mb-6 -mt-2">
              <Link to="/lupa-password" className="text-sm font-medium text-accent dark:text-dark-accent no-underline">
                Lupa Password?
              </Link>
            </div>

            <button type="submit" disabled={isLoading}
              className={`btn btn-primary w-full mt-2 ${isLoading ? 'opacity-70' : ''}`}>
              {isLoading ? 'Memproses...' : <><LogIn size={18} />Masuk</>}
            </button>
          </form>

          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-border-default dark:border-dark-border-default"></div>
            <span className="shrink-0 px-3 text-xs text-text-muted dark:text-dark-text-muted">atau masuk dengan</span>
            <div className="flex-grow border-t border-border-default dark:border-dark-border-default"></div>
          </div>

          <GoogleSignInButton 
            onSuccess={handleGoogleSuccess} 
            onError={() => { clearError(); useAuthStore.setState({ error: 'Google Sign-In gagal atau dibatalkan.' }) }} 
            text="signin_with"
          />
        </div>

        <div className="text-center mt-6">
          <p className="text-text-secondary dark:text-dark-text-secondary text-sm">
            Belum punya akun? <Link to="/daftar" className="font-semibold">Daftar Sekarang</Link>
          </p>
        </div>

        {/* Demo credentials */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8">
          <div className="glass-card p-5">
            <p className="text-xs text-accent dark:text-dark-accent font-semibold mb-3 uppercase tracking-wide">🔑 Akun Demo</p>
            <div className="grid gap-2 text-xs">
              {[
                { label: 'Admin', email: 'admin@ppdb.test' },
                { label: 'Kepsek', email: 'kepsek@ppdb.test' },
                { label: 'Panitia TK', email: 'panitia.tk@ppdb.test' },
                { label: 'Panitia SD', email: 'panitia.sd@ppdb.test' },
              ].map(acc => (
                <div key={acc.email} className="flex justify-between items-center">
                  <span className="text-text-secondary dark:text-dark-text-secondary">{acc.label}</span>
                  <button onClick={() => { setEmail(acc.email); setPassword('password'); clearError(); }}
                    className="px-2 py-0.5 text-xs font-mono rounded-sm cursor-pointer
                               bg-bg-tertiary dark:bg-dark-bg-tertiary
                               border border-border-default dark:border-dark-border-default
                               text-accent dark:text-dark-accent">
                    {acc.email}
                  </button>
                </div>
              ))}
            </div>
            <p className="text-[0.7rem] text-text-muted dark:text-dark-text-muted mt-2">
              Password: <code className="text-accent dark:text-dark-accent">password</code>
            </p>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
