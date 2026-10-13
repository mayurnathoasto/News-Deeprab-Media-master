'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import WebStoryViewer from '@/components/webStories/WebStoryViewer'
import { getWebStoriesApi } from '@/utils/api/api'
import { currentLanguageSelector } from '@/components/store/reducers/languageReducer'

const WebStoryDetails = () => {
  const router = useRouter()
  const { slug } = router.query
  const currentLanguage = useSelector(currentLanguageSelector)
  const [story, setStory] = useState(null)
  const [loading, setLoading] = useState(true)
  const storySlug = useMemo(() => {
    if (slug && !String(slug).startsWith('[')) return slug

    const pathParts = (router.asPath || '').split('?')[0].split('/').filter(Boolean)
    const storiesIndex = pathParts.indexOf('web-stories')
    return storiesIndex >= 0 ? pathParts[storiesIndex + 1] : ''
  }, [router.asPath, slug])

  useEffect(() => {
    const fetchStory = async () => {
      if (!storySlug || !currentLanguage?.code) return
      try {
        setLoading(true)
        const { data } = await getWebStoriesApi.getWebStories({
          language_code: currentLanguage.code,
          slug: storySlug,
          offset: 0,
          limit: 1,
        })
        setStory(!data?.error ? data?.data?.data?.[0] || null : null)
      } catch (error) {
        console.error('Error fetching web story:', error)
        setStory(null)
      } finally {
        setLoading(false)
      }
    }
    fetchStory()
  }, [storySlug, currentLanguage?.code])

  if (loading) {
    return <div className="min-h-screen bg-[#0c1424] text-white flex items-center justify-center">Loading story...</div>
  }

  return <WebStoryViewer story={story} langCode={currentLanguage?.code} />
}

export default WebStoryDetails
