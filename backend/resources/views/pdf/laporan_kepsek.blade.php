<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Pendaftaran PPDB</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 12px; color: #333; line-height: 1.5; }
        .header { text-align: center; border-bottom: 2px solid #2D8A6B; padding-bottom: 15px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 20px; color: #1A6B5A; }
        .header h2 { margin: 5px 0 0; font-size: 14px; color: #C9A84C; font-weight: normal; }
        .title { text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 20px; text-decoration: underline; }
        .stats-box { border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; background: #f9f9f9; border-radius: 4px; }
        .stats-box p { margin: 5px 0; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 10px; border: 1px solid #ddd; text-align: center; }
        th { background-color: #2D8A6B; color: white; }
        .footer { margin-top: 50px; text-align: right; }
    </style>
</head>
<body>
    <div class="header">
        <table style="width: 100%; border: none; margin: 0; padding: 0;">
            <tr>
                <td style="width: 80px; text-align: left; border: none; vertical-align: middle;">
                    @php
                        $logoPath = base_path('../frontend/public/images/logo.png');
                        $logoData = file_exists($logoPath) ? base64_encode(file_get_contents($logoPath)) : '';
                    @endphp
                    @if($logoData)
                        <img src="data:image/png;base64,{{ $logoData }}" style="width: 70px; height: auto;" alt="Logo" />
                    @endif
                </td>
                <td style="text-align: center; border: none; vertical-align: middle;">
                    <h1>PPDB AL ISTIQOMAH AL ISLAMIYAH</h1>
                    <h2>Tahun Ajaran 2026/2027</h2>
                </td>
                <td style="width: 80px; border: none;"></td>
            </tr>
        </table>
    </div>
    <div class="title">LAPORAN REKAPITULASI PENDAFTARAN</div>

    <div class="stats-box">
        <p><strong>Total Pendaftar Keseluruhan:</strong> {{ $stats['total'] }}</p>
        <p><strong>Total Diterima (Lulus Seleksi):</strong> {{ $stats['diterima'] }}</p>
        <p><strong>Total Resmi Terdaftar (Lunas):</strong> {{ $stats['terdaftar'] }}</p>
    </div>

    <h3>Rincian Per Jenjang Pendidikan</h3>
    <table>
        <thead>
            <tr>
                <th>Jenjang</th>
                <th>Total Pendaftar</th>
                <th>Resmi Terdaftar</th>
                <th>Persentase Konversi</th>
            </tr>
        </thead>
        <tbody>
            @foreach($perJenjang as $jenjang => $data)
            <tr>
                <td><strong>{{ $jenjang }}</strong></td>
                <td>{{ $data['total'] }}</td>
                <td>{{ $data['terdaftar'] }}</td>
                <td>{{ $data['total'] > 0 ? round(($data['terdaftar'] / $data['total']) * 100, 1) : 0 }}%</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Bogor, {{ now()->format('d F Y') }}</p>
        <p style="margin-bottom: 60px;">Kepala Sekolah</p>
        <p>___________________________</p>
    </div>
</body>
</html>
