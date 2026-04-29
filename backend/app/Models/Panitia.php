<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Panitia extends Model
{
    protected $table = 'panitia';

    protected $fillable = [
        'user_id',
        'jenjang',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
