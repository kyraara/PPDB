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
    <section className="py-20 bg-bg-primary dark:bg-dark-bg-primary">
      <div className="container">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeInUp}
          className="text-center mb-12">
          <h2 className="mb-2">Jadwal Gelombang</h2>
          <div className="w-[60px] h-1 rounded-sm mx-auto mb-4 bg-accent dark:bg-dark-accent" />
          <p className="text-text-secondary dark:text-dark-text-secondary">Informasi gelombang pendaftaran untuk setiap jenjang</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(gelombangData).map(([jenjang, waves], idx) => (
            <motion.div key={jenjang} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={idx} variants={fadeInUp}
              className="card p-7">
              <h3 className="text-[1.15rem] mb-4 flex items-center gap-2">
                <GraduationCap size={20} className="text-accent dark:text-dark-accent" />
                {jenjang}
              </h3>

              {waves.map((wave) => (
                <div key={wave.id}
                  className={`p-3 mb-2 rounded-sm bg-surface-elevated dark:bg-dark-surface-elevated
                    ${wave.status === 'BUKA'
                      ? 'border border-accent dark:border-dark-accent'
                      : 'border border-border-subtle dark:border-dark-border-subtle'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-[0.88rem]">Gel. {wave.nomor_gelombang}</span>
                    <span className="px-2 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wide"
                      style={{
                        background: wave.status === 'BUKA' ? 'rgba(16,185,129,0.15)' :
                                    wave.status === 'TUTUP' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                        color: wave.status === 'BUKA' ? '#10B981' :
                               wave.status === 'TUTUP' ? '#EF4444' : '#F59E0B',
                      }}>
                      {wave.status === 'BUKA' ? '● Dibuka' : wave.status === 'TUTUP' ? 'Ditutup' : 'Akan Datang'}
                    </span>
                  </div>
                  <div className="text-[0.78rem] text-text-secondary dark:text-dark-text-secondary">
                    {wave.tanggal_buka} — {wave.tanggal_tutup}
                  </div>
                  <div className="text-[0.78rem] text-text-muted dark:text-dark-text-muted mt-0.5">
                    Kuota: {wave.terisi}/{wave.kuota} • Sisa: {wave.sisa_kuota}
                  </div>
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
