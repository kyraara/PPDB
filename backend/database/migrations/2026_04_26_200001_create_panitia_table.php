<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('panitia', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('jenjang', ['TK', 'SD', 'SMP', 'SMA']);
            $table->timestamps();
            $table->unique(['user_id', 'jenjang']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('panitia');
    }
};
