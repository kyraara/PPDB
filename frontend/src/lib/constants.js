// src/lib/constants.js
import {
  FileEdit, Clock, Search, AlertTriangle,
  CheckCircle, XCircle, CreditCard, BadgeCheck
} from 'lucide-react';

// ─── Status Pendaftaran ───────────────────────────────────────────
export const STATUS_CONFIG = {
  DRAFT: {
    label: 'Belum Selesai',
    color: '#9CA3AF',
    icon: FileEdit,
    deskripsi: 'Formulir pendaftaran Anda belum selesai diisi.',
    ctaLabel: 'Lanjutkan Isi Formulir →',
    ctaPath: '/formulir/data-siswa',
    stepAktif: 1,
  },
  SUBMITTED: {
    label: 'Menunggu Verifikasi',
    color: '#F59E0B',
    icon: Clock,
    deskripsi: 'Pendaftaran Anda sudah dikirim dan sedang menunggu verifikasi panitia.',
    ctaLabel: 'Lihat Detail Formulir',
    ctaPath: '/formulir/review',
    stepAktif: 2,
  },
  MENUNGGU_REVIEW: {
    label: 'Sedang Diproses',
    color: '#F59E0B',
    icon: Search,
    deskripsi: 'Panitia sedang mereview berkas Anda. Mohon tunggu.',
    ctaLabel: 'Lihat Detail Formulir',
    ctaPath: '/formulir/review',
    stepAktif: 3,
  },
  REVISI: {
    label: 'Perlu Revisi Dokumen',
    color: '#F97316',
    icon: AlertTriangle,
    deskripsi: 'Panitia meminta perbaikan pada beberapa dokumen Anda.',
    ctaLabel: 'Perbaiki Dokumen Sekarang →',
    ctaPath: '/formulir/dokumen',
    stepAktif: 3,
  },
  DITERIMA: {
    label: 'Selamat, Anda Diterima! 🎉',
    color: '#10B981',
    icon: CheckCircle,
    deskripsi: 'Segera selesaikan pembayaran sebelum batas waktu habis.',
    ctaLabel: 'Lanjutkan ke Pembayaran →',
    ctaPath: '/pembayaran',
    stepAktif: 4,
  },
  DITOLAK: {
    label: 'Tidak Diterima',
    color: '#EF4444',
    icon: XCircle,
    deskripsi: 'Mohon maaf, pendaftaran Anda tidak diterima pada gelombang ini.',
    ctaLabel: 'Lihat Alasan Penolakan',
    ctaAction: 'expandAlasan',
    stepAktif: 3,
  },
  MENUNGGU_BAYAR: {
    label: 'Menunggu Pembayaran',
    color: '#3B82F6',
    icon: CreditCard,
    deskripsi: 'Silakan selesaikan pembayaran biaya pendaftaran.',
    ctaLabel: 'Selesaikan Pembayaran →',
    ctaPath: '/pembayaran',
    stepAktif: 4,
  },
  TERDAFTAR: {
    label: 'Terdaftar ✓',
    color: '#059669',
    icon: BadgeCheck,
    deskripsi: 'Anda resmi terdaftar sebagai peserta didik baru.',
    ctaLabel: 'Unduh Bukti Pendaftaran',
    ctaAction: 'downloadPDF',
    stepAktif: 5,
  },
  EXPIRED: {
    label: 'Pembayaran Kadaluarsa',
    color: '#DC2626',
    icon: Clock,
    deskripsi: 'Batas waktu pembayaran telah habis.',
    ctaLabel: 'Hubungi Panitia →',
    ctaPath: '/kontak',
    stepAktif: 4,
  },
};

// ─── Status Labels shorthand ─────────────────────────────────────
export const STATUS_LABEL = Object.fromEntries(
  Object.entries(STATUS_CONFIG).map(([k, v]) => [k, v.label])
);

