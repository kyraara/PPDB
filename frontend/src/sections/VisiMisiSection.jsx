/**
 * VisiMisiSection.jsx
 * Section Visi, Misi & Tujuan untuk halaman profil jenjang.
 * Dipindahkan dari ProfilJenjangPage.jsx.
 *
 * Props:
 *   jenjang : object dari API — { visi, misi: string[], tujuan: string[] }
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Target, BookOpen, Rocket } from 'lucide-react';

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-sm
                    bg-surface-card dark:bg-dark-surface-card
                    border border-border-default dark:border-dark-border-default
                    border-t-4 border-t-accent dark:border-t-dark-accent">
      <div className="p-5 border-b border-border-default dark:border-dark-border-default
                      flex items-center gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center
                        bg-accent-bg dark:bg-dark-accent-bg">
          <Icon size={16} className="text-accent dark:text-dark-accent" />
        </div>
        <h3 className="font-heading font-bold text-[1.05rem]
                       text-text-primary dark:text-dark-text-primary">
          {title}
        </h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function VisiMisiSection({ jenjang }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  if (!jenjang.visi && !jenjang.misi?.length && !jenjang.tujuan?.length) return null;

  return (
    <section className="py-16 bg-bg-primary dark:bg-dark-bg-primary">
      <div className="container max-w-[860px] mx-auto">

        {/* Section header */}
        <motion.div
          ref={ref}
          className="text-center mb-10"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <span className="inline-block text-[0.7rem] font-bold tracking-[0.18em] uppercase
                           text-accent dark:text-dark-accent
                           bg-accent-bg dark:bg-dark-accent-bg
                           border border-border-strong dark:border-dark-border-strong
                           px-3 py-1 rounded-full mb-3">
            Landasan
          </span>
          <h2 className="font-heading text-[clamp(1.6rem,3vw,2.2rem)] font-bold
                         text-text-primary dark:text-dark-text-primary leading-tight">
            Visi, Misi & Tujuan
          </h2>
          <div className="w-14 h-[3px] rounded-full mx-auto mt-3
                          bg-gradient-to-r from-transparent via-accent dark:via-dark-accent to-transparent" />
        </motion.div>

        {/* Visi — full width */}
        {jenjang.visi && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <SectionCard icon={Target} title="VISI">
              <p className="text-text-secondary dark:text-dark-text-secondary leading-relaxed">
                {jenjang.visi}
              </p>
            </SectionCard>
          </motion.div>
        )}

        {/* Misi & Tujuan — 2 kolom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jenjang.misi?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SectionCard icon={BookOpen} title="Misi">
                <ul className="text-text-secondary dark:text-dark-text-secondary
                               leading-loose list-disc pl-5">
                  {jenjang.misi.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </SectionCard>
            </motion.div>
          )}

          {jenjang.tujuan?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <SectionCard icon={Rocket} title="Tujuan">
                <ul className="text-text-secondary dark:text-dark-text-secondary
                               leading-loose list-disc pl-5">
                  {jenjang.tujuan.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </SectionCard>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
