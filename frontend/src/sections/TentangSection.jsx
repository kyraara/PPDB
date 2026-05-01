import { motion } from 'framer-motion';
import { Target, Heart, Lightbulb } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function TentangSection() {
  return (
    <section className="py-20 relative bg-bg-secondary dark:bg-dark-bg-secondary">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeInUp}>
            <h2 className="mb-2">Tentang Yayasan</h2>
            <div className="w-[60px] h-1 rounded-sm mb-6 bg-accent dark:bg-dark-accent" />

            <p className="text-text-secondary dark:text-dark-text-secondary text-[1.05rem] leading-relaxed mb-8">
              Yayasan Al Istiqomah Al Islamiyah didirikan dengan niat tulus untuk berkontribusi dalam pendidikan anak bangsa. Kami menggabungkan kurikulum nasional dengan pendidikan agama Islam yang komprehensif.
            </p>

            <div className="p-6 rounded-lg mb-6 bg-surface-card dark:bg-dark-surface-card border border-border-default dark:border-dark-border-default">
              <div className="flex items-center gap-3 mb-3">
                <Target size={24} className="text-accent dark:text-dark-accent" />
                <h3 className="text-xl">Visi Kami</h3>
              </div>
              <p className="text-text-muted dark:text-dark-text-muted text-[0.95rem] leading-relaxed">
                "Mencetak generasi muslim yang berakhlak mulia, cerdas secara akademik, dan mandiri dalam menghadapi tantangan global berdasarkan nilai-nilai Al-Qur'an dan As-Sunnah."
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Heart size={20} className="text-accent dark:text-dark-accent mt-0.5" />
                <div>
                  <h4 className="text-[0.95rem] mb-1">Akhlakul Karimah</h4>
                  <p className="text-xs text-text-muted dark:text-dark-text-muted">Membentuk adab dan karakter Islami.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lightbulb size={20} className="text-accent dark:text-dark-accent mt-0.5" />
                <div>
                  <h4 className="text-[0.95rem] mb-1">Cerdas & Kritis</h4>
                  <p className="text-xs text-text-muted dark:text-dark-text-muted">Pendidikan akademik berkualitas.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }} className="relative">
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-border-default dark:border-dark-border-default shadow-lg"
              style={{ background: 'url("/images/kegiatan-siswa.png") center/cover no-repeat' }} />

            {/* Decorative Card */}
            <div className="absolute -bottom-5 -left-5 p-5 rounded-md shadow-md flex items-center gap-4
                            bg-surface-card dark:bg-dark-surface-card border border-border-default dark:border-dark-border-default">
              <div className="text-[2rem] font-extrabold text-accent dark:text-dark-accent">15+</div>
              <div className="text-sm text-text-secondary dark:text-dark-text-secondary leading-tight">Tahun<br/>Pengalaman<br/>Mendidik</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
