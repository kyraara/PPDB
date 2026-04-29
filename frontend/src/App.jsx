import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BottomNav from './components/layout/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CekStatusPage from './pages/CekStatusPage';
import KontakPage from './pages/KontakPage';
import BerandaPage from './pages/pendaftar/BerandaPage';
import FormulirLayout from './pages/pendaftar/FormulirLayout';
import DataSiswaForm from './pages/pendaftar/DataSiswaForm';
import DataOrtuForm from './pages/pendaftar/DataOrtuForm';
import DokumenForm from './pages/pendaftar/DokumenForm';
import ReviewSubmitPage from './pages/pendaftar/ReviewSubmitPage';
import PembayaranPage from './pages/pendaftar/PembayaranPage';
import KonfirmasiPembayaranPage from './pages/pendaftar/KonfirmasiPembayaranPage';
import ProfilPage from './pages/pendaftar/ProfilPage';
import PanitiaLayout from './pages/panitia/PanitiaLayout';
import PanitiaDashboardPage from './pages/panitia/PanitiaDashboardPage';
import PendaftarListPage from './pages/panitia/PendaftarListPage';
import PendaftarDetailPage from './pages/panitia/PendaftarDetailPage';
// Admin
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import GelombangPage from './pages/admin/GelombangPage';
import PersyaratanPage from './pages/admin/PersyaratanPage';
import PanitiaPage from './pages/admin/PanitiaPage';
import AdminPendaftarPage from './pages/admin/AdminPendaftarPage';
import AdminPembayaranPage from './pages/admin/AdminPembayaranPage';
// Kepsek
import KepsekLayout from './pages/kepsek/KepsekLayout';
import KepsekDashboardPage from './pages/kepsek/KepsekDashboardPage';

import useAuthStore from './stores/authStore';
import api from './services/api';

function AppContent() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const [pendaftaranStatus, setPendaftaranStatus] = useState(null);

  // Fetch pendaftaran status for BottomNav conditional tabs
  useEffect(() => {
    if (isAuthenticated && user?.role === 'pendaftar') {
      api.get('/pendaftaran/saya').then(res => {
        setPendaftaranStatus(res.data.data?.pendaftaran?.status || null);
      }).catch(() => {});
    } else {
      setPendaftaranStatus(null);
    }
  }, [isAuthenticated, user, location.pathname]);

  // Routes where pendaftar layout applies (bottom nav, no footer)
  const pendaftarPaths = ['/beranda', '/formulir', '/pembayaran', '/profil', '/kontak', '/cek-status'];
  const isPendaftarPage = isAuthenticated &&
    user?.role === 'pendaftar' &&
    pendaftarPaths.some(p => location.pathname.startsWith(p));

  // Panitia/Admin/Kepsek has its own layout — hide global navbar/footer
  const isPanelPage = isAuthenticated && (
    (user?.role === 'panitia' && location.pathname.startsWith('/panitia')) ||
    (user?.role === 'admin' && location.pathname.startsWith('/admin')) ||
    (user?.role === 'kepala_sekolah' && location.pathname.startsWith('/kepsek'))
  );

  return (
    <>
      {/* Grain texture overlay */}
      <div className="grain-overlay" />

      {!isPanelPage && <Navbar />}

      <main>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/daftar" element={<RegisterPage />} />
          <Route path="/cek-status" element={<CekStatusPage />} />
          <Route path="/kontak" element={<KontakPage />} />

          {/* Pendaftar — Protected */}
          <Route path="/beranda" element={
            <ProtectedRoute roles={['pendaftar']}>
              <BerandaPage />
            </ProtectedRoute>
          } />

          <Route path="/formulir" element={
            <ProtectedRoute roles={['pendaftar']}>
              <FormulirLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DataSiswaForm />} />
            <Route path="data-siswa" element={<DataSiswaForm />} />
            <Route path="data-ortu" element={<DataOrtuForm />} />
            <Route path="dokumen" element={<DokumenForm />} />
            <Route path="review" element={<ReviewSubmitPage />} />
          </Route>

          {/* Pembayaran */}
          <Route path="/pembayaran" element={
            <ProtectedRoute roles={['pendaftar']}>
              <PembayaranPage />
            </ProtectedRoute>
          } />
          <Route path="/pembayaran/konfirmasi" element={
            <ProtectedRoute roles={['pendaftar']}>
              <KonfirmasiPembayaranPage />
            </ProtectedRoute>
          } />
          <Route path="/profil" element={
            <ProtectedRoute roles={['pendaftar', 'panitia', 'admin', 'kepala_sekolah']}>
              <ProfilPage />
            </ProtectedRoute>
          } />

          {/* Panitia */}
          <Route path="/panitia" element={
            <ProtectedRoute roles={['panitia']}>
              <PanitiaLayout />
            </ProtectedRoute>
          }>
            <Route index element={<PanitiaDashboardPage />} />
            <Route path="dashboard" element={<PanitiaDashboardPage />} />
            <Route path="pendaftar" element={<PendaftarListPage />} />
            <Route path="pendaftar/:id" element={<PendaftarDetailPage />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboardPage />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="gelombang" element={<GelombangPage />} />
            <Route path="persyaratan" element={<PersyaratanPage />} />
            <Route path="panitia" element={<PanitiaPage />} />
            <Route path="pendaftar" element={<AdminPendaftarPage />} />
            <Route path="pembayaran" element={<AdminPembayaranPage />} />
          </Route>

          {/* Kepala Sekolah */}
          <Route path="/kepsek" element={
            <ProtectedRoute roles={['kepala_sekolah']}>
              <KepsekLayout />
            </ProtectedRoute>
          }>
            <Route index element={<KepsekDashboardPage />} />
            <Route path="dashboard" element={<KepsekDashboardPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Conditional footer vs bottom nav */}
      {!isPanelPage && (isPendaftarPage ? <BottomNav pendaftaranStatus={pendaftaranStatus} /> : <Footer />)}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function NotFoundPage() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div>
        <h1 style={{ fontSize: '5rem', marginBottom: '0.5rem', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Halaman yang Anda cari tidak ditemukan.</p>
        <a href="/" className="btn btn-primary">Kembali ke Beranda</a>
      </div>
    </div>
  );
}

export default App;
