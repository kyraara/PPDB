<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pendaftaran extends Model
{
    use SoftDeletes;

    protected $table = 'pendaftaran';

    protected $fillable = [
        'nomor_daftar',
        'user_id',
        'gelombang_id',
        'jenjang',
        'status',
        'catatan_panitia',
        'reviewed_by',
        'reviewed_at',
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'reviewed_at' => 'datetime',
            'submitted_at' => 'datetime',
        ];
    }

    // --- Relationships ---

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function gelombang()
    {
        return $this->belongsTo(Gelombang::class);
    }

    public function dataSiswa()
    {
        return $this->hasOne(DataSiswa::class);
    }

    public function dataOrtu()
    {
        return $this->hasMany(DataOrtu::class);
    }

    public function dokumen()
    {
        return $this->hasMany(Dokumen::class);
    }

    public function pembayaran()
    {
        return $this->hasOne(Pembayaran::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class);
    }

    // --- Helpers ---

    public static function generateNomorDaftar(string $jenjang, int $gelombangNomor): string
    {
        $tahun = date('Y');
        $lastNumber = static::where('jenjang', $jenjang)
            ->whereYear('created_at', $tahun)
            ->count();

        return sprintf('PPDB-%s-%s-%d-%04d', $jenjang, $tahun, $gelombangNomor, $lastNumber + 1);
    }
}
