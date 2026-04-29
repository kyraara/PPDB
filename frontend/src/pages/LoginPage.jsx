import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, GraduationCap } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import GeometricPattern from '../components/GeometricPattern';

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
    if (result.success) {
      navigate(getDashboardPath(result.user.role));
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '2rem 1rem' }}>
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', zIndex: 0 }}><GeometricPattern size={400} opacity={0.03} /></div>
      <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', zIndex: 0 }}><GeometricPattern size={350} opacity={0.03} /></div>

      {/* Gold gradient orb */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-hover))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 4px 20px rgba(201,168,76,0.3)' }}>
            <GraduationCap size={28} color="#0B1A0F" />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>
            Masuk ke <span style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PPDB Online</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Yayasan Al Istiqomah Al Islamiyah</p>
        </div>

        {/* Login Card */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                <AlertCircle size={16} />{error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label"><Mail size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.35rem' }} />Email</label>
              <input type="email" className="form-input" placeholder="Masukkan email Anda" value={email} onChange={(e) => { setEmail(e.target.value); clearError(); }} required />
            </div>

            <div className="form-group">
              <label className="form-label"><Lock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.35rem' }} />Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} className="form-input" placeholder="Masukkan password" value={password} onChange={(e) => { setPassword(e.target.value); clearError(); }} required style={{ paddingRight: '3rem' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? 'Memproses...' : <><LogIn size={18} />Masuk</>}
            </button>
          </form>
        </div>

        {/* Links */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Belum punya akun? <Link to="/daftar" style={{ fontWeight: 600 }}>Daftar Sekarang</Link>
          </p>
        </div>

        {/* Demo credentials */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ marginTop: '2rem' }}>
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🔑 Akun Demo</p>
            <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.8rem' }}>
              {[
                { label: 'Admin', email: 'admin@ppdb.test' },
                { label: 'Kepsek', email: 'kepsek@ppdb.test' },
                { label: 'Panitia TK', email: 'panitia.tk@ppdb.test' },
                { label: 'Panitia SD', email: 'panitia.sd@ppdb.test' },
              ].map(acc => (
                <div key={acc.email} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{acc.label}</span>
                  <button onClick={() => { setEmail(acc.email); setPassword('password'); clearError(); }} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: 'var(--accent-primary)', cursor: 'pointer', fontFamily: 'monospace' }}>
                    {acc.email}
                  </button>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Password: <code style={{ color: 'var(--accent-primary)' }}>password</code></p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
