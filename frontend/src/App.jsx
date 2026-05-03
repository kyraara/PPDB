import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BottomNav from './components/layout/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';
import ScreenLoader from './components/ui/ScreenLoader';
import ErrorBoundary from './components/ui/ErrorBoundary';

import useAuthStore from './stores/authStore';
import api from './services/api';
import { Toaster } from 'react-hot-toast';

// --- Static Imports for Core/Fast Pages ---
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CekStatusPage from './pages/CekStatusPage';
import KontakPage from './pages/KontakPage';

// --- Lazy Loaded Pages ---
const ProfilYayasanPage = lazy(() => import('./pages/ProfilYayasanPage'));
const ProfilJenjangPage = lazy(() => import('./pages/ProfilJenjangPage'));
const LupaPasswordPage = lazy(() => import('./pages/LupaPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));

// Pendaftar
const BerandaPage = lazy(() => import('./pages/pendaftar/BerandaPage'));
const FormulirLayout = lazy(() => import('./components/layout/FormulirLayout'));
const DataSiswaForm = lazy(() => import('./pages/pendaftar/DataSiswaForm'));
const DataOrtuForm = lazy(() => import('./pages/pendaftar/DataOrtuForm'));
const DokumenForm = lazy(() => import('./pages/pendaftar/DokumenForm'));
const ReviewSubmitPage = lazy(() => import('./pages/pendaftar/ReviewSubmitPage'));
const PembayaranPage = lazy(() => import('./pages/pendaftar/PembayaranPage'));
const KonfirmasiPembayaranPage = lazy(() => import('./pages/pendaftar/KonfirmasiPembayaranPage'));
const ProfilPage = lazy(() => import('./pages/pendaftar/ProfilPage'));

// Panitia
const PanitiaLayout = lazy(() => import('./pages/panitia/PanitiaLayout'));
const PanitiaDashboardPage = lazy(() => import('./pages/panitia/PanitiaDashboardPage'));
const PendaftarListPage = lazy(() => import('./pages/panitia/PendaftarListPage'));
const PendaftarDetailPage = lazy(() => import('./pages/panitia/PendaftarDetailPage'));

// Admin
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const GelombangPage = lazy(() => import('./pages/admin/GelombangPage'));
const PersyaratanPage = lazy(() => import('./pages/admin/PersyaratanPage'));
const PanitiaPage = lazy(() => import('./pages/admin/PanitiaPage'));
const AdminPendaftarPage = lazy(() => import('./pages/admin/AdminPendaftarPage'));
const AdminPembayaranPage = lazy(() => import('./pages/admin/AdminPembayaranPage'));
const AdminPengaturanJenjangPage = lazy(() => import('./pages/admin/AdminPengaturanJenjangPage'));
const AdminProfilPage = lazy(() => import('./pages/admin/AdminProfilPage'));

// Kepsek
const KepsekLayout = lazy(() => import('./pages/kepsek/KepsekLayout'));
const KepsekDashboardPage = lazy(() => import('./pages/kepsek/KepsekDashboardPage'));

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
      {/* Toast Notifications */}
      <Toaster position="top-right" toastOptions={{
        style: { borderRadius: '8px', fontSize: '0.9rem' },
        success: { duration: 3000 },
        error: { duration: 4000 },
      }} />

      {/* Grain texture overlay */}
      <div className="grain-overlay" />

      {!isPanelPage && <Navbar />}

      <main>
        <ErrorBoundary>
          <Suspense fallback={<ScreenLoader />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/daftar" element={<RegisterPage />} />
            <Route path="/lupa-password" element={<LupaPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/cek-status" element={<CekStatusPage />} />
            <Route path="/kontak" element={<KontakPage />} />
            <Route path="/profil-yayasan" element={<ProfilYayasanPage />} />
            <Route path="/jenjang/:key" element={<ProfilJenjangPage />} />

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
              <Route path="profil" element={<AdminProfilPage />} />
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
              <Route path="pengaturan-jenjang" element={<AdminPengaturanJenjangPage />} />
              <Route path="profil" element={<AdminProfilPage />} />
            </Route>

            {/* Kepala Sekolah */}
            <Route path="/kepsek" element={
              <ProtectedRoute roles={['kepala_sekolah']}>
                <KepsekLayout />
              </ProtectedRoute>
            }>
              <Route index element={<KepsekDashboardPage />} />
              <Route path="dashboard" element={<KepsekDashboardPage />} />
              <Route path="profil" element={<AdminProfilPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </Suspense>
        </ErrorBoundary>
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
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center p-8 text-center">
      <div className="max-w-[440px]">
        <div className="text-[7rem] font-extrabold font-heading text-accent dark:text-dark-accent opacity-15 leading-none -mb-4 select-none">
          404
        </div>
        <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center mx-auto mb-6 relative z-10
                        bg-accent-bg dark:bg-dark-accent-bg border-2 border-accent-bg-strong dark:border-dark-accent-bg-strong">
          <MapPin size={32} className="text-accent dark:text-dark-accent" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Halaman Tidak Ditemukan</h2>
        <p className="text-text-secondary dark:text-dark-text-secondary leading-relaxed mb-8">
          Halaman yang Anda cari tidak ada atau telah dipindahkan. Coba kembali ke beranda atau cek status pendaftaran Anda.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/" className="btn btn-primary">Kembali ke Beranda</Link>
          <Link to="/cek-status" className="btn btn-secondary">Cek Status Pendaftaran</Link>
        </div>
      </div>
    </div>
  );
}

export default App;
