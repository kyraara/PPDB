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

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-tertiary)',
    border: '1.5px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.92rem',
    outline: 'none', transition: 'border 0.3s',
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '85px', paddingBottom: '2rem' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Skeleton width="150px" height="1.5rem" />
            <div className="glass-card-static" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <Skeleton width="64px" height="64px" borderRadius="50%" />
                <div style={{ flex: 1 }}><Skeleton width="60%" height="1.1rem" /><Skeleton width="40%" height="0.75rem" style={{ marginTop: '0.4rem' }} /></div>
              </div>
              <SkeletonText lines={4} gap="1rem" />
            </div>
            <div className="glass-card-static" style={{ padding: '2rem' }}><SkeletonText lines={3} gap="1rem" /></div>
          </div>
        </div>
      </div>
    );
  }

  const pd = profileData?.pendaftaran;

  return (
    <div style={{ minHeight: '100vh', paddingTop: '85px', paddingBottom: '6rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', zIndex: 0 }}><GeometricPattern size={350} opacity={0.03} /></div>
      <div className="container" style={{ maxWidth: '640px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
            <User size={22} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--accent-primary)' }} />
            Profil Akun
          </h2>
        </motion.div>

        {/* Info Akun */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Informasi Akun</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-hover))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.4rem', fontWeight: 700, color: '#0B1A0F' }}>
              {form.nama_lengkap?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{form.nama_lengkap}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{profileData?.user?.email}</div>
            </div>
          </div>

          {pd && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[[GraduationCap, 'Jenjang', pd.jenjang], [Hash, 'No Daftar', pd.nomor_daftar || '-'], [CalendarDays, 'Terdaftar', profileData?.user?.created_at ? new Date(profileData.user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'], [CheckCircle2, 'Status', pd.status || '-']].map(([Icon, label, value]) => (
                <div key={label} style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Icon size={14} color="var(--accent-primary)" />
                  <div><div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</div><div style={{ fontSize: '0.78rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div></div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Edit Profil */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Edit Profil</h4>

          {success && <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'color-mix(in srgb, var(--status-diterima) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--status-diterima) 25%, transparent)', color: 'var(--status-diterima)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle2 size={14} />{success}</div>}
          {error && <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'color-mix(in srgb, var(--status-ditolak) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--status-ditolak) 25%, transparent)', color: 'var(--status-ditolak)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><AlertCircle size={14} />{error}</div>}

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}><User size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.25rem' }} />Nama Lengkap</label>
              <input value={form.nama_lengkap} onChange={e => setForm(p => ({ ...p, nama_lengkap: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}><Mail size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.25rem' }} />Email</label>
              <input value={profileData?.user?.email || ''} disabled style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Email tidak bisa diubah</span>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}><Phone size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.25rem' }} />Nomor HP</label>
              <input value={form.no_hp} onChange={e => setForm(p => ({ ...p, no_hp: e.target.value }))} placeholder="08xxx" style={inputStyle} />
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center', opacity: saving ? 0.7 : 1 }}>
            {saving ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Menyimpan...</> : <><Save size={16} /> Simpan Perubahan</>}
          </button>
        </motion.div>

        {/* Ganti Password */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}><Lock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.25rem' }} />Ganti Password</h4>

          {pwSuccess && <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'color-mix(in srgb, var(--status-diterima) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--status-diterima) 25%, transparent)', color: 'var(--status-diterima)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle2 size={14} />{pwSuccess}</div>}
          {pwError && <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'color-mix(in srgb, var(--status-ditolak) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--status-ditolak) 25%, transparent)', color: 'var(--status-ditolak)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><AlertCircle size={14} />{pwError}</div>}

          <div style={{ display: 'grid', gap: '1rem' }}>
            {[['password_lama', 'Password Lama'], ['password_baru', 'Password Baru'], ['password_baru_confirmation', 'Konfirmasi Password Baru']].map(([name, label]) => (
              <div key={name} style={{ position: 'relative' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>
                <input type={showPw[name] ? 'text' : 'password'} value={pwForm[name]} onChange={e => setPwForm(p => ({ ...p, [name]: e.target.value }))} style={inputStyle} />
                <button type="button" onClick={() => setShowPw(p => ({ ...p, [name]: !p[name] }))} style={{ position: 'absolute', right: '0.75rem', top: '2.15rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPw[name] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            ))}
          </div>
          <button onClick={handleChangePw} disabled={savingPw || !pwForm.password_lama || !pwForm.password_baru} className="btn btn-secondary" style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center', opacity: savingPw ? 0.7 : 1 }}>
            {savingPw ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Mengubah...</> : <><Lock size={16} /> Ubah Password</>}
          </button>
        </motion.div>

        {/* Logout */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <button onClick={handleLogout} className="btn" style={{ width: '100%', justifyContent: 'center', background: 'transparent', border: '1.5px solid var(--status-ditolak)', color: 'var(--status-ditolak)', cursor: 'pointer' }}>
            <LogOut size={16} /> Keluar dari Akun
          </button>
        </motion.div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
