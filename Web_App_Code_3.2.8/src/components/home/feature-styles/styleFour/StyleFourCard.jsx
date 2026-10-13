'use client'
import VideoPlayIcon from '@/components/commonComponents/VideoPlayIcon';
import StyleFourCardSkeleton from '@/components/skeletons/StyleFourCardSkeleton';
import { currentLangCode, placeholderImage, stripHtmlTags, truncateText } from '@/utils/helpers';
import { translate } from '@/utils/translation';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRightLong } from "react-icons/fa6";
import { IoEye } from 'react-icons/io5';
import { LuCalendarDays } from 'react-icons/lu';

const StyleFourCard = ({ value, breakingNewsSect, videoSect, isLoading = false, rssFeedCard }) => {

    if (isLoading) {
        return <StyleFourCardSkeleton />
    }

    const currLangCode = currentLangCode();

    const newsDate = value?.published_date || value?.date

    return (
        rssFeedCard ?
            <Link href={value?.url}
                title='detail-page' target='_blank'>
                <div className='flex flex-col gap-3 commonRadius commonBg p-4 relative'>
                    <div className='relative after:content-[""] transition-all duration-700 after:transition-all after:duration-700 after:absolute after:top-[50%] hover:after:top-0 after:bottom-[50%] hover:after:bottom-0 after:left-0 after:right-0 after:bg-[#ffffff99] after:opacity-100 after:hover:opacity-0'>
                        <img src={value?.image_url || ''} height={0} width={0} alt={value?.title} loading='lazy' className='h-[250px] md:h-[300px] w-full rounded-[8px] object-cover' onError={placeholderImage} />
                    </div>
                    <div className='flex flex-wrap h-12 xl:flex-nowrap items-center gap-2.5 lg:gap-[10px] xl:gap-[20px]  textSecondary'>
                        {value?.published_at && (
                            <div className='flex items-center gap-[10px] font-[500]'>
                                <span> <LuCalendarDays size={20} /></span>
                                <span>{new Date(value?.published_at).toLocaleString('en-us', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}</span>
                            </div>
                        )}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <h4 className='line-clamp-2 sm:h-[68px] textPrimary text-[18px] lg:text-[20px] font-[700]'>{value?.title}</h4>
                        {
                            value?.description &&
                            <div className='min-h-16'>
                                {
                                    stripHtmlTags(value.description).length > 0 &&
                                    <p className='font-[600] textSecondary line-clamp-3'>{stripHtmlTags(value.description).substring(0, 200) + '...'}</p>
                                }
                            </div>
                        }
                    </div>
                    <div className='py-2 pb-0 textSecondary font-[500] text-[18px] flex items-center gap-2 border-t borderColor group'>
                        <span className='group-hover:primaryColor transition-all duration-300'>{translate('readMoreLbl')}</span>
                        <FaArrowRightLong className='group-hover:primaryColor transition-all duration-300 group-hover:ml-2 mt-[2px] rtl:rotate-180' />
                    </div>
                </div>
            </Link>
            :
            videoSect ?
                <Link href={`/${currLangCode}/video-news/${value?.slug}`} title='detail-page'>
                    <div className='flex flex-col gap-3 commonRadius commonBg p-4 relative'>
                        <div className='relative after:content-[""] transition-all duration-700 after:transition-all after:duration-700 after:absolute after:top-[50%] hover:after:top-0 after:bottom-[50%] hover:after:bottom-0 after:left-0 after:right-0 after:bg-[#ffffff99] after:opacity-100 after:hover:opacity-0'>
                            <img src={value?.image || ""} height={0} width={0} alt={value?.title} loading='lazy' className='h-[250px] md:h-[300px] w-full rounded-[8px] object-cover' onError={placeholderImage} />
                            {videoSect &&
                                <VideoPlayIcon videoSect={videoSect} keyboard={false} url={value?.content_value} type_url={value?.content_type} />
                            }
                            {
                                value?.category_name &&
                                <span className='categoryTag absolute top-4 left-4 z-[1]'> {truncateText(value?.category_name, 25)}</span>
                            }
                        </div>
                        <div className='flex items-center gap-[20px]'>
                            {
                                newsDate &&
                                <div className='flex items-center gap-[10px] font-[500]'>
                                    <span> <LuCalendarDays size={20} /></span>
                                    <span>{new Date(newsDate).toLocaleString('en-us', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}</span>
                                </div>
                            }
                            <div className='flex items-center gap-[10px] font-[500]'>
                                <span> <IoEye size={20} /></span>
                                <span>{value?.total_views} {translate('views')}</span>
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <h5 className='line-clamp-2 sm:h-[68px] textPrimary text-[18px] lg:text-[20px] font-[700]'>{value?.title}</h5>
                        </div>
                        <div className='py-2 pb-0 textSecondary font-[500] text-[18px] flex items-center gap-2 border-t borderColor group'>
                            <span className='group-hover:primaryColor transition-all duration-300'>{translate('readMoreLbl')}</span>
                            <FaArrowRightLong className='group-hover:primaryColor transition-all duration-300 group-hover:ml-2 mt-[2px] rtl:rotate-180' />
                        </div>
                    </div>
                </Link>
                :
                <Link href={breakingNewsSect ? `/${currLangCode}/breaking-news/${value?.slug}` : `/${currLangCode}/news/${value?.slug}`}
                    title='detail-page'>
                    <div className='flex flex-col gap-3 commonRadius commonBg p-4 relative'>
                        <div className='relative after:content-[""] transition-all duration-700 after:transition-all after:duration-700 after:absolute after:top-[50%] hover:after:top-0 after:bottom-[50%] hover:after:bottom-0 after:left-0 after:right-0 after:bg-[#ffffff99] after:opacity-100 after:hover:opacity-0'>
                            <img src={value?.image || ''} height={0} width={0} alt={value?.title} loading='lazy' className='h-[250px] md:h-[300px] w-full rounded-[8px] object-cover' onError={placeholderImage} />
                            {
                                value?.category_name &&
                                <span className='categoryTag absolute top-4 left-4 z-[1]'> {truncateText(value?.category_name, 25)}</span>
                            }
                        </div>
                        <div className='flex flex-wrap h-12 xl:flex-nowrap items-center gap-2.5 lg:gap-[10px] xl:gap-[20px]  textSecondary'>
                            {newsDate && (
                                <div className='flex items-center gap-[10px] font-[500]'>
                                    <span> <LuCalendarDays size={20} /></span>
                                    <span>{new Date(newsDate).toLocaleString('en-us', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}</span>
                                </div>
                            )}
                            {(value?.total_views > 0 || value?.newsview_count > 0) ? (
                                <div className='flex items-center gap-[10px] font-[500]'>
                                    <span> <IoEye size={20} /></span>
                                    <span className='flex  gap-2'><span>{value?.total_views || value?.newsview_count}</span> <span>{translate('views')}</span></span>
                                </div>) : null}
                        </div>
                        <div className='flex flex-col gap-2'>
                            <h4 className='line-clamp-2 sm:h-[68px] textPrimary text-[18px] lg:text-[20px] font-[700]'>{value?.title}</h4>
                            {
                                (value?.description || value?.summarized_description) &&
                                <div className='min-h-16'>
                                    {
                                        value?.summarized_description ?
                                            <p className='font-[600] textSecondary line-clamp-3'>{value?.summarized_description}</p>
                                            :
                                            stripHtmlTags(value.description).length > 0 &&
                                            <p className='font-[600] textSecondary line-clamp-3'>{stripHtmlTags(value.description).substring(0, 200) + '...'}</p>
                                    }
                                </div>
                            }
                        </div>
                        <div className='py-2 pb-0 textSecondary font-[500] text-[18px] flex items-center gap-2 border-t borderColor group'>
                            <span className='group-hover:primaryColor transition-all duration-300'>{translate('readMoreLbl')}</span>
                            <FaArrowRightLong className='group-hover:primaryColor transition-all duration-300 group-hover:ml-2 mt-[2px] rtl:rotate-180' />
                        </div>
                    </div>
                </Link>
    );
};

export default StyleFourCard;
