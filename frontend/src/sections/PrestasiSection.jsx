/**
 * PrestasiSection.jsx
 * Section Prestasi & Pencapaian untuk halaman profil jenjang.
 * Dipindahkan dari ProfilJenjangPage.jsx.
 *
 * Props:
 *   prestasi : string[] — daftar teks prestasi dari API
 *
 * FIX: Warna badge menggunakan token status-* project,
 *      bukan warna Tailwind generic (violet, emerald, sky, amber).
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/* ─── Helper: parse tingkat & warna dari teks prestasi ─── */
function parsePrestasi(text) {
  const lower = text.toLowerCase();
  let tingkat = 'Lainnya';
  let emoji = '🏅';
  // Gunakan token status yang sudah ada di index.css
  let colorClass = 'bg-status-draft/15 border-status-draft/30 text-status-draft';

  if (lower.includes('internasional')) {
    tingkat = 'Internasional'; emoji = '🏆';
    colorClass = 'bg-status-terdaftar/15 border-status-terdaftar/30 text-status-terdaftar';
  } else if (lower.includes('nasional')) {
    tingkat = 'Nasional'; emoji = '🥇';
    colorClass = 'bg-status-diterima/15 border-status-diterima/30 text-status-diterima';
  } else if (lower.includes('provinsi')) {
    tingkat = 'Provinsi'; emoji = '🥈';
    colorClass = 'bg-status-bayar/15 border-status-bayar/30 text-status-bayar';
  } else if (lower.includes('kabupaten') || lower.includes('kota')) {
    tingkat = 'Kabupaten/Kota'; emoji = '🥉';
    colorClass = 'bg-status-submitted/15 border-status-submitted/30 text-status-submitted';
  }

  const yearMatch = text.match(/\b(20\d{2})\b/);
  return { judul: text, tingkat, tahun: yearMatch?.[1] || '', emoji, colorClass };
}

export default function PrestasiSection({ prestasi = [] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  if (!prestasi?.length) return null;

  return (
    <section className="py-16 bg-bg-secondary dark:bg-dark-bg-secondary">
      <div className="container max-w-[800px] mx-auto">

        {/* Header */}
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
            Apresiasi
          </span>
          <h2 className="font-heading text-[clamp(1.6rem,3vw,2.2rem)] font-bold
                         text-text-primary dark:text-dark-text-primary leading-tight">
            Prestasi & Pencapaian
          </h2>
          <div className="w-14 h-[3px] rounded-full mx-auto mt-3
                          bg-gradient-to-r from-transparent via-accent dark:via-dark-accent to-transparent" />
        </motion.div>

        {/* Grid prestasi — masonry offset pada md ke atas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {prestasi.map((p, i) => {
            const data = parsePrestasi(p);
            return (
              <motion.div
                key={i}
                className={`p-5 rounded-xl border flex flex-col gap-3 shadow-sm
                            transition-transform hover:-translate-y-1
                            bg-surface-card dark:bg-dark-surface-card
                            border-border-default dark:border-dark-border-default
                            ${i % 2 !== 0 ? 'md:mt-10' : ''}`}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.48, delay: i * 0.07, ease: 'easeOut' }}
              >
                <div className="flex justify-between items-start">
                  <span className="text-3xl leading-none">{data.emoji}</span>
                  {/* Badge tingkat — pakai token status project */}
                  <span className={`text-[0.65rem] font-bold uppercase tracking-widest
                                   px-2.5 py-1 rounded-full border ${data.colorClass}`}>
                    {data.tingkat}
                  </span>
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-[0.95rem]
                                 text-text-primary dark:text-dark-text-primary leading-snug">
                    {data.judul}
                  </h4>
                  {data.tahun && (
                    <p className="text-text-muted dark:text-dark-text-muted text-[0.8rem] mt-2 font-medium">
                      Tahun {data.tahun}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
