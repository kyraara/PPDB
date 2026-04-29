<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('persyaratan_dokumen', function (Blueprint $table) {
            $table->id();
            $table->enum('jenjang', ['TK', 'SD', 'SMP', 'SMA']);
            $table->string('kode');
            $table->string('nama');
            $table->string('keterangan')->nullable();
            $table->boolean('wajib')->default(true);
            $table->string('format_diterima')->default('pdf,jpg,jpeg,png');
            $table->unsignedInteger('maks_ukuran_mb')->default(2);
            $table->unsignedTinyInteger('urutan')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('persyaratan_dokumen');
    }
};
