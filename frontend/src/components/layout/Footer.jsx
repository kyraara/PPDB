import { Link } from 'react-router-dom';
import { GraduationCap, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--glass-border)',
      padding: '3rem 0 1.5rem',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img 
                src="/images/logo.png" 
                alt="Logo Al Istiqomah" 
                style={{ width: '40px', height: '40px', objectFit: 'contain' }}
              />
              <div>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  color: 'var(--text-heading)',
                }}>PPDB Online</div>
                <div style={{
                  fontSize: '0.7rem',
                  color: 'var(--accent-primary)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>Al Istiqomah Al Islamiyah</div>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7 }}>
              Yayasan Al Istiqomah Al Islamiyah menyelenggarakan Penerimaan Peserta Didik Baru
              untuk jenjang TK, SD, SMP, dan SMA secara online.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--accent-primary)',
              marginBottom: '1rem',
              fontSize: '1rem',
            }}>Navigasi</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: 'Beranda', path: '/' },
                { label: 'Daftar Sekarang', path: '/daftar' },
                { label: 'Cek Status', path: '/cek-status' },
                { label: 'Login', path: '/login' },
              ].map(link => (
                <Link key={link.path} to={link.path} style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.88rem',
                  transition: 'color 0.3s',
                }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--accent-primary)',
              marginBottom: '1rem',
              fontSize: '1rem',
            }}>Kontak Panitia</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={16} color="var(--accent-primary)" />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                  0812-3456-7890
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Mail size={16} color="var(--accent-primary)" />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                  ppdb@alistiqomah.sch.id
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <MapPin size={16} color="var(--accent-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                  Jl. Padat Karya RT.10/RW. 01 Kel. Gunung Ibul, Kec. Prabumulih Timur Kota Prabumulih Sumatera Selatan 31113.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--glass-border)',
          paddingTop: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} Yayasan Al Istiqomah Al Islamiyah. Seluruh hak dilindungi.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            PPDB Online v1.0
          </p>
        </div>
      </div>
    </footer>
  );
}
