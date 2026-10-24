<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('tbl_survey_option', function (Blueprint $table) {
            if (!Schema::hasColumn('tbl_survey_option', 'manual_votes')) {
                $table->unsignedInteger('manual_votes')->default(0)->after('counter');
            }
        });

        Schema::table('tbl_survey_result', function (Blueprint $table) {
            if (!Schema::hasColumn('tbl_survey_result', 'voter_key')) {
                $table->string('voter_key', 64)->nullable()->after('user_id');
                $table->unique(['question_id', 'voter_key'], 'survey_question_voter_unique');
            }
        });
    }

    public function down(): void
    {
        Schema::table('tbl_survey_option', function (Blueprint $table) {
            if (Schema::hasColumn('tbl_survey_option', 'manual_votes')) {
                $table->dropColumn('manual_votes');
            }
        });

        Schema::table('tbl_survey_result', function (Blueprint $table) {
            if (Schema::hasColumn('tbl_survey_result', 'voter_key')) {
                $table->dropUnique('survey_question_voter_unique');
                $table->dropColumn('voter_key');
            }
        });
    }
};
