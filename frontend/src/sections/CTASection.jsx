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
    <section style={{
      padding: '6rem 0',
      background: 'var(--accent-primary)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: '-50px', right: '-50px', zIndex: 0 }}>
        <GeometricPattern size={300} opacity={0.08} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 style={{ marginBottom: '1rem', color: 'white' }}>
            Siap Bergabung Bersama Kami?
          </h2>
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '1.05rem',
            maxWidth: '550px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.7,
          }}>
            Jangan lewatkan kesempatan untuk mendaftarkan putra-putri Anda
            di Yayasan Al Istiqomah Al Islamiyah.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/daftar" className="btn" style={{ background: 'white', color: 'var(--accent-primary)' }}>
              Daftar Sekarang
              <ArrowRight size={18} />
            </Link>
            <Link to="/cek-status" className="btn" style={{ background: 'transparent', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)' }}>
              Cek Status Pendaftaran
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Add hover effects for these specific buttons since they use custom styling */}
      <style>{`
        .btn[style*="background: white"]:hover {
          background: #f8f9fa !important;
          transform: translateY(-2px);
        }
        .btn[style*="background: transparent"]:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(255, 255, 255, 0.5) !important;
        }
      `}</style>
    </section>
  );
}
