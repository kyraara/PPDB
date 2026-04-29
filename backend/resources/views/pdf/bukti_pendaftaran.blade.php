<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bukti Pendaftaran - {{ $pendaftaran->nomor_daftar }}</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 12px; color: #333; line-height: 1.5; }
        .header { text-align: center; border-bottom: 2px solid #2D8A6B; padding-bottom: 15px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 20px; color: #1A6B5A; }
        .header h2 { margin: 5px 0 0; font-size: 14px; color: #C9A84C; font-weight: normal; }
        .content { margin-bottom: 30px; }
        .title { text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 20px; text-decoration: underline; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
        th { background-color: #f9f9f9; width: 35%; font-weight: bold; }
        .footer { margin-top: 50px; text-align: right; }
        .signature { margin-top: 60px; text-decoration: underline; font-weight: bold; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; background: #2D8A6B; color: white; font-weight: bold; font-size: 11px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>PPDB AL ISTIQOMAH AL ISLAMIYAH</h1>
        <h2>Tahun Ajaran 2026/2027</h2>
    </div>

    <div class="title">TANDA BUKTI PENDAFTARAN PESERTA DIDIK BARU</div>

    <div class="content">
        <table>
            <tr>
                <th>Nomor Pendaftaran</th>
                <td><strong>{{ $pendaftaran->nomor_daftar }}</strong></td>
            </tr>
            <tr>
                <th>Jenjang</th>
                <td>{{ $pendaftaran->jenjang }} - {{ $pendaftaran->gelombang?->nama ?? "Gel. ".$pendaftaran->gelombang?->nomor_gelombang }}</td>
            </tr>
            <tr>
                <th>Status Pendaftaran</th>
                <td><span class="badge">{{ $pendaftaran->status }}</span></td>
            </tr>
        </table>

        <h3 style="margin-bottom: 5px; font-size: 14px;">A. Biodata Siswa</h3>
        <table>
            <tr>
                <th>Nama Lengkap</th>
                <td>{{ $pendaftaran->dataSiswa?->nama_lengkap }}</td>
            </tr>
            <tr>
                <th>NISN</th>
                <td>{{ $pendaftaran->dataSiswa?->nisn ?? '-' }}</td>
            </tr>
            <tr>
                <th>Tempat, Tanggal Lahir</th>
                <td>{{ $pendaftaran->dataSiswa?->tempat_lahir }}, {{ $pendaftaran->dataSiswa?->tanggal_lahir }}</td>
            </tr>
            <tr>
                <th>Agama</th>
                <td>{{ $pendaftaran->dataSiswa?->agama }}</td>
            </tr>
            <tr>
                <th>Alamat Lengkap</th>
                <td>{{ $pendaftaran->dataSiswa?->alamat }}</td>
            </tr>
        </table>

        <h3 style="margin-bottom: 5px; font-size: 14px;">B. Data Pembayaran</h3>
        <table>
            <tr>
                <th>Status Pembayaran</th>
                <td>{{ $pendaftaran->pembayaran?->status ?? 'BELUM ADA' }}</td>
            </tr>
            <tr>
                <th>Metode Pembayaran</th>
                <td>{{ strtoupper($pendaftaran->pembayaran?->metode ?? '-') }}</td>
            </tr>
            <tr>
                <th>Tanggal Bayar</th>
                <td>{{ $pendaftaran->pembayaran?->paid_at ? \Carbon\Carbon::parse($pendaftaran->pembayaran->paid_at)->format('d M Y H:i:s') : '-' }}</td>
            </tr>
        </table>
    </div>

    <div class="footer">
        <p>Bogor, {{ now()->format('d F Y') }}</p>
        <p style="margin-bottom: 60px;">Panitia PPDB Al Istiqomah</p>
        <p>___________________________</p>
    </div>
</body>
</html>
