import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, CreditCard } from 'lucide-react';
import api from '../services/api';
import { formatRupiah, formatDate } from '../lib/utils';
import EmptyState from '../components/ui/EmptyState';
import SkeletonProfilJenjang from '../components/ui/SkeletonProfilJenjang';
import VisiMisiSection from '../sections/VisiMisiSection';
import PrestasiSection from '../sections/PrestasiSection';
import KegiatanFasilitasSection from '../sections/KegiatanFasilitasSection';

import { getStorageUrl } from '../utils/urls';

/* ─── Helper: normalize array data dari API ─── */
const normalizeKegiatan = (arr) =>
  (arr || []).map((k, i) => typeof k === 'string' ? { id: i, nama: k, kategori: 'Pilihan' } : k);

const normalizeFasilitas = (arr) =>
  (arr || []).map((f, i) => typeof f === 'string' ? { id: i, nama: f } : f);

/* ─── Error State ─── */
function JenjangErrorState() {
  return (
    <EmptyState
      icon={AlertCircle}
      title="Jenjang Tidak Ditemukan"
      description="Halaman yang Anda cari tidak tersedia atau jenjang ini belum aktif."
      action={<Link to="/" className="btn btn-primary">Kembali ke Beranda</Link>}
    />
  );
}

/* ─── Hero Section ─── */
function HeroJenjang({ jenjang }) {
  const logoUrl = jenjang.logo_path
    ? getStorageUrl(jenjang.logo_path)
    : '/images/logo.png';

  return (
    <section className="py-10 bg-bg-secondary dark:bg-dark-bg-secondary">
      <div className="container text-center max-w-[700px] mx-auto">

        {/* Logo */}
        <img
          src={logoUrl}
          alt={`Logo ${jenjang.nama_lengkap || jenjang.nama}`}
          className="w-24 h-24 object-contain mx-auto mb-5"
          style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.15))' }}
          onError={e => { e.target.style.display = 'none'; }}
        />

        <h1 className="text-[2rem] font-heading mb-1 text-text-primary dark:text-dark-text-primary">
          {jenjang.nama_lengkap || jenjang.nama}
        </h1>
        <p className="text-text-muted dark:text-dark-text-muted mb-4">{jenjang.nama}</p>

        {/* Badge highlight */}
        {jenjang.highlight && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-5
                           text-[0.8rem] font-bold
                           bg-accent-bg dark:bg-dark-accent-bg
                           border border-border-default dark:border-dark-border-default
                           text-accent dark:text-dark-accent">
            <CheckCircle size={13} /> {jenjang.highlight}
          </span>
        )}

        {/* Gelombang aktif — FIX: pakai token, bukan inline style hex */}
        {jenjang.gelombang_aktif && (
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full mb-5
                          text-[0.85rem] font-medium
                          bg-status-diterima/10 border border-status-diterima/25
                          text-status-terdaftar">
            <span className="text-[0.65rem]">●</span>
            Gelombang {jenjang.gelombang_aktif.nomor} — Sisa{' '}
            <strong>{jenjang.gelombang_aktif.sisa_kuota} kursi</strong> —
            Tutup {formatDate(jenjang.gelombang_aktif.tanggal_tutup)}
          </div>
        )}

        {/* CTA */}
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to={`/daftar?jenjang=${jenjang.kode}`} className="btn btn-primary">
            Daftar Sekarang <ArrowRight size={16} />
          </Link>
          <Link to="/kontak" className="btn btn-secondary">
            Hubungi Panitia
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Biaya Section ─── */
function BiayaSection({ jenjang }) {
  if (!jenjang.biaya_pendaftaran) return null;
  return (
    <section className="py-12 bg-bg-primary dark:bg-dark-bg-primary">
      <div className="container max-w-[500px] mx-auto text-center">
        <div className="p-8 rounded-2xl shadow-md
                        bg-surface-card dark:bg-dark-surface-card
                        border border-border-default dark:border-dark-border-default">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4
                          bg-accent-bg dark:bg-dark-accent-bg">
            <CreditCard size={26} className="text-accent dark:text-dark-accent" />
          </div>
          <p className="text-text-muted dark:text-dark-text-muted text-[0.85rem] mb-1">
            Biaya Pendaftaran
          </p>
          <p className="text-[2rem] font-extrabold text-accent dark:text-dark-accent mb-2">
            {formatRupiah(jenjang.biaya_pendaftaran)}
          </p>
          <p className="text-[0.82rem] text-text-muted dark:text-dark-text-muted">
            {jenjang.keterangan_biaya || 'Dibayarkan setelah dinyatakan diterima'}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Bawah ─── */
function CTAJenjang({ jenjang }) {
  return (
    <section className="py-12 bg-accent dark:bg-dark-accent text-center">
      <div className="container">
        <h2 className="text-2xl font-heading text-white mb-3">
          Siap Mendaftarkan Putra-Putri Anda?
        </h2>
        <p className="text-white/80 mb-6 text-[0.95rem]">
          Daftar sekarang sebelum kuota gelombang habis.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to={`/daftar?jenjang=${jenjang.kode}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold no-underline
                       bg-white text-accent dark:text-dark-accent
                       hover:bg-white/90 transition-colors duration-200">
            Daftar Sekarang <ArrowRight size={16} />
          </Link>
          <Link to="/kontak"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold no-underline
                       bg-transparent border-2 border-white/70 text-white
                       hover:bg-white/10 transition-colors duration-200">
            Hubungi Panitia
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── MAIN PAGE ─── */
export default function ProfilJenjangPage() {
  const { key } = useParams();

  const { data: jenjang, isLoading, isError } = useQuery({
    queryKey: ['jenjang-publik', key],
    queryFn: () => api.get(`/publik/jenjang/${key}`).then(r => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <SkeletonProfilJenjang />;
  if (isError || !jenjang) return <JenjangErrorState />;

  return (
    <div className="pt-[90px] pb-0 min-h-screen">

      {/* Tombol kembali */}
      <div className="container py-4">
        <Link to="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm no-underline rounded-lg
                     bg-surface-card dark:bg-dark-surface-card
                     border border-border-default dark:border-dark-border-default
                     text-text-secondary dark:text-dark-text-secondary
                     hover:border-border-strong dark:hover:border-dark-border-strong
                     transition-colors duration-200">
          <ArrowLeft size={15} /> Kembali
        </Link>
      </div>

      <HeroJenjang jenjang={jenjang} />
      <VisiMisiSection jenjang={jenjang} />
      <KegiatanFasilitasSection
        kegiatan={normalizeKegiatan(jenjang.kegiatan)}
        fasilitas={normalizeFasilitas(jenjang.fasilitas)}
      />
      <PrestasiSection prestasi={jenjang.prestasi} />
      <BiayaSection jenjang={jenjang} />
      <CTAJenjang jenjang={jenjang} />
    </div>
  );
}
