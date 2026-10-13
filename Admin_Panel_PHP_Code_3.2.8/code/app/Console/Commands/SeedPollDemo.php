<?php

namespace App\Console\Commands;

use App\Models\Language;
use App\Models\SurveyOption;
use App\Models\SurveyQuestion;
use Illuminate\Console\Command;

class SeedPollDemo extends Command
{
    protected $signature = 'iqnews:seed-poll-demo';
    protected $description = 'Create an idempotent IQ News homepage poll';

    public function handle(): int
    {
        $language = Language::where('status', 1)->orderBy('id')->first();
        if (!$language) {
            $this->error('No active language found.');
            return self::FAILURE;
        }

        $question = SurveyQuestion::firstOrCreate(
            ['question' => 'Which type of IQ News coverage would you like to see more often?', 'language_id' => $language->id],
            ['status' => 1]
        );
        $question->update(['status' => 1]);

        foreach (['Local and city news', 'Technology explainers', 'Business and economy', 'Health and lifestyle'] as $option) {
            SurveyOption::firstOrCreate(
                ['question_id' => $question->id, 'options' => $option],
                ['counter' => 0, 'manual_votes' => 0]
            );
        }

        $this->info('IQ News demonstration poll is ready.');
        return self::SUCCESS;
    }
}
