import { useState, useEffect } from 'react';
import { Sparkles, BookOpen, School, GraduationCap } from 'lucide-react';
import api from '../services/api';

import HeroSection from '../sections/HeroSection';
import TentangSection from '../sections/TentangSection';
import KeunggulanSection from '../sections/KeunggulanSection';
import JenjangSection from '../sections/JenjangSection';
import GelombangSection from '../sections/GelombangSection';
import AlurSection from '../sections/AlurSection';
import CTASection from '../sections/CTASection';

const jenjangData = [
  {
    key: 'TK',
    label: 'Taman Kanak-Kanak',
    icon: Sparkles,
    color: 'var(--color-accent)',
    desc: 'Usia 4-6 tahun. Pendaftaran langsung diterima tanpa seleksi berkas.',
    highlight: 'Langsung Diterima',
  },
  {
    key: 'SD',
    label: 'Sekolah Dasar',
    icon: BookOpen,
    color: 'var(--color-accent-light)',
    desc: 'Usia 6-7 tahun. Seleksi berkas oleh panitia sebelum diterima.',
    highlight: 'Seleksi Berkas',
  },
  {
    key: 'SMP',
    label: 'Sekolah Menengah Pertama',
    icon: School,
    color: 'var(--color-accent)',
    desc: 'Lulusan SD/MI. Seleksi berkas termasuk rapor semester 1-5.',
    highlight: 'Seleksi Berkas',
  },
  {
    key: 'SMA',
    label: 'Sekolah Menengah Atas',
    icon: GraduationCap,
    color: 'var(--color-accent-light)',
    desc: 'Lulusan SMP/MTs. Seleksi berkas termasuk rapor dan SKBB.',
    highlight: 'Seleksi Berkas',
  },
];

export default function LandingPage() {
  const [gelombangData, setGelombangData] = useState({});
  const [statsData, setStatsData] = useState({});

  useEffect(() => {
    api.get('/publik/gelombang').then(res => {
      if (res.data.success) setGelombangData(res.data.data);
    }).catch(() => {});

    api.get('/publik/statistik').then(res => {
      if (res.data.success) setStatsData(res.data.data);
    }).catch(() => {});
  }, []);

  return (
    <div>
      <HeroSection jenjangData={jenjangData} statsData={statsData} />
      <TentangSection />
      <KeunggulanSection />
      <JenjangSection jenjangData={jenjangData} />
      <GelombangSection gelombangData={gelombangData} />
      <AlurSection />
      <CTASection />
    </div>
  );
}
