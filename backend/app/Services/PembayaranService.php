<?php

namespace App\Services;

use App\Models\Notifikasi;
use App\Models\Pembayaran;
use App\Models\Pendaftaran;
use Illuminate\Support\Facades\DB;

class PembayaranService
{
    /**
     * Inisiasi pembayaran untuk pendaftaran yang DITERIMA
     */
    public function initiate(Pendaftaran $pendaftaran): array
    {
        // Validasi status
        if (!in_array($pendaftaran->status, ['DITERIMA', 'MENUNGGU_BAYAR'])) {
            return [
                'success' => false,
                'message' => 'Pembayaran hanya bisa dilakukan setelah diterima.',
            ];
        }

        // Cek existing pembayaran
        $existing = $pendaftaran->pembayaran;
        if ($existing && $existing->status === 'SUKSES') {
            return [
                'success' => false,
                'message' => 'Pembayaran sudah berhasil.',
            ];
        }

        // Jika ada pembayaran PENDING yang belum expired, return yang sama
        if ($existing && $existing->status === 'PENDING' && $existing->expired_at > now()) {
            return [
                'success' => true,
                'data' => $existing,
                'message' => 'Pembayaran sudah dibuat sebelumnya.',
            ];
        }

        // Hapus pembayaran lama jika expired/gagal
        if ($existing && in_array($existing->status, ['EXPIRED', 'GAGAL'])) {
            $existing->delete();
        }

        $jumlah = $this->getJumlahBayar($pendaftaran);
        $batasJam = config('ppdb.batas_bayar_jam', 24);
        $mode = config('ppdb.payment_mode', 'simulasi');

        DB::beginTransaction();
        try {
            $pembayaran = Pembayaran::create([
                'pendaftaran_id' => $pendaftaran->id,
                'jumlah' => $jumlah,
                'status' => 'PENDING',
                'expired_at' => now()->addHours($batasJam),
            ]);

            // Update status pendaftaran ke MENUNGGU_BAYAR jika belum
            if ($pendaftaran->status === 'DITERIMA') {
                $pendaftaran->update(['status' => 'MENUNGGU_BAYAR']);
            }

            // Jika mode Midtrans Sandbox, buat snap token
            $snapToken = null;
            $paymentUrl = null;

            if ($mode === 'sandbox' && config('ppdb.midtrans.server_key')) {
                $snapData = $this->createMidtransTransaction($pendaftaran, $pembayaran);
                if ($snapData) {
                    $snapToken = $snapData['token'] ?? null;
                    $paymentUrl = $snapData['redirect_url'] ?? null;
                    $pembayaran->update([
                        'snap_token' => $snapToken,
                        'payment_url' => $paymentUrl,
                        'transaction_id' => $snapData['order_id'] ?? ('PPDB-' . $pendaftaran->nomor_daftar),
                    ]);
                }
            } else {
                // Simulasi mode — generate fake transaction ID
                $pembayaran->update([
                    'transaction_id' => 'SIM-' . $pendaftaran->nomor_daftar . '-' . time(),
                ]);
            }

            DB::commit();

            return [
                'success' => true,
                'data' => $pembayaran->fresh(),
                'snap_token' => $snapToken,
                'payment_url' => $paymentUrl,
                'mode' => $mode,
                'message' => 'Pembayaran berhasil dibuat.',
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'success' => false,
                'message' => 'Gagal membuat pembayaran: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Simulasi pembayaran sukses (mode simulasi)
     */
    public function simulasiBayar(Pembayaran $pembayaran): array
    {
        if ($pembayaran->status !== 'PENDING') {
            return [
                'success' => false,
                'message' => 'Pembayaran tidak dalam status pending.',
            ];
        }

        if ($pembayaran->expired_at && $pembayaran->expired_at < now()) {
            $pembayaran->update(['status' => 'EXPIRED']);
            $pembayaran->pendaftaran->update(['status' => 'EXPIRED']);
            return [
                'success' => false,
                'message' => 'Pembayaran sudah kadaluarsa.',
            ];
        }

        DB::beginTransaction();
        try {
            $pembayaran->update([
                'status' => 'SUKSES',
                'metode' => 'simulasi',
                'paid_at' => now(),
            ]);

            $pendaftaran = $pembayaran->pendaftaran;
            $pendaftaran->update(['status' => 'TERDAFTAR']);

            // Buat notifikasi
            Notifikasi::create([
                'user_id' => $pendaftaran->user_id,
                'judul' => 'Pembayaran Berhasil! 🎉',
                'pesan' => 'Pembayaran biaya pendaftaran sebesar Rp ' . number_format($pembayaran->jumlah, 0, ',', '.') . ' telah berhasil. Anda resmi terdaftar sebagai peserta didik baru.',
                'tipe' => 'sukses',
            ]);

            DB::commit();

            return [
                'success' => true,
                'data' => $pembayaran->fresh(),
                'message' => 'Pembayaran berhasil!',
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'success' => false,
                'message' => 'Gagal memproses pembayaran.',
            ];
        }
    }

    /**
     * Handle Midtrans webhook notification
     */
    public function handleWebhook(array $payload): array
    {
        $transactionId = $payload['order_id'] ?? null;
        $transactionStatus = $payload['transaction_status'] ?? null;
        $fraudStatus = $payload['fraud_status'] ?? null;

        if (!$transactionId) {
            return ['success' => false, 'message' => 'Invalid payload'];
        }

        $pembayaran = Pembayaran::where('transaction_id', $transactionId)->first();
        if (!$pembayaran) {
            return ['success' => false, 'message' => 'Transaction not found'];
        }

        DB::beginTransaction();
        try {
            if ($transactionStatus === 'capture' || $transactionStatus === 'settlement') {
                if ($fraudStatus === 'accept' || !$fraudStatus) {
                    $pembayaran->update([
                        'status' => 'SUKSES',
                        'metode' => $payload['payment_type'] ?? 'unknown',
                        'paid_at' => now(),
                        'raw_response' => $payload,
                    ]);
                    $pembayaran->pendaftaran->update(['status' => 'TERDAFTAR']);

                    Notifikasi::create([
                        'user_id' => $pembayaran->pendaftaran->user_id,
                        'judul' => 'Pembayaran Berhasil! 🎉',
                        'pesan' => 'Pembayaran sebesar Rp ' . number_format($pembayaran->jumlah, 0, ',', '.') . ' berhasil. Anda resmi terdaftar!',
                        'tipe' => 'sukses',
                    ]);
                }
            } elseif (in_array($transactionStatus, ['deny', 'cancel', 'failure'])) {
                $pembayaran->update([
                    'status' => 'GAGAL',
                    'raw_response' => $payload,
                ]);
            } elseif ($transactionStatus === 'expire') {
                $pembayaran->update([
                    'status' => 'EXPIRED',
                    'raw_response' => $payload,
                ]);
                $pembayaran->pendaftaran->update(['status' => 'EXPIRED']);
            }

            DB::commit();
            return ['success' => true];
        } catch (\Exception $e) {
            DB::rollBack();
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Manual sync status dari Midtrans (berguna saat webhook gagal/local development)
     */
    public function syncMidtrans(Pembayaran $pembayaran): array
    {
        if (!config('ppdb.midtrans.server_key') || !$pembayaran->transaction_id) {
            return ['success' => false, 'message' => 'Konfigurasi tidak lengkap atau ID transaksi kosong'];
        }

        try {
            \Midtrans\Config::$serverKey = config('ppdb.midtrans.server_key');
            \Midtrans\Config::$isProduction = config('ppdb.midtrans.is_production');

            // Ambil status terbaru dari Midtrans
            $statusObj = \Midtrans\Transaction::status($pembayaran->transaction_id);
            
            // Convert stdClass ke array agar bisa diproses oleh handleWebhook
            $payload = json_decode(json_encode($statusObj), true);

            return $this->handleWebhook($payload);
        } catch (\Exception $e) {
            // Jika transaksi tidak ditemukan di Midtrans (misal karena belum dibayar sama sekali)
            return ['success' => false, 'message' => 'Midtrans: ' . $e->getMessage()];
        }
    }

    /**
     * Cek dan auto-expire pembayaran yang lewat batas
     */
    public function checkExpired(): void
    {
        $expired = Pembayaran::where('status', 'PENDING')
            ->where('expired_at', '<', now())
            ->get();

        /** @var \App\Models\Pembayaran $pembayaran */
        foreach ($expired as $pembayaran) {
            $pembayaran->update(['status' => 'EXPIRED']);
            $pembayaran->pendaftaran->update(['status' => 'EXPIRED']);

            Notifikasi::create([
                'user_id' => $pembayaran->pendaftaran->user_id,
                'judul' => 'Pembayaran Kadaluarsa',
                'pesan' => 'Batas waktu pembayaran telah lewat. Hubungi panitia untuk informasi lebih lanjut.',
                'tipe' => 'peringatan',
            ]);
        }
    }

    /**
     * Get jumlah bayar per jenjang / gelombang
     */
    public function getJumlahBayar(Pendaftaran $pendaftaran): int
    {
        // Prioritize gelombang cost if available, fallback to config
        if ($pendaftaran->gelombang && $pendaftaran->gelombang->biaya > 0) {
            return $pendaftaran->gelombang->biaya;
        }
        return config("ppdb.biaya_pendaftaran.{$pendaftaran->jenjang}", 0);
    }

    /**
     * Create Midtrans Snap transaction (sandbox mode)
     * Supports: Bank Transfer, E-Wallet (GoPay, ShopeePay), QRIS
     */
    private function createMidtransTransaction(Pendaftaran $pendaftaran, Pembayaran $pembayaran): ?array
    {
        try {
            \Midtrans\Config::$serverKey = config('ppdb.midtrans.server_key');
            \Midtrans\Config::$isProduction = config('ppdb.midtrans.is_production');
            \Midtrans\Config::$isSanitized = true;
            \Midtrans\Config::$is3ds = true;

            $user = $pendaftaran->user;
            $orderId = 'PPDB-' . $pendaftaran->nomor_daftar . '-' . time();

            $params = [
                'transaction_details' => [
                    'order_id' => $orderId,
                    'gross_amount' => (int) $pembayaran->jumlah,
                ],
                'customer_details' => [
                    'first_name' => $user->nama_lengkap,
                    'email' => $user->email,
                    'phone' => $user->no_hp ?? '',
                ],
                'item_details' => [
                    [
                        'id' => 'PPDB-' . $pendaftaran->jenjang,
                        'price' => (int) $pembayaran->jumlah,
                        'quantity' => 1,
                        'name' => "Biaya Pendaftaran {$pendaftaran->jenjang}",
                    ],
                ],
                // Enable: Bank Transfer, E-Wallet, QRIS
                'enabled_payments' => [
                    // Bank Transfer
                    'bank_transfer',
                    'bca_va',
                    'bni_va',
                    'bri_va',
                    'permata_va',
                    'other_va',
                    // E-Wallet
                    'gopay',
                    'shopeepay',
                    // QRIS
                    'qris',
                    // Convenience Store
                    'indomaret',
                    'alfamart',
                ],
                'expiry' => [
                    'start_time' => now()->format('Y-m-d H:i:s O'),
                    'duration' => config('ppdb.batas_bayar_jam', 24),
                    'unit' => 'hours',
                ],
            ];

            // Snap::createTransaction returns stdClass with ->token and ->redirect_url
            $snapResponse = \Midtrans\Snap::createTransaction($params);

            // Cast to array
            return [
                'token' => $snapResponse->token ?? null,
                'redirect_url' => $snapResponse->redirect_url ?? null,
                'order_id' => $orderId,
            ];
        } catch (\Exception $e) {
            \Log::error('Midtrans error: ' . $e->getMessage());
            return null;
        }
    }
}
