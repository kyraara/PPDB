/**
 * KegiatanFasilitasSection.jsx
 * Dipakai di halaman profil jenjang (JenjangPage / ProfilJenjang)
 *
 * Props:
 *   kegiatan  : array dari API  [{ id, nama, deskripsi, foto_url?, kategori? }]
 *   fasilitas : array dari API  [{ id, nama, deskripsi, foto_url? }]
 *
 * Jika foto_url kosong/null → tampil placeholder icon.
 * Semua animasi pakai Framer Motion (sudah ada di project).
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  BookOpen, Building, Monitor, Activity, Heart,
  Coffee, Map, Star, Music, Beaker,
  Image as ImageIcon,
} from 'lucide-react';

const STORAGE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

/* ─────────────────────────────────────────
   Mapping icon otomatis berdasarkan nama
───────────────────────────────────────── */
const KEGIATAN_META = {
  pramuka:    { icon: Map,            tag: 'Wajib',    gradient: 'from-[#1a3a2a] to-[#2d6b4a]' },
  tahfidz:    { icon: BookOpen,       tag: 'Unggulan', gradient: 'from-[#1a2a3a] to-[#2d4a7a]' },
  quran:      { icon: BookOpen,       tag: 'Unggulan', gradient: 'from-[#1a2a3a] to-[#2d4a7a]' },
  olahraga:   { icon: Activity,       tag: 'Pilihan',  gradient: 'from-[#2a1a1a] to-[#7a3a2d]' },
  seni:       { icon: Star,           tag: 'Pilihan',  gradient: 'from-[#2a1a3a] to-[#5a2d7a]' },
  kaligrafi:  { icon: Star,           tag: 'Pilihan',  gradient: 'from-[#2a1a3a] to-[#5a2d7a]' },
  sains:      { icon: Beaker,         tag: 'Pilihan',  gradient: 'from-[#1a2a2a] to-[#2d6b6b]' },
  musik:      { icon: Music,          tag: 'Pilihan',  gradient: 'from-[#2a2a1a] to-[#6b6b2d]' },
  default:    { icon: Star,           tag: 'Pilihan',  gradient: 'from-[#1a3a2a] to-[#2d6b4a]' },
};

const FASILITAS_META = {
  perpustakaan: { icon: BookOpen,         bg: 'from-[#e8f4f0] to-[#c8e6d8]' },
  masjid:       { icon: Building,         bg: 'from-[#f0e8f4] to-[#d8c8e6]' },
  mushola:      { icon: Building,         bg: 'from-[#f0e8f4] to-[#d8c8e6]' },
  komputer:     { icon: Monitor,          bg: 'from-[#f4f0e8] to-[#e6d8c8]' },
  lab:          { icon: Beaker,           bg: 'from-[#e8f0f4] to-[#c8d8e6]' },
  lapangan:     { icon: Activity,         bg: 'from-[#f0f4e8] to-[#d8e6c8]' },
  uks:          { icon: Heart,            bg: 'from-[#f4e8e8] to-[#e6c8c8]' },
  kantin:       { icon: Coffee,           bg: 'from-[#f4f0e8] to-[#e6dcc8]' },
  default:      { icon: Star,             bg: 'from-[#e8f4f0] to-[#c8e6d8]' },
};

function getMeta(name, map) {
  const lower = (name || '').toLowerCase();
  const key = Object.keys(map).find(k => k !== 'default' && lower.includes(k));
  return map[key] || map.default;
}

