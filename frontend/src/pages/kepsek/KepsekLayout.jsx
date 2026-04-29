import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, UserCircle, LogOut, GraduationCap, Menu, Sun, Moon
} from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import useThemeStore from '../../stores/themeStore';

const navItems = [
  { path: '/kepsek/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/profil', label: 'Profil', icon: UserCircle },
];

export default function KepsekLayout() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => { await logout(); navigate('/'); };
  const ThemeIcon = theme === 'dark' ? Sun : Moon;
  const isActive = (path) => location.pathname === path || location.pathname === '/kepsek' && path === '/kepsek/dashboard';

  const SidebarContent = ({ onNavigate }) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent-primary-light), var(--accent-primary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={20} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem' }}>Kepala Sekolah</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--accent-primary-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>PPDB Online</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: '1rem 0.75rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <NavLink key={item.path} to={item.path} onClick={onNavigate} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.7rem 1rem', borderRadius: 'var(--radius-md)',
                textDecoration: 'none', fontSize: '0.88rem', fontWeight: active ? 600 : 400,
                color: active ? 'var(--accent-primary-light)' : 'var(--text-secondary)',
                background: active ? 'rgba(45,138,107,0.1)' : 'transparent',
                border: active ? '1px solid rgba(45,138,107,0.2)' : '1px solid transparent',
                transition: 'all 0.2s',
              }}>
                <Icon size={18} />{item.label}
              </NavLink>
            );
          })}
        </div>
      </nav>
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', padding: '0 0.25rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary-light), var(--accent-primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>
            {user?.nama_lengkap?.[0]?.toUpperCase() || 'K'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.nama_lengkap}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Kepala Sekolah</div>
          </div>
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: 'var(--accent-primary-light)', cursor: 'pointer', padding: '0.25rem' }}><ThemeIcon size={16} /></button>
        </div>
        <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem', borderRadius: 'var(--radius-md)', background: 'transparent', border: '1px solid color-mix(in srgb, var(--status-ditolak) 40%, transparent)', color: 'var(--status-ditolak)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500 }}>
          <LogOut size={14} /> Keluar
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside className="kepsek-sidebar" style={{ width: '260px', flexShrink: 0, background: 'var(--bg-secondary)', borderRight: '1px solid var(--glass-border)', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100 }}>
        <SidebarContent onNavigate={() => {}} />
      </aside>

      <div className="kepsek-mobile-header" style={{ display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'var(--glass-bg)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid var(--glass-border)', padding: '0.75rem 1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--accent-primary-light), var(--accent-primary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={16} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.85rem' }}>Kepala Sekolah</span>
        </div>
        <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}><Menu size={22} /></button>
      </div>

      {sidebarOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200 }}>
          <motion.div initial={{ x: -280 }} animate={{ x: 0 }} onClick={e => e.stopPropagation()} style={{ width: '280px', height: '100%', background: 'var(--bg-secondary)', borderRight: '1px solid var(--glass-border)' }}>
            <SidebarContent onNavigate={() => setSidebarOpen(false)} />
          </motion.div>
        </motion.div>
      )}

      <main className="kepsek-main" style={{ flex: 1, marginLeft: '260px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}><Outlet /></div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .kepsek-sidebar { display: none !important; }
          .kepsek-mobile-header { display: flex !important; }
          .kepsek-main { margin-left: 0 !important; padding-top: 60px; }
          .kepsek-main > div { padding: 1rem !important; }
        }
      `}</style>
    </div>
  );
}
