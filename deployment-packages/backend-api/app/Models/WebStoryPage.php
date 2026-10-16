<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class WebStoryPage extends Model
{
    use HasFactory;

    protected $table = 'tbl_web_story_pages';

    protected $fillable = [
        'web_story_id',
        'page_order',
        'media_type',
        'media_path',
        'headline',
        'body',
        'cta_label',
        'cta_url',
        'scene_json',
    ];

    protected $casts = [
        'page_order' => 'integer',
        'scene_json' => 'array',
    ];

    protected $appends = ['media_url'];

    public function getMediaUrlAttribute(): string
    {
        $path = $this->getRawOriginal('media_path');
        if (empty($path)) {
            return '';
        }

        if (preg_match('~^https?://~i', $path)) {
            return $path;
        }

        return Storage::disk('public')->exists($path) ? url(Storage::url($path)) : '';
    }

    public function story()
    {
        return $this->belongsTo(WebStory::class, 'web_story_id');
    }
}
