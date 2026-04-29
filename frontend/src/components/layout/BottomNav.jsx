import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, CreditCard, UserCircle } from 'lucide-react';

const allNavItems = [
  { path: '/beranda', label: 'Beranda', icon: Home, always: true },
  { path: '/formulir', label: 'Formulir', icon: FileText, always: true },
  { path: '/pembayaran', label: 'Bayar', icon: CreditCard, always: false, showOnStatus: ['DITERIMA', 'MENUNGGU_BAYAR', 'TERDAFTAR'] },
  { path: '/profil', label: 'Profil', icon: UserCircle, always: true },
];

export default function BottomNav({ pendaftaranStatus }) {
  const location = useLocation();

  const navItems = allNavItems.filter(item =>
    item.always || (item.showOnStatus && item.showOnStatus.includes(pendaftaranStatus))
  );

  return (
    <>
      {/* Spacer so content doesn't hide behind fixed nav */}
      <div style={{ height: '72px' }} />

      <nav className="bottom-nav" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--glass-border)',
        padding: '0.5rem 0 env(safe-area-inset-bottom, 0.5rem)',
        transition: 'background-color 0.3s, border-color 0.3s',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          maxWidth: '480px',
          margin: '0 auto',
        }}>
          {navItems.map(item => {
            const isActive = location.pathname === item.path ||
              (item.path === '/formulir' && location.pathname.startsWith('/formulir'));
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                  padding: '0.4rem 1rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  background: isActive ? 'rgba(201, 168, 76, 0.1)' : 'transparent',
                }}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'}
                />
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                  letterSpacing: '0.3px',
                }}>
                  {item.label}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                  <div style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: 'var(--accent-primary)',
                    marginTop: '-2px',
                  }} />
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <style>{`
        @media (min-width: 769px) {
          .bottom-nav { display: none !important; }
        }
      `}</style>
    </>
  );
}
