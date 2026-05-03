<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PengaturanJenjangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'kode' => 'TK',
                'nama' => 'Taman Kanak-Kanak',
                'deskripsi' => 'Usia 4-6 tahun. Pendaftaran langsung diterima tanpa seleksi berkas.',
                'highlight' => 'Langsung Diterima',
                'urutan' => 1,
            ],
            [
                'kode' => 'SD',
                'nama' => 'Sekolah Dasar',
                'deskripsi' => 'Usia 6-7 tahun. Seleksi berkas oleh panitia sebelum diterima.',
                'highlight' => 'Seleksi Berkas',
                'urutan' => 2,
            ],
            [
                'kode' => 'SMP',
                'nama' => 'Sekolah Menengah Pertama',
                'deskripsi' => 'Lulusan SD/MI. Seleksi berkas termasuk rapor semester 1-5.',
                'highlight' => 'Seleksi Berkas',
                'urutan' => 3,
            ],
            [
                'kode' => 'SMA',
                'nama' => 'Sekolah Menengah Atas',
                'deskripsi' => 'Lulusan SMP/MTs. Seleksi berkas termasuk rapor dan SKBB.',
                'highlight' => 'Seleksi Berkas',
                'urutan' => 4,
            ]
        ];

        foreach ($data as $item) {
            \App\Models\PengaturanJenjang::updateOrCreate(
                ['kode' => $item['kode']],
                $item
            );
        }
    }
}
