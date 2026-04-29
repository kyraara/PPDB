<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class ProfilController extends Controller
{
    /**
     * Get profil user
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $pendaftaran = $user->pendaftaran()
            ->with(['gelombang'])
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'nama_lengkap' => $user->nama_lengkap,
                    'email' => $user->email,
                    'no_hp' => $user->no_hp,
                    'role' => $user->role,
                    'jenjang_daftar' => $user->jenjang_daftar,
                    'created_at' => $user->created_at,
                ],
                'pendaftaran' => $pendaftaran ? [
                    'nomor_daftar' => $pendaftaran->nomor_daftar,
                    'status' => $pendaftaran->status,
                    'jenjang' => $pendaftaran->jenjang,
                    'gelombang' => $pendaftaran->gelombang?->nama,
                    'submitted_at' => $pendaftaran->submitted_at,
                ] : null,
            ],
        ]);
    }

    /**
     * Update profil (nama, no_hp)
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'no_hp' => 'nullable|string|max:20',
        ], [
            'nama_lengkap.required' => 'Nama lengkap wajib diisi.',
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'nama_lengkap' => $user->nama_lengkap,
                    'email' => $user->email,
                    'no_hp' => $user->no_hp,
                    'role' => $user->role,
                    'jenjang_daftar' => $user->jenjang_daftar,
                ],
            ],
        ]);
    }

    /**
     * Ganti password
     */
    public function changePassword(Request $request): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'password_lama' => 'required|string',
            'password_baru' => ['required', 'string', Password::min(8), 'confirmed'],
        ], [
            'password_lama.required' => 'Password lama wajib diisi.',
            'password_baru.required' => 'Password baru wajib diisi.',
            'password_baru.min' => 'Password baru minimal 8 karakter.',
            'password_baru.confirmed' => 'Konfirmasi password tidak cocok.',
        ]);

        if (!Hash::check($request->password_lama, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Password lama tidak sesuai.',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->password_baru),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil diubah.',
        ]);
    }
}
