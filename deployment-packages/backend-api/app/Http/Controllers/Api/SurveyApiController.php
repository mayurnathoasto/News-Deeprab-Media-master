<?php

namespace App\Http\Controllers\Api;

use App\Models\SurveyOption;
use App\Models\SurveyQuestion;
use App\Models\SurveyResult;
use App\Services\ResponseService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SurveyApiController extends BaseApiController
{
    private function voterIdentity(Request $request): array
    {
        $userId = Auth::check() ? (int) Auth::id() : 0;
        $voterKey = trim((string) $request->input('voter_key', ''));
        $hashedKey = $voterKey !== '' ? hash('sha256', $voterKey) : null;

        return [$userId, $hashedKey];
    }

    private function hasVoted(int $questionId, int $userId, ?string $voterKey): bool
    {
        $query = SurveyResult::where('question_id', $questionId);
        if ($userId > 0) {
            $query->where('user_id', $userId);
        } elseif ($voterKey) {
            $query->where('voter_key', $voterKey);
        } else {
            return false;
        }

        return $query->exists();
    }

    private function hydratePoll(SurveyQuestion $question, int $userId, ?string $voterKey): SurveyQuestion
    {
        $question->load(['surveyOptions' => fn ($query) => $query->withCount('result')]);
        $totalVotes = $question->surveyOptions->sum(
            fn ($option) => (int) $option->result_count + (int) ($option->manual_votes ?? 0)
        );

        $question->surveyOptions->each(function ($option) use ($totalVotes) {
            $votes = (int) $option->result_count + (int) ($option->manual_votes ?? 0);
            $option->votes = $votes;
            $option->percentage = $totalVotes > 0 ? round(($votes * 100) / $totalVotes, 2) : 0;
        });

        $question->total_votes = $totalVotes;
        $question->has_voted = $this->hasVoted((int) $question->id, $userId, $voterKey);

        return $question;
    }

    public function getQuestion(Request $request)
    {
        try {
            $languageId = $this->resolveLanguageId($request);
            [$userId, $voterKey] = $this->voterIdentity($request);
            $limit = min(max((int) $request->input('limit', 2), 1), 10);
            $offset = max((int) $request->input('offset', 0), 0);

            $query = SurveyQuestion::where(['status' => 1, 'language_id' => $languageId]);
            $total = $query->count();
            $questions = $query->orderByDesc('id')->offset($offset)->limit($limit)->get();
            $questions->transform(fn ($question) => $this->hydratePoll($question, $userId, $voterKey));

            return ResponseService::successResponse(__('Data fetched successfully'), [
                'total' => $total,
                'data' => $questions,
            ]);
        } catch (Exception $e) {
            return ResponseService::logErrorResponse($e, 'SurveyApiController -> getQuestion');
        }
    }

    public function getQuestionResult(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'question_id' => 'required|integer|exists:tbl_survey_question,id',
            ]);
            if ($validator->fails()) {
                return ResponseService::validationError($validator->errors()->first());
            }

            [$userId, $voterKey] = $this->voterIdentity($request);
            $question = SurveyQuestion::where('status', 1)->findOrFail($request->question_id);
            $question = $this->hydratePoll($question, $userId, $voterKey);

            return ResponseService::successResponse(__('Data fetched successfully'), [
                'total' => 1,
                'data' => [$question],
            ]);
        } catch (Exception $e) {
            return ResponseService::logErrorResponse($e, 'SurveyApiController -> getQuestionResult');
        }
    }

    public function setQuestionResult(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'question_id' => 'required|integer|exists:tbl_survey_question,id',
            'option_id' => 'required|integer|exists:tbl_survey_option,id',
            'voter_key' => Auth::check() ? 'nullable|string|max:255' : 'required|string|max:255',
        ]);
        if ($validator->fails()) {
            return ResponseService::validationError($validator->errors()->first());
        }

        try {
            [$userId, $voterKey] = $this->voterIdentity($request);
            $option = SurveyOption::where('id', $request->option_id)
                ->where('question_id', $request->question_id)
                ->firstOrFail();

            DB::transaction(function () use ($request, $userId, $voterKey, $option) {
                $existing = SurveyResult::where('question_id', $request->question_id)
                    ->when($userId > 0, fn ($query) => $query->where('user_id', $userId))
                    ->when($userId === 0, fn ($query) => $query->where('voter_key', $voterKey))
                    ->lockForUpdate()
                    ->first();

                if (!$existing) {
                    SurveyResult::create([
                        'user_id' => $userId,
                        'voter_key' => $voterKey,
                        'question_id' => $request->question_id,
                        'option_id' => $option->id,
                    ]);
                }
            });

            $question = SurveyQuestion::findOrFail($request->question_id);
            $question = $this->hydratePoll($question, $userId, $voterKey);

            return ResponseService::successResponse(__('Vote recorded successfully'), $question);
        } catch (Exception $e) {
            return ResponseService::logErrorResponse($e, 'SurveyApiController -> setQuestionResult');
        }
    }
}
