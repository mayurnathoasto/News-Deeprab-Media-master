'use client'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Layout from '@/components/layout/Layout'
import WebStoriesRail from '@/components/webStories/WebStoriesRail'
import { getWebStoriesApi } from '@/utils/api/api'
import { currentLanguageSelector } from '@/components/store/reducers/languageReducer'
import { categoriesSelector } from '@/components/store/reducers/CategoriesReducer'

const WebStoriesPage = () => {
  const currentLanguage = useSelector(currentLanguageSelector)
  const categories = useSelector(categoriesSelector)
  const [stories, setStories] = useState([])
  const [activeCategory, setActiveCategory] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchStories = async () => {
      if (!currentLanguage?.code) return
      try {
        setLoading(true)
        const { data } = await getWebStoriesApi.getWebStories({
          language_code: currentLanguage.code,
          offset: 0,
          limit: 60,
          category_id: activeCategory || undefined
        })
        setStories(!data?.error ? data?.data?.data || [] : [])
      } catch (error) {
        console.error('Error fetching web stories:', error)
        setStories([])
      } finally {
        setLoading(false)
      }
    }
    fetchStories()
  }, [currentLanguage?.code, activeCategory])

  const langCode = currentLanguage?.code

  return (
    <Layout>
      <main className="bg-gray-50 dark:bg-[#121212] min-h-screen">
        <div className="container py-8 md:py-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <span className="text-[#af2c2c] text-xs font-extrabold uppercase tracking-widest">Web Stories</span>
              <h1 className="text-2xl md:text-4xl font-extrabold textPrimary mt-2">Explore Visual Stories</h1>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
            <button
              onClick={() => setActiveCategory('')}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border ${activeCategory === '' ? 'bg-[#af2c2c] text-white border-[#af2c2c]' : 'bg-white dark:bg-[#1a1a1a] textPrimary border-gray-200 dark:border-gray-800'}`}
            >
              All
            </button>
            {(categories || []).map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border ${Number(activeCategory) === Number(category.id) ? 'bg-[#af2c2c] text-white border-[#af2c2c]' : 'bg-white dark:bg-[#1a1a1a] textPrimary border-gray-200 dark:border-gray-800'}`}
              >
                {category.category_name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, index) => <div key={index} className="aspect-[3/4] rounded-xl bg-gray-200 dark:bg-white/10 animate-pulse" />)}
            </div>
          ) : (
            <WebStoriesRail stories={stories} langCode={langCode} title={activeCategory ? 'Category Stories' : 'All Web Stories'} viewAll={false} />
          )}

          {!loading && stories.length === 0 && (
            <div className="rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 p-8 text-center textPrimary">
              No web stories found for this category.
            </div>
          )}
        </div>
      </main>
    </Layout>
  )
}

export default WebStoriesPage
