import { motion } from 'framer-motion';
import { BookHeart, Trophy, Building2, Sun } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
};

const keunggulan = [
  { icon: BookHeart, title: 'Pendidikan Agama Kuat', desc: 'Kurikulum tahfidz Al-Qur\'an, pembelajaran hadits, dan fiqih yang diintegrasikan dalam kegiatan sehari-hari.' },
  { icon: Trophy, title: 'Akademik Berprestasi', desc: 'Menggunakan kurikulum terpadu yang menyeimbangkan kecerdasan intelektual dan spiritual peserta didik.' },
  { icon: Building2, title: 'Fasilitas Lengkap', desc: 'Dilengkapi dengan ruang belajar yang nyaman, laboratorium, perpustakaan, dan masjid sebagai pusat kegiatan.' },
  { icon: Sun, title: 'Karakter & Disiplin', desc: 'Pembiasaan ibadah wajib dan sunnah, serta penanaman adab islami untuk membentuk karakter tangguh.' },
];

export default function KeunggulanSection() {
  return (
    <section className="py-20 bg-bg-primary dark:bg-dark-bg-primary">
      <div className="container">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeInUp}
          className="text-center mb-12">
          <h2 className="mb-2">Keunggulan Kami</h2>
          <div className="w-[60px] h-1 rounded-sm mx-auto mb-4 bg-accent dark:bg-dark-accent" />
          <p className="text-text-secondary dark:text-dark-text-secondary max-w-[600px] mx-auto">
            Mengapa memilih Yayasan Al Istiqomah Al Islamiyah sebagai mitra pendidikan putra-putri Anda?
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {keunggulan.map((k, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeInUp}
              className="card p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5
                              bg-accent-bg dark:bg-dark-accent-bg">
                <k.icon size={28} className="text-accent dark:text-dark-accent" />
              </div>
              <h3 className="text-[1.15rem] mb-3">{k.title}</h3>
              <p className="text-sm text-text-muted dark:text-dark-text-muted leading-relaxed">{k.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
