<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gelombang;
use App\Models\PengaturanJenjang;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PengaturanJenjangController extends Controller
{
    /**
     * Get all pengaturan jenjang for public
     */
    public function index(): JsonResponse
    {
        $jenjangs = PengaturanJenjang::where('aktif', true)
            ->orderBy('urutan')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $jenjangs
        ]);
    }

    /**
     * Get single jenjang detail for public (with gelombang aktif)
     */
    public function show($kode): JsonResponse
    {
        $jenjang = PengaturanJenjang::where('kode', $kode)
            ->where('aktif', true)
            ->first();

        if (!$jenjang) {
            return response()->json([
                'success' => false,
                'message' => 'Jenjang tidak ditemukan'
            ], 404);
        }

        // Get active gelombang for this jenjang
        $gelombangAktif = Gelombang::where('jenjang', $kode)
            ->where('status', 'BUKA')
            ->orderBy('nomor_gelombang', 'desc')
            ->first();

        $data = $jenjang->toArray();

        if ($gelombangAktif) {
            $data['gelombang_aktif'] = [
                'nomor' => $gelombangAktif->nomor_gelombang,
                'nama' => $gelombangAktif->nama,
                'sisa_kuota' => $gelombangAktif->sisaKuota(),
                'tanggal_tutup' => $gelombangAktif->tanggal_tutup ? \Carbon\Carbon::parse($gelombangAktif->tanggal_tutup)->format('Y-m-d') : null,
            ];
        } else {
            $data['gelombang_aktif'] = null;
        }

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * Get all pengaturan jenjang for admin
     */
    public function adminIndex(): JsonResponse
    {
        $jenjangs = PengaturanJenjang::orderBy('urutan')->get();

        return response()->json([
            'success' => true,
            'data' => $jenjangs
        ]);
    }

    /**
     * Get single jenjang detail for admin
     */
    public function adminShow($kode): JsonResponse
    {
        $jenjang = PengaturanJenjang::findOrFail($kode);

        return response()->json([
            'success' => true,
            'data' => $jenjang
        ]);
    }

    /**
     * Update pengaturan jenjang (Admin only)
     */
    public function update(Request $request, $kode): JsonResponse
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'nama_lengkap' => 'nullable|string|max:255',
            'deskripsi' => 'nullable|string',
            'highlight' => 'nullable|string|max:255',
            'visi' => 'nullable|string',
            'misi' => 'nullable|array',
            'misi.*' => 'string',
            'tujuan' => 'nullable|array',
            'tujuan.*' => 'string',
            'kegiatan' => 'nullable|array',
            'fasilitas' => 'nullable|array',
            'prestasi' => 'nullable|array',
            'prestasi.*' => 'string',
            'biaya_pendaftaran' => 'nullable|integer|min:0',
            'keterangan_biaya' => 'nullable|string|max:255',
            'aktif' => 'boolean',
            'urutan' => 'integer'
        ]);

        $jenjang = PengaturanJenjang::findOrFail($kode);
        $jenjang->update($request->only([
            'nama', 'nama_lengkap', 'deskripsi', 'highlight',
            'visi', 'misi', 'tujuan', 'kegiatan', 'fasilitas', 'prestasi',
            'biaya_pendaftaran', 'keterangan_biaya',
            'aktif', 'urutan'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Pengaturan jenjang berhasil diperbarui',
            'data' => $jenjang
        ]);
    }

    /**
     * Upload logo jenjang (Admin only)
     */
    public function uploadLogo(Request $request, $kode): JsonResponse
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,svg|max:2048',
        ]);

        $jenjang = PengaturanJenjang::findOrFail($kode);

        if ($request->hasFile('logo')) {
            // Delete old logo
            if ($jenjang->logo_path) {
                Storage::disk('public')->delete($jenjang->logo_path);
            }

            $path = $request->file('logo')->store('jenjang', 'public');
            $jenjang->update(['logo_path' => $path]);

            return response()->json([
                'success' => true,
                'message' => 'Logo berhasil diunggah',
                'data' => $jenjang
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Gagal mengunggah logo'
        ], 400);
    }

    /**
     * Upload general image (for kegiatan/fasilitas)
     */
    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,svg,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('jenjang/kegiatan', 'public');
            
            return response()->json([
                'success' => true,
                'message' => 'Gambar berhasil diunggah',
                'url' => $path
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Gagal mengunggah gambar'
        ], 400);
    }

    /**
     * Delete logo jenjang (Admin only)
     */
    public function deleteLogo($kode): JsonResponse
    {
        $jenjang = PengaturanJenjang::findOrFail($kode);

        if ($jenjang->logo_path) {
            Storage::disk('public')->delete($jenjang->logo_path);
            $jenjang->update(['logo_path' => null]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Logo berhasil dihapus',
            'data' => $jenjang
        ]);
    }
}
