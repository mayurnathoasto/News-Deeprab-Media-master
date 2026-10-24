<?php

namespace App\Traits;

use App\Models\Language;
use App\Services\ResponseService;
use Illuminate\Http\Request;

trait ResolvesLanguage
{
    /**
     * Resolve language_id from the request.
     *
     * Accepts either:
     *   - language_code (string, e.g. 'en', 'hi', 'ar') — preferred
     *   - language_id   (numeric, backward compatible)
     *
     * If both are provided, language_code takes precedence.
     * The resolved language_id is cached in request attributes
     * to avoid repeated DB lookups within the same request lifecycle.
     *
     * Usage:
     *   $languageId = $this->resolveLanguageId($request);
     *
     * @param  Request  $request
     * @return int  The resolved language_id
     */
    protected function resolveLanguageId(Request $request): int
    {
        // Return cached result if already resolved in this request
        if ($request->attributes->has('_resolved_language_id')) {
            return $request->attributes->get('_resolved_language_id');
        }

        $language = null;

        if ($request->filled('language_code')) {
            $language = Language::where('code', $request->language_code)->first();

            if (!$language) {
                $language = Language::where('status', 1)->first() ?? Language::first();
            }
        } elseif ($request->filled('language_id')) {
            $language = is_numeric($request->language_id) ? Language::find($request->language_id) : null;
            if (!$language) {
                $language = Language::where('status', 1)->first() ?? Language::first();
            }
        } else {
            // Gracefully fallback to default active language
            $language = Language::where('status', 1)->first() ?? Language::first();
        }

        // Cache in request attributes to avoid repeated DB queries
        $request->attributes->set('_resolved_language_id', $language->id);

        // Merge language_id into request so downstream code (queries, etc.) can use it transparently
        $request->merge(['language_id' => $language->id]);

        return $language->id;
    }
}
