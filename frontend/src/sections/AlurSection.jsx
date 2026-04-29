import { motion } from 'framer-motion';
import { FileText, ClipboardCheck, Star, CreditCard, CheckCircle2 } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
};

const steps = [
  { icon: FileText, title: 'Buat Akun', desc: 'Daftar akun dan pilih jenjang pendidikan yang dituju' },
  { icon: ClipboardCheck, title: 'Isi Formulir', desc: 'Lengkapi data siswa, data orang tua, dan upload dokumen' },
  { icon: Star, title: 'Verifikasi', desc: 'Panitia mereview berkas pendaftaran Anda' },
  { icon: CreditCard, title: 'Pembayaran', desc: 'Jika diterima, lakukan pembayaran biaya pendaftaran' },
  { icon: CheckCircle2, title: 'Terdaftar!', desc: 'Selamat! Anda resmi terdaftar sebagai peserta didik baru' },
];

export default function AlurSection() {
  return (
    <section style={{ padding: '5rem 0', background: 'var(--bg-secondary)' }}>
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h2 style={{ marginBottom: '0.5rem' }}>Alur Pendaftaran</h2>
          <div style={{ width: '60px', height: '4px', background: 'var(--accent-primary)', borderRadius: '2px', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>5 langkah mudah menuju penerimaan</p>
        </motion.div>

        <div className="alur-container">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeInUp}
              className="alur-step"
            >
              <div className="card" style={{
                padding: '1.5rem',
                width: '100%',
                maxWidth: '220px',
                textAlign: 'center',
                position: 'relative',
                zIndex: 2,
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'white',
                  border: '3px solid var(--bg-secondary)'
                }}>
                  {i + 1}
                </div>

                <step.icon size={32} color="var(--accent-primary)" style={{ margin: '1rem auto 0.75rem' }} />
                <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>{step.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        .alur-container {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          position: relative;
        }
        
        /* Garis horizontal untuk desktop */
        .alur-container::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 10%;
          right: 10%;
          height: 2px;
          background: var(--border-default);
          z-index: 1;
        }

        @media (max-width: 900px) {
          .alur-container {
            flex-direction: column;
            align-items: center;
            gap: 2.5rem;
          }
          /* Garis vertikal untuk mobile */
          .alur-container::before {
            top: 0;
            bottom: 0;
            left: 50%;
            right: auto;
            width: 2px;
            height: 100%;
            transform: translateX(-50%);
          }
          .alur-step .card {
            max-width: 300px;
          }
        }
      `}</style>
    </section>
  );
}
