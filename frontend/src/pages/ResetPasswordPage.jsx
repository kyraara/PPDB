import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, XCircle, CheckCircle } from 'lucide-react';
import GeometricPattern from '../components/GeometricPattern';
import PasswordStrengthIndicator from '../components/ui/PasswordStrengthIndicator';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { alert("Konfirmasi password tidak cocok"); return; }
    setTimeout(() => setIsSuccess(true), 1000);
  };

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-70px)] flex items-center justify-center p-8 bg-bg-secondary dark:bg-dark-bg-secondary">
        <div className="text-center max-w-[420px]">
          <XCircle size={48} className="text-status-ditolak mx-auto mb-4" />
          <h3 className="text-xl mb-2">Link Tidak Valid</h3>
          <p className="text-text-secondary dark:text-dark-text-secondary mb-6">Link reset password sudah kadaluarsa atau tidak valid.</p>
          <Link to="/lupa-password" className="btn btn-primary inline-block">Minta Link Baru</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center p-8 relative overflow-hidden
                    bg-bg-secondary dark:bg-dark-bg-secondary">
      <div className="absolute -top-[100px] -right-[100px] z-0"><GeometricPattern size={400} opacity={0.03} /></div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-[420px]">
        <div className="p-8 rounded-xl shadow-md bg-surface-card dark:bg-dark-surface-card
                        border border-border-default dark:border-dark-border-default">
          {isSuccess ? (
            <div className="text-center">
              <CheckCircle size={48} className="text-status-diterima mx-auto mb-4" />
              <h3 className="text-xl mb-2">Password Diubah!</h3>
              <p className="text-text-secondary dark:text-dark-text-secondary mb-6 leading-relaxed">
                Password Anda telah berhasil direset. Silakan masuk dengan password baru Anda.
              </p>
              <Link to="/login" className="btn btn-primary w-full inline-flex justify-center">Masuk Sekarang</Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="font-heading text-2xl mb-2">Reset Password</h2>
                <p className="text-text-muted dark:text-dark-text-muted text-[0.88rem]">Masukkan password baru Anda.</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-5">
                  <label className="form-label"><Lock size={14} className="inline align-middle mr-1.5" />Password Baru</label>
                  <input type="password" minLength={8} className="form-input" placeholder="Minimal 8 karakter"
                    value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <PasswordStrengthIndicator password={password} />
                <div className="form-group mb-6">
                  <label className="form-label"><Lock size={14} className="inline align-middle mr-1.5" />Konfirmasi Password</label>
                  <input type="password" minLength={8} className="form-input" placeholder="Ulangi password"
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary w-full">Reset Password</button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
