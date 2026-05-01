import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import GeometricPattern from '../components/GeometricPattern';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-accent dark:bg-dark-accent">
      <div className="absolute -top-[50px] -right-[50px] z-0">
        <GeometricPattern size={300} opacity={0.08} />
      </div>

      <div className="container relative z-10 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <h2 className="mb-4 text-white">Siap Bergabung Bersama Kami?</h2>
          <p className="text-white/90 text-[1.05rem] max-w-[550px] mx-auto mb-10 leading-relaxed">
            Jangan lewatkan kesempatan untuk mendaftarkan putra-putri Anda
            di Yayasan Al Istiqomah Al Islamiyah.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/daftar" className="btn bg-white text-accent dark:text-dark-accent hover:bg-gray-50 hover:-translate-y-0.5 transition-all">
              Daftar Sekarang <ArrowRight size={18} />
            </Link>
            <Link to="/cek-status" className="btn bg-transparent text-white border-[1.5px] border-white/30 hover:bg-white/10 hover:border-white/50 transition-all">
              Cek Status Pendaftaran
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