/* ─────────────────────────────────────────
   Section Header
───────────────────────────────────────── */
function SectionHeader({ label, title, subtitle }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
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
        {label}
      </span>
      <h2 className="font-heading text-[clamp(1.6rem,3vw,2.2rem)] font-bold
                     text-text-primary dark:text-dark-text-primary
                     leading-tight mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[0.93rem] text-text-secondary dark:text-dark-text-secondary
                      max-w-md mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="w-14 h-[3px] rounded-full mx-auto mt-3
                      bg-gradient-to-r from-transparent via-accent dark:via-dark-accent to-transparent" />
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Photo / Placeholder
───────────────────────────────────────── */
function CardPhoto({ fotoUrl, placeholderBg, PlaceholderIcon, placeholderLabel, className = '' }) {
  if (fotoUrl) {
    const finalUrl = fotoUrl.startsWith('http') || fotoUrl.startsWith('data:') 
      ? fotoUrl 
      : `${STORAGE_URL}/storage/${fotoUrl}`;
      
    return (
      <img
        src={finalUrl}
        alt={placeholderLabel}
        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07] ${className}`}
        loading="lazy"
      />
    );
  }
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br ${placeholderBg} ${className}`}>
      <PlaceholderIcon size={32} className="opacity-30 text-text-secondary" />
      <div className="flex items-center gap-1 text-[0.62rem] font-semibold uppercase tracking-widest
                      text-text-muted opacity-60">
        <ImageIcon size={10} /> {placeholderLabel}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   KEGIATAN CARD
   Layout: card 1 & 4 = wide (span 2), sisanya normal
───────────────────────────────────────── */
function KegiatanCard({ item, index, wide = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const meta = getMeta(item.nama, KEGIATAN_META);
  const IconEl = meta.icon;

  return (
    <motion.div
      ref={ref}
      className={`relative rounded-2xl overflow-hidden cursor-pointer group
                  ${wide ? 'min-h-[260px]' : 'min-h-[210px]'}
                  ${wide ? 'col-span-2' : ''}`}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07, ease: 'easeOut' }}
    >
      {/* Photo layer */}
      <div className="absolute inset-0 overflow-hidden">
        <CardPhoto
          fotoUrl={item.foto_url}
          placeholderBg={meta.gradient}
          PlaceholderIcon={IconEl}
          placeholderLabel={`Foto ${item.nama}`}
          className="absolute inset-0"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent
                      transition-all duration-300 group-hover:from-black/88 group-hover:via-black/30" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
        {/* Tag */}
        <span className="inline-block text-[0.6rem] font-bold tracking-[0.14em] uppercase
                         text-emerald-300 bg-emerald-900/40 border border-emerald-700/50
                         px-2 py-0.5 rounded-full mb-2 backdrop-blur-sm">
          {item.kategori || meta.tag}
        </span>

        {/* Title */}
        <h3 className={`font-heading font-bold text-white leading-tight mb-0
                        transition-transform duration-300 group-hover:-translate-y-1
                        ${wide ? 'text-[1.35rem]' : 'text-[1.05rem]'}`}>
          {item.nama}
        </h3>

        {/* Description — slides up on hover */}
        {item.deskripsi && (
          <p className="text-[0.8rem] text-white/70 leading-relaxed mt-2
                        max-h-0 overflow-hidden opacity-0
                        group-hover:max-h-20 group-hover:opacity-100
                        transition-all duration-400">
            {item.deskripsi}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   FASILITAS CARD
───────────────────────────────────────── */
function FasilitasCard({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const meta = getMeta(item.nama, FASILITAS_META);
  const IconEl = meta.icon;

  return (
    <motion.div
      ref={ref}
      className="card overflow-hidden cursor-pointer group"
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.48, delay: index * 0.06, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <CardPhoto
          fotoUrl={item.foto_url}
          placeholderBg={meta.bg}
          PlaceholderIcon={IconEl}
          placeholderLabel={`Foto ${item.nama}`}
        />
        {/* subtle overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0
                        group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3
                        bg-accent-bg dark:bg-dark-accent-bg
                        group-hover:bg-accent-bg-strong dark:group-hover:bg-dark-accent-bg-strong
                        transition-colors duration-300">
          <IconEl size={18} className="text-accent dark:text-dark-accent" />
        </div>
        <h4 className="font-heading font-semibold text-[1rem]
                       text-text-primary dark:text-dark-text-primary mb-1">
          {item.nama}
        </h4>
        {item.deskripsi && (
          <p className="text-[0.78rem] leading-relaxed
                        text-text-muted dark:text-dark-text-muted">
            {item.deskripsi}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────── */
function EmptyState({ label }) {
  return (
    <div className="col-span-full text-center py-14
                    text-text-muted dark:text-dark-text-muted">
      <ImageIcon size={36} className="mx-auto mb-3 opacity-30" />
      <p className="text-sm">Belum ada {label} yang ditambahkan.</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   KEGIATAN SECTION
───────────────────────────────────────── */
export function KegiatanSection({ kegiatan = [] }) {
  return (
    <section className="py-20 px-4 bg-bg-secondary dark:bg-dark-bg-secondary">
      <div className="container">
        <SectionHeader
          label="Program Unggulan"
          title="Kegiatan & Ekstrakurikuler"
          subtitle="Membentuk karakter siswa melalui kegiatan yang terstruktur, menyenangkan, dan bernilai islami"
        />

        {kegiatan.length === 0 ? (
          <div className="grid"><EmptyState label="kegiatan" /></div>
        ) : (
          /*
           * Layout grid: 3 kolom
           * Item pertama & item tengah (index ke-3) = wide (span 2)
           * Sisanya = 1 kolom
           *
           * Pola: wide, normal | normal, wide | normal, normal | ...
           * Kita tentukan wide berdasarkan posisi dalam row
           */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {kegiatan.map((item, idx) => {
              // Wide logic: index 0, 3, 6, ... (setiap baris pertama/kedua) bergantian
              const posInGroup = idx % 3;
              const wide = posInGroup === 0; // item ke-1 di setiap grup 3 = wide
              return (
                <KegiatanCard
                  key={item.id || idx}
                  item={item}
                  index={idx}
                  wide={wide}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   FASILITAS SECTION
───────────────────────────────────────── */
export function FasilitasSection({ fasilitas = [] }) {
  return (
    <section className="py-20 px-4 bg-bg-primary dark:bg-dark-bg-primary">
      <div className="container">
        <SectionHeader
          label="Sarana & Prasarana"
          title="Fasilitas Sekolah"
          subtitle="Lingkungan belajar yang nyaman dan lengkap untuk mendukung tumbuh kembang siswa"
        />

        {fasilitas.length === 0 ? (
          <div className="grid"><EmptyState label="fasilitas" /></div>
        ) : (
          <div className={`grid gap-4 mx-auto ${
            fasilitas.length <= 2 
              ? 'max-w-xl grid-cols-1 sm:grid-cols-2' 
              : fasilitas.length === 3 
                ? 'max-w-3xl grid-cols-1 sm:grid-cols-3' 
                : 'w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
          }`}>
            {fasilitas.map((item, idx) => (
              <FasilitasCard key={item.id || idx} item={item} index={idx} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   DEFAULT EXPORT — kedua section sekaligus
   (Convenience wrapper untuk JenjangPage)
───────────────────────────────────────── */
export default function KegiatanFasilitasSection({ kegiatan, fasilitas }) {
  return (
    <>
      <KegiatanSection kegiatan={kegiatan} />
      <FasilitasSection fasilitas={fasilitas} />
    </>
  );
}
