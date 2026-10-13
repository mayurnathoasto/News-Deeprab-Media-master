<?php

use App\Models\Language;
use App\Models\Location;
use App\Models\Settings;
use App\Models\Token;
use App\Models\WebSetting;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Support\Str;

if (!function_exists('get_meta_keyword')) {
    function get_meta_keyword($meta_keyword)
    {
        $meta_keyword1 = '';
        if ($meta_keyword) {
            $meta_keyword1 = implode(
                ',',
                array_map(function ($tag) {
                    return $tag['value'];
                }, $meta_keyword),
            );
        }
        return $meta_keyword1;
    }
}

/** Generate Slugs Functions */
if (!function_exists('generateUniqueSlug')) {
    function generateUniqueSlug($title, $originalSlug = null, $exceptId = null) {
        if (!$originalSlug) {
            $originalSlug = Str::slug($title);
        } else {
            $originalSlug = Str::slug($originalSlug);
        }

        if(empty($originalSlug)){
            $originalSlug = "slug";
        }
        return $originalSlug;
    }
}


if (!function_exists('customSlug')) {
    function customSlug($string, $separator = '-')
    {
        // Normalize the string
        $normalizedString = mb_strtolower(trim($string), 'UTF-8');
        // Check if the string contains only ASCII characters
        if (preg_match('/^[\x00-\x7F]*$/', $normalizedString)) {
            $slug = preg_replace('/[^a-z0-9]+/', $separator, $normalizedString);
        } else {
            // slug with remove special characters
            // $slug = preg_replace('/[^\p{L}\p{N}\s]+/u', '', $string);
            // $slug = preg_replace('/\s+/', $separator, $slug);

            //slug with all language
            // $slug = preg_replace('/[^\p{Gujarati}0-9]+/u', '', $normalizedString);

            //remove space from string
            $slug = preg_replace('/\s+/', $separator, $string);
        }
        return $slug;
    }
}

if (!function_exists('getSetting')) {
    function getSetting($type = '')
    {
        $settingList = [];
        if ($type == '') {
            $setting = Settings::get();
        } else {
            $setting = Settings::where('type', $type)->get();
        }
        foreach ($setting as $row) {
            $settingList[$row->type] = $row->message;
        }
        return $settingList;
    }
}

if (!function_exists('getSettingMode')) {
    function getSettingMode($type)
    {
        return Settings::where('type', $type)->pluck('message')->first();
    }
}

