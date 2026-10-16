'use client'

import Link from 'next/link'
import { FiChevronRight, FiPlay } from 'react-icons/fi'
import { newsImageSrc, placeholderImage } from '@/utils/helpers'
import LocationSelector from '../location/LocationSelector'
import PollCard from '../polls/PollCard'

const getCategoryName = (item) =>
  item?.category_name || item?.category?.category_name || item?.category?.name || 'Deeprab Media'

const getSummary = (item) =>
  item?.summarized_description ||
  item?.description?.replace(/<[^>]*>/g, '') ||
  'Read the latest report and analysis from Deeprab Media.'

export const articleHref = (item, langCode, type = 'news') => {
  if (!item?.slug) return `/${langCode}`
  if (type === 'video' || item?.source_type === 'live_streaming') {
    return `/${langCode}/video-news/${item.slug}`
  }
  if (type === 'breaking') return `/${langCode}/breaking-news/${item.slug}`
  return `/${langCode}/news/${item.slug}`
}

export const EditorialHeading = ({ title, href, accent = false, aside }) => (
  <div className="iq-section-heading">
    <Link href={href || '#'} className={accent ? 'iq-section-title iq-section-title-accent' : 'iq-section-title'}>
      <span>{title}</span>
      <FiChevronRight aria-hidden="true" />
    </Link>
    {aside}
  </div>
)

const StoryImage = ({ item, className = '' }) => (
  <img
    src={newsImageSrc(item?.image)}
    alt={item?.title || 'Deeprab Media'}
    className={className}
    loading="lazy"
    onError={placeholderImage}
  />
)

const HeadlineLink = ({ item, langCode, type = 'news', className = '' }) => (
  <Link href={articleHref(item, langCode, type)} className={className}>
    {item?.title}
  </Link>
)

