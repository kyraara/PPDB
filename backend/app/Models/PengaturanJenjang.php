<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PengaturanJenjang extends Model
{
    protected $table = 'pengaturan_jenjang';
    protected $primaryKey = 'kode';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'kode', 'nama', 'nama_lengkap', 'deskripsi', 'highlight', 'logo_path',
        'visi', 'misi', 'tujuan', 'kegiatan', 'fasilitas', 'prestasi',
        'biaya_pendaftaran', 'keterangan_biaya',
        'urutan', 'aktif'
    ];

    protected $casts = [
        'misi' => 'array',
        'tujuan' => 'array',
        'kegiatan' => 'array',
        'fasilitas' => 'array',
        'prestasi' => 'array',
        'aktif' => 'boolean',
        'biaya_pendaftaran' => 'integer',
    ];
}
