<?php
// Temporary deployment helper. Delete this file after it reports success.
set_time_limit(300);

$base = dirname(__DIR__);
$paths = [
    'vendor',
    'app',
    'bootstrap',
    'config',
    'database',
    'public',
    'resources',
    'routes',
    'storage',
];

function chmodPath(string $path, array &$stats): void
{
    if (!file_exists($path)) {
        $stats['missing'][] = $path;
        return;
    }

    if (is_dir($path)) {
        @chmod($path, 0755);
        $stats['dirs']++;
        $items = scandir($path);
        if ($items === false) {
            $stats['failed'][] = $path;
            return;
        }
        foreach ($items as $item) {
            if ($item === '.' || $item === '..') {
                continue;
            }
            chmodPath($path . DIRECTORY_SEPARATOR . $item, $stats);
        }
        return;
    }

    @chmod($path, 0644);
    $stats['files']++;
}

$stats = ['dirs' => 0, 'files' => 0, 'missing' => [], 'failed' => []];
foreach ($paths as $relativePath) {
    chmodPath($base . DIRECTORY_SEPARATOR . $relativePath, $stats);
}

$writableDirs = [
    $base . '/storage',
    $base . '/storage/logs',
    $base . '/storage/framework',
    $base . '/storage/framework/cache',
    $base . '/storage/framework/cache/data',
    $base . '/storage/framework/sessions',
    $base . '/storage/framework/views',
    $base . '/bootstrap/cache',
];

foreach ($writableDirs as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    @chmod($dir, 0755);
}

header('Content-Type: text/plain');
echo "Permission fixer completed.\n";
echo "Directories checked: {$stats['dirs']}\n";
echo "Files checked: {$stats['files']}\n";
if ($stats['missing']) {
    echo "Missing paths:\n" . implode("\n", $stats['missing']) . "\n";
}
if ($stats['failed']) {
    echo "Failed paths:\n" . implode("\n", $stats['failed']) . "\n";
}
echo "\nIMPORTANT: Delete public/fix-permissions.php now.\n";