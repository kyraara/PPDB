import { motion } from 'framer-motion';
import { BookHeart, Trophy, Building2, Sun } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
};

const keunggulan = [
  {
    icon: BookHeart,
    title: 'Pendidikan Agama Kuat',
    desc: 'Kurikulum tahfidz Al-Qur\'an, pembelajaran hadits, dan fiqih yang diintegrasikan dalam kegiatan sehari-hari.'
  },
  {
    icon: Trophy,
    title: 'Akademik Berprestasi',
    desc: 'Menggunakan kurikulum terpadu yang menyeimbangkan kecerdasan intelektual dan spiritual peserta didik.'
  },
  {
    icon: Building2,
    title: 'Fasilitas Lengkap',
    desc: 'Dilengkapi dengan ruang belajar yang nyaman, laboratorium, perpustakaan, dan masjid sebagai pusat kegiatan.'
  },
  {
    icon: Sun,
    title: 'Karakter & Disiplin',
    desc: 'Pembiasaan ibadah wajib dan sunnah, serta penanaman adab islami untuk membentuk karakter tangguh.'
  }
];

export default function KeunggulanSection() {
  return (
    <section style={{ padding: '5rem 0', background: 'var(--bg-primary)' }}>
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h2 style={{ marginBottom: '0.5rem' }}>Keunggulan Kami</h2>
          <div style={{ width: '60px', height: '4px', background: 'var(--accent-primary)', borderRadius: '2px', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Mengapa memilih Yayasan Al Istiqomah Al Islamiyah sebagai mitra pendidikan putra-putri Anda?
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
        }} className="keunggulan-grid">
          {keunggulan.map((k, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeInUp}
              className="card"
              style={{
                padding: '2rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--accent-primary-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <k.icon size={28} color="var(--accent-primary)" />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>{k.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {k.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      <style>{`
        @media (min-width: 768px) {
          .keunggulan-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
