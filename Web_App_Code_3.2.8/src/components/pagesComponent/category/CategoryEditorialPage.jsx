'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb'
import CommonCardSkeleton from '@/components/skeletons/CommonCardSkeleton'
import NoDataFound from '@/components/commonComponents/NoDataFound'
import LoadMoreBtn from '@/components/commonComponents/loadermoreBtn/LoadmoreBtn'
import NewsCard from '@/components/commonComponents/commonCards/NewsCard'
import SidebarWebStories from '@/components/webStories/SidebarWebStories'
import WebStoriesRail from '@/components/webStories/WebStoriesRail'
import PollCard from '@/components/polls/PollCard'
import { currentLanguageSelector } from '@/components/store/reducers/languageReducer'
import { getNewsApi, getWebStoriesApi } from '@/utils/api/api'
import { newsImageSrc, placeholderImage } from '@/utils/helpers'

const PAGE_SIZE = 12

const summary = (item) =>
  item?.summarized_description || item?.description?.replace(/<[^>]*>/g, '') || ''

const CategoryEditorialPage = ({ isSubcategory = false }) => {
  const router = useRouter()
  const slug = router?.query?.slug
  const currentLanguage = useSelector(currentLanguageSelector)
  const [items, setItems] = useState([])
  const [stories, setStories] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    setPage(0)
    setItems([])
  }, [slug, currentLanguage?.code])

  useEffect(() => {
    if (!slug || !currentLanguage?.code) return

    const fetchPage = async () => {
      page === 0 ? setLoading(true) : setLoadingMore(true)
      try {
        const request = {
          offset: page * PAGE_SIZE,
          limit: PAGE_SIZE,
          language_code: currentLanguage.code,
          ...(isSubcategory ? { subcategory_slug: slug } : { category_slug: slug })
        }
        const { data } = await getNewsApi.getNews(request)
        const nextItems = data?.data?.data || []
        setTotal(Number(data?.data?.total || 0))
        setItems((current) => page === 0 ? nextItems : [...current, ...nextItems])
      } catch (_) {
        if (page === 0) setItems([])
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    }

    fetchPage()
  }, [slug, currentLanguage?.code, page, isSubcategory])

  useEffect(() => {
    if (!slug || !currentLanguage?.code) return

    const fetchStories = async () => {
      try {
        const catSlug = isSubcategory ? (items[0]?.category?.slug || slug) : slug
        const { data } = await getWebStoriesApi.getWebStories({
          offset: 0,
          limit: 6,
          language_code: currentLanguage.code,
          ...(catSlug ? { category_slug: catSlug } : {})
        })
        let storyList = data?.data?.data || []

        // If category-specific stories are not found, fallback to latest web stories
        // so that the Web Stories section in the category page always displays content
        if (!storyList.length) {
          const fallbackRes = await getWebStoriesApi.getWebStories({
            offset: 0,
            limit: 6,
            language_code: currentLanguage.code
          })
          storyList = fallbackRes?.data?.data?.data || []
        }

        setStories(storyList)
      } catch (_) {
        setStories([])
      }
    }

    fetchStories()
  }, [slug, currentLanguage?.code, isSubcategory, items])

  const name = items[0]?.subcategory?.subcategory_name ||
    items[0]?.sub_category?.subcategory_name ||
    items[0]?.category?.category_name ||
    String(slug || 'Latest News').replace(/-/g, ' ')
  const [lead, ...rest] = items

  return (
    <Layout>
      <Breadcrumb secondElement={isSubcategory ? 'Subcategory' : 'Category'} thirdElement={name} />
      <main className="container iq-category-page">
        <header className="iq-category-page-header"><span /> <h1>{name}</h1></header>

        {loading ? (
          <div className="iq-category-page-skeleton">{Array.from({ length: 8 }).map((_, index) => <CommonCardSkeleton key={index} />)}</div>
        ) : !lead ? (
          <NoDataFound />
        ) : (
          <>
            <section className="iq-category-feature-grid">
              <Link href={`/${currentLanguage.code}/news/${lead.slug}`} className="iq-category-page-lead">
                <img src={newsImageSrc(lead.image)} alt={lead.title} onError={placeholderImage} />
                <span>{name}</span>
                <h2>{lead.title}</h2>
                <p>{summary(lead)}</p>
              </Link>

              <div className="iq-category-page-stack">
                {rest.slice(0, 2).map((item) => (
                  <Link href={`/${currentLanguage.code}/news/${item.slug}`} key={item.id}>
                    <img src={newsImageSrc(item.image)} alt={item.title} onError={placeholderImage} />
                    <h3>{item.title}</h3>
                    <p>{summary(item)}</p>
                  </Link>
                ))}
              </div>

              <aside className="iq-category-page-sidebar">
                <SidebarWebStories stories={stories} langCode={currentLanguage.code} title={`${name} Web Stories`} />
                <PollCard compact />
              </aside>
            </section>

            <section className="iq-category-brief-strip">
              {rest.slice(2, 6).map((item) => (
                <Link href={`/${currentLanguage.code}/news/${item.slug}`} key={item.id}>
                  <img src={newsImageSrc(item.image)} alt={item.title} onError={placeholderImage} />
                  <div><h3>{item.title}</h3><span>{name}</span></div>
                </Link>
              ))}
            </section>

            {stories.length > 0 && (
              <div className="iq-editorial-section iq-web-stories-section">
                <WebStoriesRail stories={stories} title={`${name} Web Stories`} langCode={currentLanguage.code} />
              </div>
            )}

            {rest.length > 6 && (
              <section className="iq-category-more-grid">
                {rest.slice(6).map((item) => <NewsCard element={item} key={item.id} />)}
              </section>
            )}

            {total > items.length && (
              <div className="iq-category-load-more"><LoadMoreBtn handleLoadMore={() => setPage((value) => value + 1)} loadMoreLoading={loadingMore} /></div>
            )}
          </>
        )}
      </main>
    </Layout>
  )
}

export default CategoryEditorialPage
