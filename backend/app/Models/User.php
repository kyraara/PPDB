<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nama_lengkap',
        'email',
        'google_id',
        'password',
        'no_hp',
        'role',
        'jenjang_daftar',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    // --- Relationships ---

    public function panitia()
    {
        return $this->hasOne(Panitia::class);
    }

    public function pendaftaran()
    {
        return $this->hasMany(Pendaftaran::class);
    }

    public function notifikasi()
    {
        return $this->hasMany(Notifikasi::class);
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class);
    }

    // --- Helpers ---

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isPanitia(): bool
    {
        return $this->role === 'panitia';
    }

    public function isPendaftar(): bool
    {
        return $this->role === 'pendaftar';
    }

    public function isKepalaSekolah(): bool
    {
        return $this->role === 'kepala_sekolah';
    }
}
