<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('data_ortu', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pendaftaran_id')->constrained('pendaftaran')->cascadeOnDelete();
            $table->enum('tipe', ['AYAH', 'IBU', 'WALI']);
            $table->string('nama');
            $table->string('nik', 16)->nullable();
            $table->string('pekerjaan')->nullable();
            $table->string('no_hp', 20);
            $table->string('penghasilan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_ortu');
    }
};
