import { currentLangCode, newsImageSrc, placeholderImage, stripHtmlTags, } from '@/utils/helpers';
import { translate } from '@/utils/translation';
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'
import { IoEye } from 'react-icons/io5';
import { LuCalendarDays } from 'react-icons/lu';
import { MdOutlineComment } from 'react-icons/md';
import NewsHorizontalCardSkeleton from '@/components/skeletons/NewsHorizontalCardSkeleton';

const NewsHorizontalCard = ({ news, isLoading = false }) => {
    if (isLoading) {
        return <NewsHorizontalCardSkeleton />
    }
    const currentLang = currentLangCode()
    const newsDate = news?.published_date || news?.date;
    return (
        <Link href={`/${currentLang}/news/${news?.slug}`} className='flex justify-between gap-4 max-h-[240px] rounded-2xl commonBg p-4 relative'>
            <div className='w-1/2 max-w-[310px] h-full relative after:content-[""] transition-all duration-700 after:transition-all after:duration-700 after:absolute after:top-[50%] hover:after:top-0 after:bottom-[50%] hover:after:bottom-0 after:left-0 after:right-0 after:bg-[#ffffff99] after:opacity-100 after:hover:opacity-0'>
                <img
                    src={newsImageSrc(news.image)}
                    height={0}
                    width={0}
                    alt={news.title}
                    loading='lazy'
                    className='w-full h-full rounded-[8px] object-cover'
                    onError={placeholderImage}
                />
            </div>
            <div className='w-1/2 flex flex-col gap-4'>
                {
                    newsDate &&
                    <div className='flex items-center gap-[10px] font-[500] textSecondary'>
                        <span> <LuCalendarDays size={20} /></span>
                        <span>{new Date(newsDate).toLocaleString('en-us', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}</span>
                    </div>
                }
                <h5 className='line-clamp-2 sm:h-[68px] textPrimary text-[18px] lg:text-[20px] font-[700]'>{news?.title}</h5>
                {(news?.description || news?.summarized_description) &&
                    <div>
                        {
                            news?.summarized_description ?
                                <p className='font-[600] textSecondary line-clamp-1'>{news?.summarized_description}</p>
                                :
                                stripHtmlTags(news.description).length > 0 &&
                                <p className='font-[600] textSecondary line-clamp-1'>{stripHtmlTags(news.description).substring(0, 200) + '...'}</p>
                        }
                    </div>
                }
                <div className="flex flex-wrap items-center gap-2 textSecondary">
                    {news?.newsview_count > 0 ? (
                        <div className='flex items-center gap-[10px] font-[500]'>
                            <span> <IoEye size={20} /></span>
                            <span>{news?.newsview_count} {translate('views')}</span>
                        </div>) : null}
                    {news?.comments?.length > 0 ? (
                        <div className='flex items-center gap-[10px] font-[500]'>
                            <span> <MdOutlineComment size={20} /></span>
                            <span>{news?.comments?.length} {translate('comsLbl')}</span>
                        </div>
                    ) : null}
                </div>
            </div>
        </Link>
    )
}

export default NewsHorizontalCard
