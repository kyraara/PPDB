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
    <section className="py-20 bg-bg-secondary dark:bg-dark-bg-secondary">
      <div className="container">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeInUp}
          className="text-center mb-16">
          <h2 className="mb-2">Alur Pendaftaran</h2>
          <div className="w-[60px] h-1 rounded-sm mx-auto mb-4 bg-accent dark:bg-dark-accent" />
          <p className="text-text-secondary dark:text-dark-text-secondary">5 langkah mudah menuju penerimaan</p>
        </motion.div>

        <div className="alur-container">
          {steps.map((step, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeInUp}
              className="alur-step">
              <div className="card p-6 w-full max-w-[220px] text-center relative z-[2]">
                <div className="absolute -top-[15px] left-1/2 -translate-x-1/2 w-[30px] h-[30px] rounded-full flex items-center justify-center
                                text-sm font-bold text-white bg-accent dark:bg-dark-accent
                                border-[3px] border-bg-secondary dark:border-dark-bg-secondary">
                  {i + 1}
                </div>
                <step.icon size={32} className="text-accent dark:text-dark-accent mx-auto mt-4 mb-3" />
                <h4 className="text-base mb-1">{step.title}</h4>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary leading-relaxed">{step.desc}</p>
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
        .alur-container::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 10%;
          right: 10%;
          height: 2px;
          background: var(--color-border-default);
          z-index: 1;
        }
        @media (max-width: 900px) {
          .alur-container {
            flex-direction: column;
            align-items: center;
            gap: 2.5rem;
          }
          .alur-container::before {
            top: 0; bottom: 0; left: 50%; right: auto;
            width: 2px; height: 100%;
            transform: translateX(-50%);
          }
          .alur-step .card { max-width: 300px; }
        }
      `}</style>
    </section>
  );
}
