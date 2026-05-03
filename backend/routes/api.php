<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\NotifikasiController;
use App\Http\Controllers\Api\PanitiaController;
use App\Http\Controllers\Api\PembayaranController;
use App\Http\Controllers\Api\PendaftaranController;
use App\Http\Controllers\Api\ProfilController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\KepsekController;
use App\Http\Controllers\Api\PengaturanJenjangController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes (tanpa login)
|--------------------------------------------------------------------------
*/

Route::prefix('publik')->group(function () {
    Route::get('/gelombang', [PublicController::class, 'gelombang']);
    Route::get('/cek-status/{nomor_daftar}', [PublicController::class, 'cekStatus']);
    Route::get('/statistik', [PublicController::class, 'statistik']);
    Route::get('/jenjang', [PengaturanJenjangController::class, 'index']);
    Route::get('/jenjang/{kode}', [PengaturanJenjangController::class, 'show']);
});

Route::get('/persyaratan-dokumen/{jenjang}', [PendaftaranController::class, 'persyaratanDokumen']);

/*
|--------------------------------------------------------------------------
| Payment Webhook (no auth — called by Midtrans)
|--------------------------------------------------------------------------
*/

Route::post('/pembayaran/webhook', [PembayaranController::class, 'webhook']);

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    // CATATAN: Rate limiting ditambahkan untuk mencegah brute force.
    // throttle:5,1 berarti maksimal 5 percobaan per 1 menit per IP.
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
    Route::post('/google', [\App\Http\Controllers\Api\GoogleAuthController::class, 'handle'])->middleware('throttle:5,1');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes (semua role)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    // Profil
    Route::get('/profil', [ProfilController::class, 'show']);
    Route::put('/profil', [ProfilController::class, 'update']);
    Route::put('/profil/password', [ProfilController::class, 'changePassword']);

    // Notifikasi
    Route::get('/notifikasi', [NotifikasiController::class, 'index']);
    Route::patch('/notifikasi/{id}/read', [NotifikasiController::class, 'markRead']);
    Route::patch('/notifikasi/read-all', [NotifikasiController::class, 'markAllRead']);
});

/*
|--------------------------------------------------------------------------
| Pendaftar Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:pendaftar'])->group(function () {
    Route::get('/pendaftaran/saya', [PendaftaranController::class, 'saya']);
    Route::post('/pendaftaran', [PendaftaranController::class, 'store']);
    Route::put('/pendaftaran/{id}', [PendaftaranController::class, 'update']);
    Route::post('/pendaftaran/{id}/submit', [PendaftaranController::class, 'submit']);
    Route::get('/pendaftaran/{id}/bukti', [\App\Http\Controllers\Api\ExportController::class, 'cetakBuktiPendaftaran']);
    Route::post('/pendaftaran/{id}/dokumen/{jenis}', [PendaftaranController::class, 'uploadDokumen']);
    Route::delete('/pendaftaran/{id}/dokumen/{jenis}', [PendaftaranController::class, 'deleteDokumen']);

    // Pembayaran
    Route::get('/pembayaran/{pendaftaran_id}/info', [PembayaranController::class, 'info']);
    Route::post('/pembayaran/{pendaftaran_id}/initiate', [PembayaranController::class, 'initiate']);
    Route::get('/pembayaran/{pendaftaran_id}/status', [PembayaranController::class, 'status']);
    Route::post('/pembayaran/{pendaftaran_id}/simulasi', [PembayaranController::class, 'simulasi']);
    Route::post('/pembayaran/sync', [PembayaranController::class, 'sync']);
});

/*
|--------------------------------------------------------------------------
| Panitia Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:panitia'])->prefix('panitia')->group(function () {
    Route::get('/dashboard', [PanitiaController::class, 'dashboard']);
    Route::get('/pendaftar', [PanitiaController::class, 'pendaftarList']);
    Route::get('/pendaftar/{id}', [PanitiaController::class, 'pendaftarDetail']);
    Route::patch('/pendaftar/{id}/status', [PanitiaController::class, 'updateStatus']);
    Route::patch('/pendaftar/{id}/dokumen/{dokumen_id}', [PanitiaController::class, 'updateDokumen']);
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);

    // Gelombang CRUD
    Route::get('/gelombang', [AdminController::class, 'gelombangIndex']);
    Route::post('/gelombang', [AdminController::class, 'gelombangStore']);
    Route::put('/gelombang/{id}', [AdminController::class, 'gelombangUpdate']);
    Route::delete('/gelombang/{id}', [AdminController::class, 'gelombangDestroy']);

    // Persyaratan Dokumen CRUD
    Route::get('/persyaratan-dokumen', [AdminController::class, 'persyaratanIndex']);
    Route::post('/persyaratan-dokumen', [AdminController::class, 'persyaratanStore']);
    Route::put('/persyaratan-dokumen/{id}', [AdminController::class, 'persyaratanUpdate']);
    Route::delete('/persyaratan-dokumen/{id}', [AdminController::class, 'persyaratanDestroy']);

    // Panitia CRUD
    Route::get('/panitia', [AdminController::class, 'panitiaIndex']);
    Route::post('/panitia', [AdminController::class, 'panitiaStore']);
    Route::put('/panitia/{id}', [AdminController::class, 'panitiaUpdate']);
    Route::delete('/panitia/{id}', [AdminController::class, 'panitiaDestroy']);

    // Pendaftar (lintas jenjang)
    Route::get('/pendaftar', [AdminController::class, 'pendaftarIndex']);
    Route::patch('/pendaftar/{id}/status', [AdminController::class, 'pendaftarUpdateStatus']);

    // Pembayaran
    Route::get('/pembayaran', [AdminController::class, 'pembayaranIndex']);

    // Export
    Route::get('/export/pendaftar', [\App\Http\Controllers\Api\ExportController::class, 'exportPendaftarCsv']);

    // Pengaturan Jenjang
    Route::get('/pengaturan-jenjang', [PengaturanJenjangController::class, 'adminIndex']);
    Route::get('/pengaturan-jenjang/{kode}', [PengaturanJenjangController::class, 'adminShow']);
    Route::put('/pengaturan-jenjang/{kode}', [PengaturanJenjangController::class, 'update']);
    Route::post('/pengaturan-jenjang/{kode}/logo', [PengaturanJenjangController::class, 'uploadLogo']);
    Route::delete('/pengaturan-jenjang/{kode}/logo', [PengaturanJenjangController::class, 'deleteLogo']);
    Route::post('/upload-image', [PengaturanJenjangController::class, 'uploadImage']);
});

/*
|--------------------------------------------------------------------------
| Kepala Sekolah Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:kepala_sekolah'])->prefix('kepsek')->group(function () {
    Route::get('/dashboard', [KepsekController::class, 'dashboard']);
    Route::get('/export/laporan', [\App\Http\Controllers\Api\ExportController::class, 'exportLaporanKepsek']);
});
