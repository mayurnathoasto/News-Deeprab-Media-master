'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { currentLangCode, newsImageSrc, placeholderImage } from '@/utils/helpers'
import { translate } from '@/utils/translation'
import { CiStreamOn } from "react-icons/ci"
import Link from 'next/link'
import VideoPlayIcon from './VideoPlayIcon'
import EmbeddedVideo from './EmbeddedVideo'
import { X } from 'lucide-react'

const VideoNewsCard = ({ element, viewAllCard, liveNewsPage, onPlay }) => {
  const currLangCode = currentLangCode()
  const [showModal, setShowModal] = useState(false)

  const videoUrl = viewAllCard ? element?.content_value : element?.url
  const videoType = viewAllCard ? element?.content_type : element?.type

  const handleClick = (e) => {
    if (onPlay) {
      e.preventDefault()
      onPlay(element)
      return
    }

    if (!element?.slug) {
      e.preventDefault()
      setShowModal(true)
    }
  }

  const cardContent = (
    <div className='relative flex flex-col h-full rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800 min-h-[300px] cursor-pointer'>
      <div className='absolute inset-0 w-full h-full overflow-hidden'>
        <img
          src={newsImageSrc(element?.image)}
          onError={placeholderImage}
          alt={element?.title || 'Video News'}
          loading='lazy'
          className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
        />
        {/* Dark gradient overlay so play button and text pop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/90 transition-colors"></div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col h-full">
        {liveNewsPage && (
          <div className='flexCenter self-start bg-[#af2c2c] text-white rounded px-2 py-1 text-xs font-bold uppercase tracking-wide gap-1 mt-3 ml-3 shadow'>
            <CiStreamOn size={16} className="animate-pulse" />
            <span>{translate('live')}</span>
          </div>
        )}

        {/* Centered Play Button */}
        <div className="flex-grow flex items-center justify-center">
          <VideoPlayIcon videoSect={true} keyboard={false} url={videoUrl} type_url={videoType} />
        </div>

        {/* Text Section */}
        <div className='p-4 md:p-5 mt-auto'>
          <h2 className='text-white text-[18px] sm:text-[22px] font-[800] leading-snug line-clamp-3' style={{ fontFamily: "var(--headline-font-family)" }}>
            {element?.title}
          </h2>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {element?.slug && !onPlay ? (
        <Link href={`/${currLangCode}/video-news/${element.slug}`} className="group block h-full">
          {cardContent}
        </Link>
      ) : (
        <div onClick={handleClick} className="group block h-full select-none" role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') handleClick(e) }}>
          {cardContent}
        </div>
      )}

      {/* Standalone Video Modal Fallback */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#121212]">
              <h3 className="text-white text-base md:text-lg font-bold line-clamp-1">{element?.title}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
                aria-label="Close video"
              >
                <X size={22} />
              </button>
            </div>
            <div className="p-2 bg-black">
              <EmbeddedVideo url={videoUrl} type={videoType} height="480px" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default VideoNewsCard
