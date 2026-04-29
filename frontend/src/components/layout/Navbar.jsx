import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, GraduationCap, LogIn, UserPlus, LogOut, LayoutDashboard, Home, Moon, Sun, Bell, UserCircle, Phone, Settings } from 'lucide-react';
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

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/beranda';
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'panitia': return '/panitia/dashboard';
      case 'kepala_sekolah': return '/kepsek/dashboard';
      default: return '/beranda';
    }
  };

  const getDashboardLabel = () => user?.role === 'pendaftar' ? 'Beranda' : 'Dashboard';
  const DashboardIcon = user?.role === 'pendaftar' ? Home : LayoutDashboard;

  const ThemeIcon = theme === 'dark' ? Sun : Moon;

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--glass-border)',
      }}
    >
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          textDecoration: 'none',
        }}>
          <img 
            src="/images/logo.png" 
            alt="Logo Al Istiqomah" 
            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
          />
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: 'var(--text-heading)',
              lineHeight: 1.2,
            }}>
              PPDB Online
            </div>
            <div style={{
              fontSize: '0.65rem',
              color: 'var(--accent-primary)',
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}>
              Al Istiqomah Al Islamiyah
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
        }} className="desktop-nav">
          {activeLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                fontSize: '0.9rem',
                fontWeight: 500,
                color: (location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path))) ? 'var(--accent-primary)' : 'var(--text-secondary)',
                transition: 'color 0.3s',
                position: 'relative',
              }}
            >
              {link.label}
              {(location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path))) && (
                <motion.div
                  layoutId="navbar-indicator"
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'var(--accent-primary)',
                    borderRadius: '1px',
                  }}
                />
              )}
            </Link>
          ))}

          {/* Theme Toggle (Public) */}
          {!isAuthenticated && (
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
              style={{
                background: 'transparent',
                border: '1px solid var(--glass-border)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--accent-primary)',
                transition: 'all 0.3s',
              }}
            >
              <ThemeIcon size={16} />
            </button>
          )}

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Notification Bell (Desktop) */}
              <div style={{ position: 'relative' }} ref={notifRef}>
                <button
                  onClick={() => {
                    setShowNotif(!showNotif);
                    if (unreadCount > 0 && !showNotif) {
                      api.patch('/notifikasi/read-all').then(() => setUnreadCount(0));
                    }
                  }}
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: 'var(--text-secondary)', position: 'relative', padding: '0.2rem'
                  }}
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute', top: 0, right: 0, background: 'var(--status-ditolak)',
                      color: 'white', fontSize: '0.6rem', fontWeight: 'bold', width: '16px', height: '16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%'
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Dropdown Desktop */}
                <AnimatePresence>
                  {showNotif && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      style={{
                        position: 'absolute', top: '100%', right: 0, width: '300px',
                        background: 'var(--glass-bg)', backdropFilter: 'blur(16px)',
                        border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 100
                      }}
                    >
                      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--glass-border)', fontWeight: 600 }}>
                        Notifikasi
                      </div>
                      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {notifikasi.length === 0 ? (
                          <div style={{ padding: '1.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            Belum ada notifikasi
                          </div>
                        ) : (
                          notifikasi.map((n) => (
                            <div key={n.id} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--glass-border)', background: n.is_read ? 'transparent' : 'rgba(201, 168, 76, 0.05)' }}>
                              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{n.judul}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.pesan}</div>
                              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                                {new Date(n.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div style={{ position: 'relative' }} ref={profileRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '20px',
                    padding: '0.3rem 0.8rem 0.3rem 0.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-hover))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF'
                  }}>
                    <UserCircle size={18} />
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                    {user?.nama_lengkap?.split(' ')[0] || 'User'}
                  </span>
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      style={{
                        position: 'absolute', top: '100%', right: 0, width: '220px', marginTop: '0.5rem',
                        background: 'var(--glass-bg)', backdropFilter: 'blur(16px)',
                        border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 100
                      }}
                    >
                      <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                          {user?.nama_lengkap}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {user?.email}
                        </div>
                      </div>
                      <div style={{ padding: '0.5rem' }}>
                        <Link to="/profil" onClick={() => setShowProfileMenu(false)} style={{
                          display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem',
                          color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)'
                        }}>
                          <UserCircle size={16} /> Profil Saya
                        </Link>
                        <Link to="/kontak" onClick={() => setShowProfileMenu(false)} style={{
                          display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem',
                          color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)'
                        }}>
                          <Phone size={16} /> Kontak Panitia
                        </Link>
                        <button onClick={toggleTheme} style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem',
                          background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer',
                          fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', textAlign: 'left'
                        }}>
                          <ThemeIcon size={16} /> Mode {theme === 'dark' ? 'Terang' : 'Gelap'}
                        </button>
                      </div>
                      <div style={{ padding: '0.5rem', borderTop: '1px solid var(--glass-border)' }}>
                        <button onClick={handleLogout} style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem',
                          background: 'transparent', border: 'none', color: 'var(--status-ditolak)', cursor: 'pointer',
                          fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', textAlign: 'left', fontWeight: 500
                        }}>
                          <LogOut size={16} /> Keluar
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                <LogIn size={16} />
                Masuk
              </Link>
              <Link to="/daftar" className="btn btn-primary btn-sm">
                <UserPlus size={16} />
                Daftar
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="mobile-controls">
          {isAuthenticated && (
            <div style={{ position: 'relative' }} className="mobile-only-flex">
              <button
                onClick={() => {
                  setShowNotif(!showNotif);
                  if (unreadCount > 0 && !showNotif) {
                    api.patch('/notifikasi/read-all').then(() => setUnreadCount(0));
                  }
                }}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'var(--accent-primary)', position: 'relative', padding: '0.5rem'
                }}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '4px', right: '4px', background: 'var(--status-ditolak)',
                    color: 'white', fontSize: '0.6rem', fontWeight: 'bold', width: '16px', height: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown Mobile */}
              <AnimatePresence>
                {showNotif && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    style={{
                      position: 'absolute', top: '100%', right: '-40px', width: '280px',
                      background: 'var(--glass-bg)', backdropFilter: 'blur(16px)',
                      border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 100
                    }}
                  >
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--glass-border)', fontWeight: 600 }}>
                      Notifikasi
                    </div>
                    <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                      {notifikasi.length === 0 ? (
                        <div style={{ padding: '1.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Belum ada notifikasi
                        </div>
                      ) : (
                        notifikasi.map((n) => (
                          <div key={n.id} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--glass-border)', background: n.is_read ? 'transparent' : 'rgba(201, 168, 76, 0.05)' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{n.judul}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.pesan}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                              {new Date(n.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {!isAuthenticated && (
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
              style={{
                display: 'none',
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-primary)',
                cursor: 'pointer',
                padding: '0.5rem',
              }}
              className="mobile-theme-btn"
            >
              <ThemeIcon size={20} />
            </button>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '0.5rem',
            }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'var(--bg-secondary)',
              borderTop: '1px solid var(--glass-border)',
              overflow: 'hidden',
            }}
            className="mobile-menu"
          >
            <div style={{ padding: '1rem 1.5rem' }}>
              {activeLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '0.75rem 0',
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: (location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path))) ? 'var(--accent-primary)' : 'var(--text-primary)',
                    borderBottom: '1px solid var(--glass-border)',
                  }}
                >
                  {link.label}
                </Link>
              ))}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                {isAuthenticated ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                    <Link to="/profil" onClick={() => setIsMenuOpen(false)} className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                      <UserCircle size={16} /> Profil Saya
                    </Link>
                    <button onClick={() => { toggleTheme(); setIsMenuOpen(false); }} className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                      <ThemeIcon size={16} /> Mode {theme === 'dark' ? 'Terang' : 'Gelap'}
                    </button>
                    <button
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                      className="btn btn-sm"
                      style={{
                        width: '100%',
                        background: 'transparent',
                        color: 'var(--status-ditolak)',
                        border: '1px solid var(--status-ditolak)',
                        cursor: 'pointer',
                        justifyContent: 'center',
                      }}
                    >
                      <LogOut size={16} /> Keluar
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                    >
                      Masuk
                    </Link>
                    <Link
                      to="/daftar"
                      onClick={() => setIsMenuOpen(false)}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                    >
                      Daftar
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile CSS */}
      <style>{`
        .mobile-only-flex { display: none; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .mobile-theme-btn { display: block !important; }
          .mobile-only-flex { display: block !important; }
        }
      `}</style>
    </motion.nav>
  );
}
