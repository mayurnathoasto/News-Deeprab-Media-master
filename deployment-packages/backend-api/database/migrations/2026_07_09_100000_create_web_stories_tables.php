<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_web_stories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('language_id')->constrained('tbl_languages')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('tbl_category')->restrictOnDelete();
            $table->string('title');
            $table->string('slug');
            $table->text('summary')->nullable();
            $table->string('cover_image')->nullable();
            $table->unsignedTinyInteger('status')->default(0);
            $table->dateTime('published_at')->nullable();
            $table->dateTime('expires_at')->nullable();
            $table->unsignedInteger('row_order')->default(0);
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->text('meta_keyword')->nullable();
            $table->timestamps();

            $table->unique(['language_id', 'slug'], 'web_stories_lang_slug_unique');
            $table->index(['language_id', 'category_id', 'status', 'published_at'], 'web_stories_public_idx');
        });

        Schema::create('tbl_web_story_pages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('web_story_id')->constrained('tbl_web_stories')->cascadeOnDelete();
            $table->unsignedInteger('page_order')->default(0);
            $table->string('media_type')->default('image');
            $table->string('media_path')->nullable();
            $table->text('headline')->nullable();
            $table->text('body')->nullable();
            $table->string('cta_label')->nullable();
            $table->string('cta_url')->nullable();
            $table->json('scene_json')->nullable();
            $table->timestamps();

            $table->index(['web_story_id', 'page_order'], 'web_story_pages_order_idx');
        });

        Schema::create('tbl_web_story_metrics_daily', function (Blueprint $table) {
            $table->id();
            $table->foreignId('web_story_id')->constrained('tbl_web_stories')->cascadeOnDelete();
            $table->date('metric_date');
            $table->unsignedInteger('opens')->default(0);
            $table->unsignedInteger('completions')->default(0);
            $table->unsignedInteger('slide_exits')->default(0);
            $table->unsignedInteger('outbound_clicks')->default(0);
            $table->timestamps();

            $table->unique(['web_story_id', 'metric_date'], 'web_story_metrics_day_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_web_story_metrics_daily');
        Schema::dropIfExists('tbl_web_story_pages');
        Schema::dropIfExists('tbl_web_stories');
    }
};