if (!function_exists('getWebSetting')) {
    function getWebSetting($type = '')
    {
        $settingList = [];
        if ($type == '') {
            $setting = WebSetting::get();
        } else {
            $setting = WebSetting::where('type', $type)->get();
        }
        foreach ($setting as $row) {
            $settingList[$row->type] = $row->message;
        }
        return $settingList;
    }
}
if (!function_exists('send_notification')) {

    function send_notification($fcmMsg, $language_id, $location_id, $devicetoken = [])
    {
        // dd($fcmMsg, $language_id, $location_id, $devicetoken);
        // dd(empty($devicetoken));
        // -----------------------------------------
        // 1. Device Token Selection (unchanged)
        // -----------------------------------------

        $languageCode = getCodeFromLanguageId($language_id);
        if (empty($devicetoken)) {

            if ($location_id != 0) {
                $filteredTokens = [];

                $location = Location::find($location_id);
                $news_lat = $location->latitude;
                $news_long = $location->longitude;

                $devicetoken = Token::where('language_id', $language_id)->get();
                $maxDistance = Settings::where('type', 'nearest_location_measure')->value('message');

                foreach ($devicetoken as $value) {
                    $device_lat = $value->latitude;
                    $device_long = $value->longitude;

                    if (!empty($device_lat)) {
                        $distance = calculateDistance($news_lat, $news_long, $device_lat, $device_long);

                        if ($distance < $maxDistance) {
                            $filteredTokens[] = $value->token;
                        }
                    }
                }

                $registrationIDs_chunks = array_chunk($filteredTokens, 500);

            } else {
                $tokens = Token::where('language_id', $language_id)->pluck('token')->toArray();
                $registrationIDs_chunks = array_chunk($tokens, 500);
            }

        } else {
            $registrationIDs_chunks = array_chunk($devicetoken, 500);
        }



        // -----------------------------------------
        // 2. Call FCM v1 (using CURL) — CLEAN
        // -----------------------------------------

        $firebase_config = public_path('assets/firebase_config.json');

        if (!file_exists($firebase_config)) {
            Log::error("Firebase config missing");
            return false;
        }

        // Hardcoded for testing
        // $registrationIDs = [
        //     // 'eibdP4ZVQ7O_BYJa6x1yBa:APA91bFwlQdMe2OnelFQ7sxFY2zp4CrPcg_1VRGfxvbbZsGVdN8F3LoT6UTSSfdbZ52XBrDstbW1E7rKggsdMK79qCBlJW69drR39Xcq8cDsIirS2fUAHTs'
        //     'fvn4I5jTRGOuncCyFEZpCG:APA91bHOn9UplXvzVtOSnqoz9Wd2HT-dEPVFlXkPmriviRVcc_FM-M6DdoFykFFlbq4qKACi4cvOOJC-axJAPNV_k5QFVBR5w-WI6MX0u8Ax-lB19hyiLg8'
        // ];

        // Loop through real device token chunks
        foreach ($registrationIDs_chunks as $registrationIDs) {

            sendFcmNotification(
                $registrationIDs,
                $fcmMsg['title'],
                $fcmMsg['body'],
                // 'default',
                $fcmMsg['type'] ?? 'default',
                $language_id,
                [
                    // 'news_id' => $fcmMsg['news_id'] ?? null,
                    // 'location_id' => $fcmMsg['location_id'] ?? null,
                    ...$fcmMsg,
                    'language_code' => $languageCode,
                ],
            );
        }
    }
}

if (!function_exists('sendFcmNotification')) {

    function sendFcmNotification(array $registrationIDs, string|null $title = '', string|null $message = '', string $type = "default", int $language_id = 1, array $data = []): string|array|bool {

        try {
            $project_id = Settings::where('type', 'firebase_project_id')->first();
            // $project_id = 'visionverse-9d4de';
            $project_id = $project_id?->message ?? null;

            if (empty($project_id)) {
                Log::error("Firebase project ID is not set");
                return ['error' => true, 'message' => 'Firebase project ID is not set'];
            }

            $url = "https://fcm.googleapis.com/v1/projects/{$project_id}/messages:send";

            $access_token = getAccessToken();

            if (empty($access_token['data'])) {
                Log::error("FCM access token missing");
                return ['error' => true, 'message' => 'Failed to get FCM access token'];
            }

            $payloadData = [
                "title" => $title,
                "body"  => $message,
                "language_id" => $language_id,
                "type" => $type,
                ...$data
            ];

            $payloadData = array_map(function ($value) {
                return is_scalar($value) ? (string)$value : json_encode($value);
            }, $payloadData);


            foreach ($registrationIDs as $registrationID) {

                if (empty($registrationID)) {
                    Log::warning("Skipping empty token");
                    continue;
                }

                $data = [
                    "message" => [
                        "token" => $registrationID,
                        "notification" => [
                            "title" => $title,
                            "body"  => $message,
                        ],
                        "data" => $payloadData,
                        "android" => ["priority" => "high"],
                        "apns" => [
                            "headers" => ["apns-priority" => "10"],
                            "payload" => [
                                "aps" => [
                                    "alert" => [
                                        "title" => $title,
                                        "body"  => $message,
                                    ],
                                    "sound" => "default"
                                ]
                            ]
                        ]
                    ]
                ];

                $jsonBody = json_encode($data);

                $headers = [
                    'Authorization: Bearer ' . $access_token['data'],
                    'Content-Type: application/json',
                ];

                $ch = curl_init();
                curl_setopt_array($ch, [
                    CURLOPT_URL            => $url,
                    CURLOPT_POST           => true,
                    CURLOPT_HTTPHEADER     => $headers,
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_SSL_VERIFYHOST => 2,
                    CURLOPT_SSL_VERIFYPEER => true,
                    CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
                    CURLOPT_POSTFIELDS     => $jsonBody,
                ]);

                $result   = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

                Log::info("FCM Response Code: $httpCode");
                Log::info("FCM Response: $result");

                // ----------------------------------------------------
                // DEAD TOKEN CLEANUP
                // ----------------------------------------------------
                if ($httpCode != 200 && $result) {

                    $errorResponse = json_decode($result, true);

                    if (!empty($errorResponse['error']['status'])) {

                        $status = $errorResponse['error']['status'];

                        if (in_array($status, ['UNREGISTERED', 'INVALID_ARGUMENT', 'NOT_FOUND'])) {

                            Log::warning("Removing dead FCM token: $registrationID (Reason: $status)");

                            Token::where('token', $registrationID)->delete();
                        }
                    }
                }

                if ($result === false) {
                    Log::error("Curl failed: " . curl_error($ch));
                }

                // curl_close($ch);
            }

            return ['error' => false, 'message' => "Success"];

        } catch (Exception $e) {
            Log::error("FCM error: " . $e->getMessage());
            return false;
        }
    }
}

