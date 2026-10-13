import React from 'react'
import Image from 'next/image'
import { currentLangCode, newsImageSrc, placeholderImage, } from '@/utils/helpers';
import { translate } from '@/utils/translation';
import { CiStreamOn } from "react-icons/ci";
import Link from 'next/link';
import VideoPlayIcon from './VideoPlayIcon';

const VideoNewsCard = ({ element, viewAllCard, liveNewsPage }) => {

    const currLangCode = currentLangCode();

    return (
        <Link href={`/${currLangCode}/video-news/${element?.slug}`} key={element?.title} className="group block h-full">
            <div className='relative flex flex-col h-full rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800 min-h-[300px]'>
                <div className='absolute inset-0 w-full h-full overflow-hidden'>
                    <img 
                        src={newsImageSrc(element?.image)}
                        onError={placeholderImage} 
                        alt={element?.title} 
                        loading='lazy' 
                        className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105' 
                    />
                    {/* Dark gradient overlay so play button and text pop */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/90 transition-colors"></div>
                </div>
                
                {/* Foreground Content */}
                <div className="relative z-10 flex flex-col h-full">
                    {
                        liveNewsPage &&
                        <div className='flexCenter self-start bg-[#af2c2c] text-white rounded px-2 py-1 text-xs font-bold uppercase tracking-wide gap-1 mt-3 ml-3 shadow'>
                            <CiStreamOn size={16} className="animate-pulse" />
                            <span>{translate('live')}</span>
                        </div>
                    }
                    
                    {/* Centered Play Button */}
                    <div className="flex-grow flex items-center justify-center">
                        <VideoPlayIcon videoSect={true} keyboard={false} url={viewAllCard ? element?.content_value : element?.url} type_url={viewAllCard ? element?.content_type : element?.type} />
                    </div>
                    
                    {/* Text Section */}
                    <div className='p-4 md:p-5 mt-auto'>
                        <h2 className='text-white text-[18px] sm:text-[22px] font-[800] leading-snug line-clamp-3' style={{ fontFamily: "var(--headline-font-family)" }}>
                            {element.title}
                        </h2>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default VideoNewsCard
