<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DataOrtu extends Model
{
    protected $table = 'data_ortu';

    protected $fillable = [
        'pendaftaran_id',
        'tipe',
        'nama',
        'nik',
        'pekerjaan',
        'no_hp',
        'penghasilan',
    ];

    public function pendaftaran()
    {
        return $this->belongsTo(Pendaftaran::class);
    }
}