/** END OF Generate Slugs Functions */
if (!function_exists('getAccessToken')) {

    function getAccessToken() {
        try {
            $file_path = public_path('assets/firebase_config.json');

            if (!file_exists($file_path)) {
                return ['error' => true, 'message' => 'FCM Service File not found'];
            }

            $client = new Google\Client();
            $client->setAuthConfig($file_path);
            $client->setScopes(['https://www.googleapis.com/auth/firebase.messaging']);

            return [
                'error'   => false,
                'message' => 'Access Token generated successfully',
                'data'    => $client->fetchAccessTokenWithAssertion()['access_token']
            ];

        } catch (Exception $e) {
            throw new RuntimeException($e);
        }
    }
}

if (!function_exists('page_type')) {
    function page_type($type)
    {
        $values = [
            'home' => __('home'),
            'video_news' => __('video_news'),
            'personal_notifications' => __('personal_notifications'),
            'all_breaking_news' => __('all_breaking_news'),
            'live_streaming_news' => __('live_streaming_news'),
            'rss_feeds' => __('rss_feeds'),
            'e_news' => __('e_news'),
        ];
        return $values[$type] ?? '';
    }
}

if (!function_exists('is_category_enabled')) {
    function is_category_enabled()
    {
        return Settings::where('type', 'category_mode')->pluck('message')->first();
    }
}

if (!function_exists('is_subcategory_enabled')) {
    function is_subcategory_enabled()
    {
        return Settings::where('type', 'subcategory_mode')->pluck('message')->first();
    }
}

if (!function_exists('is_breaking_news_enabled')) {
    function is_breaking_news_enabled()
    {
        $setting = Settings::where('type', 'breaking_news_mode')->pluck('message')->first();
        return $setting ? $setting : 0;
    }
}

if (!function_exists('is_auto_news_expire_news_enabled')) {
    function is_auto_news_expire_news_enabled()
    {
        $setting = Settings::where('type', 'auto_delete_expire_news_mode')->pluck('message')->first();
        return $setting ? $setting : 0;
    }
}

if (!function_exists('is_live_streaming_enabled')) {
    function is_live_streaming_enabled()
    {
        $setting = Settings::where('type', 'live_streaming_mode')->pluck('message')->first();
        return $setting ? $setting : 0;
    }
}

if (!function_exists('is_location_news_enabled')) {
    function is_location_news_enabled()
    {
        $setting = Settings::where('type', 'location_news_mode')->pluck('message')->first();
        return $setting ? $setting : 0;
    }
}

