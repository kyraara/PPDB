<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gelombang;
use App\Models\Pendaftaran;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    /**
     * Semua gelombang aktif (semua jenjang)
     */
    public function gelombang(): JsonResponse
    {
        $gelombang = Gelombang::orderBy('jenjang')
            ->orderBy('nomor_gelombang')
            ->get()
            ->groupBy('jenjang')
            ->map(function ($items) {
                return $items->map(function ($g) {
                    return [
                        'id' => $g->id,
                        'nomor_gelombang' => $g->nomor_gelombang,
                        'nama' => $g->nama,
                        'tanggal_buka' => $g->tanggal_buka->format('Y-m-d'),
                        'tanggal_tutup' => $g->tanggal_tutup->format('Y-m-d'),
                        'kuota' => $g->kuota,
                        'terisi' => $g->terisi,
                        'sisa_kuota' => $g->sisaKuota(),
                        'status' => $g->status,
                    ];
                });
            });

        return response()->json([
            'success' => true,
            'data' => $gelombang,
        ]);
    }

    /**
     * Cek status pendaftaran tanpa login
     */
    public function cekStatus(string $nomorDaftar): JsonResponse
    {
        $pendaftaran = Pendaftaran::where('nomor_daftar', $nomorDaftar)
            ->with(['gelombang', 'dataSiswa'])
            ->first();

        if (!$pendaftaran) {
            return response()->json([
                'success' => false,
                'message' => 'Nomor pendaftaran tidak ditemukan. Pastikan nomor yang Anda masukkan sudah benar.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'nomor_daftar' => $pendaftaran->nomor_daftar,
                'nama_siswa' => $pendaftaran->dataSiswa?->nama_lengkap ?? '-',
                'jenjang' => $pendaftaran->jenjang,
                'gelombang' => $pendaftaran->gelombang->nama,
                'status' => $pendaftaran->status,
                'catatan' => $pendaftaran->status === 'DITOLAK' ? $pendaftaran->catatan_panitia : null,
                'submitted_at' => $pendaftaran->submitted_at?->format('d M Y H:i'),
                'reviewed_at' => $pendaftaran->reviewed_at?->format('d M Y H:i'),
            ],
        ]);
    }

    /**
     * Info statistik publik
     */
    public function statistik(): JsonResponse
    {
        $jenjangList = ['TK', 'SD', 'SMP', 'SMA'];
        $stats = [];

        foreach ($jenjangList as $jenjang) {
            $gelombangAktif = Gelombang::where('jenjang', $jenjang)
                ->where('status', 'BUKA')
                ->first();

            $totalPendaftar = Pendaftaran::where('jenjang', $jenjang)
                ->whereNotIn('status', ['DRAFT'])
                ->count();

            $stats[$jenjang] = [
                'total_pendaftar' => $totalPendaftar,
                'gelombang_aktif' => $gelombangAktif ? [
                    'nama' => $gelombangAktif->nama,
                    'kuota' => $gelombangAktif->kuota,
                    'terisi' => $gelombangAktif->terisi,
                    'sisa' => $gelombangAktif->sisaKuota(),
                    'tanggal_tutup' => $gelombangAktif->tanggal_tutup->format('d M Y'),
                ] : null,
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
