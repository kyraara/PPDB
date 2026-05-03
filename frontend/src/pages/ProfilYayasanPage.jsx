import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, TreePine, Users, School, ArrowRight } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
};

const keunggulan = [
  { icon: BookOpen, title: 'Kurikulum Islam Terpadu', desc: 'Mengintegrasikan kurikulum nasional dengan nilai-nilai Islam yang komprehensif.' },
  { icon: TreePine, title: 'Lingkungan Islami & Kondusif', desc: 'Suasana belajar yang nyaman dengan nuansa Islami yang kuat.' },
  { icon: Users, title: 'Tenaga Pengajar Berkualitas', desc: 'Didukung oleh guru-guru profesional dan berpengalaman di bidangnya.' },
  { icon: School, title: 'Fasilitas Modern', desc: 'Ruang kelas, laboratorium, perpustakaan, dan fasilitas olahraga yang lengkap.' },
];

const jenjangList = [
  { key: 'TK', nama: 'TKIT Al Istiqomah' },
  { key: 'SD', nama: 'SDIT Al Istiqomah' },
  { key: 'SMP', nama: 'SMP Islam Al Istiqomah' },
];

export default function ProfilYayasanPage() {
  return (
    <div className="pt-[90px] pb-0 min-h-screen">

      {/* ── Section 1: Hero Tentang ── */}
      <section className="py-16">
        <div className="container">
          {/* Badge + Heading */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}
            className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full mb-4 text-sm font-semibold
                             bg-accent-bg dark:bg-dark-accent-bg text-accent dark:text-dark-accent
                             border border-border-default dark:border-dark-border-default">
              Profil Kami
            </span>
            <h1 className="text-[2.5rem] md:text-[3rem] leading-tight font-heading">
              Yayasan <span className="text-accent dark:text-dark-accent">Al Istiqomah</span>
            </h1>
          </motion.div>

          {/* 2 kolom — foto kiri, teks kanan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start max-w-[1000px] mx-auto">
            {/* Foto */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }} className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-border-default dark:border-dark-border-default">
                <img
                  src="/images/kegiatan-siswa.png"
                  alt="Kegiatan Yayasan Al Istiqomah"
                  className="w-full h-[350px] md:h-[400px] object-cover block"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-accent-bg dark:bg-dark-accent-bg rounded-xl -z-10" />
            </motion.div>

            {/* Teks */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}>
              <h2 className="text-2xl font-bold mb-4">Membangun Generasi Rabbani</h2>
              <p className="text-text-secondary dark:text-dark-text-secondary leading-relaxed mb-6">
                Yayasan Al Istiqomah Al Islamiyah berdiri dengan tekad luhur untuk mencetak
                generasi penerus bangsa yang unggul dalam IPTEK sekaligus kokoh dalam IMTAQ.
                Berlokasi di Prabumulih, Sumatera Selatan, yayasan ini telah melahirkan ribuan
                alumni yang berprestasi dan berakhlak mulia.
              </p>

              {/* Visi */}
              <div className="p-5 mb-4 rounded-xl
                              bg-surface-card dark:bg-dark-surface-card
                              border border-border-default dark:border-dark-border-default
                              border-l-4 border-l-accent dark:border-l-dark-accent">
                <h3 className="text-accent dark:text-dark-accent font-bold text-[1rem] mb-2">Visi</h3>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary leading-relaxed">
                  Menjadi lembaga pendidikan Islam terdepan pencetak generasi unggul yang
                  berakhlak mulia, cerdas secara akademik, dan mandiri.
                </p>
              </div>

              {/* Misi */}
              <div className="p-5 rounded-xl
                              bg-surface-card dark:bg-dark-surface-card
                              border border-border-default dark:border-dark-border-default
                              border-l-4 border-l-accent dark:border-l-dark-accent">
                <h3 className="text-accent dark:text-dark-accent font-bold text-[1rem] mb-2">Misi</h3>
                <ul className="text-sm text-text-secondary dark:text-dark-text-secondary leading-relaxed list-disc list-inside space-y-1">
                  <li>Membina karakter Islami berlandaskan Al-Qur'an dan As-Sunnah</li>
                  <li>Mengembangkan potensi akademik yang unggul dan kompetitif</li>
                  <li>Menyelenggarakan pendidikan yang mengintegrasikan ilmu umum dan agama</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Logo 3 Jenjang ── */}
      <section className="py-16 bg-bg-secondary dark:bg-dark-bg-secondary">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeInUp} className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-heading mb-2">Jenjang Pendidikan</h2>
            <p className="text-text-muted dark:text-dark-text-muted">
              Tiga jenjang pendidikan di bawah naungan Yayasan Al Istiqomah
            </p>
          </motion.div>

          <div className="flex justify-center gap-8 md:gap-12 flex-wrap">
            {jenjangList.map((j, i) => (
              <motion.div key={j.key} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i} variants={fadeInUp}>
                <Link to={`/jenjang/${j.key}`}
                  className="flex flex-col items-center gap-3 no-underline group">
                  <div className="w-[90px] h-[90px] md:w-[100px] md:h-[100px] rounded-2xl flex items-center justify-center
                                  bg-surface-card dark:bg-dark-surface-card
                                  border border-border-default dark:border-dark-border-default
                                  shadow-md group-hover:-translate-y-1 transition-transform duration-300">
                    <img
                      src="/images/logo.png"
                      alt={`Logo ${j.nama}`}
                      className="w-14 h-14 md:w-16 md:h-16 object-contain"
                    />
                  </div>
                  <span className="font-semibold text-sm text-text-primary dark:text-dark-text-primary text-center">
                    {j.nama}
                  </span>
                  <span className="text-xs text-accent dark:text-dark-accent font-semibold">
                    Lihat Profil →
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Keunggulan Yayasan ── */}
      <section className="py-16">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeInUp} className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-heading mb-2">Mengapa Al Istiqomah?</h2>
            <p className="text-text-muted dark:text-dark-text-muted">Keunggulan yang menjadi fondasi pendidikan kami</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1000px] mx-auto">
            {keunggulan.map((item, i) => (
              <motion.div key={item.title} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i} variants={fadeInUp}
                className="p-6 rounded-xl text-center
                           bg-surface-card dark:bg-dark-surface-card
                           border border-border-default dark:border-dark-border-default
                           hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4
                                bg-accent-bg dark:bg-dark-accent-bg">
                  <item.icon size={26} className="text-accent dark:text-dark-accent" />
                </div>
                <h3 className="text-[0.95rem] font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: CTA ── */}
      <section className="py-16 bg-accent dark:bg-dark-accent text-center">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="text-2xl md:text-3xl font-heading text-white mb-3">
              Daftarkan Putra-Putri Anda Sekarang
            </h2>
            <p className="text-white/80 mb-8 max-w-[500px] mx-auto">
              Bergabunglah dengan keluarga besar Al Istiqomah untuk masa depan yang lebih baik.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/daftar"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold no-underline
                           bg-white text-accent dark:text-dark-accent
                           hover:bg-white/90 transition-colors duration-200">
                Daftar Sekarang <ArrowRight size={18} />
              </Link>
              <Link to="/kontak"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold no-underline
                           bg-transparent border-2 border-white/70 text-white
                           hover:bg-white/10 transition-colors duration-200">
                Hubungi Panitia
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
