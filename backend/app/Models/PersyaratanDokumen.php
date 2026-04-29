<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersyaratanDokumen extends Model
{
    protected $table = 'persyaratan_dokumen';

    protected $fillable = [
        'jenjang',
        'kode',
        'nama',
        'keterangan',
        'wajib',
        'format_diterima',
        'maks_ukuran_mb',
        'urutan',
    ];

    protected function casts(): array
    {
        return [
            'wajib' => 'boolean',
            'maks_ukuran_mb' => 'integer',
            'urutan' => 'integer',
        ];
    }
}
