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
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20"
      style={{ background: 'url("/images/hero-bg.png") center/cover no-repeat' }}>

      {/* Overlay */}
      <div className="absolute inset-0 bg-bg-primary dark:bg-dark-bg-primary opacity-70 z-0" />
      <div className="absolute -top-[100px] -right-[100px] z-0">
        <GeometricPattern size={500} opacity={0.04} />
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 items-center">
          {/* Left */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold
                         bg-accent-bg dark:bg-dark-accent-bg border border-border-default dark:border-dark-border-default
                         text-accent dark:text-dark-accent">
              <CalendarDays size={16} />
              Pendaftaran Dibuka
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-5 leading-tight">
              Penerimaan{' '}
              <span className="bg-gradient-to-br from-[#3DAF84] to-[#6DD4A8] bg-clip-text text-transparent">
                Peserta Didik Baru
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg leading-relaxed mb-8 max-w-[550px] text-text-secondary dark:text-dark-text-secondary mx-auto lg:mx-0">
              Yayasan Al Istiqomah Al Islamiyah membuka pendaftaran untuk jenjang{' '}
              <strong className="text-accent-light dark:text-dark-accent-light">TK, SD, dan SMP</strong>.
              Daftar sekarang secara online — mudah, cepat, dan transparan.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="flex gap-4 flex-wrap justify-center lg:justify-start">
              <Link to="/daftar" className="btn btn-primary btn-lg">
                Daftar Sekarang <ArrowRight size={18} />
              </Link>
              <Link to="/cek-status" className="btn btn-secondary btn-lg">
                Cek Status
              </Link>
            </motion.div>
          </div>

          {/* Right — Stats Grid */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 gap-4">
            {jenjangData.map((j, i) => {
              const stats = statsData[j.kode];
              return (
                <motion.div key={j.kode} initial="hidden" animate="visible" custom={i} variants={fadeInUp}
                  className="p-6 text-center rounded-lg backdrop-blur-2xl
                             bg-white/80 dark:bg-[rgba(26,46,26,0.85)] 
                             border border-border-default dark:border-[rgba(45,138,107,0.3)]
                             shadow-lg dark:shadow-none">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-3
                                  bg-bg-secondary dark:bg-dark-accent-bg
                                  border border-border-subtle dark:border-[rgba(45,138,107,0.2)]">
                    {j.logo_path ? (
                      <img src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || ''}/storage/${j.logo_path}`} alt={`Logo ${j.kode}`} className="w-10 h-10 object-contain" />
                    ) : (
                      <img src="/images/logo.png" alt="Default Logo" className="w-10 h-10 object-contain" />
                    )}
                  </div>
                  <h4 className="text-[1.05rem] mb-1 text-text-primary dark:text-dark-text-primary">{j.kode}</h4>
                  <p className="text-xs text-text-secondary dark:text-dark-text-secondary mb-3">{j.nama}</p>
                  <div className="p-2 rounded-sm bg-accent-bg dark:bg-[rgba(45,138,107,0.15)] border border-accent/20 dark:border-[rgba(45,138,107,0.2)]">
                    <div className="text-[1.75rem] font-bold text-accent dark:text-[#3DAF84]">
                      {stats?.gelombang_aktif?.sisa ?? '—'}
                    </div>
                    <div className="text-[0.7rem] text-text-muted dark:text-dark-text-muted">Sisa Kuota</div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
