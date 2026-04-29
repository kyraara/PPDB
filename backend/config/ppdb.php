<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Biaya Pendaftaran Per Jenjang (dummy — bisa dikelola admin nanti)
    |--------------------------------------------------------------------------
    */
    'biaya_pendaftaran' => [
        'TK'  => 250000,
        'SD'  => 350000,
        'SMP' => 450000,
        'SMA' => 500000,
    ],

    /*
    |--------------------------------------------------------------------------
    | Batas Waktu Pembayaran (dalam jam)
    |--------------------------------------------------------------------------
    */
    'batas_bayar_jam' => 24,

    /*
    |--------------------------------------------------------------------------
    | Midtrans Configuration
    |--------------------------------------------------------------------------
    */
    'midtrans' => [
        'server_key'  => env('MIDTRANS_SERVER_KEY', ''),
        'client_key'  => env('MIDTRANS_CLIENT_KEY', ''),
        'is_production' => env('MIDTRANS_IS_PRODUCTION', false),
        'snap_url'    => env('MIDTRANS_IS_PRODUCTION', false)
            ? 'https://app.midtrans.com/snap/snap.js'
            : 'https://app.sandbox.midtrans.com/snap/snap.js',
    ],

    /*
    |--------------------------------------------------------------------------
    | Mode Pembayaran
    |--------------------------------------------------------------------------
    | 'sandbox'  = Midtrans Sandbox (butuh API keys)
    | 'simulasi' = Tanpa gateway, bayar langsung via tombol simulasi
    */
    'payment_mode' => env('PPDB_PAYMENT_MODE', 'simulasi'),

];
