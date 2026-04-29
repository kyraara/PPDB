<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gelombang', function (Blueprint $table) {
            $table->id();
            $table->enum('jenjang', ['TK', 'SD', 'SMP', 'SMA']);
            $table->unsignedTinyInteger('nomor_gelombang');
            $table->string('nama')->nullable();
            $table->date('tanggal_buka');
            $table->date('tanggal_tutup');
            $table->unsignedInteger('kuota');
            $table->unsignedInteger('terisi')->default(0);
            $table->enum('status', ['AKAN_DATANG', 'BUKA', 'TUTUP'])->default('AKAN_DATANG');
            $table->timestamps();
            $table->unique(['jenjang', 'nomor_gelombang']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gelombang');
    }
};