// ─── Badge Style (dark mode optimized) ───────────────────────────
export const STATUS_BADGE_STYLE = {
  TERDAFTAR:       { background: 'rgba(5,150,105,0.15)',   border: '1px solid rgba(5,150,105,0.35)',   color: '#34D399' },
  DITERIMA:        { background: 'rgba(16,185,129,0.15)',  border: '1px solid rgba(16,185,129,0.3)',   color: '#6EE7B7' },
  DITOLAK:         { background: 'rgba(239,68,68,0.15)',   border: '1px solid rgba(239,68,68,0.3)',    color: '#FCA5A5' },
  REVISI:          { background: 'rgba(249,115,22,0.15)',  border: '1px solid rgba(249,115,22,0.3)',   color: '#FDBA74' },
  SUBMITTED:       { background: 'rgba(245,158,11,0.15)',  border: '1px solid rgba(245,158,11,0.3)',   color: '#FCD34D' },
  MENUNGGU_REVIEW: { background: 'rgba(245,158,11,0.15)',  border: '1px solid rgba(245,158,11,0.3)',   color: '#FCD34D' },
  MENUNGGU_BAYAR:  { background: 'rgba(59,130,246,0.15)',  border: '1px solid rgba(59,130,246,0.3)',   color: '#93C5FD' },
  EXPIRED:         { background: 'rgba(220,38,38,0.15)',   border: '1px solid rgba(220,38,38,0.3)',    color: '#FCA5A5' },
  DRAFT:           { background: 'rgba(156,163,175,0.15)', border: '1px solid rgba(156,163,175,0.25)', color: '#D1D5DB' },
};

// Light mode badge — uses the original status colors (darker, readable on white)
export const STATUS_BADGE_STYLE_LIGHT = {
  TERDAFTAR:       { background: 'rgba(5,150,105,0.08)',   border: '1px solid rgba(5,150,105,0.25)',   color: '#059669' },
  DITERIMA:        { background: 'rgba(16,185,129,0.08)',  border: '1px solid rgba(16,185,129,0.2)',   color: '#059669' },
  DITOLAK:         { background: 'rgba(239,68,68,0.08)',   border: '1px solid rgba(239,68,68,0.2)',    color: '#DC2626' },
  REVISI:          { background: 'rgba(249,115,22,0.08)',  border: '1px solid rgba(249,115,22,0.2)',   color: '#EA580C' },
  SUBMITTED:       { background: 'rgba(245,158,11,0.08)',  border: '1px solid rgba(245,158,11,0.2)',   color: '#D97706' },
  MENUNGGU_REVIEW: { background: 'rgba(245,158,11,0.08)',  border: '1px solid rgba(245,158,11,0.2)',   color: '#D97706' },
  MENUNGGU_BAYAR:  { background: 'rgba(59,130,246,0.08)',  border: '1px solid rgba(59,130,246,0.2)',   color: '#2563EB' },
  EXPIRED:         { background: 'rgba(220,38,38,0.08)',   border: '1px solid rgba(220,38,38,0.2)',    color: '#DC2626' },
  DRAFT:           { background: 'rgba(156,163,175,0.08)', border: '1px solid rgba(156,163,175,0.2)',  color: '#6B7280' },
};

// Helper to get badge style based on current theme
export const getBadgeStyle = (status, theme = 'dark') =>
  theme === 'dark' ? STATUS_BADGE_STYLE[status] : (STATUS_BADGE_STYLE_LIGHT[status] || STATUS_BADGE_STYLE[status]);

// ─── Step Mapping ─────────────────────────────────────────────────
export const STATUS_TO_STEP = {
  DRAFT: 1, SUBMITTED: 2,
  MENUNGGU_REVIEW: 3, REVISI: 3, DITOLAK: 3,
  DITERIMA: 4, MENUNGGU_BAYAR: 4, EXPIRED: 4,
  TERDAFTAR: 5,
};

export const STEP_LABELS = ['Daftar', 'Formulir', 'Verifikasi', 'Bayar', 'Terdaftar'];

// ─── Jenjang Config ───────────────────────────────────────────────
export const JENJANG_CONFIG = {
  TK:  { label: 'Taman Kanak-Kanak',         keterangan: 'Usia 4–6 tahun',   seleksi: false },
  SD:  { label: 'Sekolah Dasar',             keterangan: 'Usia 6–7 tahun',   seleksi: true  },
  SMP: { label: 'Sekolah Menengah Pertama',  keterangan: 'Lulusan SD/MI',    seleksi: true  },
  SMA: { label: 'Sekolah Menengah Atas',     keterangan: 'Lulusan SMP/MTs',  seleksi: true  },
};
