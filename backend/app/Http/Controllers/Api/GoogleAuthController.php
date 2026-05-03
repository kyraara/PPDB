<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Google_Client;

class GoogleAuthController extends Controller
{
    /**
     * Handle Google Sign-In and Registration
     */
    public function handle(Request $request): JsonResponse
    {
        $request->validate([
            'credential' => 'required|string',
            'jenjang_daftar' => 'nullable|in:TK,SD,SMP,SMA',
        ]);

        $key = 'google-login:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'success' => false,
                'message' => "Terlalu banyak percobaan login. Silakan coba lagi dalam {$seconds} detik.",
            ], 429);
        }

        try {
            $client = new Google_Client(['client_id' => env('GOOGLE_CLIENT_ID')]);
            $payload = $client->verifyIdToken($request->credential);

            if (!$payload) {
                RateLimiter::hit($key, 300);
                return response()->json([
                    'success' => false,
                    'message' => 'Token Google tidak valid.',
                ], 401);
            }

            $email = $payload['email'];
            $googleId = $payload['sub'];
            $name = $payload['name'];

            $user = User::where('email', $email)->orWhere('google_id', $googleId)->first();

            if (!$user) {
                // If not found, and no jenjang_daftar provided, it means they tried to login but don't have an account
                if (!$request->jenjang_daftar) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Akun belum terdaftar. Silakan daftar terlebih dahulu.',
                    ], 404);
                }

                // Register
                $user = User::create([
                    'nama_lengkap' => $name,
                    'email' => $email,
                    'google_id' => $googleId,
                    'role' => 'pendaftar',
                    'jenjang_daftar' => $request->jenjang_daftar,
                    'password' => null, // Password is null for google users
                    'no_hp' => null, // Can be updated later
                ]);
            } else {
                // Update google_id if it was null (they registered manually before)
                if (!$user->google_id) {
                    $user->update(['google_id' => $googleId]);
                }
                
                if (!$user->is_active) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Akun Anda telah dinonaktifkan. Hubungi panitia untuk informasi lebih lanjut.',
                    ], 403);
                }
            }

            RateLimiter::clear($key);

            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login berhasil!',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'nama_lengkap' => $user->nama_lengkap,
                        'email' => $user->email,
                        'no_hp' => $user->no_hp,
                        'role' => $user->role,
                        'jenjang_daftar' => $user->jenjang_daftar,
                    ],
                    'token' => $token,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat verifikasi Google Sign-In.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