if (!function_exists('getTimezoneOptions')) {
    function getTimezoneOptions()
    {
        $list = DateTimeZone::listAbbreviations();
        $idents = DateTimeZone::listIdentifiers();
        $data = $offset = $added = [];
        foreach ($list as $info) {
            foreach ($info as $zone) {
                if (!empty($zone['timezone_id']) && !in_array($zone['timezone_id'], $added) && in_array($zone['timezone_id'], $idents)) {
                    $z = new DateTimeZone($zone['timezone_id']);
                    $c = new DateTime(); // Replace $n = '' with $n = null
                    $c->setTimezone($z);
                    $zone['time'] = $c->format('H:i a');
                    $offset[] = $zone['offset'] = $z->getOffset($c);
                    $data[] = $zone;
                    $added[] = $zone['timezone_id'];
                }
            }
        }
        array_multisort($offset, SORT_ASC, $data);
        $options = [];
        foreach ($data as $row) {
            $options[] = [
                'time' => $row['time'],
                'offset' => formatOffset($row['offset']),
                'timezone_id' => $row['timezone_id'],
            ];
        }
        return $options;
    }
}

if (!function_exists('formatOffset')) {
    function formatOffset($offset)
    {
        $hours = floor($offset / 3600);
        $minutes = abs(($offset % 3600) / 60);
        return sprintf('%+d:%02d', $hours, $minutes);
    }
}

if (!function_exists('generateRandomString')) {
    function generateRandomString($length = 10)
    {
        return substr(str_shuffle(str_repeat($x = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length / strlen($x)))), 1, $length);
    }
}

if (!function_exists('is_email_setting')) {
    function is_email_setting()
    {
        $builder = new Settings(); // Create an instance of the Settings model
        $email_setting = new \stdClass(); // Create a new stdClass object to store email settings
        // Retrieve and set individual email settings
        $email_setting->SMTPHost = $builder->where('type', 'smtp_host')->first()->message;
        $email_setting->SMTPUser = $builder->where('type', 'smtp_user')->first()->message;
        $email_setting->SMTPPass = $builder->where('type', 'smtp_password')->first()->message;
        $email_setting->SMTPPort = $builder->where('type', 'smtp_port')->first()->message;
        $email_setting->SMTPCrypto = $builder->where('type', 'smtp_crypto')->first()->message;
        $email_setting->fromName = $builder->where('type', 'from_name')->first()->message;
        $email_setting->mailType = 'html';
        return $email_setting;
    }
}

if (!function_exists('createSlug')) {
    function createSlug($text)
    {
        // // Convert the title to lowercase and replace spaces with hyphens
        $slug = str_replace(' ', '-', strtolower($text));
        // Remove special characters
        $slug = preg_replace('/[^A-Za-z0-9\-]/', '', $slug);
        return $slug . '-' . rand(1, 100);
    }
}

if (!function_exists('get_language')) {
    function get_language($status = '')
    {
        if ($status) {
            return Language::where('status', $status)->get();
        } else {
            return Language::get();
        }
    }
}

if (!function_exists('get_default_language')) {
    function get_default_language()
    {
        $language = '';
        $setting = getSetting('default_language');
        if (!empty($setting)) {
            $language = Language::where('id', $setting['default_language'])->first();
        }
        return $language;
    }
}

if (!function_exists('calculateDistance')) {
    function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        // Convert degrees to radians
        $lat1 = deg2rad($lat1);
        $lon1 = deg2rad($lon1);
        $lat2 = deg2rad($lat2);
        $lon2 = deg2rad($lon2);
        // Radius of the Earth in kilometers
        $earthRadius = 6371; // You can also use 3959 for miles
        // Haversine formula
        $dlat = $lat2 - $lat1;
        $dlon = $lon2 - $lon1;
        $a = sin($dlat / 2) * sin($dlat / 2) + cos($lat1) * cos($lat2) * sin($dlon / 2) * sin($dlon / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return $earthRadius * $c;
    }
}

//hideEmailAddress
if (!function_exists('hideEmailAddress')) {
    function hideEmailAddress($email)
    {
        $demo_mode = env('DEMO_MODE');
        if ($demo_mode == true && $email != '') {
            return 'xyz@gmail.com';
        } else {
            return $email;
        }
    }
}

