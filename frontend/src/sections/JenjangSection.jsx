import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
    <section className="py-20 relative bg-bg-secondary dark:bg-dark-bg-secondary">
      <div className="container">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeInUp}
          className="text-center mb-12">
          <h2 className="mb-2">Jenjang Pendidikan</h2>
          <div className="w-[60px] h-1 rounded-sm mx-auto mb-4 bg-accent dark:bg-dark-accent" />
          <p className="text-text-secondary dark:text-dark-text-secondary">Pilih jenjang yang sesuai untuk putra-putri Anda</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {jenjangData.map((j, i) => (
            <motion.div key={j.kode} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <Link to={`/jenjang/${j.kode}`} className="block no-underline">
                <div className="bg-surface-card dark:bg-dark-surface-card border border-border-default dark:border-dark-border-default rounded-2xl p-6 text-center hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-bg-secondary dark:bg-dark-bg-secondary border border-border-subtle dark:border-dark-border-subtle shadow-sm">
                    {j.logo_path ? (
                      <img src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || ''}/storage/${j.logo_path}`} alt={`Logo ${j.kode}`} className="w-10 h-10 object-contain" />
                    ) : (
                      <img src="/images/logo.png" alt="Default Logo" className="w-10 h-10 object-contain" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-text-primary dark:text-dark-text-primary">{j.kode}</h3>
                  <p className="text-sm font-semibold text-accent dark:text-dark-accent mb-4">{j.nama}</p>
                  <p className="text-sm text-text-secondary dark:text-dark-text-secondary leading-relaxed mb-4">
                    {j.deskripsi}
                  </p>
                  {j.highlight && (
                    <div className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-accent-bg dark:bg-dark-accent-bg text-accent dark:text-dark-accent mb-3">
                      {j.highlight}
                    </div>
                  )}
                  <p className="text-xs font-semibold text-accent dark:text-dark-accent mt-2">Lihat Profil →</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

