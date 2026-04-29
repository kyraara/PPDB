<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pendaftaran', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_daftar', 30)->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('gelombang_id')->constrained('gelombang');
            $table->enum('jenjang', ['TK', 'SD', 'SMP', 'SMA']);
            $table->enum('status', [
                'DRAFT', 'SUBMITTED', 'MENUNGGU_REVIEW',
                'REVISI', 'DITERIMA', 'DITOLAK',
                'MENUNGGU_BAYAR', 'TERDAFTAR', 'EXPIRED'
            ])->default('DRAFT');
            $table->text('catatan_panitia')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pendaftaran');
    }
};
