'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { currentLangCode, placeholderImage, stripHtmlTags, truncateText } from '@/utils/helpers'
import { translate } from '@/utils/translation'
import VideoPlayerModal from '@/components/commonComponents/videoplayer/VideoPlayerModal'
import { FaArrowRightLong } from 'react-icons/fa6'
import { IoEye } from 'react-icons/io5'
import VideoPlayIcon from '@/components/commonComponents/VideoPlayIcon'

const StyleFiveCard = ({ element, videoNewsCard, breakingNewsCard, rssFeedCard }) => {

    const currLangCode = currentLangCode();

    return (
        rssFeedCard ?
            <Link href={element?.url} title='detail-page' target='_blank'>
                <div className="group bodyBgColor shadow-[0_0_6px_0px_rgba(96,70,201,0.12)] p-4 rounded-[16px] flex flex-col gap-4">
                    <div>
                        <Image src={element?.image_url} alt={element?.title} loading='lazy' height={0} width={0} className="w-full h-56 object-cover -mt-20 relative z-2 rounded-[16px] transition-all duration-300 group-hover:-translate-y-2" onError={placeholderImage} />
                    </div>
                    <div>
                        <h5 className="text-[18px] lg:text-[20px] font-semibold textPrimary line-clamp-2 h-[60px] mb-3">{element.title}</h5>
                        {
                            element?.description &&
                            <div>
                                {
                                    stripHtmlTags(element.description).length > 0 &&
                                    <p className='text-[18px] textSecondary font-[500] line-clamp-3'>{stripHtmlTags(element.description).substring(0, 95) + '...'}</p>
                                }
                            </div>
                        }
                        <div className='textSecondary font-[600] text-lg flex items-center gap-2 mt-1 group/edit'>
                            <span className='group-hover/edit:primaryColor'>{translate('readMoreLbl')}</span>
                            <span className='mt-[2px] group-hover/edit:ml-1.5 group-hover/edit:primaryColor transition-all duration-300'><FaArrowRightLong className='rtl:rotate-180' /></span>
                        </div>
                    </div>
                </div>
            </Link>
            :
            element && !videoNewsCard ? <Link href={breakingNewsCard ? `/${currLangCode}/breaking-news/${element.slug}` : `/${currLangCode}/news/${element.slug}`} title='detail-page'>
                <div className="group bodyBgColor shadow-[0_0_6px_0px_rgba(96,70,201,0.12)] p-4 rounded-[16px] flex flex-col gap-4">
                    <div>
                        <Image src={element?.image} alt={element?.title} loading='lazy' height={0} width={0} className="w-full h-56 object-cover -mt-20 relative z-2 rounded-[16px] transition-all duration-300 group-hover:-translate-y-2" onError={placeholderImage} />
                    </div>
                    <div className="">
                        {
                            element?.category_name &&
                            <span className="categoryTag !py-1">{truncateText(element.category_name, 25)}</span>
                        }
                    </div>
                    <div>
                        <div className='flex items-center gap-[10px] font-[500] textSecondary -mt-[4px] mb-1'>
                            <span> <IoEye size={20} /></span>
                            <span>{element?.total_views} {translate('views')}</span>
                        </div>
                        <h5 className="text-[18px] lg:text-[20px] font-semibold textPrimary line-clamp-2 h-[60px] mb-3">{element.title}</h5>
                        {
                            (element?.description || element?.summarized_description) &&
                            <div>
                                {
                                    element?.summarized_description ?
                                        <p className='text-[18px] textSecondary font-[500] line-clamp-3'>{element?.summarized_description}</p>
                                        :
                                        stripHtmlTags(element.description).length > 0 &&
                                        <p className='text-[18px] textSecondary font-[500] line-clamp-3'>{stripHtmlTags(element.description).substring(0, 95) + '...'}</p>
                                }
                            </div>
                        }
                        <div className='textSecondary font-[600] text-lg flex items-center gap-2 mt-1 group/edit'>
                            <span className='group-hover/edit:primaryColor'>{translate('readMoreLbl')}</span>
                            <span className='mt-[2px] group-hover/edit:ml-1.5 group-hover/edit:primaryColor transition-all duration-300'><FaArrowRightLong className='rtl:rotate-180' /></span>
                        </div>
                    </div>
                </div>
            </Link> :
                element &&
                <Link href={`/${currLangCode}/video-news/${element.slug}`} title='detail-page'>
                    <div className="group bodyBgColor shadow-[0_0_6px_0px_rgba(96,70,201,0.12)] p-4 rounded-[16px] flex flex-col gap-5">
                        <div className='relative'>
                            <Image src={element?.image} alt={element?.title} loading='lazy' height={0} width={0} className="w-full h-56 object-cover -mt-20 relative z-2 rounded-[16px] transition-all duration-300 group-hover:-translate-y-2" onError={placeholderImage} />
                            <VideoPlayIcon videoSect={videoNewsCard} keyboard={false} url={element?.content_value} type_url={element?.content_type} styleFive={true} />
                        </div>
                        {
                            element.category_name &&
                            <div className="">
                                <span className="categoryTag !py-1">
                                    {truncateText(element.category_name, 25)}
                                </span>
                            </div>
                        }
                        <div>
                            <div className='flex items-center gap-[10px] font-[500] textSecondary -mt-[4px] mb-1'>
                                <span> <IoEye size={20} /></span>
                                <span>{element?.total_views} {translate('views')}</span>
                            </div>
                            <h5 className="text-[18px] lg:text-[20px] font-semibold textPrimary line-clamp-2 h-[60px]">{element.title}</h5>
                        </div>
                    </div>
                </Link>
    )
}

export default StyleFiveCard