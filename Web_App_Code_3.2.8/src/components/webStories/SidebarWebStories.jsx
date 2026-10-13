'use client'

import Link from 'next/link'
import { FiChevronRight } from 'react-icons/fi'
import { newsImageSrc, placeholderImage } from '@/utils/helpers'

const SidebarWebStories = ({ stories = [], langCode = 'en', title = 'Web Stories' }) => {
  if (!stories.length) return null

  return (
    <aside className="iq-sidebar-stories" aria-label={title}>
      <div className="iq-sidebar-heading">
        <h2>{title}</h2>
        <Link href={`/${langCode}/web-stories`} aria-label="View all Web Stories"><FiChevronRight /></Link>
      </div>
      <div className="iq-sidebar-story-list">
        {stories.slice(0, 4).map((story, index) => (
          <Link href={`/${langCode}/web-stories/${story.slug}`} key={story.id} className={index === 0 ? 'featured' : ''}>
            <img src={newsImageSrc(story.cover_image)} alt={story.title} onError={placeholderImage} loading="lazy" />
            <div>
              {story.category_name && <span>{story.category_name}</span>}
              <h3>{story.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  )
}

export default SidebarWebStories