export const LeadNewsSection = ({ items = [], breakingItems = [], videos = [], langCode }) => {
  const lead = items[0]
  if (!lead) return null

  const briefs = [...breakingItems, ...items.slice(5)].slice(0, 5)
  const secondary = items.slice(1, 5)
  const featuredVideo = videos[0]

  return (
    <section className="iq-editorial-section iq-lead-section">
      <div className="iq-lead-layout">
        <div className="iq-lead-briefs">
          <span>Latest Updates</span>
          {briefs.map((item, index) => (
            <HeadlineLink
              item={item}
              langCode={langCode}
              type={index < breakingItems.length ? 'breaking' : 'news'}
              key={`lead-brief-${item.id}-${index}`}
            />
          ))}
        </div>

        <div className="iq-lead-primary">
          <Link href={articleHref(lead, langCode)}>
            <h1>{lead.title}</h1>
            <StoryImage item={lead} />
            <p>{getSummary(lead)}</p>
          </Link>
          <div className="iq-lead-secondary-list">
            {secondary.map((item) => (
              <Link href={articleHref(item, langCode)} key={`lead-secondary-${item.id}`}>
                <div><h3>{item.title}</h3><p>{getSummary(item)}</p></div>
                <StoryImage item={item} />
              </Link>
            ))}
          </div>
        </div>

        <div className="iq-lead-sidebar">
          <PollCard compact />
          {featuredVideo && (
            <Link href={articleHref(featuredVideo, langCode, 'video')} className="iq-lead-video">
              <span>Featured Video</span>
              <div><StoryImage item={featuredVideo} /><i><FiPlay aria-hidden="true" /></i></div>
              <h3>{featuredVideo.title}</h3>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export const MultiColumnNewsSection = ({ columns, langCode }) => (
  <section className="iq-editorial-section">
    <div className="iq-three-column-grid">
      {columns.map((column) => {
        const [lead, ...secondary] = column.items || []
        if (!lead) return null

        return (
          <div className="iq-news-column" key={column.title}>
            <EditorialHeading title={column.title} href={column.href} />
            <Link href={articleHref(lead, langCode, column.type)} className="iq-column-lead">
              <StoryImage item={lead} className="iq-column-lead-image" />
              <h3>{lead.title}</h3>
            </Link>
            <div className="iq-column-list">
              {secondary.slice(0, 4).map((item) => (
                <HeadlineLink
                  key={`${column.title}-${item.id}`}
                  item={item}
                  langCode={langCode}
                  type={column.type}
                  className="iq-column-list-item"
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  </section>
)

export const ExclusiveSection = ({ items, langCode }) => {
  if (!items?.length) return null

  return (
    <section className="iq-editorial-section iq-exclusive-section">
      <EditorialHeading title="Deeprab Exclusive" accent href={`/${langCode}`} />
      <div className="iq-exclusive-grid">
        {items.slice(0, 6).map((item) => (
          <Link href={articleHref(item, langCode)} className="iq-exclusive-item" key={`exclusive-${item.id}`}>
            <StoryImage item={item} />
            <h3>{item.title}</h3>
            <p>{getSummary(item)}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export const CityNewsSection = ({ items, langCode }) => {
  if (!items?.length) return null
  const [lead, ...rest] = items

  const cityMeta = (
    <div className="iq-city-meta">
      <LocationSelector compact />
    </div>
  )

  return (
    <section className="iq-editorial-section">
      <EditorialHeading title="City" href={`/${langCode}/categories-news/politics`} aside={cityMeta} />
      <div className="iq-city-layout">
        <Link href={articleHref(lead, langCode)} className="iq-city-lead">
          <StoryImage item={lead} />
          <h3>{lead.title}</h3>
        </Link>
        <div className="iq-city-headlines">
          {rest.slice(0, 5).map((item) => (
            <HeadlineLink key={`city-${item.id}`} item={item} langCode={langCode} />
          ))}
        </div>
        <div className="iq-city-briefs">
          {rest.slice(5, 9).map((item) => (
            <HeadlineLink key={`city-brief-${item.id}`} item={item} langCode={langCode} />
          ))}
        </div>
      </div>
    </section>
  )
}

export const LifestyleSection = ({ groups, langCode }) => {
  const visibleGroups = groups.filter((group) => group.items?.length)
  if (!visibleGroups.length) return null

  return (
    <section className="iq-editorial-section">
      <EditorialHeading title="Lifestyle" href={`/${langCode}/categories-news/health`} />
      <div className="iq-lifestyle-grid">
        {visibleGroups.slice(0, 6).map((group) => {
          const [lead, ...rest] = group.items
          return (
            <div className="iq-lifestyle-group" key={group.title}>
              <EditorialHeading title={group.title} href={group.href} />
              <Link href={articleHref(lead, langCode)} className="iq-lifestyle-lead">
                <StoryImage item={lead} />
                <h3>{lead.title}</h3>
              </Link>
              <div className="iq-lifestyle-links">
                {rest.slice(0, 2).map((item) => (
                  <HeadlineLink key={`${group.title}-${item.id}`} item={item} langCode={langCode} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export const TrendingSection = ({ items, langCode }) => {
  if (!items?.length) return null

  return (
    <section className="iq-editorial-section">
      <EditorialHeading title="Trending" href={`/${langCode}/tag/trending`} />
      <div className="iq-trending-grid">
        {items.slice(0, 6).map((item) => (
          <Link href={articleHref(item, langCode)} className="iq-trending-item" key={`trending-${item.id}`}>
            <StoryImage item={item} />
            <h3>{item.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  )
}

export const VideoNewsSection = ({ videos, articles, langCode }) => {
  if (!videos?.length && !articles?.length) return null
  const lead = videos?.[0] || articles?.[0]
  const videoItems = (videos || []).slice(1, 7)
  const listItems = (articles || []).slice(0, 9)

  return (
    <section className="iq-editorial-section">
      <EditorialHeading title="Video News" href={`/${langCode}/video-news`} />
      <div className="iq-video-layout">
        <div className="iq-video-feature">
          <Link href={articleHref(lead, langCode, videos?.length ? 'video' : 'news')}>
            <div className="iq-video-image-wrap">
              <StoryImage item={lead} />
              <span className="iq-play-button"><FiPlay aria-hidden="true" /></span>
            </div>
            <h3>{lead.title}</h3>
          </Link>
          <div className="iq-video-mini-grid">
            {videoItems.slice(0, 2).map((item) => (
              <Link href={articleHref(item, langCode, 'video')} key={`video-mini-${item.id}`}>
                <div className="iq-video-thumb">
                  <StoryImage item={item} />
                  <FiPlay aria-hidden="true" />
                </div>
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="iq-video-headline-list">
          {listItems.map((item) => (
            <HeadlineLink key={`video-list-${item.id}`} item={item} langCode={langCode} />
          ))}
        </div>
        <div className="iq-video-grid">
          {videoItems.slice(2).map((item) => (
            <Link href={articleHref(item, langCode, 'video')} key={`video-${item.id}`}>
              <div className="iq-video-thumb">
                <StoryImage item={item} />
                <FiPlay aria-hidden="true" />
              </div>
              <h4>{item.title}</h4>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export const CategoryEditorialSection = ({ category, items, langCode }) => {
  if (!items?.length) return null
  const [lead, ...rest] = items

  return (
    <section className="iq-category-section">
      <EditorialHeading
        title={category?.category_name || getCategoryName(lead)}
        href={`/${langCode}/categories-news/${category?.slug || lead?.category?.slug || ''}`}
      />
      <div className="iq-category-layout">
        <Link href={articleHref(lead, langCode)} className="iq-category-lead">
          <StoryImage item={lead} />
          <span>{getCategoryName(lead)}</span>
          <h3>{lead.title}</h3>
        </Link>
        <div className="iq-category-list">
          {rest.slice(0, 5).map((item) => (
            <Link href={articleHref(item, langCode)} key={`category-${category?.id}-${item.id}`}>
              <StoryImage item={item} />
              <h4>{item.title}</h4>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export const MoreStoriesSection = ({ items, langCode }) => {
  if (!items?.length) return null

  return (
    <section className="iq-editorial-section">
      <EditorialHeading title="More Stories" href={`/${langCode}`} />
      <div className="iq-more-stories-grid">
        {items.slice(0, 8).map((item) => (
          <Link href={articleHref(item, langCode)} key={`more-${item.id}`}>
            <StoryImage item={item} />
            <span>{getCategoryName(item)}</span>
            <h3>{item.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  )
}
