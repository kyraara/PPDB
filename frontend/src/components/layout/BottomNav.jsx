import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, CreditCard, UserCircle } from 'lucide-react';

const allNavItems = [
  { path: '/beranda', label: 'Beranda', icon: Home, always: true },
  { path: '/formulir', label: 'Formulir', icon: FileText, always: true },
  { path: '/pembayaran', label: 'Bayar', icon: CreditCard, always: false, showOnStatus: ['DITERIMA', 'MENUNGGU_BAYAR'] },
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
      <div className="h-[72px] md:hidden" />

      <nav className="fixed bottom-0 left-0 right-0 z-[1000] py-2 pb-[env(safe-area-inset-bottom,0.5rem)]
                       bg-surface-card dark:bg-dark-surface-card
                       border-t border-border-default dark:border-dark-border-default
                       shadow-[0_-4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.3)]
                       transition-colors duration-300 md:hidden">
        <div className="flex justify-around items-center max-w-[480px] mx-auto">
          {navItems.map(item => {
            const isActive = location.pathname === item.path ||
              (item.path === '/formulir' && location.pathname.startsWith('/formulir'));
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center gap-[3px] no-underline flex-1 py-2 transition-colors duration-150"
              >
                <div className={`rounded-lg px-3 py-1 flex items-center justify-center transition-colors duration-200
                  ${isActive ? 'bg-accent-bg dark:bg-dark-accent-bg' : 'bg-transparent'}`}>
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className={isActive
                      ? 'text-accent-light dark:text-dark-accent-light'
                      : 'text-text-muted dark:text-dark-text-muted'}
                  />
                </div>
                <span className={`text-[0.68rem] font-medium
                  ${isActive
                    ? 'text-accent-light dark:text-dark-accent-light'
                    : 'text-text-muted dark:text-dark-text-muted'}`}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
}