//hideMobileNumber
if (!function_exists('hideMobileNumber')) {
    function hideMobileNumber($mobile)
    {
        $demo_mode = env('DEMO_MODE');
        if ($demo_mode == true && $mobile != '') {
            return '***********';
        } else {
            return $mobile;
        }
    }
}
if (!function_exists('compressAndUpload')) {
function compressAndUpload($requestFile, $folder, $quality = 80, $maxWidth = 1920, $maxHeight = 1920) {
    $extension = strtolower($requestFile->getClientOriginalExtension());
    $mime = strtolower((string)$requestFile->getMimeType());

    // Keep vector SVG and animated GIF in their original formats
    if ($extension === 'svg' || $mime === 'image/svg+xml' || $extension === 'gif' || $mime === 'image/gif') {
        $file_name = uniqid() . '.' . $extension;
        return $requestFile->storeAs($folder, $file_name, 'public');
    }

    // Non-image files (e.g. PDF attachments, video, etc.) stored as-is
    $convertibleExtensions = ['jpg', 'jpeg', 'png', 'webp', 'bmp'];
    $isImageMime = str_starts_with($mime, 'image/');
    if (!in_array($extension, $convertibleExtensions) && !$isImageMime) {
        $file_name = uniqid() . '.' . ($extension ?: 'bin');
        return $requestFile->storeAs($folder, $file_name, 'public');
    }

    // All raster images are converted to optimized WebP
    $file_name = uniqid() . '.webp';

    // 1. Primary engine: Intervention Image
    try {
        if (class_exists('Intervention\Image\Laravel\Facades\Image') || class_exists('Intervention\Image\ImageManagerStatic')) {
            $image = Image::read($requestFile);

            // Auto-scale large images proportionally if larger than max dimensions
            if (method_exists($image, 'scaleDown')) {
                $image->scaleDown(width: $maxWidth, height: $maxHeight);
            } elseif (method_exists($image, 'scale')) {
                if ($image->width() > $maxWidth) {
                    $image->scale(width: $maxWidth);
                }
            } elseif (method_exists($image, 'resize')) {
                if ($image->width() > $maxWidth) {
                    $image->resize($maxWidth, null, function ($constraint) {
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    });
                }
            }

            // Encode to WebP
            if (method_exists($image, 'toWebp')) {
                $encoded = $image->toWebp($quality);
                $binary = method_exists($encoded, 'toString') ? $encoded->toString() : (string)$encoded;
            } elseif (method_exists($image, 'encode')) {
                $encoded = $image->encode('webp', $quality);
                $binary = (string)$encoded;
            } else {
                $binary = null;
            }

            if (!empty($binary)) {
                Storage::disk('public')->put("$folder/$file_name", $binary);
                return "$folder/$file_name";
            }
        }
    } catch (\Throwable $e) {
        Log::warning('Intervention WebP conversion fallback to GD: ' . $e->getMessage());
    }

    // 2. Secondary engine: Native PHP GD WebP
    try {
        if (function_exists('imagewebp')) {
            $filePath = $requestFile->getRealPath();
            $gdImage = @imagecreatefromstring(file_get_contents($filePath));
            if ($gdImage) {
                $w = imagesx($gdImage);
                $h = imagesy($gdImage);

                // Downscale large camera/stock images
                if ($w > $maxWidth || $h > $maxHeight) {
                    if ($w >= $h) {
                        $newW = $maxWidth;
                        $newH = (int) round(($h / $w) * $maxWidth);
                    } else {
                        $newH = $maxHeight;
                        $newW = (int) round(($w / $h) * $maxHeight);
                    }
                    if (function_exists('imagescale')) {
                        $scaled = @imagescale($gdImage, $newW, $newH);
                        if ($scaled) {
                            imagedestroy($gdImage);
                            $gdImage = $scaled;
                        }
                    }
                }

                // Preserve alpha channel transparency for PNG/WebP
                imagepalettetotruecolor($gdImage);
                imagealphablending($gdImage, true);
                imagesavealpha($gdImage, true);

                ob_start();
                imagewebp($gdImage, null, $quality);
                $binary = ob_get_clean();
                imagedestroy($gdImage);

                if (!empty($binary)) {
                    Storage::disk('public')->put("$folder/$file_name", $binary);
                    return "$folder/$file_name";
                }
            }
        }
    } catch (\Throwable $e) {
        Log::warning('Native GD WebP conversion failed: ' . $e->getMessage());
    }

    // 3. Fallback: Save original image if conversion fails
    $fallbackName = uniqid() . '.' . ($extension ?: 'jpg');
    return $requestFile->storeAs($folder, $fallbackName, 'public');
}
}

