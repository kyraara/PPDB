import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
};

export default function JenjangSection({ jenjangData }) {
  return (
    <section style={{ padding: '5rem 0', position: 'relative', background: 'var(--bg-secondary)' }}>
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h2 style={{ marginBottom: '0.5rem' }}>Jenjang Pendidikan</h2>
          <div style={{ width: '60px', height: '4px', background: 'var(--accent-primary)', borderRadius: '2px', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Pilih jenjang yang sesuai untuk putra-putri Anda</p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
        }} className="jenjang-grid">
          {jenjangData.map((j, i) => (
            <motion.div
              key={j.key}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeInUp}
              className="card"
              style={{ padding: '2rem' }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: `color-mix(in srgb, ${j.color} 15%, transparent)`,
                border: `1px solid color-mix(in srgb, ${j.color} 30%, transparent)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <j.icon size={28} color={j.color} />
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{j.key}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
                {j.desc}
              </p>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '50px',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: j.key === 'TK' ? 'var(--accent-primary-bg)' : 'rgba(59, 130, 246, 0.1)',
                color: j.key === 'TK' ? 'var(--accent-primary)' : '#3B82F6',
                border: `1px solid ${j.key === 'TK' ? 'color-mix(in srgb, var(--accent-primary) 20%, transparent)' : 'rgba(59,130,246,0.2)'}`,
              }}>
                <CheckCircle2 size={12} />
                {j.highlight}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .jenjang-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}
