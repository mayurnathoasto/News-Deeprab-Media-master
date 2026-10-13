<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SeedEditorialDemo extends Command
{
    protected $signature = 'iqnews:seed-editorial-demo';

    protected $description = 'Create the IQ News editorial demo subcategories, tag, and presentation articles.';

    public function handle(): int
    {
        $languageId = (int) (DB::table('tbl_languages')->where('code', 'en')->value('id') ?: 1);
        $categories = DB::table('tbl_category')
            ->where('language_id', $languageId)
            ->orderBy('id')
            ->get()
            ->keyBy('slug');

        if ($categories->isEmpty()) {
            $this->error('No English categories were found.');
            return self::FAILURE;
        }

        $trendingTagId = $this->ensureTrendingTag($languageId);
        $lifestyleSubcategories = $this->ensureLifestyleSubcategories($languageId, $categories);
        $articles = $this->articleBlueprints();
        $created = 0;

        DB::transaction(function () use (
            $articles,
            $categories,
            $languageId,
            $trendingTagId,
            $lifestyleSubcategories,
            &$created
        ) {
            foreach ($articles as $categorySlug => $items) {
                $category = $categories->get($categorySlug);
                if (!$category) {
                    continue;
                }

                $categoryImage = $this->resolveCategoryImage($category);

                foreach ($items as $index => $item) {
                    $slug = Str::slug($item['title']);
                    $subcategoryId = 0;
                    if (!empty($item['subcategory'])) {
                        $subcategoryId = (int) ($lifestyleSubcategories[$item['subcategory']] ?? 0);
                    }
                    $articleImage = !empty($item['image']) &&
                        Storage::disk('public')->exists($item['image'])
                        ? $item['image']
                        : $categoryImage;

                    $publishedAt = Carbon::now()->subMinutes(($category->id * 45) + ($index * 11));
                    $exists = DB::table('tbl_news')->where('slug', $slug)->exists();

                    DB::table('tbl_news')->updateOrInsert(
                        ['slug' => $slug],
                        [
                            'language_id' => $languageId,
                            'category_id' => $category->id,
                            'subcategory_id' => $subcategoryId,
                            'tag_id' => $index === 0 ? (string) $trendingTagId : '',
                            'location_id' => 0,
                            'title' => $item['title'],
                            'image' => $articleImage,
                            'date' => $publishedAt->format('Y-m-d H:i:s'),
                            'published_date' => $publishedAt->format('Y-m-d'),
                            'content_type' => 'standard_post',
                            'content_value' => '',
                            'description' => sprintf(
                                '<p>%s</p><p>%s</p><p><strong>IQ News explainer:</strong> This presentation article summarizes publicly available information and is intended for demonstration of the editorial layout.</p>',
                                e($item['summary']),
                                e($item['detail'])
                            ),
                            'summarized_description' => $item['summary'],
                            'user_id' => 0,
                            'admin_id' => 0,
                            'show_till' => null,
                            'status' => 1,
                            'is_draft' => 0,
                            'is_clone' => 0,
                            'is_comment' => 1,
                            'is_short_news' => 0,
                            'counter' => 0,
                            'meta_title' => $item['title'],
                            'meta_description' => $item['summary'],
                            'meta_keyword' => 'IQ News, explainer, public information, trending',
                            'schema_markup' => '',
                            'updated_at' => now(),
                            'created_at' => $exists ? DB::raw('created_at') : now(),
                        ]
                    );

                    if (!$exists) {
                        $created++;
                    }
                }
            }
        });

        $this->info("Editorial demo ready. {$created} new articles were added.");
        return self::SUCCESS;
    }

    private function ensureTrendingTag(int $languageId): int
    {
        DB::table('tbl_tag')->updateOrInsert(
            ['language_id' => $languageId, 'slug' => 'trending'],
            [
                'tag_name' => 'Trending',
                'meta_title' => 'Trending News',
                'meta_description' => 'Trending reports and explainers from IQ News.',
                'meta_keyword' => 'trending, IQ News',
                'schema_markup' => '',
                'og_image' => null,
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        return (int) DB::table('tbl_tag')
            ->where('language_id', $languageId)
            ->where('slug', 'trending')
            ->value('id');
    }

    private function ensureLifestyleSubcategories(int $languageId, $categories): array
    {
        $definitions = [
            'Health+' => ['slug' => 'health-plus', 'category' => 'health', 'order' => 20],
            'Beauty' => ['slug' => 'beauty', 'category' => 'health', 'order' => 21],
            'Food' => ['slug' => 'food', 'category' => 'health', 'order' => 22],
            'Style' => ['slug' => 'style', 'category' => 'entertainment', 'order' => 20],
            'Relationships' => ['slug' => 'relationships', 'category' => 'entertainment', 'order' => 21],
            'Parenting' => ['slug' => 'parenting', 'category' => 'entertainment', 'order' => 22],
        ];
        $ids = [];

        foreach ($definitions as $name => $definition) {
            $category = $categories->get($definition['category']);
            if (!$category) {
                continue;
            }

            DB::table('tbl_subcategory')->updateOrInsert(
                ['language_id' => $languageId, 'slug' => $definition['slug']],
                [
                    'category_id' => $category->id,
                    'subcategory_name' => $name,
                    'row_order' => $definition['order'],
                    'image' => '',
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );

            $ids[$name] = (int) DB::table('tbl_subcategory')
                ->where('language_id', $languageId)
                ->where('slug', $definition['slug'])
                ->value('id');
        }

        return $ids;
    }

    private function resolveCategoryImage(object $category): ?string
    {
        $rawImage = DB::table('tbl_news')
            ->where('category_id', $category->id)
            ->whereNotNull('image')
            ->where('image', '!=', '')
            ->orderByDesc('id')
            ->value('image');

        if (!$rawImage) {
            $rawImage = $category->image ?? null;
        }

        if (!$rawImage || Str::startsWith($rawImage, ['http://', 'https://'])) {
            return $rawImage;
        }

        return url(Storage::url($rawImage));
    }

    private function articleBlueprints(): array
    {
        return [
            'technology' => [
                [
                    'title' => 'Digital Public Infrastructure Is Reshaping Everyday Services',
                    'summary' => 'Open digital systems are making payments and public services easier to access.',
                    'detail' => 'Interoperable platforms can lower costs while strong privacy and security controls remain essential.',
                ],
                [
                    'title' => 'Small Language AI Models Bring Useful Tools Closer to Communities',
                    'summary' => 'Compact language models are expanding access to translation and local-language services.',
                    'detail' => 'Researchers are focusing on representative datasets, evaluation and responsible deployment.',
                ],
                [
                    'title' => 'Cybersecurity Basics Every Connected Household Should Practice',
                    'summary' => 'Updates, password managers and multifactor authentication reduce common digital risks.',
                    'detail' => 'Simple habits provide a practical first line of defence against phishing and account takeover.',
                ],
            ],
            'science' => [
                [
                    'title' => 'Citizen Science Projects Turn Everyday Observations into Research',
                    'summary' => 'Public participation is helping researchers track biodiversity, weather and the night sky.',
                    'detail' => 'Clear protocols and expert review allow large volunteer datasets to support formal studies.',
                ],
                [
                    'title' => 'Open Research Data Helps Scientific Results Travel Further',
                    'summary' => 'Well-documented datasets make findings easier to verify and reuse.',
                    'detail' => 'Open repositories also help students and smaller institutions participate in global research.',
                ],
                [
                    'title' => 'New Telescope Surveys Will Map a More Detailed Night Sky',
                    'summary' => 'Wide-field instruments are preparing to catalogue changing objects across the universe.',
                    'detail' => 'Repeated observations will help astronomers study asteroids, supernovae and distant galaxies.',
                ],
            ],
            'business' => [
                [
                    'title' => 'Digital Payments Give Small Retailers Better Business Visibility',
                    'summary' => 'Transaction records can help neighbourhood businesses understand demand and cash flow.',
                    'detail' => 'The benefits are strongest when payment tools remain affordable, reliable and easy to use.',
                ],
                [
                    'title' => 'Why Supply Chain Resilience Is Now a Boardroom Priority',
                    'summary' => 'Companies are diversifying suppliers and improving inventory visibility.',
                    'detail' => 'Resilient networks balance efficiency with alternative routes, vendors and contingency planning.',
                ],
                [
                    'title' => 'Green Finance Moves from Pledges to Measurable Projects',
                    'summary' => 'Investors increasingly expect climate claims to be linked with transparent outcomes.',
                    'detail' => 'Common reporting standards can help capital reach credible transition and adaptation projects.',
                ],
            ],
            'religion' => [
                [
                    'title' => 'Community Kitchens Show How Faith Traditions Support Public Service',
                    'summary' => 'Volunteer-led kitchens continue to provide meals and strengthen neighbourhood ties.',
                    'detail' => 'The model combines shared responsibility, dignity and practical support for people in need.',
                ],
                [
                    'title' => 'Protecting Sacred Heritage Requires Conservation and Local Partnership',
                    'summary' => 'Historic places benefit when technical restoration includes community knowledge.',
                    'detail' => 'Sustainable visitor management can protect architecture while respecting living traditions.',
                ],
                [
                    'title' => 'Interfaith Dialogue Creates Space for Shared Civic Action',
                    'summary' => 'Local initiatives bring communities together around health, education and disaster relief.',
                    'detail' => 'Regular cooperation builds trust before communities face periods of stress or uncertainty.',
                ],
            ],
            'health' => [
                [
                    'title' => 'Preventive Health Checks Work Best When Follow-Up Is Simple',
                    'summary' => 'Screening programmes need clear referral paths to turn early detection into better care.',
                    'detail' => 'Accessible counselling and affordable treatment are as important as the initial test.',
                    'subcategory' => 'Health+',
                    'image' => 'news/iq-editorial-demo/health-plus.jpg',
                ],
                [
                    'title' => 'A Practical Skin Care Routine Starts with Sun Protection',
                    'summary' => 'Gentle cleansing, moisturising and daily sunscreen form a reliable basic routine.',
                    'detail' => 'People with persistent irritation should seek qualified medical advice instead of adding more products.',
                    'subcategory' => 'Beauty',
                    'image' => 'news/iq-editorial-demo/beauty.jpg',
                ],
                [
                    'title' => 'Balanced Home Meals Can Be Built from Familiar Ingredients',
                    'summary' => 'Vegetables, pulses, grains and appropriate portions support everyday nutrition.',
                    'detail' => 'Planning simple meals also helps households reduce food waste and unnecessary expense.',
                    'subcategory' => 'Food',
                    'image' => 'news/iq-editorial-demo/food.jpg',
                ],
            ],
            'entertainment' => [
                [
                    'title' => 'Independent Designers Are Taking Regional Textiles to New Audiences',
                    'summary' => 'Contemporary collections are giving traditional materials fresh visibility.',
                    'detail' => 'Responsible partnerships can support artisans while preserving the identity of each craft.',
                    'subcategory' => 'Style',
                    'image' => 'news/iq-editorial-demo/style.jpg',
                ],
                [
                    'title' => 'Healthy Relationships Depend on Clear and Respectful Communication',
                    'summary' => 'Listening, boundaries and honest expectations help people navigate disagreements.',
                    'detail' => 'Consistent respect matters more than winning a single argument.',
                    'subcategory' => 'Relationships',
                    'image' => 'news/iq-editorial-demo/relationships.jpg',
                ],
                [
                    'title' => 'Family Reading Time Builds Language Skills and Lasting Routines',
                    'summary' => 'Regular shared reading supports vocabulary, attention and connection.',
                    'detail' => 'Children benefit most when books match their interests and reading remains pressure-free.',
                    'subcategory' => 'Parenting',
                    'image' => 'news/iq-editorial-demo/parenting.jpg',
                ],
            ],
            'sports' => [
                [
                    'title' => 'Community Sports Facilities Expand Participation at Every Age',
                    'summary' => 'Safe local grounds make regular activity more practical for children and adults.',
                    'detail' => 'Inclusive schedules and affordable coaching help facilities serve a wider population.',
                ],
                [
                    'title' => 'Sports Science Is Changing How Athletes Recover Between Events',
                    'summary' => 'Training loads, sleep and nutrition are increasingly measured together.',
                    'detail' => 'Individual plans help athletes improve performance while reducing avoidable injury risk.',
                ],
                [
                    'title' => 'Women Coaches Are Building Stronger Pathways into Competitive Sport',
                    'summary' => 'Visible leadership and mentoring are widening opportunities across disciplines.',
                    'detail' => 'Long-term progress also depends on safe workplaces and transparent selection systems.',
                ],
            ],
            'politics' => [
                [
                    'title' => 'How Citizens Can Track Public Projects and Local Budgets',
                    'summary' => 'Open records and council meetings help residents follow decisions that affect daily life.',
                    'detail' => 'Clear public dashboards make spending and project timelines easier to understand.',
                ],
                [
                    'title' => 'Voter Registration Drives Focus on First-Time Electors',
                    'summary' => 'Awareness campaigns explain eligibility, documents and correction procedures.',
                    'detail' => 'Checking electoral records early gives voters time to resolve common errors.',
                ],
                [
                    'title' => 'Local Governments Expand Digital Channels for Civic Feedback',
                    'summary' => 'Online grievance systems can make issue reporting faster and more transparent.',
                    'detail' => 'Effective systems still need clear response standards and offline access for inclusion.',
                ],
            ],
            'education' => [
                [
                    'title' => 'Open Learning Libraries Give Teachers More Ways to Adapt Lessons',
                    'summary' => 'Reusable materials help educators tailor examples to local classrooms.',
                    'detail' => 'Quality review and accessible formats remain important as collections grow.',
                ],
                [
                    'title' => 'Digital Literacy Now Includes Verification and Online Safety',
                    'summary' => 'Students need practical skills for evaluating sources and protecting personal information.',
                    'detail' => 'Classroom exercises can make responsible online behaviour concrete and memorable.',
                ],
                [
                    'title' => 'School Libraries Are Becoming Flexible Learning and Media Spaces',
                    'summary' => 'Libraries increasingly combine books, research guidance and collaborative activities.',
                    'detail' => 'Trained staff help students navigate both print collections and digital resources.',
                ],
            ],
            'top-news' => [
                [
                    'title' => 'Early Warning Networks Turn Forecasts into Practical Local Action',
                    'summary' => 'Timely alerts are most effective when communities know exactly how to respond.',
                    'detail' => 'Preparedness plans connect scientific forecasts with trusted communication and local action.',
                ],
                [
                    'title' => 'Public Data Dashboards Make Complex Issues Easier to Follow',
                    'summary' => 'Clear visual reporting can improve understanding of health, climate and civic services.',
                    'detail' => 'Dashboards should publish methods, update schedules and accessible explanations.',
                ],
                [
                    'title' => 'Urban Heat Planning Brings Shade Water and Health Alerts Together',
                    'summary' => 'Cities are combining public spaces, emergency planning and neighbourhood outreach.',
                    'detail' => 'Heat action plans work best when they identify vulnerable groups before extreme conditions arrive.',
                ],
            ],
        ];
    }
}
