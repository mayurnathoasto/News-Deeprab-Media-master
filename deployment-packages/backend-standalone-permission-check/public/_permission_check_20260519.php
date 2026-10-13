<?php
set_time_limit(600);
header('Content-Type: text/plain');

$base = dirname(__DIR__);
$targets = [
    'vendor',
    'vendor/ralouphie/getallheaders/src/getallheaders.php',
    'vendor/symfony/deprecation-contracts/function.php',
    'storage',
    'bootstrap/cache',
];

function show_status($base, $label) {
    echo "\n== {$label} ==\n";
    foreach ([
        'vendor/ralouphie/getallheaders/src/getallheaders.php',
        'vendor/symfony/deprecation-contracts/function.php',
        'vendor/autoload.php',
        'storage',
        'bootstrap/cache',
    ] as $rel) {
        $path = $base . '/' . $rel;
        echo $rel . ': ';
        if (!file_exists($path)) {
            echo "MISSING\n";
            continue;
        }
        echo (is_dir($path) ? 'dir' : 'file')
            . ' perms=' . substr(sprintf('%o', fileperms($path)), -4)
            . ' readable=' . (is_readable($path) ? 'yes' : 'no')
            . ' writable=' . (is_writable($path) ? 'yes' : 'no')
            . "\n";
    }
}

show_status($base, 'before');

$commands = [
    'find ' . escapeshellarg($base) . ' -type d -exec chmod 755 {} \;',
    'find ' . escapeshellarg($base) . ' -type f -exec chmod 644 {} \;',
    'chmod -R 755 ' . escapeshellarg($base . '/storage'),
    'chmod -R 755 ' . escapeshellarg($base . '/bootstrap/cache'),
];

foreach ($commands as $command) {
    echo "\n$ " . $command . "\n";
    $output = [];
    $code = 0;
    exec($command . ' 2>&1', $output, $code);
    echo "exit_code={$code}\n";
    if ($output) {
        echo implode("\n", $output) . "\n";
    }
}

if (!is_dir($base . '/storage/logs')) {
    mkdir($base . '/storage/logs', 0755, true);
}
if (!file_exists($base . '/storage/logs/laravel.log')) {
    touch($base . '/storage/logs/laravel.log');
}
@chmod($base . '/storage/logs/laravel.log', 0664);

show_status($base, 'after');

echo "\nNow delete this file: public/_permission_check_20260519.php\n";