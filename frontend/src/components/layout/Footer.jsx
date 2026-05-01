import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-bg-secondary dark:bg-dark-bg-secondary border-t border-border-default dark:border-dark-border-default pt-12 pb-6 transition-colors duration-300">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/logo.png" alt="Logo Al Istiqomah" className="w-10 h-10 object-contain" />
              <div>
                <div className="font-heading font-bold text-text-primary dark:text-dark-text-primary">PPDB Online</div>
                <div className="text-[0.7rem] text-accent dark:text-dark-accent font-semibold uppercase tracking-wide">
                  Al Istiqomah Al Islamiyah
                </div>
              </div>
            </div>
            <p className="text-text-secondary dark:text-dark-text-secondary text-sm leading-relaxed">
              Yayasan Al Istiqomah Al Islamiyah menyelenggarakan Penerimaan Peserta Didik Baru
              untuk jenjang TK, SD, SMP, dan SMA secara online.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-accent dark:text-dark-accent mb-4 text-base">Navigasi</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Beranda', path: '/' },
                { label: 'Daftar Sekarang', path: '/daftar' },
                { label: 'Cek Status', path: '/cek-status' },
                { label: 'Login', path: '/login' },
              ].map(link => (
                <Link key={link.path} to={link.path}
                  className="text-text-secondary dark:text-dark-text-secondary text-[0.88rem] transition-colors duration-300 hover:text-accent dark:hover:text-dark-accent">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-accent dark:text-dark-accent mb-4 text-base">Kontak Panitia</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-accent dark:text-dark-accent" />
                <span className="text-text-secondary dark:text-dark-text-secondary text-[0.88rem]">0812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-accent dark:text-dark-accent" />
                <span className="text-text-secondary dark:text-dark-text-secondary text-[0.88rem]">ppdb@alistiqomah.sch.id</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-accent dark:text-dark-accent mt-0.5 shrink-0" />
                <span className="text-text-secondary dark:text-dark-text-secondary text-[0.88rem]">
                  Jl. Padat Karya RT.10/RW. 01 Kel. Gunung Ibul, Kec. Prabumulih Timur Kota Prabumulih Sumatera Selatan 31113.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border-default dark:border-dark-border-default pt-5 flex justify-between items-center flex-wrap gap-2">
          <p className="text-text-muted dark:text-dark-text-muted text-xs">
            © {new Date().getFullYear()} Yayasan Al Istiqomah Al Islamiyah. Seluruh hak dilindungi.
          </p>
          <p className="text-text-muted dark:text-dark-text-muted text-xs">
            PPDB Online v1.0
          </p>
        </div>
      </div>
    </footer>
  );
}
