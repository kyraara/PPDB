import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

export default function KontakPage() {
  return (
    <div style={{ padding: '6rem 0', minHeight: 'calc(100vh - 200px)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ marginBottom: '1rem' }}>Hubungi Kami</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Punya pertanyaan seputar proses Penerimaan Peserta Didik Baru? Jangan ragu untuk menghubungi panitia kami melalui jalur komunikasi di bawah ini.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {/* Card 1: WhatsApp */}
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ 
              width: '60px', height: '60px', borderRadius: '50%', 
              background: 'var(--accent-primary-bg)', color: 'var(--accent-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <MessageCircle size={28} />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>WhatsApp Panitia</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Respons tercepat untuk pertanyaan seputar teknis pendaftaran PPDB.
            </p>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
              Chat WhatsApp
            </a>
          </div>

          {/* Card 2: Email & Telp */}
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ 
              width: '60px', height: '60px', borderRadius: '50%', 
              background: 'var(--accent-primary-bg)', color: 'var(--accent-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <Phone size={28} />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>Telepon & Email</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Layanan informasi resmi Yayasan Al Istiqomah.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                <Phone size={16} color="var(--accent-primary)" /> 0812-3456-7890
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                <Mail size={16} color="var(--accent-primary)" /> ppdb@alistiqomah.sch.id
              </div>
            </div>
          </div>

          {/* Card 3: Lokasi & Jam Kerja */}
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ 
              width: '60px', height: '60px', borderRadius: '50%', 
              background: 'var(--accent-primary-bg)', color: 'var(--accent-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <MapPin size={28} />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>Lokasi Sekretariat</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Jl. Padat Karya RT.10/RW. 01 Kel. Gunung Ibul, Kec. Prabumulih Timur Kota Prabumulih Sumatera Selatan 31113
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600, background: 'var(--accent-primary-bg)', padding: '0.5rem 1rem', borderRadius: '50px' }}>
              <Clock size={16} /> Senin - Sabtu, 08:00 - 15:00 WIB
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
