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
            $table->json('tujuan')->nullable()->after('misi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pengaturan_jenjang', function (Blueprint $table) {
            $table->dropColumn('tujuan');
        });
    }
};

