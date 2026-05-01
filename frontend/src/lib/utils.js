// src/lib/utils.js

export const formatDate = (dateStr, options = {}) => {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
    ...options,
  }).format(new Date(dateStr));
};

export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'Baru saja';
  if (mins < 60)  return `${mins} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 7)   return `${days} hari lalu`;
  return formatDate(dateStr);
};

export const formatFileSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1048576)     return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

export const formatRupiah = (amount) => {
  if (!amount && amount !== 0) return '—';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(amount);
};

export const formatNomorDaftar = (str) =>
  str ? str.replace(/-/g, '\u2011') : '—';  // non-breaking hyphen

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
};

export const isValidNIK = (nik) => /^\d{16}$/.test(nik);
export const isValidNISN = (nisn) => /^\d{10}$/.test(nisn);
export const isValidNoHP = (hp) => /^08\d{8,11}$/.test(hp);
