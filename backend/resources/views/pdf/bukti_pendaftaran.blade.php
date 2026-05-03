<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Bukti Pendaftaran - {{ $pendaftaran->nomor_daftar }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
            font-size: 11px;
            color: #1A2E1A;
            line-height: 1.6;
            background: #fff;
        }

        .page {
            padding: 28px 36px;
            min-height: 100%;
            position: relative;
        }

        /* ── Watermark ── */
        .watermark {
            position: fixed;
            top: 38%;
            left: 50%;
            transform: translateX(-50%) rotate(-35deg);
            font-size: 72px;
            font-weight: 900;
            color: rgba(45, 138, 107, 0.055);
            letter-spacing: 6px;
            white-space: nowrap;
            z-index: 0;
            pointer-events: none;
        }

        /* ── Header ── */
        .header {
            background-color: #1A6B5A;
            border-radius: 10px;
            padding: 18px 22px;
            margin-bottom: 18px;
        }

        .header-inner {
            width: 100%;
            border-collapse: collapse;
        }

        .header-inner td {
            border: none !important;
            padding: 0;
            vertical-align: middle;
        }

        .header-logo-cell {
            width: 72px;
            text-align: left;
        }

        .header-logo-cell img {
            width: 60px;
            height: 60px;
            border-radius: 8px;
        }

        .header-logo-placeholder {
            width: 60px;
            height: 60px;
            border-radius: 8px;
            background: rgba(255,255,255,0.2);
        }

        .header-text {
            text-align: center;
            padding: 0 12px;
        }

        .org-name {
            font-size: 16px;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: 0.5px;
            line-height: 1.3;
            margin-bottom: 2px;
        }

        .org-sub {
            font-size: 10px;
            color: #d0ede5;
            font-weight: 400;
        }

        .org-year {
            font-size: 10px;
            color: #F0C96A;
            font-weight: 600;
            margin-top: 2px;
        }

        .header-right {
            width: 72px;
        }

        /* ── Divider ── */
        .divider {
            height: 2px;
            background: #2D8A6B;
            margin: 0 0 16px 0;
            border-radius: 2px;
            opacity: 0.3;
        }

        /* ── Doc title ── */
        .doc-title {
            text-align: center;
            margin-bottom: 16px;
        }

        .doc-title h2 {
            font-size: 13px;
            font-weight: 800;
            color: #1A6B5A;
            letter-spacing: 1px;
            text-transform: uppercase;
            display: inline-block;
            border-bottom: 2px solid #2D8A6B;
            padding-bottom: 4px;
        }

        /* ── Nomor pendaftaran highlight ── */
        .nomor-box {
            background: #F4FAF7;
            border: 1.5px solid #2D8A6B;
            border-left: 5px solid #1A6B5A;
            border-radius: 7px;
            padding: 10px 16px;
            margin-bottom: 16px;
        }

        .nomor-box table {
            width: 100%;
            border-collapse: collapse;
        }

        .nomor-box table td {
            border: none !important;
            padding: 0;
            vertical-align: middle;
        }

        .nomor-label {
            font-size: 9px;
            font-weight: 700;
            color: #2D8A6B;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            display: block;
            margin-bottom: 2px;
        }

        .nomor-value {
            font-size: 17px;
            font-weight: 800;
            color: #1A6B5A;
            font-family: 'Courier New', Courier, monospace;
            letter-spacing: 1.5px;
        }

        .status-badge {
            display: inline-block;
            padding: 5px 14px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.8px;
            text-transform: uppercase;
        }

        .status-terdaftar { background: #DCFCE7; color: #166534; border: 1px solid #86EFAC; }
        .status-diterima  { background: #DCFCE7; color: #166534; border: 1px solid #86EFAC; }
        .status-ditolak   { background: #FEE2E2; color: #991B1B; border: 1px solid #FCA5A5; }
        .status-pending   { background: #FEF3C7; color: #92400E; border: 1px solid #FCD34D; }
        .status-default   { background: #E8F5F0; color: #1A6B5A; border: 1px solid #2D8A6B; }
        .status-lunas     { background: #DCFCE7; color: #166534; border: 1px solid #86EFAC; }

        /* ── Section header ── */
        .section-header {
            background: #1A6B5A;
            color: #ffffff;
            padding: 6px 12px;
            border-radius: 5px;
            font-size: 10.5px;
            font-weight: 700;
            letter-spacing: 0.5px;
            margin: 14px 0 8px 0;
            display: block;
        }

        /* ── Tables ── */
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 4px;
        }

        .info-table th,
        .info-table td {
            padding: 7px 12px;
            border: 1px solid #C8E6D8;
            vertical-align: top;
            line-height: 1.5;
        }

        .info-table th {
            background: #F0FAF5;
            color: #2D6B4A;
            font-weight: 700;
            width: 36%;
            font-size: 10.5px;
            text-align: left;
        }

        .info-table td {
            background: #ffffff;
            color: #1A2E1A;
            font-size: 11px;
        }

        .info-table tr:nth-child(even) td {
            background: #FAFFFE;
        }

        /* ── Summary row ── */
        .summary-row {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
        }

        .summary-row td {
            border: none !important;
            padding: 0;
            vertical-align: top;
        }

        .summary-cell {
            background: #F0FAF5;
            border: 1.5px solid #C8E6D8;
            border-radius: 7px;
            padding: 10px 14px;
            margin-right: 8px;
        }

        .summary-cell-label {
            font-size: 9px;
            font-weight: 700;
            color: #2D8A6B;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            margin-bottom: 3px;
        }

        .summary-cell-value {
            font-size: 11.5px;
            font-weight: 700;
            color: #1A2E1A;
        }

        /* ── Footer ── */
        .footer {
            margin-top: 30px;
            border-top: 1.5px solid #C8E6D8;
            padding-top: 16px;
        }

        .footer-inner {
            width: 100%;
            border-collapse: collapse;
        }

        .footer-inner td {
            border: none !important;
            padding: 0;
            vertical-align: top;
        }

        .footer-note {
            font-size: 9.5px;
            color: #5A7A5A;
            line-height: 1.7;
            max-width: 300px;
        }

        .footer-note strong {
            color: #1A6B5A;
        }

        .footer-sign {
            text-align: right;
            font-size: 10.5px;
            color: #1A2E1A;
        }

        .footer-sign .city-date {
            margin-bottom: 4px;
            color: #3D5C3D;
        }

        .footer-sign .sign-title {
            color: #2D6B4A;
            font-weight: 700;
            margin-bottom: 54px;
        }

        .footer-sign .sign-line {
            border-top: 1.5px solid #1A6B5A;
            width: 180px;
            margin-left: auto;
            padding-top: 4px;
            font-size: 9.5px;
            color: #2D6B4A;
            font-weight: 600;
        }

        /* ── Bottom stamp ── */
        .doc-stamp {
            text-align: center;
            margin-top: 14px;
            padding: 5px 0 2px;
            border-top: 1px dashed #C8E6D8;
        }

        .doc-stamp span {
            font-size: 8.5px;
            color: #9DC49D;
            letter-spacing: 0.5px;
        }
    </style>
</head>
<body>
<div class="page">

    {{-- Watermark --}}
    @php
        $statusText = $pendaftaran->status === 'TERDAFTAR' ? 'TERDAFTAR'
            : ($pendaftaran->status === 'DITERIMA' ? 'DITERIMA'
            : ($pendaftaran->status === 'DITOLAK'  ? 'DITOLAK'  : ''));
    @endphp
    @if($statusText)
        <div class="watermark">{{ $statusText }}</div>
    @endif

    {{-- ── HEADER ── --}}
    <div class="header">
        @php
            $logoPath = base_path('../frontend/public/images/logo.png');
            $logoData = file_exists($logoPath) ? base64_encode(file_get_contents($logoPath)) : '';
        @endphp
        <table class="header-inner">
            <tr>
                <td class="header-logo-cell">
                    @if($logoData)
                        <img src="data:image/png;base64,{{ $logoData }}" alt="Logo">
                    @else
                        <div class="header-logo-placeholder"></div>
                    @endif
                </td>
                <td class="header-text">
                    <div class="org-name">PPDB AL ISTIQOMAH AL ISLAMIYAH</div>
                    <div class="org-sub">Prabumulih, Sumatera Selatan</div>
                    <div class="org-year">Tahun Ajaran {{ now()->month >= 7 ? now()->year.'/'.(now()->year+1) : (now()->year-1).'/'.now()->year }}</div>
                </td>
                <td class="header-right"></td>
            </tr>
        </table>
    </div>

    {{-- ── DOC TITLE ── --}}
    <div class="doc-title">
        <h2>Tanda Bukti Pendaftaran Peserta Didik Baru</h2>
    </div>

    {{-- ── NOMOR PENDAFTARAN ── --}}
    <div class="nomor-box">
        <table>
            <tr>
                <td>
                    <span class="nomor-label">Nomor Pendaftaran</span>
                    <span class="nomor-value">{{ $pendaftaran->nomor_daftar }}</span>
                </td>
                <td style="text-align: right; width: 160px;">
                    @php
                        $statusClass = match($pendaftaran->status) {
                            'TERDAFTAR'      => 'status-terdaftar',
                            'DITERIMA'       => 'status-diterima',
                            'DITOLAK'        => 'status-ditolak',
                            'MENUNGGU_BAYAR',
                            'SUBMITTED',
                            'MENUNGGU_REVIEW' => 'status-pending',
                            default          => 'status-default',
                        };
                        $statusLabel = match($pendaftaran->status) {
                            'TERDAFTAR'       => 'TERDAFTAR',
                            'DITERIMA'        => 'DITERIMA',
                            'DITOLAK'         => 'TIDAK DITERIMA',
                            'MENUNGGU_BAYAR'  => 'MENUNGGU BAYAR',
                            'MENUNGGU_REVIEW' => 'SEDANG DIPROSES',
                            'SUBMITTED'       => 'MENUNGGU VERIFIKASI',
                            default           => $pendaftaran->status,
                        };
                    @endphp
                    <span class="status-badge {{ $statusClass }}">{{ $statusLabel }}</span>
                </td>
            </tr>
        </table>
    </div>

    {{-- ── RINGKASAN INFO ── --}}
    <table class="summary-row">
        <tr>
            <td style="padding-right: 6px;">
                <div class="summary-cell">
                    <div class="summary-cell-label">Jenjang</div>
                    <div class="summary-cell-value">{{ $pendaftaran->jenjang }}</div>
                </div>
            </td>
            <td style="padding-right: 6px;">
                <div class="summary-cell">
                    <div class="summary-cell-label">Gelombang</div>
                    <div class="summary-cell-value">
                        {{ $pendaftaran->gelombang?->nama ?? 'Gelombang '.$pendaftaran->gelombang?->nomor_gelombang }}
                    </div>
                </div>
            </td>
            <td>
                <div class="summary-cell">
                    <div class="summary-cell-label">Tanggal Cetak</div>
                    <div class="summary-cell-value">{{ now()->locale('id')->isoFormat('D MMMM YYYY') }}</div>
                </div>
            </td>
        </tr>
    </table>

    {{-- ── A. BIODATA SISWA ── --}}
    <span class="section-header">A. Biodata Calon Peserta Didik</span>
    <table class="info-table">
        <tr>
            <th>Nama Lengkap</th>
            <td><strong>{{ $pendaftaran->dataSiswa?->nama_lengkap ?? '-' }}</strong></td>
        </tr>
        <tr>
            <th>NISN</th>
            <td>{{ $pendaftaran->dataSiswa?->nisn ?? '-' }}</td>
        </tr>
        <tr>
            <th>Tempat, Tanggal Lahir</th>
            <td>
                {{ ucfirst(strtolower($pendaftaran->dataSiswa?->tempat_lahir ?? '')) }},
                @if($pendaftaran->dataSiswa?->tanggal_lahir)
                    {{ \Carbon\Carbon::parse($pendaftaran->dataSiswa->tanggal_lahir)->locale('id')->isoFormat('D MMMM YYYY') }}
                @else
                    -
                @endif
            </td>
        </tr>
        <tr>
            <th>Jenis Kelamin</th>
            <td>{{ $pendaftaran->dataSiswa?->jenis_kelamin === 'L' ? 'Laki-laki' : ($pendaftaran->dataSiswa?->jenis_kelamin === 'P' ? 'Perempuan' : '-') }}</td>
        </tr>
        <tr>
            <th>Agama</th>
            <td>{{ ucfirst(strtolower($pendaftaran->dataSiswa?->agama ?? '-')) }}</td>
        </tr>
        <tr>
            <th>Asal Sekolah</th>
            <td>{{ $pendaftaran->dataSiswa?->asal_sekolah ?? '-' }}</td>
        </tr>
        <tr>
            <th>Alamat Lengkap</th>
            <td>{{ ucfirst(strtolower($pendaftaran->dataSiswa?->alamat ?? '-')) }}</td>
        </tr>
    </table>

    {{-- ── B. DATA ORANG TUA ── --}}
    @if($pendaftaran->dataOrtu && $pendaftaran->dataOrtu->count() > 0)
    @php
        $ayah = $pendaftaran->dataOrtu->first(function($item) {
            return strtoupper($item->tipe) === 'AYAH';
        });
        $ibu = $pendaftaran->dataOrtu->first(function($item) {
            return strtoupper($item->tipe) === 'IBU';
        });
        $wali = $pendaftaran->dataOrtu->first(function($item) {
            return strtoupper($item->tipe) === 'WALI';
        });
    @endphp
    <span class="section-header">B. Data Orang Tua / Wali</span>
    <table class="info-table">
        @if($ayah)
        <tr>
            <th>Nama Ayah</th>
            <td>{{ $ayah->nama ?? '-' }}</td>
        </tr>
        <tr>
            <th>Pekerjaan Ayah</th>
            <td>{{ $ayah->pekerjaan ?? '-' }}</td>
        </tr>
        <tr>
            <th>No. HP Ayah</th>
            <td>{{ $ayah->no_hp ?? '-' }}</td>
        </tr>
        @endif
        @if($ibu)
        <tr>
            <th>Nama Ibu</th>
            <td>{{ $ibu->nama ?? '-' }}</td>
        </tr>
        <tr>
            <th>Pekerjaan Ibu</th>
            <td>{{ $ibu->pekerjaan ?? '-' }}</td>
        </tr>
        <tr>
            <th>No. HP Ibu</th>
            <td>{{ $ibu->no_hp ?? '-' }}</td>
        </tr>
        @endif
        @if($wali)
        <tr>
            <th>Nama Wali</th>
            <td>{{ $wali->nama ?? '-' }}</td>
        </tr>
        <tr>
            <th>No. HP Wali</th>
            <td>{{ $wali->no_hp ?? '-' }}</td>
        </tr>
        @endif
    </table>
    @endif

    {{-- ── C. DATA PEMBAYARAN ── --}}
    <span class="section-header">C. Data Pembayaran</span>
    <table class="info-table">
        <tr>
            <th>Status Pembayaran</th>
            <td>
                @php
                    $bayarStatus = $pendaftaran->pembayaran?->status ?? 'BELUM ADA';
                    $bayarLabel  = match(strtoupper($bayarStatus)) {
                        'SUKSES', 'SUCCESS', 'PAID', 'SETTLEMENT' => 'LUNAS',
                        'PENDING'  => 'MENUNGGU PEMBAYARAN',
                        'EXPIRED'  => 'KADALUARSA',
                        'GAGAL'    => 'GAGAL',
                        'BELUM ADA' => 'BELUM ADA',
                        default     => strtoupper($bayarStatus),
                    };
                    $bayarClass = in_array(strtoupper($bayarStatus), ['SUKSES','SUCCESS','PAID','SETTLEMENT'])
                        ? 'status-lunas'
                        : (strtoupper($bayarStatus) === 'BELUM ADA' ? 'status-default' : 'status-pending');
                @endphp
                <span class="status-badge {{ $bayarClass }}">{{ $bayarLabel }}</span>
            </td>
        </tr>
        <tr>
            <th>Metode Pembayaran</th>
            <td>{{ $pendaftaran->pembayaran?->metode ? strtoupper($pendaftaran->pembayaran->metode) : '-' }}</td>
        </tr>
        <tr>
            <th>Jumlah Dibayar</th>
            <td>
                @if($pendaftaran->pembayaran?->jumlah)
                    Rp {{ number_format($pendaftaran->pembayaran->jumlah, 0, ',', '.') }}
                @else
                    -
                @endif
            </td>
        </tr>
        <tr>
            <th>Tanggal Bayar</th>
            <td>
                @if($pendaftaran->pembayaran?->paid_at)
                    {{ \Carbon\Carbon::parse($pendaftaran->pembayaran->paid_at)->locale('id')->isoFormat('D MMMM YYYY, HH:mm') }} WIB
                @else
                    -
                @endif
            </td>
        </tr>
    </table>

    {{-- ── FOOTER ── --}}
    <div class="footer">
        <table class="footer-inner">
            <tr>
                <td>
                    <div class="footer-note">
                        <strong>Catatan:</strong><br>
                        - Dokumen ini merupakan bukti resmi pendaftaran PPDB.<br>
                        - Simpan dokumen ini sebagai arsip.<br>
                        - Informasi lebih lanjut hubungi panitia PPDB.
                    </div>
                </td>
                <td style="width: 220px;">
                    <div class="footer-sign">
                        <div class="city-date">Prabumulih, {{ now()->locale('id')->isoFormat('D MMMM YYYY') }}</div>
                        <div class="sign-title">Panitia PPDB Al Istiqomah</div>
                        <div class="sign-line">( Ketua Panitia )</div>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    {{-- ── STAMP BAWAH ── --}}
    <div class="doc-stamp">
        <span>
            Dicetak melalui Sistem PPDB Online Al Istiqomah Al Islamiyah |
            {{ now()->locale('id')->isoFormat('D MMMM YYYY, HH:mm') }} WIB |
            {{ $pendaftaran->nomor_daftar }}
        </span>
    </div>

</div>
</body>
</html>