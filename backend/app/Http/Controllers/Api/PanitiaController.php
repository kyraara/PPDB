<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dokumen;
use App\Models\Gelombang;
use App\Models\Notifikasi;
use App\Models\Panitia;
use App\Models\Pendaftaran;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PanitiaController extends Controller
{
    /**
     * Get jenjang yang dikelola panitia ini
     */
    private function getJenjang(Request $request): ?string
    {
        $panitia = Panitia::where('user_id', $request->user()->id)->first();
        return $panitia?->jenjang;
    }

    /**
     * Dashboard statistik
     */
    public function dashboard(Request $request): JsonResponse
    {
        $jenjang = $this->getJenjang($request);
        if (!$jenjang) {
            return response()->json(['success' => false, 'message' => 'Data panitia tidak ditemukan.'], 404);
        }

        $base = Pendaftaran::where('jenjang', $jenjang);

        // Statistik
        $stats = [
            'total' => (clone $base)->count(),
            'menunggu_review' => (clone $base)->whereIn('status', ['SUBMITTED', 'MENUNGGU_REVIEW'])->count(),
            'diterima' => (clone $base)->where('status', 'DITERIMA')->count(),
            'ditolak' => (clone $base)->where('status', 'DITOLAK')->count(),
            'revisi' => (clone $base)->where('status', 'REVISI')->count(),
            'terdaftar' => (clone $base)->where('status', 'TERDAFTAR')->count(),
            'menunggu_bayar' => (clone $base)->where('status', 'MENUNGGU_BAYAR')->count(),
            'draft' => (clone $base)->where('status', 'DRAFT')->count(),
        ];

        // Hari ini
        $stats['baru_hari_ini'] = (clone $base)->whereDate('created_at', today())->count();
        $stats['submit_hari_ini'] = (clone $base)->whereDate('submitted_at', today())->count();

        // Distribusi status untuk chart
        $distribusi = (clone $base)
            ->select('status', DB::raw('count(*) as jumlah'))
            ->groupBy('status')
            ->get()
            ->map(fn($item) => ['status' => $item->status, 'jumlah' => $item->jumlah]);

        // Pendaftar terbaru menunggu review (5)
        $terbaru = Pendaftaran::where('jenjang', $jenjang)
            ->whereIn('status', ['SUBMITTED', 'MENUNGGU_REVIEW'])
            ->with(['dataSiswa', 'gelombang'])
            ->orderByDesc('submitted_at')
            ->limit(5)
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'nomor_daftar' => $p->nomor_daftar,
                'nama' => $p->dataSiswa?->nama_lengkap ?? '-',
                'status' => $p->status,
                'gelombang' => $p->gelombang?->nama,
                'submitted_at' => $p->submitted_at,
            ]);

        // Gelombang aktif
        $gelombang = Gelombang::where('jenjang', $jenjang)
            ->where('status', 'BUKA')
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'jenjang' => $jenjang,
                'stats' => $stats,
                'distribusi' => $distribusi,
                'terbaru' => $terbaru,
                'gelombang_aktif' => $gelombang ? [
                    'nama' => $gelombang->nama,
                    'kuota' => $gelombang->kuota,
                    'terisi' => $gelombang->terisi,
                    'sisa' => $gelombang->sisaKuota(),
                    'tanggal_tutup' => $gelombang->tanggal_tutup,
                ] : null,
            ],
        ]);
    }

    /**
     * List pendaftar (filter, search, pagination)
     */
    public function pendaftarList(Request $request): JsonResponse
    {
        $jenjang = $this->getJenjang($request);
        if (!$jenjang) {
            return response()->json(['success' => false, 'message' => 'Data panitia tidak ditemukan.'], 404);
        }

        $query = Pendaftaran::where('jenjang', $jenjang)
            ->with(['dataSiswa', 'gelombang']);

        // Filter by status
        if ($request->has('status') && $request->status !== 'semua') {
            $query->where('status', $request->status);
        }

        // Search by nama atau nomor daftar
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nomor_daftar', 'like', "%{$search}%")
                  ->orWhereHas('dataSiswa', function ($sq) use ($search) {
                      $sq->where('nama_lengkap', 'like', "%{$search}%");
                  });
            });
        }

        // Sort
        $sortBy = $request->get('sort', 'submitted_at');
        $sortDir = $request->get('dir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        $perPage = $request->get('per_page', 15);
        $paginated = $query->paginate($perPage);

        $items = $paginated->getCollection()->map(fn($p) => [
            'id' => $p->id,
            'nomor_daftar' => $p->nomor_daftar,
            'nama' => $p->dataSiswa?->nama_lengkap ?? '-',
            'jenjang' => $p->jenjang,
            'status' => $p->status,
            'gelombang' => $p->gelombang?->nama,
            'submitted_at' => $p->submitted_at,
            'created_at' => $p->created_at,
        ]);

        return response()->json([
            'success' => true,
            'data' => $items,
            'pagination' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ],
        ]);
    }

    /**
     * Detail pendaftar lengkap
     */
    public function pendaftarDetail(Request $request, int $id): JsonResponse
    {
        $jenjang = $this->getJenjang($request);
        if (!$jenjang) {
            return response()->json(['success' => false, 'message' => 'Data panitia tidak ditemukan.'], 404);
        }

        $pendaftaran = Pendaftaran::where('id', $id)
            ->where('jenjang', $jenjang)
            ->with(['dataSiswa', 'dataOrtu', 'dokumen', 'gelombang', 'pembayaran', 'user', 'reviewer'])
            ->first();

        if (!$pendaftaran) {
            return response()->json(['success' => false, 'message' => 'Pendaftar tidak ditemukan atau bukan jenjang Anda.'], 404);
        }

        // Get persyaratan dokumen untuk cross-reference
        $persyaratan = \App\Models\PersyaratanDokumen::where('jenjang', $jenjang)
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
     * Ubah status pendaftar (DITERIMA / DITOLAK / REVISI)
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $jenjang = $this->getJenjang($request);
        if (!$jenjang) {
            return response()->json(['success' => false, 'message' => 'Data panitia tidak ditemukan.'], 404);
        }

        $pendaftaran = Pendaftaran::where('id', $id)
            ->where('jenjang', $jenjang)
            ->first();

        if (!$pendaftaran) {
            return response()->json(['success' => false, 'message' => 'Pendaftar tidak ditemukan.'], 404);
        }

        $request->validate([
            'status' => 'required|in:DITERIMA,DITOLAK,REVISI,MENUNGGU_REVIEW',
            'catatan_panitia' => 'nullable|string|max:1000',
        ]);

        $newStatus = $request->status;
        $catatan = $request->catatan_panitia;

        // Validasi transisi status
        $allowedFrom = ['SUBMITTED', 'MENUNGGU_REVIEW'];
        if (!in_array($pendaftaran->status, $allowedFrom) && $newStatus !== 'MENUNGGU_REVIEW') {
            return response()->json([
                'success' => false,
                'message' => "Status hanya bisa diubah dari SUBMITTED/MENUNGGU_REVIEW. Status saat ini: {$pendaftaran->status}.",
            ], 422);
        }

        // DITOLAK dan REVISI wajib catatan
        if (in_array($newStatus, ['DITOLAK', 'REVISI']) && !$catatan) {
            return response()->json([
                'success' => false,
                'message' => 'Catatan/alasan wajib diisi untuk status ' . $newStatus . '.',
            ], 422);
        }

        DB::beginTransaction();
        try {
            $pendaftaran->update([
                'status' => $newStatus,
                'catatan_panitia' => $catatan,
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
            ]);

            // Notifikasi ke pendaftar
            $notifMap = [
                'DITERIMA' => [
                    'judul' => 'Selamat! Anda Diterima 🎉',
                    'pesan' => 'Pendaftaran Anda diterima. Segera lakukan pembayaran untuk menyelesaikan proses.',
                    'tipe' => 'sukses',
                ],
                'DITOLAK' => [
                    'judul' => 'Pendaftaran Tidak Diterima',
                    'pesan' => 'Mohon maaf, pendaftaran Anda tidak diterima. Alasan: ' . ($catatan ?? '-'),
                    'tipe' => 'error',
                ],
                'REVISI' => [
                    'judul' => 'Dokumen Perlu Diperbaiki',
                    'pesan' => 'Ada dokumen yang perlu diperbaiki. Catatan: ' . ($catatan ?? '-'),
                    'tipe' => 'peringatan',
                ],
                'MENUNGGU_REVIEW' => [
                    'judul' => 'Dokumen Sedang Direview',
                    'pesan' => 'Dokumen revisi Anda sudah diterima dan sedang direview ulang.',
                    'tipe' => 'info',
                ],
            ];

            if (isset($notifMap[$newStatus])) {
                Notifikasi::create([
                    'user_id' => $pendaftaran->user_id,
                    ...$notifMap[$newStatus],
                ]);
            }

            DB::commit();

            $pendaftaran->load(['dataSiswa', 'dataOrtu', 'dokumen', 'gelombang']);

            return response()->json([
                'success' => true,
                'message' => "Status berhasil diubah menjadi {$newStatus}.",
                'data' => $pendaftaran,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengubah status.',
            ], 500);
        }
    }

    /**
     * Update status dokumen (VALID / INVALID)
     */
    public function updateDokumen(Request $request, int $id, int $dokumenId): JsonResponse
    {
        $jenjang = $this->getJenjang($request);
        if (!$jenjang) {
            return response()->json(['success' => false, 'message' => 'Data panitia tidak ditemukan.'], 404);
        }

        $pendaftaran = Pendaftaran::where('id', $id)->where('jenjang', $jenjang)->first();
        if (!$pendaftaran) {
            return response()->json(['success' => false, 'message' => 'Pendaftar tidak ditemukan.'], 404);
        }

        $dokumen = Dokumen::where('id', $dokumenId)
            ->where('pendaftaran_id', $pendaftaran->id)
            ->first();

        if (!$dokumen) {
            return response()->json(['success' => false, 'message' => 'Dokumen tidak ditemukan.'], 404);
        }

        $request->validate([
            'status' => 'required|in:VALID,INVALID,PENDING',
            'catatan' => 'nullable|string|max:500',
        ]);

        $dokumen->update([
            'status' => $request->status,
            'catatan' => $request->catatan,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Status dokumen berhasil diperbarui.',
            'data' => $dokumen,
        ]);
    }
}
