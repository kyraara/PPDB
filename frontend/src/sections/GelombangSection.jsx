import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
};

export default function GelombangSection({ gelombangData }) {
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
          <h2 style={{ marginBottom: '0.5rem' }}>Jadwal Gelombang</h2>
          <div style={{ width: '60px', height: '4px', background: 'var(--accent-primary)', borderRadius: '2px', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Informasi gelombang pendaftaran untuk setiap jenjang</p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }} className="gelombang-grid">
          {Object.entries(gelombangData).map(([jenjang, waves], idx) => (
            <motion.div
              key={jenjang}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={idx}
              variants={fadeInUp}
              className="card"
              style={{ padding: '1.75rem' }}
            >
              <h3 style={{
                fontSize: '1.15rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <GraduationCap size={20} color="var(--accent-primary)" />
                {jenjang}
              </h3>

              {waves.map((wave) => (
                <div key={wave.id} style={{
                  padding: '0.85rem',
                  marginBottom: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-elevated)',
                  border: wave.status === 'BUKA'
                    ? '1px solid var(--accent-primary)'
                    : '1px solid var(--border-subtle)',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.4rem',
                  }}>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                      Gel. {wave.nomor_gelombang}
                    </span>
                    <span style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: '50px',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      background: wave.status === 'BUKA' ? 'rgba(16,185,129,0.15)' :
                                  wave.status === 'TUTUP' ? 'rgba(239,68,68,0.15)' :
                                  'rgba(245,158,11,0.15)',
                      color: wave.status === 'BUKA' ? '#10B981' :
                             wave.status === 'TUTUP' ? '#EF4444' :
                             '#F59E0B',
                    }}>
                      {wave.status === 'BUKA' ? '● Dibuka' : wave.status === 'TUTUP' ? 'Ditutup' : 'Akan Datang'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {wave.tanggal_buka} — {wave.tanggal_tutup}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Kuota: {wave.terisi}/{wave.kuota} • Sisa: {wave.sisa_kuota}
                  </div>
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .gelombang-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}
