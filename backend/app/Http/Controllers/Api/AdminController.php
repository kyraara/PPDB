<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gelombang;
use App\Models\Notifikasi;
use App\Models\Panitia;
use App\Models\Pembayaran;
use App\Models\Pendaftaran;
use App\Models\PersyaratanDokumen;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    // ─── DASHBOARD ────────────────────────────────────────────────

    public function dashboard(): JsonResponse
    {
        $jenjangList = ['TK', 'SD', 'SMP', 'SMA'];

        // Global stats
        $totalPendaftar = Pendaftaran::count();
        $diterima = Pendaftaran::where('status', 'DITERIMA')->count();
        $ditolak = Pendaftaran::where('status', 'DITOLAK')->count();
        $terdaftar = Pendaftaran::where('status', 'TERDAFTAR')->count();
        $menungguReview = Pendaftaran::whereIn('status', ['SUBMITTED', 'MENUNGGU_REVIEW'])->count();
        $menungguBayar = Pendaftaran::where('status', 'MENUNGGU_BAYAR')->count();

        // Revenue
        $totalRevenue = Pembayaran::where('status', 'SUKSES')->sum('jumlah');

        // Per jenjang breakdown
        $perJenjang = [];
        foreach ($jenjangList as $j) {
            $base = Pendaftaran::where('jenjang', $j);
            $perJenjang[] = [
                'jenjang' => $j,
                'total' => (clone $base)->count(),
                'menunggu_review' => (clone $base)->whereIn('status', ['SUBMITTED', 'MENUNGGU_REVIEW'])->count(),
                'diterima' => (clone $base)->where('status', 'DITERIMA')->count(),
                'ditolak' => (clone $base)->where('status', 'DITOLAK')->count(),
                'terdaftar' => (clone $base)->where('status', 'TERDAFTAR')->count(),
                'revisi' => (clone $base)->where('status', 'REVISI')->count(),
            ];
        }

        // Tren 7 hari terakhir
        $tren = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            $tren[] = [
                'tanggal' => $date,
                'label' => now()->subDays($i)->format('d/m'),
                'pendaftar' => Pendaftaran::whereDate('created_at', $date)->count(),
                'submit' => Pendaftaran::whereDate('submitted_at', $date)->count(),
            ];
        }

        // Pendaftar terbaru (10)
        $terbaru = Pendaftaran::with(['dataSiswa', 'gelombang'])
            ->orderByDesc('created_at')
            ->limit(10)
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'nomor_daftar' => $p->nomor_daftar,
                'nama' => $p->dataSiswa?->nama_lengkap ?? '-',
                'jenjang' => $p->jenjang,
                'status' => $p->status,
                'gelombang' => $p->gelombang?->nama,
                'created_at' => $p->created_at,
            ]);

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'total_pendaftar' => $totalPendaftar,
                    'diterima' => $diterima,
                    'ditolak' => $ditolak,
                    'terdaftar' => $terdaftar,
                    'menunggu_review' => $menungguReview,
                    'menunggu_bayar' => $menungguBayar,
                    'total_revenue' => $totalRevenue,
                ],
                'per_jenjang' => $perJenjang,
                'tren' => $tren,
                'terbaru' => $terbaru,
            ],
        ]);
    }

    // ─── GELOMBANG CRUD ───────────────────────────────────────────

    public function gelombangIndex(Request $request): JsonResponse
    {
        $query = Gelombang::query()->orderBy('jenjang')->orderBy('nomor_gelombang');

        if ($request->has('jenjang') && $request->jenjang !== 'semua') {
            $query->where('jenjang', $request->jenjang);
        }

        $gelombang = $query->get()->map(fn($g) => [
            'id' => $g->id,
            'jenjang' => $g->jenjang,
            'nomor_gelombang' => $g->nomor_gelombang,
            'nama' => $g->nama,
            'tanggal_buka' => $g->tanggal_buka,
            'tanggal_tutup' => $g->tanggal_tutup,
            'kuota' => $g->kuota,
            'terisi' => $g->terisi,
            'sisa' => $g->sisaKuota(),
            'status' => $g->status,
            'biaya' => $g->biaya,
        ]);

        return response()->json(['success' => true, 'data' => $gelombang]);
    }

    public function gelombangStore(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'jenjang' => 'required|in:TK,SD,SMP,SMA',
            'nomor_gelombang' => 'required|integer|min:1',
            'nama' => 'nullable|string|max:255',
            'tanggal_buka' => 'required|date',
            'tanggal_tutup' => 'required|date|after:tanggal_buka',
            'kuota' => 'required|integer|min:1',
            'status' => 'required|in:AKAN_DATANG,BUKA,TUTUP',
            'biaya' => 'required|integer|min:0',
        ]);

        // Check unique
        $exists = Gelombang::where('jenjang', $validated['jenjang'])
            ->where('nomor_gelombang', $validated['nomor_gelombang'])
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => "Gelombang {$validated['nomor_gelombang']} untuk jenjang {$validated['jenjang']} sudah ada.",
            ], 422);
        }

        $gelombang = Gelombang::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Gelombang berhasil ditambahkan.',
            'data' => $gelombang,
        ], 201);
    }

    public function gelombangUpdate(Request $request, int $id): JsonResponse
    {
        $gelombang = Gelombang::find($id);
        if (!$gelombang) {
            return response()->json(['success' => false, 'message' => 'Gelombang tidak ditemukan.'], 404);
        }

        $validated = $request->validate([
            'nama' => 'nullable|string|max:255',
            'tanggal_buka' => 'sometimes|date',
            'tanggal_tutup' => 'sometimes|date',
            'kuota' => 'sometimes|integer|min:1',
            'status' => 'sometimes|in:AKAN_DATANG,BUKA,TUTUP',
            'biaya' => 'sometimes|integer|min:0',
        ]);

        $gelombang->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Gelombang berhasil diperbarui.',
            'data' => $gelombang,
        ]);
    }

    public function gelombangDestroy(int $id): JsonResponse
    {
        $gelombang = Gelombang::find($id);
        if (!$gelombang) {
            return response()->json(['success' => false, 'message' => 'Gelombang tidak ditemukan.'], 404);
        }

        // Prevent delete if has pendaftaran
        if ($gelombang->pendaftaran()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Gelombang tidak bisa dihapus karena sudah ada pendaftar.',
            ], 422);
        }

        $gelombang->delete();

        return response()->json(['success' => true, 'message' => 'Gelombang berhasil dihapus.']);
    }

    // ─── PERSYARATAN DOKUMEN CRUD ────────────────────────────────

    public function persyaratanIndex(Request $request): JsonResponse
    {
        $query = PersyaratanDokumen::query()->orderBy('jenjang')->orderBy('urutan');

        if ($request->has('jenjang') && $request->jenjang !== 'semua') {
            $query->where('jenjang', $request->jenjang);
        }

        return response()->json(['success' => true, 'data' => $query->get()]);
    }

    public function persyaratanStore(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'jenjang' => 'required|in:TK,SD,SMP,SMA',
            'kode' => 'required|string|max:50',
            'nama' => 'required|string|max:255',
            'keterangan' => 'nullable|string|max:500',
            'wajib' => 'boolean',
            'format_diterima' => 'nullable|string|max:100',
            'maks_ukuran_mb' => 'nullable|integer|min:1|max:20',
            'urutan' => 'nullable|integer|min:0',
        ]);

        $persyaratan = PersyaratanDokumen::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Persyaratan dokumen berhasil ditambahkan.',
            'data' => $persyaratan,
        ], 201);
    }

    public function persyaratanUpdate(Request $request, int $id): JsonResponse
    {
        $persyaratan = PersyaratanDokumen::find($id);
        if (!$persyaratan) {
            return response()->json(['success' => false, 'message' => 'Persyaratan tidak ditemukan.'], 404);
        }

        $validated = $request->validate([
            'kode' => 'sometimes|string|max:50',
            'nama' => 'sometimes|string|max:255',
            'keterangan' => 'nullable|string|max:500',
            'wajib' => 'boolean',
            'format_diterima' => 'nullable|string|max:100',
            'maks_ukuran_mb' => 'nullable|integer|min:1|max:20',
            'urutan' => 'nullable|integer|min:0',
        ]);

        $persyaratan->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Persyaratan dokumen berhasil diperbarui.',
            'data' => $persyaratan,
        ]);
    }

    public function persyaratanDestroy(int $id): JsonResponse
    {
        $persyaratan = PersyaratanDokumen::find($id);
        if (!$persyaratan) {
            return response()->json(['success' => false, 'message' => 'Persyaratan tidak ditemukan.'], 404);
        }

        $persyaratan->delete();

        return response()->json(['success' => true, 'message' => 'Persyaratan dokumen berhasil dihapus.']);
    }

    // ─── PANITIA CRUD ─────────────────────────────────────────────

    public function panitiaIndex(): JsonResponse
    {
        $panitiaUsers = User::where('role', 'panitia')
            ->with('panitia')
            ->orderBy('nama_lengkap')
            ->get()
            ->map(fn($u) => [
                'id' => $u->id,
                'nama_lengkap' => $u->nama_lengkap,
                'email' => $u->email,
                'no_hp' => $u->no_hp,
                'jenjang' => $u->panitia?->jenjang,
                'is_active' => $u->is_active,
                'created_at' => $u->created_at,
            ]);

        return response()->json(['success' => true, 'data' => $panitiaUsers]);
    }

    public function panitiaStore(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'no_hp' => 'nullable|string|max:20',
            'jenjang' => 'required|in:TK,SD,SMP,SMA',
        ]);

        DB::beginTransaction();
        try {
            $user = User::create([
                'nama_lengkap' => $validated['nama_lengkap'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'no_hp' => $validated['no_hp'] ?? null,
                'role' => 'panitia',
                'is_active' => true,
            ]);

            Panitia::create([
                'user_id' => $user->id,
                'jenjang' => $validated['jenjang'],
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Akun panitia berhasil dibuat.',
                'data' => [
                    'id' => $user->id,
                    'nama_lengkap' => $user->nama_lengkap,
                    'email' => $user->email,
                    'jenjang' => $validated['jenjang'],
                    'is_active' => true,
                ],
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Gagal membuat akun panitia.'], 500);
        }
    }

    public function panitiaUpdate(Request $request, int $id): JsonResponse
    {
        $user = User::where('id', $id)->where('role', 'panitia')->first();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Panitia tidak ditemukan.'], 404);
        }

        $validated = $request->validate([
            'nama_lengkap' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'no_hp' => 'nullable|string|max:20',
            'jenjang' => 'sometimes|in:TK,SD,SMP,SMA',
            'is_active' => 'sometimes|boolean',
        ]);

        DB::beginTransaction();
        try {
            $user->update(collect($validated)->only(['nama_lengkap', 'email', 'no_hp', 'is_active'])->toArray());

            if (isset($validated['jenjang'])) {
                Panitia::where('user_id', $user->id)->update(['jenjang' => $validated['jenjang']]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Data panitia berhasil diperbarui.',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Gagal memperbarui data.'], 500);
        }
    }

    public function panitiaDestroy(int $id): JsonResponse
    {
        $user = User::where('id', $id)->where('role', 'panitia')->first();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Panitia tidak ditemukan.'], 404);
        }

        // Soft: deactivate instead of delete
        $user->update(['is_active' => false]);
        $user->tokens()->delete(); // revoke all tokens

        return response()->json(['success' => true, 'message' => 'Akun panitia berhasil dinonaktifkan.']);
    }

    // ─── PENDAFTAR (LINTAS JENJANG) ──────────────────────────────

    public function pendaftarIndex(Request $request): JsonResponse
    {
        $query = Pendaftaran::with(['dataSiswa', 'gelombang']);

        if ($request->has('jenjang') && $request->jenjang !== 'semua') {
            $query->where('jenjang', $request->jenjang);
        }

        if ($request->has('status') && $request->status !== 'semua') {
            $query->where('status', $request->status);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nomor_daftar', 'like', "%{$search}%")
                  ->orWhereHas('dataSiswa', fn($sq) => $sq->where('nama_lengkap', 'like', "%{$search}%"));
            });
        }

        $sortBy = $request->get('sort', 'created_at');
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

    public function pendaftarUpdateStatus(Request $request, int $id): JsonResponse
    {
        $pendaftaran = Pendaftaran::find($id);
        if (!$pendaftaran) {
            return response()->json(['success' => false, 'message' => 'Pendaftar tidak ditemukan.'], 404);
        }

        $request->validate([
            'status' => 'required|in:DRAFT,SUBMITTED,MENUNGGU_REVIEW,REVISI,DITERIMA,DITOLAK,MENUNGGU_BAYAR,TERDAFTAR,EXPIRED',
            'catatan_panitia' => 'nullable|string|max:1000',
        ]);

        // Admin can override any status
        $pendaftaran->update([
            'status' => $request->status,
            'catatan_panitia' => $request->catatan_panitia,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        // Notifikasi
        Notifikasi::create([
            'user_id' => $pendaftaran->user_id,
            'judul' => 'Status Pendaftaran Diperbarui',
            'pesan' => "Status pendaftaran Anda diubah menjadi {$request->status} oleh Admin." . ($request->catatan_panitia ? " Catatan: {$request->catatan_panitia}" : ''),
            'tipe' => 'info',
        ]);

        return response()->json([
            'success' => true,
            'message' => "Status berhasil diubah menjadi {$request->status}.",
        ]);
    }

    // ─── PEMBAYARAN ──────────────────────────────────────────────

    public function pembayaranIndex(Request $request): JsonResponse
    {
        $query = Pembayaran::with(['pendaftaran.dataSiswa', 'pendaftaran.gelombang']);

        if ($request->has('status') && $request->status !== 'semua') {
            $query->where('status', $request->status);
        }

        if ($request->has('jenjang') && $request->jenjang !== 'semua') {
            $query->whereHas('pendaftaran', fn($q) => $q->where('jenjang', $request->jenjang));
        }

        $query->orderByDesc('created_at');
        $perPage = $request->get('per_page', 15);
        $paginated = $query->paginate($perPage);

        $items = $paginated->getCollection()->map(fn($p) => [
            'id' => $p->id,
            'nomor_daftar' => $p->pendaftaran?->nomor_daftar,
            'nama' => $p->pendaftaran?->dataSiswa?->nama_lengkap ?? '-',
            'jenjang' => $p->pendaftaran?->jenjang,
            'jumlah' => $p->jumlah,
            'metode' => $p->metode,
            'status' => $p->status,
            'paid_at' => $p->paid_at,
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
}
