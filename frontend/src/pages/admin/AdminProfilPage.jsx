import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, Lock, Save, CheckCircle2, AlertCircle, Eye, EyeOff, Loader2
} from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import api from '../../services/api';

export default function AdminProfilPage() {
  const { user } = useAuthStore();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  const [form, setForm] = useState({ nama_lengkap: '', no_hp: '' });
  const [pwForm, setPwForm] = useState({ password_lama: '', password_baru: '', password_baru_confirmation: '' });
  const [showPw, setShowPw] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profil');
        const d = res.data.data;
        setProfileData(d);
        setForm({ nama_lengkap: d.user.nama_lengkap || '', no_hp: d.user.no_hp || '' });
      } catch { setError('Gagal memuat profil.'); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true); setError(''); setSuccess('');
    try {
      const res = await api.put('/profil', form);
      if (res.data.success) {
        setSuccess('Profil berhasil diperbarui.');
        const u = res.data.data.user;
        localStorage.setItem('ppdb_user', JSON.stringify({ ...user, ...u }));
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) { setError(err.response?.data?.message || 'Gagal menyimpan profil.'); }
    finally { setSaving(false); }
  };

  const handleChangePw = async () => {
    setSavingPw(true); setPwError(''); setPwSuccess('');
    try {
      const res = await api.put('/profil/password', pwForm);
      if (res.data.success) {
        setPwSuccess('Password berhasil diubah.');
        setPwForm({ password_lama: '', password_baru: '', password_baru_confirmation: '' });
        setTimeout(() => setPwSuccess(''), 3000);
      }
    } catch (err) { setPwError(err.response?.data?.message || 'Gagal mengubah password.'); }
    finally { setSavingPw(false); }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><div className="loading-spinner w-8 h-8" /></div>;
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-[1.75rem] mb-1">
          Profil <span className="text-accent dark:text-dark-accent">Akun</span>
        </h1>
        <p className="text-text-secondary dark:text-dark-text-secondary">
          Kelola informasi profil dan keamanan akun Anda.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Informasi Akun */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-surface-card dark:bg-dark-surface-card rounded-xl p-6 border border-border-default dark:border-dark-border-default shadow-sm">
          <h3 className="text-base font-bold mb-5 flex items-center gap-2">
            <User size={18} className="text-accent dark:text-dark-accent" /> Informasi Akun
          </h3>

          {/* Avatar & Info */}
          <div className="flex items-center gap-4 mb-6 pb-5 border-b border-border-subtle dark:border-dark-border-subtle">
            <div className="w-16 h-16 rounded-full shrink-0 flex items-center justify-center text-[1.5rem] font-bold text-[#0B1A0F]"
              style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}>
              {form.nama_lengkap?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <div className="text-lg font-semibold">{form.nama_lengkap}</div>
              <div className="text-sm text-text-muted dark:text-dark-text-muted">{profileData?.user?.email}</div>
              <div className="mt-1 inline-block px-2 py-0.5 rounded-full text-[0.7rem] font-bold bg-accent-bg dark:bg-dark-accent-bg text-accent dark:text-dark-accent">
                {user?.role === 'admin' ? 'Administrator' : user?.role}
              </div>
            </div>
          </div>

          {success && (
            <div className="flex items-center gap-1.5 p-2.5 rounded-md mb-4 text-sm text-status-diterima bg-status-diterima/10 border border-status-diterima/25">
              <CheckCircle2 size={14} />{success}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-1.5 p-2.5 rounded-md mb-4 text-sm text-status-ditolak bg-status-ditolak/10 border border-status-ditolak/25">
              <AlertCircle size={14} />{error}
            </div>
          )}

          <div className="grid gap-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                <User size={13} className="inline align-middle mr-1" />Nama Lengkap
              </label>
              <input value={form.nama_lengkap} onChange={e => setForm(p => ({ ...p, nama_lengkap: e.target.value }))} className="input" />
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                <Mail size={13} className="inline align-middle mr-1" />Email
              </label>
              <input value={profileData?.user?.email || ''} disabled className="input opacity-60 cursor-not-allowed" />
              <span className="text-[0.72rem] text-text-muted dark:text-dark-text-muted">Email tidak bisa diubah</span>
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                <Phone size={13} className="inline align-middle mr-1" />Nomor HP
              </label>
              <input value={form.no_hp} onChange={e => setForm(p => ({ ...p, no_hp: e.target.value }))} placeholder="08xxx" className="input" />
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className={`btn btn-primary w-full justify-center mt-5 ${saving ? 'opacity-70' : ''}`}>
            {saving ? <><Loader2 size={16} className="animate-spin" /> Menyimpan...</> : <><Save size={16} /> Simpan Perubahan</>}
          </button>
        </motion.div>

        {/* Ganti Password */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-surface-card dark:bg-dark-surface-card rounded-xl p-6 border border-border-default dark:border-dark-border-default shadow-sm">
          <h3 className="text-base font-bold mb-5 flex items-center gap-2">
            <Lock size={18} className="text-accent dark:text-dark-accent" /> Ganti Password
          </h3>

          {pwSuccess && (
            <div className="flex items-center gap-1.5 p-2.5 rounded-md mb-4 text-sm text-status-diterima bg-status-diterima/10 border border-status-diterima/25">
              <CheckCircle2 size={14} />{pwSuccess}
            </div>
          )}
          {pwError && (
            <div className="flex items-center gap-1.5 p-2.5 rounded-md mb-4 text-sm text-status-ditolak bg-status-ditolak/10 border border-status-ditolak/25">
              <AlertCircle size={14} />{pwError}
            </div>
          )}

          <div className="grid gap-4">
            {[['password_lama', 'Password Lama'], ['password_baru', 'Password Baru'], ['password_baru_confirmation', 'Konfirmasi Password Baru']].map(([name, label]) => (
              <div key={name} className="relative">
                <label className="block mb-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{label}</label>
                <input type={showPw[name] ? 'text' : 'password'} value={pwForm[name]}
                  onChange={e => setPwForm(p => ({ ...p, [name]: e.target.value }))} className="input pr-10" />
                <button type="button" onClick={() => setShowPw(p => ({ ...p, [name]: !p[name] }))}
                  className="absolute right-3 top-[2.15rem] text-text-muted dark:text-dark-text-muted cursor-pointer bg-transparent border-none p-0">
                  {showPw[name] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            ))}
          </div>
          <button onClick={handleChangePw} disabled={savingPw || !pwForm.password_lama || !pwForm.password_baru}
            className={`btn btn-secondary w-full justify-center mt-5 ${savingPw ? 'opacity-70' : ''}`}>
            {savingPw ? <><Loader2 size={16} className="animate-spin" /> Mengubah...</> : <><Lock size={16} /> Ubah Password</>}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
