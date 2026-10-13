'use client'
import VideoPlayIcon from '@/components/commonComponents/VideoPlayIcon';
import { currentLangCode, placeholderImage, truncateText } from '@/utils/helpers';
import { translate } from '@/utils/translation';
import Image from 'next/image';
import Link from 'next/link';
import { IoEye } from 'react-icons/io5';
import { LuCalendarDays } from 'react-icons/lu';

const StyleTwoCard = ({ Data, middleCard, videosNewsCard, breakingNewsCard, rssFeedCard }) => {

    const currLangCode = currentLangCode();

    const newsDate = Data?.published_date || Data?.date

    return (
        rssFeedCard ?
            <Link href={Data?.url}
                title='detail-page' target='_blank'>
                <div className={`group relative overflow-hidden commonRadius ${middleCard ? 'h-full' : 'h-max'} after:content-[''] after:absolute after:bottom-0 after:h-[300px] after:w-full after:textLinearBg after:transition-all after:duration-700 after:z-[1]`}>
                    <Image src={Data && Data?.image_url} width={0} height={0} alt={truncateText(Data?.title, 25)} loading='lazy' onError={placeholderImage} className={`${middleCard ? 'h-full' : 'h-[250px] md:h-[300px] lg:h-[350px]'} w-full commonRadius transition-all duration-500 group-hover:scale-[1.5] object-cover aspect-[1]`} />
                    <div className='absolute bottom-0 text-white p-3 flex flex-col gap-2 z-[2] w-full'>
                        <h4 className={` ${middleCard ? 'text-[18px] md:text-[24px] lg:text-[30px]' : 'text-[18px] lg:text-[20px]'} font-[700] line-clamp-2 transition-all duration-500 group-hover:underline`}>{Data && Data?.title}</h4>
                        <div className='flex items-center gap-[20px] border-t-[2px] border-[#FFFFFF40] pt-3'>

                            {
                                Data?.published_at &&
                                <div className='flex items-center gap-[10px] font-[500]'>
                                    <span> <LuCalendarDays size={20} /></span>
                                    <span className='text-base lg:text-sm 2xl:text-base'>{new Date(Data?.published_at).toLocaleString('en-us', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}</span>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </Link>
            :
            Data && !videosNewsCard ? <Link href={breakingNewsCard ? `/${currLangCode}/breaking-news/${Data?.slug}` : `/${currLangCode}/news/${Data?.slug}`}
                title='detail-page'>
                <div className={`group relative overflow-hidden commonRadius ${middleCard ? 'h-full' : 'h-max'} after:content-[''] after:absolute after:bottom-0 after:h-[300px] after:w-full after:textLinearBg after:transition-all after:duration-700 after:z-[1]`}>
                    <Image src={Data && Data?.image} width={0} height={0} alt={truncateText(Data?.category_name, 25)} loading='lazy' onError={placeholderImage} className={`${middleCard ? 'h-full' : 'h-[250px] md:h-[300px] lg:h-[350px]'} w-full commonRadius transition-all duration-500 group-hover:scale-[1.5] object-cover aspect-[1]`} />
                    <div className='absolute bottom-0 text-white p-3 flex flex-col gap-2 z-[2] w-full'>
                        {
                            Data?.category_name &&
                            <span className='categoryTag'>{truncateText(Data?.category_name, 25)}</span>
                        }
                        <h4 className={` ${middleCard ? 'text-[18px] md:text-[24px] lg:text-[30px]' : 'text-[18px] lg:text-[20px]'} font-[700] line-clamp-2 transition-all duration-500 group-hover:underline`}>{Data && Data?.title}</h4>
                        <div className='flex items-center gap-[20px] border-t-[2px] border-[#FFFFFF40] pt-3'>

                            {
                                newsDate &&
                                <div className='flex items-center gap-[10px] font-[500]'>
                                    <span> <LuCalendarDays size={20} /></span>
                                    <span className='text-base lg:text-sm 2xl:text-base'>{new Date(newsDate).toLocaleString('en-us', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}</span>
                                </div>
                            }

                            <div className='flex items-center gap-[10px] font-[500]'>
                                <span> <IoEye size={20} /></span>
                                <span className='text-base lg:text-sm 2xl:text-base'>{Data?.total_views} {translate('views')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link> :
                Data &&
                <div className={`group relative overflow-hidden commonRadius ${middleCard ? 'h-full' : 'h-max'} after:content-[''] after:absolute after:bottom-0 after:h-[300px] after:w-full after:textLinearBg after:transition-all after:duration-700 after:z-[1]`}>
                    <Image src={Data && Data?.image} width={0} height={0} alt={truncateText(Data?.category_name, 25)} loading='lazy' onError={placeholderImage} className={`${middleCard ? 'h-full' : 'h-[250px] md:h-[300px] lg:h-[350px]'} w-full commonRadius transition-all duration-500 group-hover:scale-[1.5] object-cover`} />
                    <div className='absolute bottom-0 text-white p-3 flex flex-col gap-2 w-full z-[2]'>
                        <h4 className={` ${middleCard ? 'text-[18px] md:text-[24px] lg:text-[30px]' : 'text-[18px] lg:text-[20px]'} font-[700] line-clamp-2 transition-all duration-500 group-hover:underline`}>{Data && Data?.title}</h4>
                        <div className='flex items-center gap-[20px]  border-t-[2px] border-[#FFFFFF40] pt-3'>
                            {
                                newsDate &&
                                <div className='flex items-center gap-[10px] font-[500]'>
                                    <span> <LuCalendarDays size={20} /></span>
                                    <span className='text-base lg:text-sm 2xl:text-base'>{new Date(newsDate).toLocaleString('en-us', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}</span>
                                </div>
                            }
                            <div className='flex items-center gap-[10px] font-[500]'>
                                <span> <IoEye size={20} /></span>
                                <span>{Data?.total_views} {translate('views')}</span>
                            </div>
                        </div>
                    </div>
                    {

                        Data?.content_type &&
                        <Link href={`/${currLangCode}/video-news/${Data?.slug}`} title='detail-page'>
                            <VideoPlayIcon videoSect={videosNewsCard} keyboard={false} url={Data?.content_value} type_url={Data?.content_type} />
                        </Link>
                    }
                </div>
    );
};

export default StyleTwoCard;
