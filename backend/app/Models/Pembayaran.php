<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pembayaran extends Model
{
    protected $table = 'pembayaran';

    protected $fillable = [
        'pendaftaran_id',
        'jumlah',
        'metode',
        'status',
        'transaction_id',
        'snap_token',
        'payment_url',
        'expired_at',
        'paid_at',
        'raw_response',
    ];

    protected function casts(): array
    {
        return [
            'jumlah' => 'integer',
            'expired_at' => 'datetime',
            'paid_at' => 'datetime',
            'raw_response' => 'array',
        ];
    }

    public function pendaftaran()
    {
        return $this->belongsTo(Pendaftaran::class);
    }
}
