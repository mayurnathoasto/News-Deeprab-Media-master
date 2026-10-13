'use client'

import Link from 'next/link'
import { newsImageSrc, placeholderImage } from '@/utils/helpers'

const WebStoriesRail = ({ stories = [], langCode, title = 'Web Stories', viewAll = true }) => {
  if (!stories || stories.length === 0) return null

  return (
    <section className="mb-10 webStoriesSection">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="block w-1 h-7 rounded-full bg-[#af2c2c] shrink-0" />
          <h2 className="text-[15px] font-extrabold uppercase tracking-widest text-[#af2c2c]">{title}</h2>
          <span className="hidden sm:block w-20 h-px bg-gray-200 dark:bg-gray-700" />
        </div>
        {viewAll && (
          <Link href={`/${langCode}/web-stories`} className="text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-[#af2c2c] transition-colors flex items-center gap-1">
            View All <span>{'>'}</span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stories.slice(0, 6).map(story => (
          <Link
            key={story.id}
            href={`/${langCode}/web-stories/${story.slug}`}
            className="group relative block overflow-hidden rounded-xl aspect-[3/4] bg-gray-200 shadow-sm border border-white/60 dark:border-white/10"
          >
            <img
              src={newsImageSrc(story.cover_image)}
              alt={story.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={placeholderImage}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
            <div className="absolute top-3 left-3 right-3 flex items-center gap-1">
              {(story.pages || []).slice(0, 5).map(page => (
                <span key={page.id} className="h-1 flex-1 rounded-full bg-white/75" />
              ))}
            </div>
            <div className="absolute left-3 right-3 bottom-3">
              {story.category_name && (
                <span className="inline-block text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#af2c2c] mb-2">
                  {story.category_name}
                </span>
              )}
              <h3 className="text-white text-[13px] font-extrabold leading-snug line-clamp-3">
                {story.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default WebStoriesRail
