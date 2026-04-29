import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, CalendarDays, FileText, Users, UserCircle,
  LogOut, GraduationCap, Menu, X, Shield, CreditCard, Sun, Moon
} from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import useThemeStore from '../../stores/themeStore';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/gelombang', label: 'Gelombang', icon: CalendarDays },
  { path: '/admin/persyaratan', label: 'Persyaratan', icon: FileText },
  { path: '/admin/panitia', label: 'Panitia', icon: Shield },
  { path: '/admin/pendaftar', label: 'Pendaftar', icon: Users },
  { path: '/admin/pembayaran', label: 'Pembayaran', icon: CreditCard },
  { path: '/profil', label: 'Profil', icon: UserCircle },
];

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const ThemeIcon = theme === 'dark' ? Sun : Moon;

  const isActive = (path) => {
    if (path === '/admin/dashboard') return location.pathname === path || location.pathname === '/admin';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const SidebarContent = ({ onNavigate }) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-hover))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={20} color="#0B1A0F" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem' }}>Panel Admin</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--accent-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              PPDB Online
            </div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.7rem 1rem', borderRadius: 'var(--radius-md)',
                  textDecoration: 'none', fontSize: '0.88rem', fontWeight: active ? 600 : 400,
                  color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  background: active ? 'rgba(201,168,76,0.1)' : 'transparent',
                  border: active ? '1px solid rgba(201,168,76,0.2)' : '1px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', padding: '0 0.25rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-hover))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#0B1A0F' }}>
            {user?.nama_lengkap?.[0]?.toUpperCase() || 'A'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.nama_lengkap}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Administrator</div>
          </div>
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', padding: '0.25rem' }}>
            <ThemeIcon size={16} />
          </button>
        </div>
        <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem', borderRadius: 'var(--radius-md)', background: 'transparent', border: '1px solid color-mix(in srgb, var(--status-ditolak) 40%, transparent)', color: 'var(--status-ditolak)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500, transition: 'all 0.2s' }}>
          <LogOut size={14} /> Keluar
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      <aside className="admin-sidebar" style={{
        width: '260px', flexShrink: 0, background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--glass-border)', position: 'fixed',
        top: 0, left: 0, bottom: 0, zIndex: 100, transition: 'background-color 0.3s',
      }}>
        <SidebarContent onNavigate={() => {}} />
      </aside>

      {/* Mobile header */}
      <div className="admin-mobile-header" style={{
        display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'var(--glass-bg)', backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid var(--glass-border)',
        padding: '0.75rem 1rem', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-hover))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={16} color="#0B1A0F" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.85rem' }}>Panel Admin</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--accent-primary)', fontWeight: 600 }}>PPDB Online</div>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.4rem' }}>
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200 }}>
          <motion.div initial={{ x: -280 }} animate={{ x: 0 }} onClick={e => e.stopPropagation()} style={{ width: '280px', height: '100%', background: 'var(--bg-secondary)', borderRight: '1px solid var(--glass-border)' }}>
            <SidebarContent onNavigate={() => setSidebarOpen(false)} />
          </motion.div>
        </motion.div>
      )}

      {/* Main content */}
      <main className="admin-main" style={{ flex: 1, marginLeft: '260px', minHeight: '100vh', background: 'var(--bg-primary)', transition: 'background-color 0.3s' }}>
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="admin-bottom-nav" style={{
        display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'var(--glass-bg)', backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)', borderTop: '1px solid var(--glass-border)',
        padding: '0.5rem 0 env(safe-area-inset-bottom, 0.5rem)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', maxWidth: '520px', margin: '0 auto' }}>
          {navItems.slice(0, 5).map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <NavLink key={item.path} to={item.path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem', padding: '0.3rem 0.6rem', borderRadius: '12px', textDecoration: 'none', background: active ? 'rgba(201,168,76,0.1)' : 'transparent' }}>
                <Icon size={19} strokeWidth={active ? 2.5 : 1.8} color={active ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                <span style={{ fontSize: '0.55rem', fontWeight: active ? 700 : 500, color: active ? 'var(--accent-primary)' : 'var(--text-muted)' }}>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
          .admin-mobile-header { display: flex !important; }
          .admin-bottom-nav { display: block !important; }
          .admin-main { margin-left: 0 !important; padding-top: 60px; padding-bottom: 72px; }
          .admin-main > div { padding: 1rem !important; }
        }
      `}</style>
    </div>
  );
}
