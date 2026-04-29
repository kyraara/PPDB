<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use App\Models\Pendaftaran;
use App\Services\PembayaranService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PembayaranController extends Controller
{
    public function __construct(
        private PembayaranService $pembayaranService
    ) {}

    /**
     * Inisiasi pembayaran
     */
    public function initiate(Request $request, int $pendaftaranId): JsonResponse
    {
        $user = $request->user();
        $pendaftaran = Pendaftaran::where('id', $pendaftaranId)
            ->where('user_id', $user->id)
            ->with(['gelombang', 'user', 'pembayaran'])
            ->first();

        if (!$pendaftaran) {
            return response()->json([
                'success' => false,
                'message' => 'Pendaftaran tidak ditemukan.',
            ], 404);
        }

        $result = $this->pembayaranService->initiate($pendaftaran);

        return response()->json($result, $result['success'] ? 200 : 422);
    }

    /**
     * Cek status pembayaran
     */
    public function status(Request $request, int $pendaftaranId): JsonResponse
    {
        $user = $request->user();
        $pendaftaran = Pendaftaran::where('id', $pendaftaranId)
            ->where('user_id', $user->id)
            ->first();

        if (!$pendaftaran) {
            return response()->json([
                'success' => false,
                'message' => 'Pendaftaran tidak ditemukan.',
            ], 404);
        }

        $pembayaran = $pendaftaran->pembayaran;

        if (!$pembayaran) {
            return response()->json([
                'success' => true,
                'data' => null,
                'message' => 'Belum ada pembayaran.',
            ]);
        }

        // Auto-expire check
        if ($pembayaran->status === 'PENDING' && $pembayaran->expired_at < now()) {
            $pembayaran->update(['status' => 'EXPIRED']);
            $pendaftaran->update(['status' => 'EXPIRED']);
            $pembayaran->refresh();
        }

        return response()->json([
            'success' => true,
            'data' => $pembayaran,
            'biaya' => $this->pembayaranService->getJumlahBayar($pendaftaran),
            'midtrans_client_key' => config('ppdb.midtrans.client_key'),
            'snap_url' => config('ppdb.midtrans.snap_url'),
            'payment_mode' => config('ppdb.payment_mode'),
        ]);
    }

    /**
     * Simulasi pembayaran sukses (hanya mode simulasi)
     */
    public function simulasi(Request $request, int $pendaftaranId): JsonResponse
    {
        if (config('ppdb.payment_mode') !== 'simulasi') {
            return response()->json([
                'success' => false,
                'message' => 'Mode simulasi tidak aktif.',
            ], 403);
        }

        $user = $request->user();
        $pendaftaran = Pendaftaran::where('id', $pendaftaranId)
            ->where('user_id', $user->id)
            ->first();

        if (!$pendaftaran) {
            return response()->json([
                'success' => false,
                'message' => 'Pendaftaran tidak ditemukan.',
            ], 404);
        }

        $pembayaran = $pendaftaran->pembayaran;
        if (!$pembayaran) {
            return response()->json([
                'success' => false,
                'message' => 'Belum ada pembayaran yang diinisiasi.',
            ], 422);
        }

        $result = $this->pembayaranService->simulasiBayar($pembayaran);
        return response()->json($result, $result['success'] ? 200 : 422);
    }

    /**
     * Info ringkasan pembayaran (biaya, batas waktu, dsb)
     */
    public function info(Request $request, int $pendaftaranId): JsonResponse
    {
        $user = $request->user();
        $pendaftaran = Pendaftaran::where('id', $pendaftaranId)
            ->where('user_id', $user->id)
            ->with(['gelombang', 'pembayaran', 'dataSiswa'])
            ->first();

        if (!$pendaftaran) {
            return response()->json([
                'success' => false,
                'message' => 'Pendaftaran tidak ditemukan.',
            ], 404);
        }

        $biaya = $this->pembayaranService->getJumlahBayar($pendaftaran);

        return response()->json([
            'success' => true,
            'data' => [
                'pendaftaran' => $pendaftaran,
                'biaya' => $biaya,
                'biaya_formatted' => 'Rp ' . number_format($biaya, 0, ',', '.'),
                'batas_bayar_jam' => config('ppdb.batas_bayar_jam', 24),
                'payment_mode' => config('ppdb.payment_mode'),
                'midtrans_client_key' => config('ppdb.midtrans.client_key'),
                'snap_url' => config('ppdb.midtrans.snap_url'),
            ],
        ]);
    }

    /**
     * Webhook dari Midtrans
     */
    public function webhook(Request $request): JsonResponse
    {
        $payload = $request->all();

        // Verify signature (Midtrans)
        $serverKey = config('ppdb.midtrans.server_key');
        if ($serverKey) {
            $orderId = $payload['order_id'] ?? '';
            $statusCode = $payload['status_code'] ?? '';
            $grossAmount = $payload['gross_amount'] ?? '';
            $signature = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

            if (($payload['signature_key'] ?? '') !== $signature) {
                return response()->json(['success' => false, 'message' => 'Invalid signature'], 403);
            }
        }

        $result = $this->pembayaranService->handleWebhook($payload);
        return response()->json($result);
    }

    /**
     * Sinkronisasi status dari Midtrans (berguna untuk localhost tanpa webhook)
     */
    public function sync(Request $request): JsonResponse
    {
        $user = $request->user();
        $pendaftaran = Pendaftaran::where('user_id', $user->id)
            ->with('pembayaran')
            ->first();

        if ($pendaftaran && $pendaftaran->pembayaran && $pendaftaran->pembayaran->status === 'PENDING') {
            $this->pembayaranService->syncMidtrans($pendaftaran->pembayaran);
        }

        return response()->json(['success' => true]);
    }
}
