const DUMMY_IMG_HERO = 'https://placehold.co/800x500/1e293b/ffffff?text=Top+Story'
const DUMMY_IMG_MD = 'https://placehold.co/400x300/334155/ffffff?text=News'

export const DEMO_NEWS_FLAT = [
  { id: 'd1', title: 'Deepika Noida Murder Case Updates', slug: 'demo-1', category_name: 'Top Stories', image: DUMMY_IMG_HERO, created_at: new Date().toISOString() },
  { id: 'd2', title: 'Bihar: CM Nitish Kumar Expands Cabinet', slug: 'demo-2', category_name: 'Politics', image: DUMMY_IMG_MD, created_at: new Date().toISOString() },
  { id: 'd3', title: 'Economic Growth Projected at 7%', slug: 'demo-3', category_name: 'Business', image: DUMMY_IMG_MD, created_at: new Date().toISOString() },
  { id: 'd4', title: 'New Electric Vehicles Launched', slug: 'demo-4', category_name: 'Auto', image: DUMMY_IMG_MD, created_at: new Date().toISOString() },
  { id: 'd5', title: 'Stock Markets Hit Record Highs', slug: 'demo-5', category_name: 'Finance', image: DUMMY_IMG_MD, created_at: new Date().toISOString() },
  { id: 'd6', title: 'Global Tech Summit 2024 Highlights', slug: 'demo-6', category_name: 'Technology', image: DUMMY_IMG_MD, created_at: new Date().toISOString() },
  { id: 'd7', title: 'Health Benefits of Daily Meditation', slug: 'demo-7', category_name: 'Health', image: DUMMY_IMG_MD, created_at: new Date().toISOString() },
  { id: 'd8', title: 'India Wins T20 World Cup Final', slug: 'demo-8', category_name: 'Sports', image: DUMMY_IMG_MD, created_at: new Date().toISOString() },
  { id: 'd9', title: 'Hollywood Blockbuster Breaks Records', slug: 'demo-9', category_name: 'Entertainment', image: DUMMY_IMG_MD, created_at: new Date().toISOString() },
  { id: 'd10', title: 'Scientists Discover New Planet', slug: 'demo-10', category_name: 'Science', image: DUMMY_IMG_MD, created_at: new Date().toISOString() },
  { id: 'd11', title: 'Supreme Court Passes Landmark Ruling', slug: 'demo-11', category_name: 'Law', image: DUMMY_IMG_MD, created_at: new Date().toISOString() },
  { id: 'd12', title: 'Local Farmers Protest Minimum Price', slug: 'demo-12', category_name: 'Local', image: DUMMY_IMG_MD, created_at: new Date().toISOString() },
  { id: 'd13', title: 'Weather Alert: Heavy Rains Expected', slug: 'demo-13', category_name: 'Weather', image: DUMMY_IMG_MD, created_at: new Date().toISOString() }
]

export const DEMO_CATEGORIES = {
  top: DEMO_NEWS_FLAT.slice(0, 11),
  world: DEMO_NEWS_FLAT.slice(2, 8),
  business: DEMO_NEWS_FLAT.slice(3, 9),
  gallery: DEMO_NEWS_FLAT.slice(0, 6),
  sports: DEMO_NEWS_FLAT.slice(4, 10),
  entertainment: DEMO_NEWS_FLAT.slice(5, 11),
  tech: DEMO_NEWS_FLAT.slice(6, 12),
  health: DEMO_NEWS_FLAT.slice(1, 7),
  more: DEMO_NEWS_FLAT.slice(0, 8),
  breaking: [DEMO_NEWS_FLAT[0], DEMO_NEWS_FLAT[1], DEMO_NEWS_FLAT[2]]
}
