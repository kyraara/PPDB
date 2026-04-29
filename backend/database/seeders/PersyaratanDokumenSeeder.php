<?php

namespace Database\Seeders;

use App\Models\PersyaratanDokumen;
use Illuminate\Database\Seeder;

class PersyaratanDokumenSeeder extends Seeder
{
    public function run(): void
    {
        $dokumenBase = [
            ['kode' => 'akta_lahir', 'nama' => 'Akta Kelahiran', 'keterangan' => 'Scan akta kelahiran asli (PDF/JPG)', 'maks_ukuran_mb' => 2],
            ['kode' => 'kk', 'nama' => 'Kartu Keluarga', 'keterangan' => 'Scan KK terbaru (PDF/JPG)', 'maks_ukuran_mb' => 2],
            ['kode' => 'foto', 'nama' => 'Foto Calon Siswa 3x4', 'keterangan' => 'Foto berwarna latar merah/biru (JPG)', 'format_diterima' => 'jpg,jpeg,png', 'maks_ukuran_mb' => 1],
        ];

        $dokumenPerJenjang = [
            'TK' => [],
            'SD' => [
                ['kode' => 'ijazah_tk', 'nama' => 'Ijazah / SKTL TK', 'keterangan' => 'Ijazah TK atau Surat Keterangan Tamat (PDF/JPG)'],
            ],
            'SMP' => [
                ['kode' => 'ijazah_sd', 'nama' => 'Ijazah / SKTL SD', 'keterangan' => 'Ijazah SD atau Surat Keterangan Tamat (PDF/JPG)'],
                ['kode' => 'rapor_sd', 'nama' => 'Rapor SD (Semester 1-5)', 'keterangan' => 'Scan rapor semester 1 sampai 5 dalam satu file PDF', 'maks_ukuran_mb' => 5],
            ],
            'SMA' => [
                ['kode' => 'ijazah_smp', 'nama' => 'Ijazah / SKTL SMP', 'keterangan' => 'Ijazah SMP atau Surat Keterangan Tamat (PDF/JPG)'],
                ['kode' => 'rapor_smp', 'nama' => 'Rapor SMP (Semester 1-5)', 'keterangan' => 'Scan rapor semester 1 sampai 5 dalam satu file PDF', 'maks_ukuran_mb' => 5],
                ['kode' => 'skbb', 'nama' => 'Surat Berkelakuan Baik', 'keterangan' => 'Dari sekolah asal (opsional)', 'wajib' => false],
            ],
        ];

        $jenjangList = ['TK', 'SD', 'SMP', 'SMA'];

        foreach ($jenjangList as $jenjang) {
            $urutan = 1;

            // Dokumen dasar (semua jenjang)
            foreach ($dokumenBase as $dok) {
                PersyaratanDokumen::create(array_merge($dok, [
                    'jenjang' => $jenjang,
                    'wajib' => true,
                    'format_diterima' => $dok['format_diterima'] ?? 'pdf,jpg,jpeg,png',
                    'maks_ukuran_mb' => $dok['maks_ukuran_mb'] ?? 2,
                    'urutan' => $urutan++,
                ]));
            }

            // Dokumen khusus jenjang
            foreach ($dokumenPerJenjang[$jenjang] as $dok) {
                PersyaratanDokumen::create(array_merge([
                    'wajib' => true,
                    'format_diterima' => 'pdf,jpg,jpeg,png',
                    'maks_ukuran_mb' => 2,
                ], $dok, [
                    'jenjang' => $jenjang,
                    'urutan' => $urutan++,
                ]));
            }
        }
    }
}
