@extends('layouts.main')

@section('title')
    Web Stories
@endsection

@php
    $isEdit = isset($webStory);
    $storyPages = $isEdit ? $webStory->pages->values() : collect();
    $existingSlides = $storyPages->map(function ($page) {
        $scene = $page->scene_json ?? [];
        return [
            'media_type' => $page->media_type,
            'existing_media' => $page->getRawOriginal('media_path'),
            'media_url' => $page->media_url,
            'headline' => $page->headline,
            'body' => $page->body,
            'cta_label' => $page->cta_label,
            'cta_url' => $page->cta_url,
            'font_family' => $scene['fontFamily'] ?? 'Inter',
            'text_color' => $scene['textColor'] ?? '#ffffff',
            'text_align' => $scene['textAlign'] ?? 'left',
            'overlay' => $scene['overlay'] ?? 'dark',
            'animation' => $scene['animation'] ?? 'fade-in',
            'fabric_json' => $scene['fabric'] ?? null,
        ];
    })->values();
@endphp

@section('content')
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0">{{ $isEdit ? 'Edit Web Story' : 'Create and Manage Web Stories' }}</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item text-dark">
                            <a href="{{ route('home') }}" class="text-dark"><i class="fas fa-home mr-1"></i>{{ __('dashboard') }}</a>
                        </li>
                        <li class="breadcrumb-item active"><i class="nav-icon fas fa-photo-video mr-1"></i>Web Stories</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>

    <section class="content">
        <div class="container-fluid">
            <div class="card card-secondary">
                <div class="card-header">
                    <h3 class="card-title">{{ $isEdit ? 'Edit Story' : 'Create Story' }}</h3>
                </div>
                <div class="card-body">
                    <form id="{{ $isEdit ? 'update_form' : 'create_form' }}" action="{{ url('web_stories') }}" method="POST" enctype="multipart/form-data">
                        @csrf
                        @if ($isEdit)
                            <input type="hidden" name="edit_id" value="{{ $webStory->id }}">
                        @endif
                        <input type="hidden" id="slides_payload" name="slides_payload" value="">

                        <div class="row">
                            <div class="col-lg-4 col-md-6">
                                <div class="form-group">
                                    <label class="required">Language</label>
                                    <select id="story_language_id" name="language_id" class="form-control" required>
                                        @if (count($languageList) > 1)
                                            <option value="">Select Language</option>
                                        @endif
                                        @foreach ($languageList as $language)
                                            <option value="{{ $language->id }}" {{ $isEdit && $webStory->language_id == $language->id ? 'selected' : '' }}>{{ $language->language }}</option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>

                            <div class="col-lg-4 col-md-6">
                                <div class="form-group">
                                    <label class="required">Category</label>
                                    <select id="story_category_id" name="category_id" class="form-control" required>
                                        <option value="">Select Category</option>
                                        @foreach ($categoryList as $category)
                                            <option value="{{ $category->id }}" {{ $isEdit && $webStory->category_id == $category->id ? 'selected' : '' }}>{{ $category->category_name }}</option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>

                            <div class="col-lg-4 col-md-6">
                                <div class="form-group">
                                    <label class="required">Status</label>
                                    <select name="status" class="form-control" required>
                                        <option value="0" {{ $isEdit && $webStory->status == 0 ? 'selected' : '' }}>Draft</option>
                                        <option value="1" {{ $isEdit && $webStory->status == 1 ? 'selected' : '' }}>Published</option>
                                    </select>
                                </div>
                            </div>

                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label class="required">Title</label>
                                    <input id="story_title" type="text" name="title" class="form-control" value="{{ $isEdit ? $webStory->title : '' }}" data-slug-table="tbl_web_stories" data-slug-target="#story_slug" required>
                                </div>
                            </div>

                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label class="required">Slug</label>
                                    <input id="story_slug" type="text" name="slug" class="form-control" value="{{ $isEdit ? $webStory->slug : '' }}" required>
                                </div>
                            </div>

                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label class="{{ $isEdit ? '' : 'required' }}">Cover Image</label>
                                    <input type="file" name="cover_image" class="form-control" accept="image/*" {{ $isEdit ? '' : 'required' }}>
                                    <small class="text-muted">Recommended: portrait 3:4 or 9:16 image, at least 720px tall.</small>
                                    @if ($isEdit && $webStory->cover_image_url)
                                        <div class="mt-2">
                                            <img src="{{ $webStory->cover_image_url }}" alt="Story cover" style="width: 92px; height: 124px; object-fit: cover; border-radius: 8px;">
                                        </div>
                                    @endif
                                </div>
                            </div>

                            <div class="col-lg-3 col-md-6">
                                <div class="form-group">
                                    <label>Publish At</label>
                                    <input type="datetime-local" name="published_at" class="form-control" value="{{ $isEdit && $webStory->published_at ? $webStory->published_at->format('Y-m-d\TH:i') : '' }}">
                                </div>
                            </div>

                            <div class="col-lg-3 col-md-6">
                                <div class="form-group">
                                    <label>Expire At</label>
                                    <input type="datetime-local" name="expires_at" class="form-control" value="{{ $isEdit && $webStory->expires_at ? $webStory->expires_at->format('Y-m-d\TH:i') : '' }}">
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="form-group">
                                    <label>Summary</label>
                                    <textarea name="summary" class="form-control" rows="2" maxlength="500">{{ $isEdit ? $webStory->summary : '' }}</textarea>
                                </div>
                            </div>
                        </div>

                        <hr>

                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h5 class="mb-1">Story Slides</h5>
                                <small class="text-muted">Each slide supports image/video, headline, body, optional CTA, and basic visual styling.</small>
                            </div>
                            <button type="button" id="add_slide" class="btn btn-outline-primary"><i class="fas fa-plus-circle mr-1"></i>Add Slide</button>
                        </div>

                        <div id="slides_container"></div>

                        <div class="row mt-4">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label>Meta Title</label>
                                    <input type="text" name="meta_title" class="form-control" value="{{ $isEdit ? $webStory->meta_title : '' }}">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label>Meta Keywords</label>
                                    <input type="text" name="meta_keyword" class="form-control" value="{{ $isEdit ? $webStory->meta_keyword : '' }}">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label>Meta Description</label>
                                    <textarea name="meta_description" class="form-control" rows="1">{{ $isEdit ? $webStory->meta_description : '' }}</textarea>
                                </div>
                            </div>
                        </div>

                        <div class="d-flex justify-content-end">
                            @if ($isEdit)
                                <a href="{{ url('web_stories') }}" class="btn btn-light mr-2">Cancel</a>
                            @endif
                            <button type="submit" class="btn btn-primary">{{ $isEdit ? 'Update Story' : 'Submit' }}</button>
                        </div>
                    </form>
                </div>
            </div>

            @if (!$isEdit)
                <div class="card card-secondary">
                    <div class="card-header">
                        <h3 class="card-title">Web Stories List</h3>
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div class="col-md-3">
                                <label>Language</label>
                                <select id="filter_language_id" class="form-control">
                                    <option value="0">Select Language</option>
                                    @foreach ($languageList as $language)
                                        <option value="{{ $language->id }}">{{ $language->language }}</option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label>Category</label>
                                <select id="filter_category_id" class="form-control">
                                    <option value="0">Select Category</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label>Status</label>
                                <select id="filter_status" class="form-control">
                                    <option value="">All</option>
                                    <option value="1">Published</option>
                                    <option value="0">Draft</option>
                                </select>
                            </div>
                        </div>

                        <table id="table"
                            data-toggle="table"
                            data-url="{{ route('webStoriesList') }}"
                            data-side-pagination="server"
                            data-pagination="true"
                            data-search="true"
                            data-page-list="[5, 10, 20, 50]"
                            data-query-params="webStoriesQueryParams"
                            data-show-refresh="true"
                            data-show-columns="true"
                            data-unique-id="id">
                            <thead>
                                <tr>
                                    <th data-field="id" data-sortable="true">ID</th>
                                    <th data-field="language_name">Language</th>
                                    <th data-field="category_name">Category</th>
                                    <th data-field="cover">Cover</th>
                                    <th data-field="title" data-sortable="true">Title</th>
                                    <th data-field="pages_count">Slides</th>
                                    <th data-field="status">Status</th>
                                    <th data-field="published_at" data-sortable="true">Publish At</th>
                                    <th data-field="operate">Action</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            @endif
        </div>
    </section>

    <div class="modal fade" id="fabricEditorModal" tabindex="-1" role="dialog" aria-labelledby="fabricEditorTitle" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="fabricEditorTitle">Visual Slide Editor</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-lg-4">
                            <div class="form-group">
                                <label>Add Image</label>
                                <input type="file" id="fabric_add_image_file" class="form-control" accept="image/*">
                                <small class="text-muted">Images added here are draggable, resizable, and layerable.</small>
                            </div>
                            <div class="form-group">
                                <label>Selected Object Text</label>
                                <textarea id="fabric_text_value" class="form-control" rows="3"></textarea>
                            </div>
                            <div class="row">
                                <div class="col-md-7">
                                    <div class="form-group">
                                        <label>Font Family</label>
                                        <select id="fabric_font_family" class="form-control">
                                            <option value="Inter">Inter</option>
                                            <option value="Roboto">Roboto</option>
                                            <option value="Open Sans">Open Sans</option>
                                            <option value="Lato">Lato</option>
                                            <option value="Montserrat">Montserrat</option>
                                            <option value="Poppins">Poppins</option>
                                            <option value="Merriweather">Merriweather</option>
                                            <option value="Playfair Display">Playfair Display</option>
                                            <option value="Source Sans 3">Source Sans 3</option>
                                            <option value="Noto Sans Devanagari">Noto Sans Devanagari</option>
                                            <option value="Noto Serif Devanagari">Noto Serif Devanagari</option>
                                            <option value="Georgia">Georgia</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-5">
                                    <div class="form-group">
                                        <label>Font Size</label>
                                        <input type="number" id="fabric_font_size" class="form-control" min="10" max="96" value="30">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Text Color</label>
                                        <input type="color" id="fabric_text_color" class="form-control" value="#ffffff">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Opacity</label>
                                        <input type="range" id="fabric_opacity" class="form-control-range" min="0.1" max="1" step="0.05" value="1">
                                    </div>
                                </div>
                            </div>
                            <div class="btn-group mb-2" role="group" aria-label="Text style controls">
                                <button type="button" class="btn btn-outline-secondary" id="fabric_bold"><strong>B</strong></button>
                                <button type="button" class="btn btn-outline-secondary" id="fabric_italic"><em>I</em></button>
                                <button type="button" class="btn btn-outline-secondary" id="fabric_underline"><u>U</u></button>
                            </div>
                            <div class="btn-group mb-2 ml-2" role="group" aria-label="Text alignment controls">
                                <button type="button" class="btn btn-outline-secondary" data-fabric-align="left">Left</button>
                                <button type="button" class="btn btn-outline-secondary" data-fabric-align="center">Center</button>
                                <button type="button" class="btn btn-outline-secondary" data-fabric-align="right">Right</button>
                            </div>
                            <div class="btn-group mb-3" role="group" aria-label="Layer controls">
                                <button type="button" class="btn btn-outline-secondary" id="fabric_bring_forward">Forward</button>
                                <button type="button" class="btn btn-outline-secondary" id="fabric_send_backward">Backward</button>
                            </div>
                            <div class="d-flex flex-wrap gap-2">
                                <button type="button" class="btn btn-outline-primary mb-2" id="fabric_add_headline">Add Headline</button>
                                <button type="button" class="btn btn-outline-primary mb-2" id="fabric_add_body">Add Body</button>
                                <button type="button" class="btn btn-outline-danger mb-2" id="fabric_delete_object">Delete Selected</button>
                            </div>
                            <small class="text-muted d-block mt-2">Use this editor to position text over the slide image. Saving exports the canvas as the slide media.</small>
                        </div>
                        <div class="col-lg-8 d-flex justify-content-center">
                            <div class="fabric-stage-wrap">
                                <canvas id="fabric_story_canvas" width="360" height="640"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="fabric_save_slide">Save Edited Slide</button>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('script')
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=Lato:wght@400;700;900&family=Merriweather:wght@400;700;900&family=Montserrat:wght@400;600;800&family=Noto+Sans+Devanagari:wght@400;700;900&family=Noto+Serif+Devanagari:wght@400;700;900&family=Open+Sans:wght@400;700;800&family=Playfair+Display:wght@400;700;900&family=Poppins:wght@400;600;800&family=Roboto:wght@400;700;900&family=Source+Sans+3:wght@400;700;900&display=swap');

        .story-slide-card {
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
            background: #fff;
        }
        .story-slide-card .slide-title {
            font-weight: 700;
        }
        #fabricEditorModal .btn-group .btn {
            min-width: 42px;
        }
        .fabric-stage-wrap {
            width: 360px;
            height: 640px;
            max-width: 100%;
            border-radius: 12px;
            overflow: hidden;
            background: #172033;
            box-shadow: 0 16px 40px rgba(15, 23, 42, 0.22);
        }

        #fabric_story_canvas,
        #fabricEditorModal .canvas-container,
        #fabricEditorModal .lower-canvas,
        #fabricEditorModal .upper-canvas {
            width: 360px !important;
            height: 640px !important;
            max-width: 100%;
        }

        #fabricEditorModal .lower-canvas {
            background: #172033 !important;
        }

        #fabricEditorModal .upper-canvas {
            background: transparent !important;
        }
    </style>
    <script>
        const existingSlides = @json($existingSlides);

        let slideIndex = 0;

        function renderSlide(slide = {}) {
            const index = slideIndex++;
            const mediaPreview = slide.media_url ? `<a href="${slide.media_url}" target="_blank" class="d-inline-block mt-2">View current media</a>` : '';
            const html = `
                <div class="story-slide-card" data-slide-index="${index}">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div class="slide-title">Slide <span class="slide-number"></span></div>
                        <button type="button" class="btn btn-sm btn-outline-danger remove-slide"><i class="fas fa-trash"></i></button>
                    </div>
                    <input type="hidden" class="existing-media" value="${slide.existing_media || ''}">
                    <div class="row">
                        <div class="col-lg-3 col-md-6">
                            <div class="form-group">
                                <label>Media Type</label>
                                <select class="form-control slide-media-type">
                                    <option value="image" ${slide.media_type !== 'video' ? 'selected' : ''}>Image</option>
                                    <option value="video" ${slide.media_type === 'video' ? 'selected' : ''}>Video</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-lg-5 col-md-6">
                            <div class="form-group">
                                <label>Media</label>
                                <input type="file" name="slide_media_${index}" class="form-control slide-media" accept="image/*,video/*">
                                <input type="hidden" class="fabric-data-url" value="">
                                <input type="hidden" class="fabric-json" value="${escapeHtml(JSON.stringify(slide.fabric_json || {}))}">
                                ${mediaPreview}
                                <button type="button" class="btn btn-sm btn-outline-dark mt-2 open-fabric-editor">
                                    <i class="fas fa-object-group mr-1"></i>Edit with Fabric.js
                                </button>
                            </div>
                        </div>
                        <div class="col-lg-2 col-md-6">
                            <div class="form-group">
                                <label>Overlay</label>
                                <select class="form-control slide-overlay">
                                    <option value="dark" ${slide.overlay !== 'none' ? 'selected' : ''}>Dark</option>
                                    <option value="none" ${slide.overlay === 'none' ? 'selected' : ''}>None</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-lg-2 col-md-6">
                            <div class="form-group">
                                <label>Animation</label>
                                <select class="form-control slide-animation">
                                    <option value="fade-in" ${slide.animation !== 'slide-up' ? 'selected' : ''}>Fade In</option>
                                    <option value="slide-up" ${slide.animation === 'slide-up' ? 'selected' : ''}>Slide Up</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Headline</label>
                                <input type="text" class="form-control slide-headline" maxlength="120" value="${escapeHtml(slide.headline || '')}">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Body</label>
                                <textarea class="form-control slide-body" rows="2" maxlength="280">${escapeHtml(slide.body || '')}</textarea>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6">
                            <div class="form-group">
                                <label>Font</label>
                                <select class="form-control slide-font">
                                    <option value="Inter" ${slide.font_family !== 'Georgia' ? 'selected' : ''}>Inter</option>
                                    <option value="Georgia" ${slide.font_family === 'Georgia' ? 'selected' : ''}>Georgia</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6">
                            <div class="form-group">
                                <label>Text Color</label>
                                <input type="color" class="form-control slide-color" value="${slide.text_color || '#ffffff'}">
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6">
                            <div class="form-group">
                                <label>Alignment</label>
                                <select class="form-control slide-align">
                                    <option value="left" ${slide.text_align !== 'center' && slide.text_align !== 'right' ? 'selected' : ''}>Left</option>
                                    <option value="center" ${slide.text_align === 'center' ? 'selected' : ''}>Center</option>
                                    <option value="right" ${slide.text_align === 'right' ? 'selected' : ''}>Right</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6">
                            <div class="form-group">
                                <label>CTA Label</label>
                                <input type="text" class="form-control slide-cta-label" maxlength="40" value="${escapeHtml(slide.cta_label || '')}">
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="form-group">
                                <label>CTA URL</label>
                                <input type="url" class="form-control slide-cta-url" value="${escapeHtml(slide.cta_url || '')}">
                            </div>
                        </div>
                    </div>
                </div>
            `;
            $('#slides_container').append(html);
            refreshSlideNumbers();
        }

        function escapeHtml(value) {
            return String(value).replace(/[&<>"']/g, function (char) {
                return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char];
            });
        }

        function refreshSlideNumbers() {
            $('.story-slide-card').each(function(index) {
                $(this).find('.slide-number').text(index + 1);
            });
        }

        function prepareSlidesPayload() {
            const payload = [];
            $('.story-slide-card').each(function () {
                const card = $(this);
                const input = card.find('.slide-media')[0];
                payload.push({
                    media_type: card.find('.slide-media-type').val(),
                    media_field: input && input.files.length ? input.name : '',
                    existing_media: card.find('.existing-media').val(),
                    headline: card.find('.slide-headline').val(),
                    body: card.find('.slide-body').val(),
                    cta_label: card.find('.slide-cta-label').val(),
                    cta_url: card.find('.slide-cta-url').val(),
                    font_family: card.find('.slide-font').val(),
                    text_color: card.find('.slide-color').val(),
                    text_align: card.find('.slide-align').val(),
                    overlay: card.find('.slide-overlay').val(),
                    animation: card.find('.slide-animation').val(),
                    fabric_data: card.find('.fabric-data-url').val(),
                    fabric_json: card.find('.fabric-json').val(),
                });
            });
            $('#slides_payload').val(JSON.stringify(payload));
        }

        function webStoriesQueryParams(params) {
            return {
                ...params,
                language_id: $('#filter_language_id').val(),
                category_id: $('#filter_category_id').val(),
                status: $('#filter_status').val(),
            };
        }

        $(document).ready(function() {
            let activeFabricCard = null;
            let fabricCanvas = null;
            let shouldHydrateFabricEditor = false;
            const canvasWidth = 360;
            const canvasHeight = 640;

            const initFabricCanvas = () => {
                if (!fabricCanvas) {
                    fabricCanvas = new fabric.Canvas('fabric_story_canvas', {
                        preserveObjectStacking: true,
                        backgroundColor: '#172033'
                    });

                    fabricCanvas.on('selection:created', syncFabricPanel);
                    fabricCanvas.on('selection:updated', syncFabricPanel);
                    fabricCanvas.on('selection:cleared', () => $('#fabric_text_value').val(''));
                    fabricCanvas.on('object:modified', syncFabricPanel);
                }
                fabricCanvas.setDimensions({ width: canvasWidth, height: canvasHeight });
                fabricCanvas.setZoom(1);
                fabricCanvas.calcOffset();
                fabricCanvas.clear();
                fabricCanvas.setBackgroundColor('#172033', fabricCanvas.renderAll.bind(fabricCanvas));
                addFabricPlaceholder();
            };

            const addFabricPlaceholder = () => {
                const rect = new fabric.Rect({
                    left: 18,
                    top: 18,
                    width: canvasWidth - 36,
                    height: canvasHeight - 36,
                    fill: '#111827',
                    stroke: '#334155',
                    strokeDashArray: [8, 8],
                    rx: 14,
                    ry: 14,
                    selectable: false,
                    evented: false,
                    role: 'placeholder'
                });
                const hint = new fabric.Textbox('Add an image or edit text', {
                    left: 50,
                    top: 292,
                    width: canvasWidth - 100,
                    textAlign: 'center',
                    fill: '#94a3b8',
                    fontSize: 18,
                    fontFamily: 'Inter',
                    selectable: false,
                    evented: false,
                    role: 'placeholder'
                });
                fabricCanvas.add(rect, hint);
                rect.sendToBack();
                hint.bringToFront();
                fabricCanvas.renderAll();
            };

            const removePlaceholders = () => {
                fabricCanvas.getObjects().forEach(object => {
                    if (object.role === 'placeholder') {
                        fabricCanvas.remove(object);
                    }
                });
            };

            const fitImageToCanvas = (img, options = {}) => {
                const scale = Math.max(canvasWidth / img.width, canvasHeight / img.height);
                img.set({
                    left: canvasWidth / 2,
                    top: canvasHeight / 2,
                    originX: 'center',
                    originY: 'center',
                    scaleX: scale,
                    scaleY: scale,
                    selectable: true,
                    evented: true,
                    hasControls: true,
                    lockUniScaling: false,
                    role: options.role || 'image'
                });
                removePlaceholders();
                fabricCanvas.add(img);
                img.sendToBack();
                fabricCanvas.setActiveObject(img);
                fabricCanvas.renderAll();
            };

            const loadFabricBackground = (card) => {
                const fileInput = card.find('.slide-media')[0];
                const existingUrl = card.find('a[target="_blank"]').attr('href');

                if (fileInput && fileInput.files && fileInput.files[0] && fileInput.files[0].type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        fabric.Image.fromURL(event.target.result, image => fitImageToCanvas(image, { role: 'slide-image' }));
                    };
                    reader.readAsDataURL(fileInput.files[0]);
                    return;
                }

                if (existingUrl) {
                    fabric.Image.fromURL(existingUrl, image => fitImageToCanvas(image, { role: 'slide-image' }), { crossOrigin: 'anonymous' });
                }
            };

            const syncFabricPanel = () => {
                const object = fabricCanvas?.getActiveObject();
                if (object && object.type === 'textbox') {
                    $('#fabric_text_value').val(object.text || '');
                    $('#fabric_text_color').val(object.fill || '#ffffff');
                    $('#fabric_font_family').val(object.fontFamily || 'Inter');
                    $('#fabric_font_size').val(object.fontSize || 30);
                    $('#fabric_opacity').val(object.opacity || 1);
                } else if (object) {
                    $('#fabric_text_value').val('');
                    $('#fabric_opacity').val(object.opacity || 1);
                }
            };

            const addFabricText = (text, fontSize, top) => {
                removePlaceholders();
                const textbox = new fabric.Textbox(text, {
                    left: 36,
                    top,
                    width: 288,
                    fill: $('#fabric_text_color').val() || '#ffffff',
                    fontFamily: $('#fabric_font_family').val() || 'Inter',
                    fontSize: Number($('#fabric_font_size').val()) || fontSize,
                    fontWeight: fontSize > 26 ? 800 : 500,
                    lineHeight: 1.15,
                    editable: true,
                    hasControls: true,
                    lockUniScaling: false
                });
                fabricCanvas.add(textbox);
                fabricCanvas.setActiveObject(textbox);
                fabricCanvas.renderAll();
            };

            const hydrateFabricEditor = (card) => {
                initFabricCanvas();

                const storedJson = card.find('.fabric-json').val();
                if (storedJson && storedJson !== '{}') {
                    try {
                        fabricCanvas.loadFromJSON(JSON.parse(storedJson), () => {
                            fabricCanvas.setDimensions({ width: canvasWidth, height: canvasHeight });
                            fabricCanvas.getObjects().forEach(object => {
                                object.set({
                                    selectable: object.role !== 'placeholder',
                                    evented: object.role !== 'placeholder',
                                    hasControls: object.role !== 'placeholder'
                                });
                            });
                            fabricCanvas.calcOffset();
                            fabricCanvas.requestRenderAll();
                            if (fabricCanvas.getObjects().length === 0) addFabricPlaceholder();
                        });
                        return;
                    } catch (e) {
                        console.warn('Unable to restore Fabric scene.', e);
                    }
                }

                loadFabricBackground(card);
                const headline = card.find('.slide-headline').val();
                const body = card.find('.slide-body').val();
                addFabricText(headline || 'Add your headline', 30, 410);
                if (body) addFabricText(body, 18, 500);
                fabricCanvas.calcOffset();
                fabricCanvas.requestRenderAll();
            };

            const addFabricImageFromFile = (file) => {
                if (!file || !file.type.startsWith('image/')) {
                    showErrorToast('Please select an image file.');
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    fabric.Image.fromURL(event.target.result, image => {
                        const scale = Math.min((canvasWidth * 0.72) / image.width, (canvasHeight * 0.72) / image.height, 1);
                        image.set({
                            left: canvasWidth / 2,
                            top: canvasHeight / 2,
                            originX: 'center',
                            originY: 'center',
                            scaleX: scale,
                            scaleY: scale,
                            selectable: true,
                            evented: true,
                            hasControls: true,
                            role: 'image'
                        });
                        removePlaceholders();
                        fabricCanvas.add(image);
                        fabricCanvas.setActiveObject(image);
                        fabricCanvas.renderAll();
                    });
                };
                reader.readAsDataURL(file);
            };

            const updateSelectedObject = (props) => {
                const object = fabricCanvas?.getActiveObject();
                if (!object) return;
                object.set(props);
                fabricCanvas.renderAll();
            };

            $(document).on('click', '.open-fabric-editor', function() {
                activeFabricCard = $(this).closest('.story-slide-card');
                shouldHydrateFabricEditor = true;
                $('#fabricEditorModal').modal('show');
            });

            $('#fabricEditorModal').on('shown.bs.modal', function() {
                if (!shouldHydrateFabricEditor || !activeFabricCard) return;
                shouldHydrateFabricEditor = false;
                window.requestAnimationFrame(() => hydrateFabricEditor(activeFabricCard));
            });

            $('#fabric_add_headline').on('click', () => addFabricText('Headline text', 30, 420));
            $('#fabric_add_body').on('click', () => addFabricText('Body text', 18, 500));
            $('#fabric_add_image_file').on('change', function() {
                addFabricImageFromFile(this.files[0]);
                $(this).val('');
            });
            $('#fabric_delete_object').on('click', () => {
                const object = fabricCanvas?.getActiveObject();
                if (object) {
                    fabricCanvas.remove(object);
                    fabricCanvas.discardActiveObject();
                    fabricCanvas.renderAll();
                }
            });
            $('#fabric_font_family').on('change', function() {
                updateSelectedObject({ fontFamily: $(this).val() });
            });
            $('#fabric_font_size').on('input', function() {
                updateSelectedObject({ fontSize: Number($(this).val()) || 30 });
            });
            $('#fabric_text_value').on('input', function() {
                const object = fabricCanvas?.getActiveObject();
                if (object && object.type === 'textbox') {
                    object.set('text', $(this).val());
                    fabricCanvas.renderAll();
                }
            });
            $('#fabric_text_color').on('input', function() {
                const object = fabricCanvas?.getActiveObject();
                if (object && object.type === 'textbox') {
                    object.set('fill', $(this).val());
                    fabricCanvas.renderAll();
                }
            });
            $('#fabric_opacity').on('input', function() {
                updateSelectedObject({ opacity: Number($(this).val()) || 1 });
            });
            $('#fabric_bold').on('click', function() {
                const object = fabricCanvas?.getActiveObject();
                if (object && object.type === 'textbox') {
                    object.set('fontWeight', object.fontWeight === 'bold' || object.fontWeight === 800 ? 400 : 'bold');
                    fabricCanvas.renderAll();
                }
            });
            $('#fabric_italic').on('click', function() {
                const object = fabricCanvas?.getActiveObject();
                if (object && object.type === 'textbox') {
                    object.set('fontStyle', object.fontStyle === 'italic' ? 'normal' : 'italic');
                    fabricCanvas.renderAll();
                }
            });
            $('#fabric_underline').on('click', function() {
                const object = fabricCanvas?.getActiveObject();
                if (object && object.type === 'textbox') {
                    object.set('underline', !object.underline);
                    fabricCanvas.renderAll();
                }
            });
            $('[data-fabric-align]').on('click', function() {
                updateSelectedObject({ textAlign: $(this).data('fabric-align') });
            });
            $('#fabric_bring_forward').on('click', function() {
                const object = fabricCanvas?.getActiveObject();
                if (object) {
                    object.bringForward();
                    fabricCanvas.renderAll();
                }
            });
            $('#fabric_send_backward').on('click', function() {
                const object = fabricCanvas?.getActiveObject();
                if (object) {
                    object.sendBackwards();
                    fabricCanvas.renderAll();
                }
            });
            $('#fabric_save_slide').on('click', function() {
                if (!activeFabricCard || !fabricCanvas) return;
                fabricCanvas.discardActiveObject();
                fabricCanvas.renderAll();
                activeFabricCard.find('.fabric-data-url').val(fabricCanvas.toDataURL({
                    format: 'jpeg',
                    quality: 0.86,
                    multiplier: 2
                }));
                activeFabricCard.find('.fabric-json').val(JSON.stringify(fabricCanvas.toJSON(['role'])));
                activeFabricCard.find('.slide-media-type').val('image');
                showSuccessToast('Fabric slide design saved. Submit the story to store it.');
                $('#fabricEditorModal').modal('hide');
            });

            if (existingSlides.length) {
                existingSlides.forEach(renderSlide);
            } else {
                renderSlide();
            }

            $('#add_slide').on('click', () => renderSlide());
            $(document).on('click', '.remove-slide', function() {
                if ($('.story-slide-card').length <= 1) {
                    showErrorToast('At least one slide is required.');
                    return;
                }
                $(this).closest('.story-slide-card').remove();
                refreshSlideNumbers();
            });

            document.querySelector('#{{ $isEdit ? 'update_form' : 'create_form' }}').addEventListener('submit', prepareSlidesPayload, true);

            $('#story_language_id').on('change', function() {
                fetchList('{{ route('get_category_by_language') }}', { language_id: $(this).val() }, '#story_category_id');
            });

            $('#filter_language_id').on('change', function() {
                fetchList('{{ route('get_category_by_language') }}', { language_id: $(this).val() }, '#filter_category_id');
                $('#table').bootstrapTable('refresh');
            });
            $('#filter_category_id, #filter_status').on('change', function() {
                $('#table').bootstrapTable('refresh');
            });
        });
    </script>
@endsection
