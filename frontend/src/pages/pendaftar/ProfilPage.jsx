import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, Lock, Save, GraduationCap, Hash,
  CalendarDays, CheckCircle2, AlertCircle, Eye, EyeOff, Loader2, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import api from '../../services/api';
import GeometricPattern from '../../components/GeometricPattern';
import { Skeleton, SkeletonText } from '../../components/SkeletonLoader';

export default function ProfilPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
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
    const fetch = async () => {
      try {
        const res = await api.get('/profil');
        const d = res.data.data;
        setProfileData(d);
        setForm({ nama_lengkap: d.user.nama_lengkap || '', no_hp: d.user.no_hp || '' });
      } catch { setError('Gagal memuat profil.'); }
      finally { setLoading(false); }
    };
    fetch();
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

  const handleLogout = async () => { await logout(); navigate('/'); };

  const inputCls = "w-full px-4 py-3 rounded-md text-[0.92rem] outline-none transition-colors duration-300 bg-bg-tertiary dark:bg-dark-bg-tertiary border-[1.5px] border-border-default dark:border-dark-border-default text-text-primary dark:text-dark-text-primary focus:border-accent dark:focus:border-dark-accent";

  if (loading) {
    return (
      <div className="min-h-screen pt-[85px] pb-8">
        <div className="container max-w-[640px]">
          <div className="flex flex-col gap-5">
            <Skeleton width="150px" height="1.5rem" />
            <div className="glass-card-static p-8">
              <div className="flex items-center gap-4 mb-6">
                <Skeleton width="64px" height="64px" borderRadius="50%" />
                <div className="flex-1"><Skeleton width="60%" height="1.1rem" /><Skeleton width="40%" height="0.75rem" style={{ marginTop: '0.4rem' }} /></div>
              </div>
              <SkeletonText lines={4} gap="1rem" />
            </div>
            <div className="glass-card-static p-8"><SkeletonText lines={3} gap="1rem" /></div>
          </div>
        </div>
      </div>
    );
  }

  const pd = profileData?.pendaftaran;

  return (
    <div className="min-h-screen pt-[85px] pb-24 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 z-0"><GeometricPattern size={350} opacity={0.03} /></div>
      <div className="container max-w-[640px] relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
          <h2 className="text-2xl mb-1">
            <User size={22} className="inline align-middle mr-2 text-accent dark:text-dark-accent" />
            Profil Akun
          </h2>
        </motion.div>

        {/* Info Akun */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static p-6 mb-5">
          <h4 className="text-sm font-semibold uppercase tracking-wide mb-4 text-text-muted dark:text-dark-text-muted">Informasi Akun</h4>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full shrink-0 flex items-center justify-center text-[1.4rem] font-bold text-[#0B1A0F] bg-gradient-to-br from-accent to-accent-hover">
              {form.nama_lengkap?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="text-lg font-semibold">{form.nama_lengkap}</div>
              <div className="text-sm text-text-muted dark:text-dark-text-muted">{profileData?.user?.email}</div>
            </div>
          </div>

          {pd && (
            <div className="grid grid-cols-2 gap-3">
              {[
                [GraduationCap, 'Jenjang', pd.jenjang],
                [Hash, 'No Daftar', pd.nomor_daftar || '-'],
                [CalendarDays, 'Terdaftar', profileData?.user?.created_at ? new Date(profileData.user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-']
              ].map(([Icon, label, value]) => (
                <div key={label} className="p-2.5 rounded-sm flex items-center gap-2 bg-bg-tertiary dark:bg-dark-bg-tertiary">
                  <Icon size={14} className="text-accent dark:text-dark-accent" />
                  <div>
                    <div className="text-[0.6rem] uppercase text-text-muted dark:text-dark-text-muted">{label}</div>
                    <div className="text-[0.78rem] font-semibold truncate">{value}</div>
                  </div>
                </div>
              ))}
              <div className="p-2.5 rounded-sm flex items-center gap-2 bg-bg-tertiary dark:bg-dark-bg-tertiary">
                <CheckCircle2 size={14} className="text-accent dark:text-dark-accent" />
                <div>
                  <div className="text-[0.6rem] uppercase text-text-muted dark:text-dark-text-muted">Status</div>
                  <span className="px-2 py-0.5 rounded-full text-[0.7rem] font-bold mt-0.5 inline-block
                                   bg-accent-bg dark:bg-dark-accent-bg text-accent dark:text-dark-accent">
                    {pd.status || '-'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Edit Profil */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static p-6 mb-5">
          <h4 className="text-sm font-semibold uppercase tracking-wide mb-4 text-text-muted dark:text-dark-text-muted">Edit Profil</h4>

          {success && (
            <div className="flex items-center gap-1.5 p-2.5 rounded-sm mb-4 text-sm text-status-diterima bg-status-diterima/10 border border-status-diterima/25">
              <CheckCircle2 size={14} />{success}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-1.5 p-2.5 rounded-sm mb-4 text-sm text-status-ditolak bg-status-ditolak/10 border border-status-ditolak/25">
              <AlertCircle size={14} />{error}
            </div>
          )}

          <div className="grid gap-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary"><User size={13} className="inline align-middle mr-1" />Nama Lengkap</label>
              <input value={form.nama_lengkap} onChange={e => setForm(p => ({ ...p, nama_lengkap: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary"><Mail size={13} className="inline align-middle mr-1" />Email</label>
              <input value={profileData?.user?.email || ''} disabled className={`${inputCls} opacity-60 cursor-not-allowed`} />
              <span className="text-[0.72rem] text-text-muted dark:text-dark-text-muted">Email tidak bisa diubah</span>
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary"><Phone size={13} className="inline align-middle mr-1" />Nomor HP</label>
              <input value={form.no_hp} onChange={e => setForm(p => ({ ...p, no_hp: e.target.value }))} placeholder="08xxx" className={inputCls} />
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className={`btn btn-primary w-full justify-center mt-5 ${saving ? 'opacity-70' : ''}`}>
            {saving ? <><Loader2 size={16} className="animate-spin" /> Menyimpan...</> : <><Save size={16} /> Simpan Perubahan</>}
          </button>
        </motion.div>

        {/* Ganti Password */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static p-6 mb-5">
          <h4 className="text-sm font-semibold uppercase tracking-wide mb-4 text-text-muted dark:text-dark-text-muted">
            <Lock size={14} className="inline align-middle mr-1" />Ganti Password
          </h4>

          {pwSuccess && (
            <div className="flex items-center gap-1.5 p-2.5 rounded-sm mb-4 text-sm text-status-diterima bg-status-diterima/10 border border-status-diterima/25">
              <CheckCircle2 size={14} />{pwSuccess}
            </div>
          )}
          {pwError && (
            <div className="flex items-center gap-1.5 p-2.5 rounded-sm mb-4 text-sm text-status-ditolak bg-status-ditolak/10 border border-status-ditolak/25">
              <AlertCircle size={14} />{pwError}
            </div>
          )}

          <div className="grid gap-4">
            {[['password_lama', 'Password Lama'], ['password_baru', 'Password Baru'], ['password_baru_confirmation', 'Konfirmasi Password Baru']].map(([name, label]) => (
              <div key={name} className="relative">
                <label className="block mb-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{label}</label>
                <input type={showPw[name] ? 'text' : 'password'} value={pwForm[name]} onChange={e => setPwForm(p => ({ ...p, [name]: e.target.value }))} className={inputCls} />
                <button type="button" onClick={() => setShowPw(p => ({ ...p, [name]: !p[name] }))}
                  className="absolute right-3 top-[2.15rem] text-text-muted dark:text-dark-text-muted cursor-pointer bg-transparent border-none">
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

        {/* Logout */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <button onClick={handleLogout}
            className="btn w-full justify-center bg-transparent cursor-pointer text-status-ditolak border-[1.5px] border-status-ditolak hover:bg-status-ditolak/5">
            <LogOut size={16} /> Keluar dari Akun
          </button>
        </motion.div>
      </div>
    </div>
  );
}
