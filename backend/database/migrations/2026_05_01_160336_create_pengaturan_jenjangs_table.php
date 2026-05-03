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
        Schema::create('pengaturan_jenjang', function (Blueprint $table) {
            $table->string('kode', 10)->primary(); // 'TK', 'SD', 'SMP', 'SMA'
            $table->string('nama');
            $table->text('deskripsi')->nullable();
            $table->string('highlight')->nullable();
            $table->string('logo_path')->nullable();
            $table->integer('urutan')->default(0);
            $table->boolean('aktif')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengaturan_jenjang');
    }
};
