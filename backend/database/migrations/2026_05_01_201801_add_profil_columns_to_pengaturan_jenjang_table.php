<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pengaturan_jenjang', function (Blueprint $table) {
            $table->string('nama_lengkap')->nullable()->after('nama');
            $table->text('visi')->nullable()->after('deskripsi');
            $table->json('misi')->nullable()->after('visi');
            $table->json('kegiatan')->nullable()->after('misi');
            $table->json('fasilitas')->nullable()->after('kegiatan');
            $table->json('prestasi')->nullable()->after('fasilitas');
            $table->unsignedInteger('biaya_pendaftaran')->nullable()->after('prestasi');
            $table->string('keterangan_biaya')->nullable()->after('biaya_pendaftaran');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pengaturan_jenjang', function (Blueprint $table) {
            $table->dropColumn([
                'nama_lengkap', 'visi', 'misi', 'kegiatan',
                'fasilitas', 'prestasi', 'biaya_pendaftaran', 'keterangan_biaya'
            ]);
        });
    }
};
