<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gelombang extends Model
{
    protected $table = 'gelombang';

    protected $fillable = [
        'jenjang',
        'nomor_gelombang',
        'nama',
        'tanggal_buka',
        'tanggal_tutup',
        'kuota',
        'terisi',
        'status',
        'biaya',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_buka' => 'date',
            'tanggal_tutup' => 'date',
            'kuota' => 'integer',
            'terisi' => 'integer',
        ];
    }

    public function pendaftaran()
    {
        return $this->hasMany(Pendaftaran::class);
    }

    public function isBuka(): bool
    {
        return $this->status === 'BUKA';
    }

    public function isFull(): bool
    {
        return $this->terisi >= $this->kuota;
    }

    public function sisaKuota(): int
    {
        return max(0, $this->kuota - $this->terisi);
    }
}
