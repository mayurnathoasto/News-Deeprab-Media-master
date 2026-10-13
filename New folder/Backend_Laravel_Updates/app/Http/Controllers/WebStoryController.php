<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Language;
use App\Models\WebStory;
use App\Models\WebStoryPage;
use App\Services\ResponseService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class WebStoryController extends Controller
{
    public function index()
    {
        try {
            $languageList = Language::where('status', 1)->get();
            $categoryList = [];

            if (count($languageList) === 1) {
                $categoryList = Category::select('id', 'category_name')
                    ->where('language_id', $languageList[0]->id)
                    ->orderBy('row_order')
                    ->get();
            }

            return view('web-stories', compact('languageList', 'categoryList'));
        } catch (Exception $e) {
            return ResponseService::logErrorRedirectResponse($e, 'WebStoryController -> index');
        }
    }

    public function show(Request $request)
    {
        $offset = $request->input('offset', 0);
        $limit = $request->input('limit', 10);
        $sort = $request->input('sort', 'id');
        $order = $request->input('order', 'DESC');

        $query = WebStory::with(['language:id,language,code', 'category:id,category_name', 'pages']);

        if ($request->filled('search')) {
            $query->where('title', 'LIKE', '%' . $request->search . '%');
        }
        if ($request->filled('language_id') && $request->language_id != 0) {
            $query->where('language_id', $request->language_id);
        }
        if ($request->filled('category_id') && $request->category_id != 0) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->filled('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        $total = $query->clone()->count();
        $rows = $query->safeOrder($sort, $order)
            ->skip($offset)
            ->take($limit)
            ->get()
            ->map(function (WebStory $story) {
                $status = $story->status
                    ? '<span class="badge badge-success">Active</span>'
                    : '<span class="badge badge-danger">Draft</span>';

                $cover = $story->cover_image_url
                    ? '<a href="' . e($story->cover_image_url) . '" data-toggle="lightbox" data-title="Cover"><img class="images_border" src="' . e($story->cover_image_url) . '" height="60" width="45"></a>'
                    : '-';

                $operate = '<div class="dropdown">
                    <button class="btn btn-primary btn-sm px-3" data-toggle="dropdown"><i class="fas fa-ellipsis-v"></i></button>
                    <div class="dropdown-menu dropdown-scrollbar">
                        <a class="dropdown-item edit-web-story" href="' . url('web_stories/' . $story->id . '/edit') . '"><i class="fa fa-pen mr-1 text-primary"></i>Edit</a>
                        <a data-url="' . url('web_stories', $story->id) . '" class="dropdown-item delete-form" data-id="' . $story->id . '"><i class="fa fa-trash mr-1 text-danger"></i>Delete</a>
                    </div>
                </div>';

                return [
                    'id' => $story->id,
                    'language_id' => $story->language_id,
                    'language_name' => $story->language->language ?? '',
                    'category_id' => $story->category_id,
                    'category_name' => $story->category->category_name ?? '',
                    'cover' => $cover,
                    'title' => $story->title,
                    'slug' => $story->slug,
                    'status' => $status,
                    'raw_status' => $story->status,
                    'pages_count' => $story->pages->count(),
                    'published_at' => optional($story->published_at)->format('Y-m-d H:i'),
                    'expires_at' => optional($story->expires_at)->format('Y-m-d H:i'),
                    'operate' => $operate,
                ];
            });

        return response()->json(['total' => $total, 'rows' => $rows]);
    }

    public function store(Request $request)
    {
        return $this->persist($request);
    }

    public function edit(WebStory $webStory)
    {
        $webStory->load('pages');
        $languageList = Language::where('status', 1)->get();
        $categoryList = Category::select('id', 'category_name', 'language_id')
            ->where('language_id', $webStory->language_id)
            ->orderBy('row_order')
            ->get();

        return view('web-stories', compact('languageList', 'categoryList', 'webStory'));
    }

    public function update(Request $request, WebStory $webStory)
    {
        return $this->persist($request, $webStory);
    }

    public function destroy($id)
    {
        try {
            $story = WebStory::findOrFail($id);
            $story->delete();

            return ResponseService::successResponse(__('deleted_success'));
        } catch (Exception $e) {
            return ResponseService::logErrorResponse($e, 'WebStoryController -> destroy');
        }
    }

    private function persist(Request $request, ?WebStory $story = null)
    {
        $validator = Validator::make($request->all(), [
            'language_id' => 'required|exists:tbl_languages,id',
            'category_id' => 'required|exists:tbl_category,id',
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'summary' => 'nullable|string|max:500',
            'cover_image' => ($story ? 'nullable' : 'required') . '|image|mimes:jpg,jpeg,png,webp|max:5120',
            'status' => 'required|in:0,1',
            'published_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:published_at',
            'slides_payload' => 'required|json',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => true, 'message' => $validator->errors()->first()], 422);
        }

        $slides = json_decode($request->slides_payload, true) ?: [];
        $slides = array_values(array_filter($slides, fn($slide) => trim($slide['headline'] ?? '') !== '' || trim($slide['body'] ?? '') !== '' || !empty($slide['existing_media'] ?? '') || !empty($slide['media_field'] ?? '') || !empty($slide['fabric_data'] ?? '')));

        if (count($slides) === 0) {
            return response()->json(['error' => true, 'message' => 'Please add at least one story slide.'], 422);
        }

        try {
            $slug = generateUniqueSlug($request->slug);
            $duplicate = WebStory::where('language_id', $request->language_id)
                ->where('slug', $slug)
                ->when($story?->exists, fn($q) => $q->where('id', '!=', $story->id))
                ->exists();

            if ($duplicate) {
                return response()->json(['error' => true, 'message' => 'The story slug is already in use for this language.'], 422);
            }

            DB::transaction(function () use ($request, $story, $slides) {
                $story = $story ?: new WebStory();

                if ($request->hasFile('cover_image')) {
                    $oldCover = $story->exists ? $story->getRawOriginal('cover_image') : null;
                    if ($oldCover && Storage::disk('public')->exists($oldCover)) {
                        Storage::disk('public')->delete($oldCover);
                    }
                    $story->cover_image = compressAndUpload($request->file('cover_image'), 'web-stories/covers');
                }

                $story->fill([
                    'language_id' => $request->language_id,
                    'category_id' => $request->category_id,
                    'title' => $request->title,
                    'slug' => generateUniqueSlug($request->slug),
                    'summary' => $request->summary,
                    'status' => $request->status,
                    'published_at' => $request->published_at,
                    'expires_at' => $request->expires_at,
                    'meta_title' => $request->meta_title ?: $request->title,
                    'meta_description' => $request->meta_description,
                    'meta_keyword' => $request->meta_keyword,
                ]);
                $story->save();

                $existingPaths = $story->pages()->pluck('media_path')->filter()->all();
                $keptPaths = [];
                $story->pages()->delete();

                foreach ($slides as $index => $slide) {
                    $mediaPath = $slide['existing_media'] ?? null;
                    $field = $slide['media_field'] ?? '';
                    if (!empty($slide['fabric_data'])) {
                        $mediaPath = $this->storeFabricDataUrl($slide['fabric_data'], $story->id, $index);
                    } elseif ($field && $request->hasFile($field)) {
                        $file = $request->file($field);
                        $mediaPath = compressAndUpload($file, 'web-stories/' . $story->id);
                    }
                    if ($mediaPath) {
                        $keptPaths[] = $mediaPath;
                    }

                    WebStoryPage::create([
                        'web_story_id' => $story->id,
                        'page_order' => $index,
                        'media_type' => $slide['media_type'] ?? 'image',
                        'media_path' => $mediaPath,
                        'headline' => $slide['headline'] ?? '',
                        'body' => $slide['body'] ?? '',
                        'cta_label' => $slide['cta_label'] ?? '',
                        'cta_url' => $slide['cta_url'] ?? '',
                        'scene_json' => [
                            'fontFamily' => $slide['font_family'] ?? 'Inter',
                            'textColor' => $slide['text_color'] ?? '#ffffff',
                            'textAlign' => $slide['text_align'] ?? 'left',
                            'overlay' => $slide['overlay'] ?? 'dark',
                            'animation' => $slide['animation'] ?? 'fade-in',
                            'fabric' => !empty($slide['fabric_json']) ? json_decode($slide['fabric_json'], true) : null,
                        ],
                    ]);
                }

                foreach (array_diff($existingPaths, $keptPaths) as $path) {
                    if ($path && Storage::disk('public')->exists($path)) {
                        Storage::disk('public')->delete($path);
                    }
                }
            });

            return ResponseService::successResponse($story ? __('updated_success') : __('created_success'));
        } catch (Exception $e) {
            return ResponseService::logErrorResponse($e, 'WebStoryController -> persist');
        }
    }

    private function storeFabricDataUrl(string $dataUrl, int $storyId, int $index): string
    {
        if (!preg_match('/^data:image\/(png|jpe?g|webp);base64,/', $dataUrl, $matches)) {
            throw new Exception('Invalid Fabric image data.');
        }

        $extension = $matches[1] === 'jpeg' ? 'jpg' : $matches[1];
        $base64 = substr($dataUrl, strpos($dataUrl, ',') + 1);
        $binary = base64_decode($base64, true);

        if ($binary === false) {
            throw new Exception('Unable to decode Fabric image data.');
        }

        $path = 'web-stories/' . $storyId . '/fabric-slide-' . ($index + 1) . '-' . time() . '.' . $extension;
        Storage::disk('public')->put($path, $binary);

        return $path;
    }
}
