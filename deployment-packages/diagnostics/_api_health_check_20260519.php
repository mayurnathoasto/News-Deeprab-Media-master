<?php
declare(strict_types=1);

header('Content-Type: text/plain; charset=utf-8');

$root = dirname(__DIR__);
if (basename($root) === 'public') {
    $root = dirname($root);
}

function line(string $message = ''): void
{
    echo $message . PHP_EOL;
}

function yn(bool $value): string
{
    return $value ? 'yes' : 'no';
}

function tail_file(string $path, int $lines = 80): array
{
    if (!is_file($path) || !is_readable($path)) {
        return [];
    }

    $data = file($path, FILE_IGNORE_NEW_LINES);
    if (!is_array($data)) {
        return [];
    }

    return array_slice($data, -$lines);
}

function env_value(string $root, string $key): ?string
{
    $envPath = $root . DIRECTORY_SEPARATOR . '.env';
    if (!is_file($envPath) || !is_readable($envPath)) {
        return null;
    }

    foreach (file($envPath, FILE_IGNORE_NEW_LINES) ?: [] as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
            continue;
        }
        [$name, $value] = explode('=', $line, 2);
        if (trim($name) === $key) {
            return trim($value, " \t\n\r\0\x0B\"'");
        }
    }
    return null;
}

line('== PHP ==');
line('version=' . PHP_VERSION);
line('sapi=' . PHP_SAPI);
line('loaded_ini=' . (php_ini_loaded_file() ?: 'none'));
line('fileinfo_extension_loaded=' . yn(extension_loaded('fileinfo')));
line('finfo_class_exists=' . yn(class_exists('finfo')));
line('pdo_mysql_loaded=' . yn(extension_loaded('pdo_mysql')));
line('mbstring_loaded=' . yn(extension_loaded('mbstring')));
line('openssl_loaded=' . yn(extension_loaded('openssl')));
line('curl_loaded=' . yn(extension_loaded('curl')));
line('disabled_functions=' . (ini_get('disable_functions') ?: 'none'));

line();
line('== Paths ==');
line('root=' . $root);
line('root_readable=' . yn(is_readable($root)));
line('storage_readable=' . yn(is_readable($root . '/storage')));
line('storage_writable=' . yn(is_writable($root . '/storage')));
line('bootstrap_cache_readable=' . yn(is_readable($root . '/bootstrap/cache')));
line('bootstrap_cache_writable=' . yn(is_writable($root . '/bootstrap/cache')));
line('vendor_autoload=' . yn(is_readable($root . '/vendor/autoload.php')));

line();
line('== Env Safe Values ==');
line('APP_ENV=' . (env_value($root, 'APP_ENV') ?? 'missing'));
line('APP_DEBUG=' . (env_value($root, 'APP_DEBUG') ?? 'missing'));
line('APP_URL=' . (env_value($root, 'APP_URL') ?? 'missing'));
line('DB_DATABASE=' . (env_value($root, 'DB_DATABASE') ?? 'missing'));
line('DB_USERNAME=' . (env_value($root, 'DB_USERNAME') ?? 'missing'));
line('DB_PASSWORD_set=' . yn((env_value($root, 'DB_PASSWORD') ?? '') !== ''));
line('APPSECRET_set=' . yn((env_value($root, 'APPSECRET') ?? '') !== ''));

line();
line('== Laravel Log Tail ==');
$logPath = $root . '/storage/logs/laravel.log';
$tail = tail_file($logPath, 120);
if (!$tail) {
    line('No readable Laravel log found at ' . $logPath);
} else {
    foreach ($tail as $logLine) {
        $logLine = preg_replace('/(DB_PASSWORD=)[^\s]+/i', '$1[hidden]', $logLine);
        $logLine = preg_replace('/(password["\']?\s*[:=]\s*["\']?)[^"\'\s,}]+/i', '$1[hidden]', $logLine);
        line($logLine);
    }
}

line();
line('DELETE THIS FILE AFTER CHECKING.');
