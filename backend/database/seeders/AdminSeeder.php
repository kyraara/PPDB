<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'nama_lengkap' => 'Administrator PPDB',
            'email' => 'admin@ppdb.test',
            'password' => bcrypt('password'),
            'no_hp' => '081234567890',
            'role' => 'admin',
            'is_active' => true,
        ]);

        User::create([
            'nama_lengkap' => 'Kepala Sekolah',
            'email' => 'kepsek@ppdb.test',
            'password' => bcrypt('password'),
            'no_hp' => '081234567891',
            'role' => 'kepala_sekolah',
            'is_active' => true,
        ]);

        // Panitia per jenjang
        $jenjangList = ['TK', 'SD', 'SMP', 'SMA'];
        foreach ($jenjangList as $jenjang) {
            $user = User::create([
                'nama_lengkap' => "Panitia {$jenjang}",
                'email' => strtolower("panitia.{$jenjang}@ppdb.test"),
                'password' => bcrypt('password'),
                'no_hp' => '08123456789' . array_search($jenjang, $jenjangList),
                'role' => 'panitia',
                'is_active' => true,
            ]);

            \App\Models\Panitia::create([
                'user_id' => $user->id,
                'jenjang' => $jenjang,
            ]);
        }
    }
}
