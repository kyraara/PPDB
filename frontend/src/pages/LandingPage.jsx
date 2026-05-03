import { useState, useEffect } from 'react';
import { Sparkles, BookOpen, School, GraduationCap } from 'lucide-react';
import api from '../services/api';

import HeroSection from '../sections/HeroSection';
import TentangSection from '../sections/TentangSection';
import KeunggulanSection from '../sections/KeunggulanSection';
import JenjangSection from '../sections/JenjangSection';
import GelombangSection from '../sections/GelombangSection';
import AlurSection from '../sections/AlurSection';
import ProfilYayasanSection from '../sections/ProfilYayasanSection';
import CTASection from '../sections/CTASection';

// Data jenjang sekarang diambil dari database

export default function LandingPage() {
  const [gelombangData, setGelombangData] = useState({});
  const [statsData, setStatsData] = useState({});
  const [jenjangData, setJenjangData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/publik/gelombang').catch(() => ({ data: { success: false } })),
      api.get('/publik/statistik').catch(() => ({ data: { success: false } })),
      api.get('/publik/jenjang').catch(() => ({ data: { success: false } }))
    ]).then(([resGelombang, resStats, resJenjang]) => {
      if (resGelombang.data.success) setGelombangData(resGelombang.data.data);
      if (resStats.data.success) setStatsData(resStats.data.data);
      if (resJenjang.data.success) setJenjangData(resJenjang.data.data);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="loading-spinner w-8 h-8" /></div>;

  return (
    <div>
      <HeroSection jenjangData={jenjangData} statsData={statsData} />
      <ProfilYayasanSection />
      <TentangSection jenjangData={jenjangData} />
      <KeunggulanSection />
      <JenjangSection jenjangData={jenjangData} />
      <GelombangSection gelombangData={gelombangData} />
      <AlurSection />
      <CTASection />
    </div>
  );
}
