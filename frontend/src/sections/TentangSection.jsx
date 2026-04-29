import { motion } from 'framer-motion';
import { Target, Heart, Lightbulb, Users } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function TentangSection() {
  return (
    <section style={{ padding: '5rem 0', background: 'var(--bg-secondary)', position: 'relative' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
        }} className="tentang-grid">
          
          {/* Left: Teks Visi Misi */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeInUp}>
            <h2 style={{ marginBottom: '0.5rem' }}>Tentang Yayasan</h2>
            <div style={{ width: '60px', height: '4px', background: 'var(--accent-primary)', borderRadius: '2px', marginBottom: '1.5rem' }} />
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Yayasan Al Istiqomah Al Islamiyah didirikan dengan niat tulus untuk berkontribusi dalam pendidikan anak bangsa. Kami menggabungkan kurikulum nasional dengan pendidikan agama Islam yang komprehensif.
            </p>

            <div style={{ padding: '1.5rem', background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Target size={24} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Visi Kami</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                "Mencetak generasi muslim yang berakhlak mulia, cerdas secara akademik, dan mandiri dalam menghadapi tantangan global berdasarkan nilai-nilai Al-Qur'an dan As-Sunnah."
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Heart size={20} color="var(--accent-primary)" style={{ marginTop: '0.1rem' }} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>Akhlakul Karimah</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Membentuk adab dan karakter Islami.</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Lightbulb size={20} color="var(--accent-primary)" style={{ marginTop: '0.1rem' }} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>Cerdas & Kritis</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pendidikan akademik berkualitas.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Ilustrasi / Gambar */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            style={{ position: 'relative' }}
          >
            <div style={{ 
              aspectRatio: '4/3', 
              background: 'url("/images/kegiatan-siswa.png") center/cover no-repeat', 
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-lg)'
            }}>
            </div>
            
            {/* Dekorasi Card Kecil */}
            <div style={{ 
              position: 'absolute', 
              bottom: '-20px', 
              left: '-20px', 
              background: 'var(--surface-card)', 
              padding: '1.25rem', 
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>15+</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.2 }}>Tahun<br/>Pengalaman<br/>Mendidik</div>
            </div>
          </motion.div>
          
        </div>
      </div>
      
      <style>{`
        @media (max-width: 900px) {
          .tentang-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
