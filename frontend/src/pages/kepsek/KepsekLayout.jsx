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
  { path: '/kepsek/profil', label: 'Profil', icon: UserCircle },
];

export default function KepsekLayout() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => { await logout(); navigate('/'); };
  const ThemeIcon = theme === 'dark' ? Sun : Moon;
  const isActive = (path) => location.pathname === path || (location.pathname === '/kepsek' && path === '/kepsek/dashboard');

  const SidebarContent = ({ onNavigate }) => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border-default dark:border-dark-border-default">
        <div className="flex items-center gap-3">
          <img src="/images/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
          <div>
            <div className="font-heading font-bold text-[0.95rem]">Panel Kepsek</div>
            <div className="text-[0.68rem] font-semibold uppercase tracking-wide text-accent-light">PPDB Online</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3">
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

      <div className="py-4 px-3 border-t border-border-default dark:border-dark-border-default">
        <div className="flex items-center gap-2.5 mb-3 px-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--color-accent-light), var(--color-accent))' }}>
            {user?.nama_lengkap?.[0]?.toUpperCase() || 'K'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate">{user?.nama_lengkap}</div>
            <div className="text-[0.65rem] text-text-muted dark:text-dark-text-muted">Kepala Sekolah</div>
          </div>
          <button onClick={toggleTheme} className="bg-transparent border-none text-accent-light cursor-pointer p-1">
            <ThemeIcon size={16} />
          </button>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-transparent cursor-pointer text-sm font-medium text-status-ditolak"
          style={{ border: '1px solid color-mix(in srgb, var(--color-status-ditolak) 40%, transparent)' }}>
          <LogOut size={14} /> Keluar
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:block w-[260px] shrink-0 fixed top-0 left-0 bottom-0 z-[100]
                         bg-bg-secondary dark:bg-dark-bg-secondary border-r border-border-default dark:border-dark-border-default">
        <SidebarContent onNavigate={() => {}} />
      </aside>

      <div className="admin-mobile-header flex md:hidden fixed top-0 left-0 right-0 z-[100] items-center justify-between px-4 py-3 backdrop-blur-2xl
                       bg-surface-card/80 dark:bg-dark-surface-card/80 border-b border-border-default dark:border-dark-border-default">
        <div className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
          <span className="font-heading font-bold text-sm">Panel Kepsek</span>
        </div>
        <button onClick={() => setSidebarOpen(true)} className="bg-transparent border-none cursor-pointer text-text-primary dark:text-dark-text-primary">
          <Menu size={22} />
        </button>
      </div>

      {sidebarOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-[200]">
          <motion.div initial={{ x: -280 }} animate={{ x: 0 }} onClick={e => e.stopPropagation()}
            className="w-[280px] h-full bg-bg-secondary dark:bg-dark-bg-secondary border-r border-border-default dark:border-dark-border-default">
            <SidebarContent onNavigate={() => setSidebarOpen(false)} />
          </motion.div>
        </motion.div>
      )}

      <main className="flex-1 ml-0 md:ml-[260px] min-h-screen bg-bg-primary dark:bg-dark-bg-primary pt-[60px] md:pt-0">
        <div className="p-4 md:p-8 max-w-[1200px] mx-auto"><Outlet /></div>
      </main>
    </div>
  );
}
