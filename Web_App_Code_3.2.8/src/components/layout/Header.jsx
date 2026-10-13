'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'
import { FiChevronDown, FiMenu, FiX } from 'react-icons/fi'
import { categoriesSelector } from '../store/reducers/CategoriesReducer'
import { settingsSelector } from '../store/reducers/settingsReducer'
import { checkNewsDataSelector } from '../store/reducers/CheckNewsDataReducer'
import { currentLangCode, defaultLanguageCode } from '@/utils/helpers'

const SearchModal = dynamic(() => import('../search/SearchModal'), { ssr: false })
const LiveMarketTicker = dynamic(() => import('../commonComponents/LiveMarketTicker'), { ssr: false })

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()
  const categories = useSelector(categoriesSelector)
  const settingsData = useSelector(settingsSelector)
  const checkNewsData = useSelector(checkNewsDataSelector)
  const langCode = currentLangCode() || defaultLanguageCode() || 'en'

  const showLiveNews =
    settingsData?.data?.live_streaming_mode === '1' &&
    checkNewsData?.data?.isLiveNewsData
  const showBreakingNews =
    settingsData?.data?.breaking_news_mode === '1' &&
    checkNewsData?.data?.isBreakingNewsData
  const showRss = settingsData?.data?.rss_feed_mode === '1'

  const mainLinks = [
    { label: 'Home', href: `/${langCode}` },
    showLiveNews && { label: 'Live News', href: `/${langCode}/live-news` },
    showBreakingNews && { label: 'Breaking News', href: `/${langCode}/all-breaking-news` },
    { label: 'Videos', href: `/${langCode}/video-news` },
    showRss && { label: 'RSS Feed', href: `/${langCode}/rss-feed` },
    { label: 'eNews', href: `/${langCode}/enews` }
  ].filter(Boolean)

  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setDrawerOpen(false)
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  return (
    <>
      <div className="iq-brand-row">
        <div className="container iq-brand-inner">
          <Link href={`/${langCode}`} aria-label="IQ News home">
            <img src="/storage/logos/iq-news-main.png" alt="IQ News" />
          </Link>
        </div>
      </div>

      <nav className="iq-main-nav" aria-label="Primary navigation">
        <div className="container iq-main-nav-inner">
          <Link href={`/${langCode}`} className="iq-sticky-logo" aria-label="IQ News home">
            <img src="/storage/logos/iq-news-main.png" alt="" />
          </Link>

          <div className="iq-main-links">
            {mainLinks.map((item) => (
              <Link href={item.href} key={item.label} className={pathname === item.href ? 'active' : ''}>
                {item.label}
              </Link>
            ))}
            <button type="button" onClick={() => setDrawerOpen(true)}>
              More Pages <FiChevronDown aria-hidden="true" />
            </button>
          </div>

          <div className="iq-nav-actions">
            <Link href={`/${langCode}/live-news`} className="iq-live-action">Live</Link>
            <SearchModal />
            <button type="button" className="iq-menu-button" aria-label="Open navigation menu" onClick={() => setDrawerOpen(true)}>
              <FiMenu aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      <div className="iq-category-nav" aria-label="News categories">
        <div className="container iq-category-nav-inner">
          <span>In The News</span>
          {(categories || []).map((category) => (
            <Link
              key={category.id}
              href={`/${langCode}/categories-news/${category.slug}`}
              className={pathname === `/${langCode}/categories-news/${category.slug}` ? 'active' : ''}
            >
              {category.category_name}
            </Link>
          ))}
        </div>
      </div>

      <LiveMarketTicker />

      <div className={drawerOpen ? 'iq-drawer-overlay open' : 'iq-drawer-overlay'} onClick={() => setDrawerOpen(false)} aria-hidden={!drawerOpen} />
      <aside className={drawerOpen ? 'iq-nav-drawer open' : 'iq-nav-drawer'} aria-label="All navigation">
        <div className="iq-drawer-header">
          <img src="/storage/logos/iq-news-main.png" alt="IQ News" />
          <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close navigation menu"><FiX aria-hidden="true" /></button>
        </div>

        <div className="iq-drawer-content">
          <div className="iq-drawer-main-links">
            {mainLinks.map((item) => <Link href={item.href} key={`drawer-${item.label}`}>{item.label}</Link>)}
            <Link href={`/${langCode}/about-us`}>About Us</Link>
            <Link href={`/${langCode}/contact-us`}>Contact Us</Link>
          </div>

          <div className="iq-drawer-categories">
            <h2>Categories</h2>
            {(categories || []).map((category) => (
              <div className="iq-drawer-category" key={`drawer-category-${category.id}`}>
                <Link href={`/${langCode}/categories-news/${category.slug}`}>{category.category_name}</Link>
                {category.sub_categories?.length > 0 && (
                  <div>
                    {category.sub_categories.map((subcategory) => (
                      <Link href={`/${langCode}/categories-news/sub-category/${subcategory.slug}`} key={subcategory.id}>
                        {subcategory.subcategory_name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}

export default Header
