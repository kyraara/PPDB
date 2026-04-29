<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotifikasiController extends Controller
{
    /**
     * List notifikasi user (paginated)
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $limit = $request->get('limit', 10);

        $notifikasi = Notifikasi::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->paginate($limit);

        $unreadCount = Notifikasi::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'success' => true,
            'data' => $notifikasi->items(),
            'unread_count' => $unreadCount,
            'pagination' => [
                'current_page' => $notifikasi->currentPage(),
                'last_page' => $notifikasi->lastPage(),
                'total' => $notifikasi->total(),
            ],
        ]);
    }

    /**
     * Tandai notifikasi sudah dibaca
     */
    public function markRead(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $notifikasi = Notifikasi::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$notifikasi) {
            return response()->json([
                'success' => false,
                'message' => 'Notifikasi tidak ditemukan.',
            ], 404);
        }

        $notifikasi->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Notifikasi ditandai sudah dibaca.',
        ]);
    }

    /**
     * Tandai semua notifikasi sudah dibaca
     */
    public function markAllRead(Request $request): JsonResponse
    {
        $user = $request->user();

        Notifikasi::where('user_id', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Semua notifikasi ditandai sudah dibaca.',
        ]);
    }
}
