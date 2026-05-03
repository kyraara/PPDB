import { motion } from 'framer-motion';

export default function ProfilYayasanSection() {
  return (
    <section className="py-20 bg-bg-secondary dark:bg-dark-bg-secondary" id="profil-yayasan">
      <div className="container">
        <div className="max-w-[800px] mx-auto text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full mb-4 text-sm font-semibold
                       bg-accent-bg dark:bg-dark-accent-bg text-accent dark:text-dark-accent">
            Tentang Kami
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-[2rem] md:text-[2.5rem] leading-tight mb-4">
            Profil Yayasan <span className="text-accent dark:text-dark-accent">Al Istiqomah</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-border-default dark:border-dark-border-default">
              <img src="/images/kegiatan-siswa.png" alt="Yayasan Al Istiqomah" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent-bg dark:bg-dark-accent-bg rounded-xl -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 border-2 border-accent/30 dark:border-dark-accent/30 rounded-xl -z-10" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="text-2xl font-bold mb-4">Membangun Generasi Rabbani yang Cerdas dan Berakhlak</h3>
            <p className="text-text-secondary dark:text-dark-text-secondary mb-4 leading-relaxed">
              Yayasan Al Istiqomah Al Islamiyah berdiri dengan tekad luhur untuk mencetak generasi penerus bangsa yang unggul dalam IPTEK (Ilmu Pengetahuan dan Teknologi) sekaligus kokoh dalam IMTAQ (Iman dan Taqwa).
            </p>
            <p className="text-text-secondary dark:text-dark-text-secondary mb-6 leading-relaxed">
              Dengan fasilitas yang modern dan didukung oleh tenaga pendidik yang profesional serta berdedikasi tinggi, kami menyelenggarakan pendidikan menyeluruh mulai dari tingkat Taman Kanak-Kanak (TK) hingga Sekolah Menengah Atas (SMA).
            </p>

            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="p-4 rounded-xl bg-surface-card dark:bg-dark-surface-card border border-border-default dark:border-dark-border-default">
                <div className="text-2xl font-bold text-accent dark:text-dark-accent mb-1">Visi</div>
                <div className="text-sm text-text-secondary dark:text-dark-text-secondary">Menjadi lembaga pendidikan Islam terdepan pencetak generasi unggul.</div>
              </div>
              <div className="p-4 rounded-xl bg-surface-card dark:bg-dark-surface-card border border-border-default dark:border-dark-border-default">
                <div className="text-2xl font-bold text-accent dark:text-dark-accent mb-1">Misi</div>
                <div className="text-sm text-text-secondary dark:text-dark-text-secondary">Membina karakter Islami dan mengembangkan potensi akademik unggul.</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
