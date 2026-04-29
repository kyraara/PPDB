<?php

namespace Database\Seeders;

use App\Models\Gelombang;
use Illuminate\Database\Seeder;

class GelombangSeeder extends Seeder
{
    public function run(): void
    {
        $jenjangList = ['TK', 'SD', 'SMP', 'SMA'];

        foreach ($jenjangList as $jenjang) {
            // Gelombang 1 — sudah tutup
            Gelombang::create([
                'jenjang' => $jenjang,
                'nomor_gelombang' => 1,
                'nama' => "Gelombang 1 - Jalur Reguler {$jenjang}",
                'tanggal_buka' => '2026-01-10',
                'tanggal_tutup' => '2026-02-28',
                'kuota' => $jenjang === 'TK' ? 30 : ($jenjang === 'SD' ? 60 : 40),
                'terisi' => $jenjang === 'TK' ? 12 : ($jenjang === 'SD' ? 35 : 20),
                'status' => 'TUTUP',
            ]);

            // Gelombang 2 — sedang buka
            Gelombang::create([
                'jenjang' => $jenjang,
                'nomor_gelombang' => 2,
                'nama' => "Gelombang 2 - Jalur Reguler {$jenjang}",
                'tanggal_buka' => '2026-03-01',
                'tanggal_tutup' => '2026-06-30',
                'kuota' => $jenjang === 'TK' ? 20 : ($jenjang === 'SD' ? 40 : 30),
                'terisi' => 0,
                'status' => 'BUKA',
            ]);

            // Gelombang 3 — akan datang
            Gelombang::create([
                'jenjang' => $jenjang,
                'nomor_gelombang' => 3,
                'nama' => "Gelombang 3 - Jalur Khusus {$jenjang}",
                'tanggal_buka' => '2026-07-01',
                'tanggal_tutup' => '2026-07-31',
                'kuota' => $jenjang === 'TK' ? 10 : 20,
                'terisi' => 0,
                'status' => 'AKAN_DATANG',
            ]);
        }
    }
}
