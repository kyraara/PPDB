<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | CATATAN DEPLOY PRODUKSI:
    |--------------------------------------------------------------------------
    | Saat ini ['*'] mengizinkan SEMUA domain mengakses API Anda.
    | Ini aman untuk development, tapi WAJIB diubah saat deploy ke server.
    |
    | Ganti ['*'] dengan domain frontend Anda, contoh:
    |   'allowed_origins' => ['https://ppdb.alistiqomah.sch.id'],
    |
    | Jika frontend dan backend di domain berbeda (misal subdomain):
    |   'allowed_origins' => [
    |       'https://ppdb.alistiqomah.sch.id',
    |       'https://admin.alistiqomah.sch.id',
    |   ],
    */
    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
