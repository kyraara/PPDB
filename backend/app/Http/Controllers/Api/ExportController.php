<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    /**
     * Cetak Bukti Pendaftaran (PDF)
     */
    public function cetakBuktiPendaftaran(Request $request, int $id)
    {
        $user = $request->user();
        
        $pendaftaran = Pendaftaran::where('id', $id)
            ->with(['dataSiswa', 'gelombang', 'pembayaran', 'dataOrtu'])
            ->first();

        if (!$pendaftaran) {
            return response()->json(['message' => 'Pendaftaran tidak ditemukan.'], 404);
        }

        // Pendaftar hanya bisa cetak miliknya sendiri
        if ($user->role === 'pendaftar' && $pendaftaran->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($pendaftaran->status !== 'TERDAFTAR') {
            return response()->json(['message' => 'Belum resmi terdaftar.'], 400);
        }

        $pdf = Pdf::loadView('pdf.bukti_pendaftaran', compact('pendaftaran'));
        
        return $pdf->download("Bukti_Pendaftaran_{$pendaftaran->nomor_daftar}.pdf");
    }

    /**
     * Export Pendaftar to CSV (Admin/Panitia)
     */
    public function exportPendaftarCsv(Request $request): StreamedResponse
    {
        $query = Pendaftaran::with(['dataSiswa', 'dataOrtu', 'gelombang']);

        if ($request->has('jenjang') && $request->jenjang !== 'semua') {
            $query->where('jenjang', $request->jenjang);
        }
        if ($request->has('status') && $request->status !== 'semua') {
            $query->where('status', $request->status);
        }

        $pendaftar = $query->orderBy('created_at', 'desc')->get();

        $filename = "Export_Pendaftar_" . date('Y-m-d_H-i-s') . ".csv";

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = [
            'Nomor Daftar', 'Nama Lengkap', 'NISN', 'Jenjang', 
            'Gelombang', 'Status', 'Tempat Lahir', 'Tanggal Lahir',
            'Agama', 'No HP Siswa', 'Nama Ayah', 'Nama Ibu', 'No HP Ortu',
            'Alamat Lengkap', 'Tanggal Daftar'
        ];

        $callback = function() use($pendaftar, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($pendaftar as $p) {
                $row = [
                    $p->nomor_daftar,
                    $p->dataSiswa?->nama_lengkap ?? '-',
                    $p->dataSiswa?->nisn ?? '-',
                    $p->jenjang,
                    $p->gelombang?->nama ?? "Gel. {$p->gelombang?->nomor_gelombang}",
                    $p->status,
                    $p->dataSiswa?->tempat_lahir ?? '-',
                    $p->dataSiswa?->tanggal_lahir ?? '-',
                    $p->dataSiswa?->agama ?? '-',
                    $p->dataSiswa?->no_hp ?? '-',
                    $p->dataOrtu?->nama_ayah ?? '-',
                    $p->dataOrtu?->nama_ibu ?? '-',
                    $p->dataOrtu?->no_hp ?? '-',
                    $p->dataSiswa?->alamat ?? '-',
                    $p->created_at->format('Y-m-d H:i:s'),
                ];
                fputcsv($file, $row);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Cetak Laporan (PDF) untuk Kepsek
     */
    public function exportLaporanKepsek(Request $request)
    {
        $jenjangList = ['TK', 'SD', 'SMP', 'SMA'];
        
        $stats = [
            'total' => Pendaftaran::count(),
            'diterima' => Pendaftaran::where('status', 'DITERIMA')->count(),
            'terdaftar' => Pendaftaran::where('status', 'TERDAFTAR')->count(),
        ];

        $perJenjang = [];
        foreach ($jenjangList as $j) {
            $base = Pendaftaran::where('jenjang', $j);
            $perJenjang[$j] = [
                'total' => (clone $base)->count(),
                'terdaftar' => (clone $base)->where('status', 'TERDAFTAR')->count(),
            ];
        }

        $pdf = Pdf::loadView('pdf.laporan_kepsek', compact('stats', 'perJenjang'));
        return $pdf->download("Laporan_Kepsek_" . date('Y-m-d') . ".pdf");
    }
}
