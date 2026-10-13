import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { currentLangCode, newsImageSrc, placeholderImage, truncateText } from '@/utils/helpers'
import VideoNewsCard from '../VideoNewsCard'

const NewsCardTwo = ({ element, breakingNews, videoNews }) => {

    const currLangCode = currentLangCode();

    return (
        videoNews ? <div className='relative h-full' key={element?.title}>
            <VideoNewsCard element={element} viewAllCard={true} />
        </div>
            :
            <Link href={`${breakingNews ? `/${currLangCode}/breaking-news/${element?.slug}` : `/${currLangCode}/news/${element?.slug}`}`} key={element?.title} className="group block h-full">
                <div className="flex flex-col h-full rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800">
                    <div className="relative overflow-hidden w-full h-[250px] sm:h-[280px]">
                        <img 
                            src={newsImageSrc(element?.image)}
                            alt={element?.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            onError={placeholderImage} 
                            loading='lazy'
                        />
                        {breakingNews && (
                            <div className="absolute top-4 left-4 bg-[#af2c2c] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded">
                                Breaking
                            </div>
                        )}
                    </div>
                    <div className='p-5 flex-grow flex flex-col'>
                        <h2 className='text-gray-900 dark:text-white text-[20px] sm:text-[22px] font-[800] leading-snug line-clamp-3 group-hover:text-[#af2c2c] transition-colors' style={{ fontFamily: "var(--headline-font-family)" }}>
                            {truncateText(element?.title, 120)}
                        </h2>
                    </div>
                </div>
            </Link>
    )
}

export default NewsCardTwo
