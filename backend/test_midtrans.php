<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$ortu = App\Models\DataOrtu::all(['id','pendaftaran_id','tipe','nama','no_hp']);
echo "Total: " . $ortu->count() . "\n";
foreach ($ortu as $o) {
    echo "ID={$o->id} pendaftaran_id={$o->pendaftaran_id} tipe=[{$o->tipe}] nama=[{$o->nama}] hp=[{$o->no_hp}]\n";
}
