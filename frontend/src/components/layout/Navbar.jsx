import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, UserPlus, LogOut, LayoutDashboard, Home, Moon, Sun, Bell, UserCircle, Phone, Settings } from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import useThemeStore from '../../stores/themeStore';
import api from '../../services/api';

const publicLinks = [
  { label: 'Beranda', path: '/' },
  { label: 'Cek Status', path: '/cek-status' },
  { label: 'Kontak', path: '/kontak' },
];

const pendaftarLinks = [
  { label: 'Beranda', path: '/beranda' },
  { label: 'Formulir', path: '/formulir' },
  { label: 'Pembayaran', path: '/pembayaran' },
  { label: 'Kontak Panitia', path: '/kontak' },
];

/* Notification Item */
function NotifItem({ n }) {
  return (
    <div className={`flex gap-3 items-start p-3 border-b border-border-subtle dark:border-dark-border-subtle ${n.is_read ? 'opacity-65' : ''}`}>
      <Bell size={15} className="text-accent dark:text-dark-accent shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className={`text-sm mb-0.5 text-text-primary dark:text-dark-text-primary ${n.is_read ? 'font-normal' : 'font-semibold'}`}>{n.judul}</div>
        <div className="text-[0.78rem] text-text-muted dark:text-dark-text-muted truncate">{n.pesan}</div>
      </div>
      <span className="text-[0.7rem] text-text-muted dark:text-dark-text-muted shrink-0">
        {new Date(n.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
      </span>
    </div>
  );
}

/* Notification Dropdown */
function NotifDropdown({ notifikasi, unreadCount, setUnreadCount, setNotifikasi, setShowNotif, width = 'w-[340px]' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className={`absolute top-full right-0 ${width} mt-2 z-[200] overflow-hidden rounded-lg shadow-lg
                  bg-surface-card dark:bg-dark-surface-card border border-border-default dark:border-dark-border-default`}
    >
      <div className="flex justify-between items-center px-4 py-3 border-b border-border-subtle dark:border-dark-border-subtle">
        <h4 className="text-[0.95rem] m-0">Notifikasi</h4>
        {unreadCount > 0 && (
          <button onClick={() => {
            api.patch('/notifikasi/read-all').then(() => {
              setUnreadCount(0);
              setNotifikasi(notifikasi.map(n => ({ ...n, is_read: true })));
            });
          }} className="text-[0.78rem] text-accent dark:text-dark-accent bg-transparent border-none cursor-pointer p-0">
            Tandai semua dibaca
          </button>
        )}
      </div>
      <div className="max-h-[300px] overflow-y-auto">
        {notifikasi.length === 0 ? (
          <div className="p-6 text-center text-text-muted dark:text-dark-text-muted text-sm">Belum ada notifikasi</div>
        ) : (
          notifikasi.slice(0, 5).map((n) => <NotifItem key={n.id} n={n} />)
        )}
      </div>
      {notifikasi.length > 5 && (
        <Link to="/notifikasi" onClick={() => setShowNotif(false)}
          className="block py-3 text-center text-sm text-accent dark:text-dark-accent border-t border-border-subtle dark:border-dark-border-subtle no-underline">
          Lihat semua notifikasi →
        </Link>
      )}
    </motion.div>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifikasi, setNotifikasi] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  const activeLinks = (isAuthenticated && user?.role === 'pendaftar') ? pendaftarLinks : publicLinks;

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/notifikasi?limit=5').then(res => {
        setNotifikasi(res.data.data || []);
        setUnreadCount(res.data.unread_count || 0);
      }).catch(() => {});
    }
  }, [isAuthenticated, location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => { await logout(); navigate('/'); };
  const getDashboardPath = () => {
    if (!user) return '/beranda';
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'panitia': return '/panitia/dashboard';
      case 'kepala_sekolah': return '/kepsek/dashboard';
      default: return '/beranda';
    }
  };

  const ThemeIcon = theme === 'dark' ? Sun : Moon;
  const isLinkActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  const notifProps = { notifikasi, unreadCount, setUnreadCount, setNotifikasi, setShowNotif };

  return (
    <motion.nav
      initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-[1000] backdrop-blur-2xl
                 bg-surface-card dark:bg-dark-surface-card
                 border-b border-border-default dark:border-dark-border-default
                 transition-colors duration-300"
    >
      <div className="container flex items-center justify-between h-[70px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline">
          <img src="/images/logo.png" alt="Logo Al Istiqomah" className="w-10 h-10 object-contain" />
          <div>
            <div className="font-heading font-bold text-[1.1rem] leading-tight text-text-primary dark:text-dark-text-primary">PPDB Online</div>
            <div className="text-[0.65rem] text-accent dark:text-dark-accent font-semibold uppercase tracking-wide">Al Istiqomah Al Islamiyah</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {activeLinks.map((link) => (
            <Link key={link.path} to={link.path}
              className={`text-sm font-medium relative transition-colors duration-300
                ${isLinkActive(link.path)
                  ? 'text-accent dark:text-dark-accent'
                  : 'text-text-secondary dark:text-dark-text-secondary hover:text-accent dark:hover:text-dark-accent'}`}>
              {link.label}
              {isLinkActive(link.path) && (
                <motion.div layoutId="navbar-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-sm bg-accent dark:bg-dark-accent" />
              )}
            </Link>
          ))}

          {/* Theme Toggle (Public) */}
          {!isAuthenticated && (
            <button onClick={toggleTheme} aria-label={theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
              className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300
                         bg-transparent border border-border-default dark:border-dark-border-default
                         text-accent dark:text-dark-accent hover:bg-accent-bg dark:hover:bg-dark-accent-bg">
              <ThemeIcon size={16} />
            </button>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button onClick={() => setShowNotif(!showNotif)}
                  className="bg-transparent border-none cursor-pointer text-text-secondary dark:text-dark-text-secondary relative p-1">
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-status-ditolak text-white text-[0.65rem] font-bold flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                <AnimatePresence>{showNotif && <NotifDropdown {...notifProps} />}</AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="bg-transparent border border-border-default dark:border-dark-border-default rounded-full
                             px-3 py-1 pl-1.5 flex items-center gap-2 cursor-pointer
                             text-text-primary dark:text-dark-text-primary transition-all duration-300
                             hover:border-border-strong dark:hover:border-dark-border-strong">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-accent-hover dark:from-dark-accent dark:to-dark-accent-hover
                                  flex items-center justify-center text-white">
                    <UserCircle size={18} />
                  </div>
                  <span className="text-sm font-medium">{user?.nama_lengkap?.split(' ')[0] || 'User'}</span>
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 w-[220px] mt-2 z-[100] overflow-hidden rounded-md shadow-lg
                                 bg-surface-card dark:bg-dark-surface-card border border-border-default dark:border-dark-border-default">
                      <div className="p-4 border-b border-border-default dark:border-dark-border-default">
                        <div className="font-semibold text-sm text-text-primary dark:text-dark-text-primary">{user?.nama_lengkap}</div>
                        <div className="text-xs text-text-muted dark:text-dark-text-muted">{user?.email}</div>
                      </div>
                      <div className="p-2">
                        <Link to="/profil" onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm no-underline
                                     text-text-secondary dark:text-dark-text-secondary hover:bg-bg-tertiary dark:hover:bg-dark-bg-tertiary">
                          <UserCircle size={16} /> Profil Saya
                        </Link>
                        <button onClick={toggleTheme}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm text-left cursor-pointer
                                     bg-transparent border-none text-text-secondary dark:text-dark-text-secondary hover:bg-bg-tertiary dark:hover:bg-dark-bg-tertiary">
                          <ThemeIcon size={16} /> Mode {theme === 'dark' ? 'Terang' : 'Gelap'}
                        </button>
                      </div>
                      <div className="p-2 border-t border-border-default dark:border-dark-border-default">
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm text-left cursor-pointer font-medium
                                     bg-transparent border-none text-status-ditolak hover:bg-bg-tertiary dark:hover:bg-dark-bg-tertiary">
                          <LogOut size={16} /> Keluar
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn btn-secondary btn-sm"><LogIn size={16} /> Masuk</Link>
              <Link to="/daftar" className="btn btn-primary btn-sm"><UserPlus size={16} /> Daftar</Link>
            </div>
          )}
        </div>

        {/* Mobile Right Controls */}
        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated && (
            <div className="relative" ref={notifRef}>
              <button onClick={() => setShowNotif(!showNotif)}
                className="bg-transparent border-none cursor-pointer text-accent dark:text-dark-accent relative p-2">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-status-ditolak text-white text-[0.6rem] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <AnimatePresence>{showNotif && <NotifDropdown {...notifProps} width="w-[320px] -right-10" />}</AnimatePresence>
            </div>
          )}

          {!isAuthenticated && (
            <button onClick={toggleTheme} aria-label={theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
              className="bg-transparent border-none text-accent dark:text-dark-accent cursor-pointer p-2">
              <ThemeIcon size={20} />
            </button>
          )}

          <button onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-transparent border-none text-text-primary dark:text-dark-text-primary cursor-pointer p-2">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-bg-secondary dark:bg-dark-bg-secondary border-t border-border-default dark:border-dark-border-default overflow-hidden md:hidden">
            <div className="px-6 py-4">
              {activeLinks.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)}
                  className={`block py-3 text-base font-medium border-b border-border-default dark:border-dark-border-default no-underline
                    ${isLinkActive(link.path) ? 'text-accent dark:text-dark-accent' : 'text-text-primary dark:text-dark-text-primary'}`}>
                  {link.label}
                </Link>
              ))}

              <div className="flex flex-col gap-3 mt-4">
                {isAuthenticated ? (
                  <>
                    <Link to="/profil" onClick={() => setIsMenuOpen(false)} className="btn btn-secondary btn-sm w-full justify-center">
                      <UserCircle size={16} /> Profil Saya
                    </Link>
                    <button onClick={() => { toggleTheme(); setIsMenuOpen(false); }} className="btn btn-secondary btn-sm w-full justify-center">
                      <ThemeIcon size={16} /> Mode {theme === 'dark' ? 'Terang' : 'Gelap'}
                    </button>
                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                      className="btn btn-sm w-full justify-center bg-transparent text-status-ditolak border border-status-ditolak cursor-pointer">
                      <LogOut size={16} /> Keluar
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn btn-secondary btn-sm flex-1">Masuk</Link>
                    <Link to="/daftar" onClick={() => setIsMenuOpen(false)} className="btn btn-primary btn-sm flex-1">Daftar</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
