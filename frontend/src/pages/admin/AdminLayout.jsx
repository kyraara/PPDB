import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, CalendarDays, FileText, Users, UserCircle,
  LogOut, GraduationCap, Menu, Shield, CreditCard, Sun, Moon
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

  const handleLogout = async () => { await logout(); navigate('/'); };
  const ThemeIcon = theme === 'dark' ? Sun : Moon;

  const isActive = (path) => {
    if (path === '/admin/dashboard') return location.pathname === path || location.pathname === '/admin';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const SidebarContent = ({ onNavigate }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-border-default dark:border-dark-border-default">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}>
            <GraduationCap size={20} color="#0B1A0F" />
          </div>
          <div>
            <div className="font-heading font-bold text-[0.95rem]">Panel Admin</div>
            <div className="text-[0.68rem] font-semibold uppercase tracking-wide text-accent dark:text-dark-accent">PPDB Online</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <div className="flex flex-col gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <NavLink key={item.path} to={item.path} onClick={onNavigate}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-md no-underline text-[0.88rem] transition-all duration-200
                  ${active
                    ? 'font-semibold text-accent dark:text-dark-accent bg-accent-bg dark:bg-dark-accent-bg border border-accent-bg-strong dark:border-dark-accent-bg-strong'
                    : 'font-normal text-text-secondary dark:text-dark-text-secondary border border-transparent hover:bg-bg-tertiary dark:hover:bg-dark-bg-tertiary'
                  }`}>
                <Icon size={18} />{item.label}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="py-4 px-3 border-t border-border-default dark:border-dark-border-default">
        <div className="flex items-center gap-2.5 mb-3 px-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#0B1A0F] shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}>
            {user?.nama_lengkap?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate">{user?.nama_lengkap}</div>
            <div className="text-[0.65rem] text-text-muted dark:text-dark-text-muted">Administrator</div>
          </div>
          <button onClick={toggleTheme} className="bg-transparent border-none text-accent dark:text-dark-accent cursor-pointer p-1">
            <ThemeIcon size={16} />
          </button>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-transparent cursor-pointer text-sm font-medium transition-all duration-200 text-status-ditolak"
          style={{ border: '1px solid color-mix(in srgb, var(--color-status-ditolak) 40%, transparent)' }}>
          <LogOut size={14} /> Keluar
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="admin-sidebar w-[260px] shrink-0 fixed top-0 left-0 bottom-0 z-[100] transition-colors duration-300
                         bg-bg-secondary dark:bg-dark-bg-secondary border-r border-border-default dark:border-dark-border-default">
        <SidebarContent onNavigate={() => {}} />
      </aside>

      {/* Mobile header */}
      <div className="admin-mobile-header hidden fixed top-0 left-0 right-0 z-[100] items-center justify-between px-4 py-3 backdrop-blur-2xl
                       bg-surface-card/80 dark:bg-dark-surface-card/80 border-b border-border-default dark:border-dark-border-default">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}>
            <GraduationCap size={16} color="#0B1A0F" />
          </div>
          <div>
            <div className="font-heading font-bold text-sm">Panel Admin</div>
            <div className="text-[0.6rem] font-semibold text-accent dark:text-dark-accent">PPDB Online</div>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(true)} className="bg-transparent border-none cursor-pointer p-1 text-text-primary dark:text-dark-text-primary">
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-[200]">
          <motion.div initial={{ x: -280 }} animate={{ x: 0 }} onClick={e => e.stopPropagation()}
            className="w-[280px] h-full bg-bg-secondary dark:bg-dark-bg-secondary border-r border-border-default dark:border-dark-border-default">
            <SidebarContent onNavigate={() => setSidebarOpen(false)} />
          </motion.div>
        </motion.div>
      )}

      {/* Main content */}
      <main className="admin-main flex-1 ml-[260px] min-h-screen transition-colors duration-300 bg-bg-primary dark:bg-dark-bg-primary">
        <div className="p-8 max-w-[1200px] mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="admin-bottom-nav hidden fixed bottom-0 left-0 right-0 z-[100] backdrop-blur-2xl
                       bg-surface-card/80 dark:bg-dark-surface-card/80 border-t border-border-default dark:border-dark-border-default
                       pb-[env(safe-area-inset-bottom,0.5rem)] pt-2">
        <div className="flex justify-around max-w-[520px] mx-auto">
          {navItems.slice(0, 5).map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <NavLink key={item.path} to={item.path}
                className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl no-underline
                  ${active ? 'bg-accent-bg dark:bg-dark-accent-bg' : ''}`}>
                <Icon size={19} strokeWidth={active ? 2.5 : 1.8}
                  className={active ? 'text-accent dark:text-dark-accent' : 'text-text-muted dark:text-dark-text-muted'} />
                <span className={`text-[0.55rem] ${active ? 'font-bold text-accent dark:text-dark-accent' : 'font-medium text-text-muted dark:text-dark-text-muted'}`}>
                  {item.label}
                </span>
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
