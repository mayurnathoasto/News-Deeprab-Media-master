'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import {
  getBreaingNewsApi,
  getNewsApi,
  getVideoNewsApi,
  getWebStoriesApi
} from '@/utils/api/api'
import { currentLanguageSelector } from '../store/reducers/languageReducer'
import { categoriesSelector } from '../store/reducers/CategoriesReducer'
import { settingsSelector } from '../store/reducers/settingsReducer'
import Layout from '../layout/Layout'
import Loader from '../commonComponents/Loader'
import NoDataFound from '../commonComponents/NoDataFound'
import WebStoriesRail from '../webStories/WebStoriesRail'
import {
  CategoryEditorialSection,
  CityNewsSection,
  ExclusiveSection,
  LeadNewsSection,
  LifestyleSection,
  MoreStoriesSection,
  MultiColumnNewsSection,
  TrendingSection,
  VideoNewsSection,
  articleHref
} from './EditorialSections'

const extractItems = (response) => response?.value?.data?.data?.data || []

const uniqueItems = (items) =>
  Array.from(
    new Map(
      items
        .filter(Boolean)
        .map((item) => [`${item.source_type || 'news'}-${item.id}-${item.slug}`, item])
    ).values()
  )

const BreakingTicker = ({ items, langCode }) => {
  if (!items?.length) return null

  return (
    <div className="iq-breaking-strip" aria-label="Breaking news">
      <div className="container iq-breaking-inner">
        <strong><i aria-hidden="true" /> Breaking</strong>
        <div className="iq-breaking-links">
          <div className="iq-breaking-track">
            {[...items.slice(0, 6), ...items.slice(0, 6)].map((item, index) => (
              <Link
                href={articleHref(item, langCode, 'breaking')}
                key={`breaking-${item.id}-${index}`}
                aria-hidden={index >= Math.min(6, items.length) ? 'true' : undefined}
                tabIndex={index >= Math.min(6, items.length) ? -1 : undefined}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const HomePage = () => {
  const [loading, setLoading] = useState(true)
  const [news, setNews] = useState([])
  const [breakingNews, setBreakingNews] = useState([])
  const [videos, setVideos] = useState([])
  const [webStories, setWebStories] = useState([])

  const currentLanguage = useSelector(currentLanguageSelector)
  const categories = useSelector(categoriesSelector)
  const settingsData = useSelector(settingsSelector)
  const adsenseUrl = settingsData?.data?.web_setting?.google_adsense

  useEffect(() => {
    if (!currentLanguage?.code) return

    const fetchHomepageData = async () => {
      setLoading(true)
      const language_code = currentLanguage.code

      const responses = await Promise.allSettled([
        getNewsApi.getNews({ offset: 0, limit: 100, language_code }),
        getBreaingNewsApi.getBreakingNews({ offset: 0, limit: 20, language_code }),
        getVideoNewsApi.getVideoNews({ offset: 0, limit: 20, language_code }),
        getWebStoriesApi.getWebStories({ offset: 0, limit: 12, language_code })
      ])

      setNews(extractItems(responses[0]))
      setBreakingNews(extractItems(responses[1]))
      setVideos(extractItems(responses[2]))
      setWebStories(extractItems(responses[3]))
      setLoading(false)
    }

    fetchHomepageData()
  }, [currentLanguage?.code])

  const categoryNewsMap = useMemo(
    () =>
      news.reduce((grouped, item) => {
        const categoryId = Number(item?.category_id || item?.category?.id)
        if (!categoryId) return grouped
        grouped[categoryId] = [...(grouped[categoryId] || []), item]
        return grouped
      }, {}),
    [news]
  )

  const subcategoryNewsMap = useMemo(
    () =>
      news.reduce((grouped, item) => {
        const subcategoryId = Number(item?.subcategory_id || item?.sub_category?.id)
        if (!subcategoryId) return grouped
        grouped[subcategoryId] = [...(grouped[subcategoryId] || []), item]
        return grouped
      }, {}),
    [news]
  )

  const getCategory = (slug, fallbackIndex = 0) =>
    categories?.find((category) => category.slug === slug) || categories?.[fallbackIndex]

  const getCategoryItems = (slug, fallbackIndex = 0) => {
    const category = getCategory(slug, fallbackIndex)
    return categoryNewsMap[category?.id] || []
  }

  const lifestyleGroups = useMemo(() => {
    const requestedNames = ['Health+', 'Style', 'Relationships', 'Beauty', 'Parenting', 'Food']
    const subcategories = (categories || []).flatMap((category) =>
      (category.sub_categories || []).map((subcategory) => ({
        ...subcategory,
        categorySlug: category.slug
      }))
    )
    const healthFallback = categoryNewsMap[getCategory('health', 4)?.id] || []
    const entertainmentFallback = categoryNewsMap[getCategory('entertainment', 5)?.id] || []
    const fallbacks = [
      healthFallback,
      entertainmentFallback,
      entertainmentFallback.slice().reverse(),
      healthFallback.slice().reverse(),
      [...healthFallback.slice(1), ...entertainmentFallback],
      [...entertainmentFallback.slice(1), ...healthFallback]
    ]

    return requestedNames.map((name, index) => {
      const subcategory = subcategories.find(
        (item) => item.subcategory_name?.toLowerCase() === name.toLowerCase()
      )
      return {
        title: name,
        items: subcategory ? subcategoryNewsMap[subcategory.id] || fallbacks[index] : fallbacks[index],
        href: subcategory
          ? `/${currentLanguage?.code}/categories-news/sub-category/${subcategory.slug}`
          : `/${currentLanguage?.code}/categories-news/${index % 2 ? 'entertainment' : 'health'}`
      }
    })
  }, [categories, categoryNewsMap, subcategoryNewsMap, currentLanguage?.code])

  const trendingNews = useMemo(() => {
    const tagged = news.filter((item) => {
      const names = [
        item?.tag_name,
        ...(Array.isArray(item?.tag) ? item.tag.map((tag) => tag?.tag_name) : [])
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return names.includes('trending')
    })
    return tagged.length >= 4 ? tagged : news.slice(0, 8)
  }, [news])

  const langCode = currentLanguage?.code || 'en'
  const technology = getCategoryItems('technology', 0)
  const business = getCategoryItems('business', 2)
  const cityItems = uniqueItems([
    ...getCategoryItems('politics', 7),
    ...getCategoryItems('top-news', 9),
    ...news
  ]).slice(0, 10)
  const exclusiveItems = uniqueItems([
    ...news.filter((_, index) => index % 3 === 0),
    ...business,
    ...technology
  ])
  const categorySections = (categories || [])
    .map((category) => ({ category, items: categoryNewsMap[category.id] || [] }))
    .filter((section) => section.items.length)

  return (
    <Layout>
      <main className="iq-homepage">
        <BreakingTicker items={breakingNews.length ? breakingNews : news} langCode={langCode} />

        {loading ? (
          <div className="min-h-[420px] flex items-center justify-center"><Loader /></div>
        ) : news.length ? (
          <div className="container iq-homepage-content">
            <LeadNewsSection items={news} breakingItems={breakingNews} videos={videos} langCode={langCode} />

            <ExclusiveSection items={exclusiveItems} langCode={langCode} />

            {webStories.length > 0 && (
              <div className="iq-editorial-section iq-web-stories-section">
                <WebStoriesRail stories={webStories} title="Web Stories" langCode={langCode} />
              </div>
            )}

            <CityNewsSection items={cityItems} langCode={langCode} />
            <MultiColumnNewsSection
              langCode={langCode}
              columns={[
                {
                  title: getCategory('technology', 0)?.category_name || 'Technology',
                  href: `/${langCode}/categories-news/technology`,
                  items: technology.slice(0, 5)
                },
                {
                  title: getCategory('business', 2)?.category_name || 'Business',
                  href: `/${langCode}/categories-news/business`,
                  items: business.slice(0, 5)
                },
                {
                  title: 'Also In News',
                  href: `/${langCode}/all-breaking-news`,
                  items: breakingNews.slice(0, 5),
                  type: 'breaking'
                }
              ]}
            />
            <LifestyleSection groups={lifestyleGroups} langCode={langCode} />
            <TrendingSection items={trendingNews} langCode={langCode} />
            <VideoNewsSection videos={videos} articles={getCategoryItems('entertainment', 5)} langCode={langCode} />

            <div className="iq-category-section-grid">
              {categorySections.map(({ category, items }) => (
                <CategoryEditorialSection
                  key={category.id}
                  category={category}
                  items={items.slice(0, 6)}
                  langCode={langCode}
                />
              ))}
            </div>

            <MoreStoriesSection items={news} langCode={langCode} />
          </div>
        ) : (
          <div className="container py-16"><NoDataFound text="No news is available right now." /></div>
        )}
      </main>

      {process.env.NEXT_PUBLIC_SEO === 'false' && adsenseUrl?.length > 0 && (
        <script async src={adsenseUrl} crossOrigin="anonymous" />
      )}
    </Layout>
  )
}

export default HomePage
