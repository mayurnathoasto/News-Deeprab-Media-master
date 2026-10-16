'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { getWebStoriesApi } from '@/utils/api/api'
import { newsImageSrc, placeholderImage } from '@/utils/helpers'

const WebStoryViewer = ({ story, langCode }) => {
  const pages = useMemo(() => story?.pages || [], [story])
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (story?.id) {
      getWebStoriesApi.trackEvent({ story_id: story.id, event: 'open' }).catch(() => {})
    }
  }, [story?.id])

  useEffect(() => {
    const handleKey = event => {
      if (event.key === 'ArrowRight') next()
      if (event.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  })

  const next = () => {
    setActive(prevIndex => {
      if (prevIndex >= pages.length - 1) {
        if (story?.id) getWebStoriesApi.trackEvent({ story_id: story.id, event: 'complete' }).catch(() => {})
        return prevIndex
      }
      return prevIndex + 1
    })
  }

  const prev = () => setActive(prevIndex => Math.max(0, prevIndex - 1))
  const page = pages[active]
  const scene = page?.scene_json || {}

  if (!story || pages.length === 0) {
    return (
      <div className="min-h-screen bg-[#0c1424] text-white flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-3">Story not available</h1>
          <Link href={`/${langCode}/web-stories`} className="text-[#ff4b57] font-semibold">Back to Web Stories</Link>
        </div>
      </div>
    )
  }

  return (
    <main className="webStoryViewer bg-[#0c1424] text-white flex items-center justify-center">
      <div className="webStoryViewerCard relative rounded-2xl overflow-hidden bg-black shadow-2xl">
        {page.media_type === 'video' ? (
          <video src={page.media_url} className="absolute inset-0 w-full h-full object-cover" autoPlay muted playsInline controls={false} />
        ) : (
          <img src={newsImageSrc(page.media_url || story.cover_image)} alt={page.headline || story.title} className="absolute inset-0 w-full h-full object-cover" onError={placeholderImage} />
        )}

        {scene.overlay !== 'none' && <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" />}

        <div className="absolute top-3 left-3 right-3 flex gap-1">
          {pages.map((item, index) => (
            <span key={item.id || index} className={`h-1 flex-1 rounded-full ${index <= active ? 'bg-white' : 'bg-white/35'}`} />
          ))}
        </div>

        <Link href={`/${langCode}/web-stories`} className="absolute top-7 right-4 w-9 h-9 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/70 transition-colors" aria-label="Close story">
          <X size={18} />
        </Link>

        <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/25 hover:bg-black/50 flex items-center justify-center" aria-label="Previous slide">
          <ChevronLeft size={20} />
        </button>
        <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/25 hover:bg-black/50 flex items-center justify-center" aria-label="Next slide">
          <ChevronRight size={20} />
        </button>

        <article
          className={`webStoryContent absolute left-5 right-5 bottom-6 ${scene.textAlign === 'center' ? 'text-center' : scene.textAlign === 'right' ? 'text-right' : 'text-left'} ${scene.animation === 'slide-up' ? 'animate-[storySlideUp_.35s_ease-out]' : 'animate-[storyFade_.35s_ease-out]'}`}
          style={{ color: scene.textColor || '#ffffff', fontFamily: scene.fontFamily || 'Inter' }}
        >
          {story.category_name && <div className="inline-flex bg-[#af2c2c] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm mb-3">{story.category_name}</div>}
          {page.headline && <h1 className="webStoryHeadline text-2xl sm:text-3xl font-extrabold leading-tight mb-3">{page.headline}</h1>}
          {(() => {
            let url = page?.cta_url?.trim();
            let label = page?.cta_label?.trim();

            if (!url && (story?.news_slug || story?.slug)) {
              url = `/${langCode}/news/${story.news_slug || story.slug}`;
              if (!label) label = 'Read Source';
            }

            if (!url) return null;

            let isExternal = false;
            if (/^https?:\/\//i.test(url)) {
              isExternal = true;
            } else if (!url.startsWith('/')) {
              url = `https://${url}`;
              isExternal = true;
            }

            return (
              <a
                href={url}
                target={isExternal ? "_blank" : "_self"}
                rel={isExternal ? "noopener noreferrer" : undefined}
                onClick={() => getWebStoriesApi.trackEvent({ story_id: story.id, event: 'outbound_click' }).catch(() => {})}
                className="webStoryCta mt-5 inline-flex items-center gap-2 rounded-full bg-white text-[#0c1424] px-4 py-2 text-sm font-bold shadow-md hover:bg-gray-100 transition-colors"
              >
                {label || 'Read Source'} <ExternalLink size={14} />
              </a>
            );
          })()}
        </article>
      </div>
    </main>
  )
}

export default WebStoryViewer
