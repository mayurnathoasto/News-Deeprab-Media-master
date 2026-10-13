<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use App\Models\WebStory;
use App\Models\WebStoryMetricDaily;
use App\Services\ResponseService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WebStoryApiController extends BaseApiController
{
    public function getWebStories(Request $request)
    {
        try {
            $languageId = $this->resolveLanguageId($request);
            $offset = (int) ($request->offset ?? 0);
            $limit = (int) ($request->limit ?? 12);

            $query = WebStory::with([
                'category:id,category_name,slug',
                'language:id,language,code',
                'pages',
            ])
                ->where('language_id', $languageId)
                ->where('status', 1)
                ->where(function ($q) {
                    $q->whereNull('published_at')->orWhere('published_at', '<=', now());
                })
                ->where(function ($q) {
                    $q->whereNull('expires_at')->orWhere('expires_at', '>=', now());
                });

            if ($request->filled('category_id')) {
                $query->where('category_id', $request->category_id);
            }

            if ($request->filled('category_slug')) {
                $categorySlug = $request->category_slug;
                $categoryIds = Category::where('slug', $categorySlug)
                    ->when($languageId, fn($q) => $q->where('language_id', $languageId))
                    ->pluck('id');

                if ($categoryIds->isEmpty()) {
                    $categoryIds = Category::where('slug', $categorySlug)->pluck('id');
                }

                if ($categoryIds->isNotEmpty()) {
                    $query->whereIn('category_id', $categoryIds);
                } else {
                    $query->whereHas('category', function ($q) use ($categorySlug) {
                        $q->where('slug', $categorySlug);
                    });
                }
            }

            if ($request->filled('slug')) {
                $query->where('slug', $request->slug);
            }

            $total = $query->clone()->count();
            if ($total === 0) {
                return ResponseService::successResponse(__('Data fetched successfully'), [
                    'total' => 0,
                    'data' => [],
                ]);
            }

            $stories = $query->orderBy('row_order')
                ->orderByDesc('published_at')
                ->orderByDesc('id')
                ->skip($offset)
                ->take($limit)
                ->get()
                ->map(fn(WebStory $story) => $this->formatStory($story));

            return ResponseService::successResponse(__('Data fetched successfully'), [
                'total' => $total,
                'data' => $stories,
            ]);
        } catch (Exception $e) {
            return ResponseService::logErrorResponse($e, 'WebStoryApiController -> getWebStories');
        }
    }

    public function trackWebStoryEvent(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'story_id' => 'required|exists:tbl_web_stories,id',
                'event' => 'required|in:open,complete,slide_exit,outbound_click',
            ]);
            if ($validator->fails()) {
                return ResponseService::validationError($validator->errors()->first());
            }

            $column = [
                'open' => 'opens',
                'complete' => 'completions',
                'slide_exit' => 'slide_exits',
                'outbound_click' => 'outbound_clicks',
            ][$request->event];

            $metric = WebStoryMetricDaily::firstOrCreate([
                'web_story_id' => $request->story_id,
                'metric_date' => now()->toDateString(),
            ]);
            $metric->increment($column);

            return ResponseService::successResponse(__('Data saved successfully'));
        } catch (Exception $e) {
            return ResponseService::logErrorResponse($e, 'WebStoryApiController -> trackWebStoryEvent');
        }
    }

    private function formatStory(WebStory $story): array
    {
        return [
            'id' => $story->id,
            'title' => $story->title,
            'slug' => $story->slug,
            'summary' => $story->summary,
            'cover_image' => $story->cover_image_url,
            'category_id' => $story->category_id,
            'category_name' => $story->category?->category_name ?? '',
            'category_slug' => $story->category?->slug ?? '',
            'language_code' => $story->language?->code ?? '',
            'published_at' => optional($story->published_at)->toIso8601String(),
            'meta_title' => $story->meta_title,
            'meta_description' => $story->meta_description,
            'pages' => $story->pages->map(fn($page) => [
                'id' => $page->id,
                'page_order' => $page->page_order,
                'media_type' => $page->media_type,
                'media_url' => $page->media_url,
                'headline' => $page->headline,
                'body' => $page->body,
                'cta_label' => $page->cta_label,
                'cta_url' => $page->cta_url,
                'scene_json' => $page->scene_json,
            ])->values(),
        ];
    }
}
