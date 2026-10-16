<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebStoryMetricDaily extends Model
{
    use HasFactory;

    protected $table = 'tbl_web_story_metrics_daily';

    protected $fillable = [
        'web_story_id',
        'metric_date',
        'opens',
        'completions',
        'slide_exits',
        'outbound_clicks',
    ];

    protected $casts = [
        'metric_date' => 'date',
        'opens' => 'integer',
        'completions' => 'integer',
        'slide_exits' => 'integer',
        'outbound_clicks' => 'integer',
    ];
}