if (!function_exists('compressAndReplace')) {
function compressAndReplace($requestFile, $folder, $deleteRawOriginalImage) {
    if (!empty($deleteRawOriginalImage) && Storage::disk('public')->exists($deleteRawOriginalImage)) {
        Storage::disk('public')->delete($deleteRawOriginalImage);
    }
    return compressAndUpload($requestFile, $folder);
}
}
if(!function_exists('getCodeFromLanguageId')) {
    function getCodeFromLanguageId(int $language_id): string
    {
        $code = Language::find($language_id)?->code;
        // other wise default language from DB table
        if (!$code) {
            $defaultCode = Settings::where('type', 'default_language')->first()->message;
            $code = $defaultCode;
        }

        return $code;
    }
}

if (!function_exists('normalizeVideoEmbedUrl')) {
    function normalizeVideoEmbedUrl(?string $url): string
    {
        $url = trim((string) $url);
        if ($url === '') {
            return '';
        }

        $parts = parse_url($url);
        $host = strtolower($parts['host'] ?? '');
        $path = $parts['path'] ?? '';

        if (str_contains($host, 'inqtube.com') && str_contains($path, '/watch/')) {
            return str_replace('/watch/', '/embed/', $url);
        }

        return $url;
    }
}

if (!function_exists('getVideoThumbnailUrl')) {
    function getVideoThumbnailUrl(?string $url): string
    {
        $url = normalizeVideoEmbedUrl($url);
        if ($url === '') {
            return '';
        }

        $youtubeId = null;
        if (preg_match('~(?:youtube\.com/(?:watch\?v=|embed/|shorts/)|youtu\.be/)([A-Za-z0-9_-]{6,})~', $url, $matches)) {
            $youtubeId = $matches[1];
        }

        if ($youtubeId) {
            return "https://img.youtube.com/vi/{$youtubeId}/hqdefault.jpg";
        }

        return \Illuminate\Support\Facades\Cache::remember('video_thumbnail_' . md5($url), now()->addHours(12), function () use ($url) {
            try {
                $response = \Illuminate\Support\Facades\Http::timeout(6)
                    ->withHeaders(['User-Agent' => 'Mozilla/5.0'])
                    ->get($url);

                if (!$response->successful()) {
                    return '';
                }

                $html = $response->body();
                $patterns = [
                    '/<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']/i',
                    '/<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']/i',
                    '/<meta[^>]+name=["\']twitter:image["\'][^>]+content=["\']([^"\']+)["\']/i',
                    '/<meta[^>]+content=["\']([^"\']+)["\'][^>]+name=["\']twitter:image["\']/i',
                ];

                foreach ($patterns as $pattern) {
                    if (preg_match($pattern, $html, $matches)) {
                        $thumbnail = html_entity_decode($matches[1], ENT_QUOTES);
                        if (str_starts_with($thumbnail, '//')) {
                            return 'https:' . $thumbnail;
                        }
                        if (preg_match('~^https?://~i', $thumbnail)) {
                            return $thumbnail;
                        }

                        $parts = parse_url($url);
                        $origin = ($parts['scheme'] ?? 'https') . '://' . ($parts['host'] ?? '');
                        return $origin . '/' . ltrim($thumbnail, '/');
                    }
                }
            } catch (\Throwable $e) {
                return '';
            }

            return '';
        });
    }
}
