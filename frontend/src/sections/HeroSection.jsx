import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays } from 'lucide-react';
import GeometricPattern from '../components/GeometricPattern';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
};

export default function HeroSection({ jenjangData, statsData }) {
  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      paddingTop: '80px',
      background: 'url("/images/hero-bg.png") center/cover no-repeat',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-primary)', opacity: 0.7, zIndex: 0 }}></div>
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', zIndex: 0 }}>
        <GeometricPattern size={500} opacity={0.04} />
      </div>
      
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '4rem',
          alignItems: 'center',
        }} className="hero-grid">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '50px',
                background: 'var(--accent-primary-bg)',
                border: '1px solid var(--border-default)',
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
                color: 'var(--accent-primary)',
                fontWeight: 600,
              }}
            >
              <CalendarDays size={16} />
              Pendaftaran Dibuka
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ marginBottom: '1.25rem', lineHeight: 1.15 }}
            >
              Penerimaan{' '}
              <span style={{ color: 'var(--accent-primary)' }}>
                Peserta Didik Baru
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontSize: '1.1rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                marginBottom: '2rem',
                maxWidth: '550px',
              }}
            >
              Yayasan Al Istiqomah Al Islamiyah membuka pendaftaran untuk jenjang{' '}
              <strong style={{ color: 'var(--accent-primary)' }}>TK, SD, SMP, dan SMA</strong>.
              Daftar sekarang secara online — mudah, cepat, dan transparan.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
            >
              <Link to="/daftar" className="btn btn-primary btn-lg">
                Daftar Sekarang
                <ArrowRight size={18} />
              </Link>
              <Link to="/cek-status" className="btn btn-secondary btn-lg">
                Cek Status
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}
            className="hero-stats-grid"
          >
            {jenjangData.map((j, i) => {
              const stats = statsData[j.key];
              return (
                <motion.div
                  key={j.key}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                  variants={fadeInUp}
                  className="card"
                  style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--surface-card)', opacity: 0.95 }}
                >
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: 'var(--accent-primary-bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 0.75rem',
                  }}>
                    <j.icon size={24} color={j.color} />
                  </div>
                  <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>{j.key}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    {j.label}
                  </p>
                  <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: j.color }}>
                      {stats?.gelombang_aktif?.sisa ?? '—'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Sisa Kuota
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
            text-align: center;
          }
          .hero-grid > div:first-child {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-grid p {
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}</style>
    </section>
  );
}
