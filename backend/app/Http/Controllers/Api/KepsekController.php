<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gelombang;
use App\Models\Pembayaran;
use App\Models\Pendaftaran;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class KepsekController extends Controller
{
    /**
     * Dashboard statistik lengkap semua jenjang (read-only)
     */
    public function dashboard(): JsonResponse
    {
        $jenjangList = ['TK', 'SD', 'SMP', 'SMA'];

        // Global summary
        $totalPendaftar = Pendaftaran::count();
        $totalDiterima = Pendaftaran::where('status', 'DITERIMA')->count();
        $totalTerdaftar = Pendaftaran::where('status', 'TERDAFTAR')->count();
        $totalDitolak = Pendaftaran::where('status', 'DITOLAK')->count();
        $totalRevenue = Pembayaran::where('status', 'SUKSES')->sum('jumlah');

        // Per jenjang stats
        $perJenjang = [];
        foreach ($jenjangList as $j) {
            $base = Pendaftaran::where('jenjang', $j);
            $perJenjang[] = [
                'jenjang' => $j,
                'total' => (clone $base)->count(),
                'diterima' => (clone $base)->where('status', 'DITERIMA')->count(),
                'ditolak' => (clone $base)->where('status', 'DITOLAK')->count(),
                'terdaftar' => (clone $base)->where('status', 'TERDAFTAR')->count(),
                'menunggu_review' => (clone $base)->whereIn('status', ['SUBMITTED', 'MENUNGGU_REVIEW'])->count(),
                'revisi' => (clone $base)->where('status', 'REVISI')->count(),
                'menunggu_bayar' => (clone $base)->where('status', 'MENUNGGU_BAYAR')->count(),
            ];
        }

        // Distribusi status global
        $distribusi = Pendaftaran::select('status', DB::raw('count(*) as jumlah'))
            ->groupBy('status')
            ->get()
            ->map(fn($item) => ['status' => $item->status, 'jumlah' => $item->jumlah]);

        // Gelombang overview (semua)
        $gelombang = Gelombang::orderBy('jenjang')->orderBy('nomor_gelombang')->get()->map(fn($g) => [
            'id' => $g->id,
            'jenjang' => $g->jenjang,
            'nama' => $g->nama,
            'kuota' => $g->kuota,
            'terisi' => $g->terisi,
            'sisa' => $g->sisaKuota(),
            'status' => $g->status,
            'tanggal_buka' => $g->tanggal_buka,
            'tanggal_tutup' => $g->tanggal_tutup,
        ]);

        // Tren mingguan (4 minggu terakhir)
        $trenMingguan = [];
        for ($i = 3; $i >= 0; $i--) {
            $start = now()->subWeeks($i)->startOfWeek();
            $end = now()->subWeeks($i)->endOfWeek();
            $trenMingguan[] = [
                'minggu' => 'W' . $start->weekOfYear,
                'label' => $start->format('d/m') . ' - ' . $end->format('d/m'),
                'pendaftar' => Pendaftaran::whereBetween('created_at', [$start, $end])->count(),
                'diterima' => Pendaftaran::whereBetween('reviewed_at', [$start, $end])->where('status', 'DITERIMA')->count(),
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'total_pendaftar' => $totalPendaftar,
                    'total_diterima' => $totalDiterima,
                    'total_terdaftar' => $totalTerdaftar,
                    'total_ditolak' => $totalDitolak,
                    'total_revenue' => $totalRevenue,
                ],
                'per_jenjang' => $perJenjang,
                'distribusi' => $distribusi,
                'gelombang' => $gelombang,
                'tren_mingguan' => $trenMingguan,
            ],
        ]);
    }
}
