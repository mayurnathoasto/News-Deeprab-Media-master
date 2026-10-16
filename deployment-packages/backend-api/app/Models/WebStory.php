<?php

namespace App\Models;

use App\Traits\HasSafeOrder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class WebStory extends Model
{
    use HasFactory, HasSafeOrder;

    protected $table = 'tbl_web_stories';

    protected $fillable = [
        'language_id',
        'category_id',
        'title',
        'slug',
        'summary',
        'cover_image',
        'status',
        'published_at',
        'expires_at',
        'row_order',
        'meta_title',
        'meta_description',
        'meta_keyword',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
        'status' => 'integer',
        'row_order' => 'integer',
    ];

    protected $appends = ['cover_image_url', 'category_name', 'language_code'];

    protected $orderable = ['id', 'title', 'published_at', 'status', 'row_order', 'created_at'];

    public function getCoverImageUrlAttribute(): string
    {
        $image = $this->getRawOriginal('cover_image');
        if (empty($image)) {
            return '';
        }

        if (preg_match('~^https?://~i', $image)) {
            return $image;
        }

        return Storage::disk('public')->exists($image) ? url(Storage::url($image)) : '';
    }

    public function getCategoryNameAttribute(): string
    {
        return $this->category?->category_name ?? '';
    }

    public function getLanguageCodeAttribute(): string
    {
        return $this->language?->code ?? '';
    }

    public function language()
    {
        return $this->belongsTo(Language::class, 'language_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function pages()
    {
        return $this->hasMany(WebStoryPage::class, 'web_story_id')->orderBy('page_order');
    }

    public function metrics()
    {
        return $this->hasMany(WebStoryMetricDaily::class, 'web_story_id');
    }

    protected static function booted()
    {
        static::deleting(function (WebStory $story) {
            $cover = $story->getRawOriginal('cover_image');
            if ($cover && Storage::disk('public')->exists($cover)) {
                Storage::disk('public')->delete($cover);
            }

            $directory = 'web-stories/' . $story->id;
            if (Storage::disk('public')->exists($directory)) {
                Storage::disk('public')->deleteDirectory($directory);
            }
        });
    }
}
