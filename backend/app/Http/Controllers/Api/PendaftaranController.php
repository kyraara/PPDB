<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dokumen;
use App\Models\Gelombang;
use App\Models\Pendaftaran;
use App\Models\PersyaratanDokumen;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PendaftaranController extends Controller
{
    /**
     * Data pendaftaran milik user yang login
     */
    public function saya(Request $request): JsonResponse
    {
        $user = $request->user();

        $pendaftaran = Pendaftaran::where('user_id', $user->id)
            ->with(['gelombang', 'dataSiswa', 'dataOrtu', 'dokumen', 'pembayaran', 'reviewer'])
            ->first();

        if (!$pendaftaran) {
            return response()->json([
                'success' => true,
                'data' => null,
                'message' => 'Belum ada pendaftaran. Silakan mulai pendaftaran baru.',
            ]);
        }

        // Get persyaratan dokumen untuk jenjang ini
        $persyaratan = PersyaratanDokumen::where('jenjang', $pendaftaran->jenjang)
            ->orderBy('urutan')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'pendaftaran' => $pendaftaran,
                'persyaratan_dokumen' => $persyaratan,
            ],
        ]);
    }

    /**
     * Buat draft pendaftaran baru
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        // Business rule: 1 user = 1 pendaftaran aktif
        $existing = Pendaftaran::where('user_id', $user->id)
            ->whereNotIn('status', ['DITOLAK', 'EXPIRED'])
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah memiliki pendaftaran aktif. Silakan selesaikan pendaftaran yang sedang berjalan.',
            ], 422);
        }

        $jenjang = $user->jenjang_daftar;
        if (!$jenjang) {
            return response()->json([
                'success' => false,
                'message' => 'Jenjang pendidikan belum dipilih.',
            ], 422);
        }

        // Cari gelombang aktif (BUKA) untuk jenjang user
        $gelombang = Gelombang::where('jenjang', $jenjang)
            ->where('status', 'BUKA')
            ->first();

        if (!$gelombang) {
            return response()->json([
                'success' => false,
                'message' => 'Saat ini belum ada gelombang pendaftaran yang dibuka untuk jenjang ' . $jenjang . '.',
            ], 422);
        }

        if ($gelombang->isFull()) {
            return response()->json([
                'success' => false,
                'message' => 'Kuota gelombang ini sudah penuh. Silakan tunggu gelombang berikutnya.',
            ], 422);
        }

        $nomorDaftar = Pendaftaran::generateNomorDaftar($jenjang, $gelombang->nomor_gelombang);

        $pendaftaran = Pendaftaran::create([
            'nomor_daftar' => $nomorDaftar,
            'user_id' => $user->id,
            'gelombang_id' => $gelombang->id,
            'jenjang' => $jenjang,
            'status' => 'DRAFT',
        ]);

        $pendaftaran->load(['gelombang']);

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran berhasil dibuat. Silakan lengkapi formulir.',
            'data' => $pendaftaran,
        ], 201);
    }

    /**
     * Update data siswa dan orang tua (hanya saat DRAFT/REVISI)
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $pendaftaran = Pendaftaran::where('id', $id)->where('user_id', $user->id)->first();

        if (!$pendaftaran) {
            return response()->json(['success' => false, 'message' => 'Pendaftaran tidak ditemukan.'], 404);
        }

        if (!in_array($pendaftaran->status, ['DRAFT', 'REVISI'])) {
            return response()->json([
                'success' => false,
                'message' => 'Data hanya bisa diubah saat status Draft atau Revisi.',
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Update data siswa
            if ($request->has('data_siswa')) {
                $siswaData = $request->validate([
                    'data_siswa.nama_lengkap' => 'required|string|max:255',
                    'data_siswa.nik' => 'nullable|string|size:16',
                    'data_siswa.nisn' => 'nullable|string|max:10',
                    'data_siswa.tempat_lahir' => 'required|string|max:255',
                    'data_siswa.tanggal_lahir' => 'required|date',
                    'data_siswa.jenis_kelamin' => 'required|in:L,P',
                    'data_siswa.agama' => 'required|string|max:50',
                    'data_siswa.alamat' => 'required|string',
                    'data_siswa.asal_sekolah' => 'nullable|string|max:255',
                ], [
                    'data_siswa.nama_lengkap.required' => 'Nama lengkap siswa wajib diisi.',
                    'data_siswa.nik.size' => 'NIK harus terdiri dari 16 digit.',
                    'data_siswa.tempat_lahir.required' => 'Tempat lahir wajib diisi.',
                    'data_siswa.tanggal_lahir.required' => 'Tanggal lahir wajib diisi.',
                    'data_siswa.jenis_kelamin.required' => 'Jenis kelamin wajib dipilih.',
                    'data_siswa.agama.required' => 'Agama wajib diisi.',
                    'data_siswa.alamat.required' => 'Alamat wajib diisi.',
                ]);

                $pendaftaran->dataSiswa()->updateOrCreate(
                    ['pendaftaran_id' => $pendaftaran->id],
                    $siswaData['data_siswa']
                );
            }

            // Update data orang tua
            if ($request->has('data_ortu')) {
                $request->validate([
                    'data_ortu' => 'required|array|min:1',
                    'data_ortu.*.tipe' => 'required|in:AYAH,IBU,WALI',
                    'data_ortu.*.nama' => 'required|string|max:255',
                    'data_ortu.*.nik' => 'nullable|string|size:16',
                    'data_ortu.*.pekerjaan' => 'nullable|string|max:255',
                    'data_ortu.*.no_hp' => 'required|string|max:20',
                    'data_ortu.*.penghasilan' => 'nullable|string|max:100',
                ], [
                    'data_ortu.required' => 'Data orang tua wajib diisi.',
                    'data_ortu.min' => 'Minimal 1 data orang tua harus diisi.',
                    'data_ortu.*.nama.required' => 'Nama orang tua wajib diisi.',
                    'data_ortu.*.no_hp.required' => 'Nomor HP orang tua wajib diisi.',
                ]);

                // Replace all parent data
                $pendaftaran->dataOrtu()->delete();
                foreach ($request->data_ortu as $ortu) {
                    $pendaftaran->dataOrtu()->create($ortu);
                }
            }

            DB::commit();

            $pendaftaran->load(['dataSiswa', 'dataOrtu', 'dokumen', 'gelombang']);

            return response()->json([
                'success' => true,
                'message' => 'Data berhasil disimpan.',
                'data' => $pendaftaran,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan data. Silakan coba lagi.',
            ], 500);
        }
    }

    /**
     * Submit pendaftaran
     */
    public function submit(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $pendaftaran = Pendaftaran::where('id', $id)
            ->where('user_id', $user->id)
            ->with(['dataSiswa', 'dataOrtu', 'dokumen', 'gelombang'])
            ->first();

        if (!$pendaftaran) {
            return response()->json(['success' => false, 'message' => 'Pendaftaran tidak ditemukan.'], 404);
        }

        if ($pendaftaran->status !== 'DRAFT') {
            return response()->json([
                'success' => false,
                'message' => 'Pendaftaran hanya bisa di-submit dari status Draft.',
            ], 422);
        }

        // Validasi kelengkapan
        $errors = [];
        if (!$pendaftaran->dataSiswa) {
            $errors[] = 'Data siswa belum diisi.';
        }
        if ($pendaftaran->dataOrtu->isEmpty()) {
            $errors[] = 'Data orang tua belum diisi.';
        }

        // Cek dokumen wajib
        $persyaratan = PersyaratanDokumen::where('jenjang', $pendaftaran->jenjang)
            ->where('wajib', true)
            ->get();

        $uploadedJenis = $pendaftaran->dokumen->pluck('jenis_dokumen')->toArray();
        foreach ($persyaratan as $p) {
            if (!in_array($p->kode, $uploadedJenis)) {
                $errors[] = "Dokumen \"{$p->nama}\" belum diupload.";
            }
        }

        if (!empty($errors)) {
            return response()->json([
                'success' => false,
                'message' => 'Pendaftaran belum lengkap.',
                'errors' => $errors,
            ], 422);
        }

        // TK: langsung DITERIMA
        if ($pendaftaran->jenjang === 'TK') {
            $pendaftaran->update([
                'status' => 'DITERIMA',
                'submitted_at' => now(),
                'reviewed_at' => now(),
            ]);
            $message = 'Selamat! Pendaftaran TK langsung diterima. Silakan lanjutkan ke pembayaran.';
        } else {
            $pendaftaran->update([
                'status' => 'SUBMITTED',
                'submitted_at' => now(),
            ]);
            $message = 'Pendaftaran berhasil dikirim. Silakan tunggu proses verifikasi oleh panitia.';
        }

        // Increment kuota terisi
        $pendaftaran->gelombang->increment('terisi');

        $pendaftaran->load(['dataSiswa', 'dataOrtu', 'dokumen', 'gelombang']);

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $pendaftaran,
        ]);
    }

    /**
     * Upload dokumen
     */
    public function uploadDokumen(Request $request, int $id, string $jenis): JsonResponse
    {
        $user = $request->user();
        $pendaftaran = Pendaftaran::where('id', $id)->where('user_id', $user->id)->first();

        if (!$pendaftaran) {
            return response()->json(['success' => false, 'message' => 'Pendaftaran tidak ditemukan.'], 404);
        }

        if (!in_array($pendaftaran->status, ['DRAFT', 'REVISI'])) {
            return response()->json([
                'success' => false,
                'message' => 'Dokumen hanya bisa diupload saat status Draft atau Revisi.',
            ], 422);
        }

        // REVISI: hanya dokumen INVALID yang bisa diupload ulang
        if ($pendaftaran->status === 'REVISI') {
            $existingDoc = $pendaftaran->dokumen()->where('jenis_dokumen', $jenis)->first();
            if ($existingDoc && $existingDoc->status !== 'INVALID') {
                return response()->json([
                    'success' => false,
                    'message' => 'Dokumen ini tidak perlu diperbaiki.',
                ], 422);
            }
        }

        // Validate persyaratan
        $persyaratan = PersyaratanDokumen::where('jenjang', $pendaftaran->jenjang)
            ->where('kode', $jenis)
            ->first();

        if (!$persyaratan) {
            return response()->json([
                'success' => false,
                'message' => 'Jenis dokumen tidak valid untuk jenjang ini.',
            ], 422);
        }

        $maxSize = $persyaratan->maks_ukuran_mb * 1024; // KB
        $formats = $persyaratan->format_diterima;

        $request->validate([
            'file' => "required|file|max:{$maxSize}|mimes:{$formats}",
        ], [
            'file.required' => 'File dokumen wajib diupload.',
            'file.max' => "Ukuran file maksimal {$persyaratan->maks_ukuran_mb}MB.",
            'file.mimes' => "Format file harus: {$formats}.",
        ]);

        $file = $request->file('file');
        $path = $file->store("dokumen/{$pendaftaran->id}", 'public');

        // Delete old document if exists
        $oldDoc = $pendaftaran->dokumen()->where('jenis_dokumen', $jenis)->first();
        if ($oldDoc) {
            Storage::disk('public')->delete($oldDoc->path_file);
            $oldDoc->delete();
        }

        $dokumen = $pendaftaran->dokumen()->create([
            'jenis_dokumen' => $jenis,
            'nama_file' => $file->getClientOriginalName(),
            'path_file' => $path,
            'ukuran_file' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'status' => 'PENDING',
            'uploaded_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => "Dokumen \"{$persyaratan->nama}\" berhasil diupload.",
            'data' => $dokumen,
        ]);
    }

    /**
     * Hapus dokumen
     */
    public function deleteDokumen(Request $request, int $id, string $jenis): JsonResponse
    {
        $user = $request->user();
        $pendaftaran = Pendaftaran::where('id', $id)->where('user_id', $user->id)->first();

        if (!$pendaftaran) {
            return response()->json(['success' => false, 'message' => 'Pendaftaran tidak ditemukan.'], 404);
        }

        if (!in_array($pendaftaran->status, ['DRAFT', 'REVISI'])) {
            return response()->json([
                'success' => false,
                'message' => 'Dokumen hanya bisa dihapus saat status Draft atau Revisi.',
            ], 422);
        }

        $dokumen = $pendaftaran->dokumen()->where('jenis_dokumen', $jenis)->first();
        if (!$dokumen) {
            return response()->json(['success' => false, 'message' => 'Dokumen tidak ditemukan.'], 404);
        }

        Storage::disk('public')->delete($dokumen->path_file);
        $dokumen->delete();

        return response()->json([
            'success' => true,
            'message' => 'Dokumen berhasil dihapus.',
        ]);
    }

    /**
     * Daftar persyaratan dokumen per jenjang
     */
    public function persyaratanDokumen(string $jenjang): JsonResponse
    {
        if (!in_array($jenjang, ['TK', 'SD', 'SMP', 'SMA'])) {
            return response()->json(['success' => false, 'message' => 'Jenjang tidak valid.'], 422);
        }

        $persyaratan = PersyaratanDokumen::where('jenjang', $jenjang)
            ->orderBy('urutan')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $persyaratan,
        ]);
    }
}
