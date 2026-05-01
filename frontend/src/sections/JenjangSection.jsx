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
    <section className="py-20 relative bg-bg-secondary dark:bg-dark-bg-secondary">
      <div className="container">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeInUp}
          className="text-center mb-12">
          <h2 className="mb-2">Jenjang Pendidikan</h2>
          <div className="w-[60px] h-1 rounded-sm mx-auto mb-4 bg-accent dark:bg-dark-accent" />
          <p className="text-text-secondary dark:text-dark-text-secondary">Pilih jenjang yang sesuai untuk putra-putri Anda</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {jenjangData.map((j, i) => (
            <motion.div key={j.key} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeInUp}
              className="card p-8">
              <div className="w-14 h-14 rounded-[14px] flex items-center justify-center mb-5"
                style={{ background: `color-mix(in srgb, ${j.color} 15%, transparent)`, border: `1px solid color-mix(in srgb, ${j.color} 30%, transparent)` }}>
                <j.icon size={28} style={{ color: j.color }} />
              </div>
              <h3 className="text-xl mb-2">{j.key}</h3>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4 leading-relaxed">{j.desc}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                              bg-accent-bg dark:bg-dark-accent-bg text-accent dark:text-dark-accent
                              border border-accent-bg-strong dark:border-dark-accent-bg-strong">
                <CheckCircle2 size={12} />
                {j.highlight}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
