import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, CheckCircle, Mail } from 'lucide-react';
import GeometricPattern from '../components/GeometricPattern';

export default function LupaPasswordPage() {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => setEmailSent(true), 1000);
  };

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center p-8 relative overflow-hidden
                    bg-bg-secondary dark:bg-dark-bg-secondary">
      <div className="absolute -top-[100px] -right-[100px] z-0"><GeometricPattern size={400} opacity={0.03} /></div>
      <div className="absolute -bottom-[100px] -left-[100px] z-0"><GeometricPattern size={350} opacity={0.03} /></div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-[420px]">
        <div className="p-8 rounded-xl shadow-md bg-surface-card dark:bg-dark-surface-card
                        border border-border-default dark:border-dark-border-default">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4
                            bg-accent-bg dark:bg-dark-accent-bg">
              <KeyRound size={28} className="text-accent dark:text-dark-accent" />
            </div>
            <h2 className="font-heading text-2xl mb-2">Lupa Password</h2>
            <p className="text-text-muted dark:text-dark-text-muted text-[0.88rem]">
              Masukkan email Anda. Kami akan mengirim link untuk mereset password.
            </p>
          </div>

          {!emailSent ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-6">
                <label className="form-label"><Mail size={14} className="inline align-middle mr-1.5" />Email</label>
                <input type="email" className="form-input" placeholder="Masukkan email terdaftar"
                  value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary w-full">Kirim Link Reset</button>
            </form>
          ) : (
            <div className="text-center">
              <CheckCircle size={48} className="text-status-diterima mx-auto mb-4" />
              <h3 className="text-xl mb-2">Email Terkirim!</h3>
              <p className="text-text-secondary dark:text-dark-text-secondary text-sm mb-3 leading-relaxed">
                Link reset password telah dikirim ke <strong>{email}</strong>.<br/>
                Cek inbox atau folder spam Anda.
              </p>
              <p className="text-xs text-text-muted dark:text-dark-text-muted">
                Link berlaku selama <strong>1 jam</strong>.
              </p>
              <button onClick={() => setEmailSent(false)}
                className="btn btn-secondary w-full mt-6 justify-center">
                Kirim ulang ke email berbeda
              </button>
            </div>
          )}

          <Link to="/login" className="block text-center mt-6 text-sm font-medium
                                       text-text-muted dark:text-dark-text-muted no-underline">
            ← Kembali ke Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
