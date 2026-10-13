'use client'
import VideoPlayIcon from '@/components/commonComponents/VideoPlayIcon';
import { currentLangCode, placeholderImage, truncateText } from '@/utils/helpers';
import Image from 'next/image';
import Link from 'next/link';
import { LuCalendarDays } from 'react-icons/lu';

const StyleSixCard = ({ item, breakingNewsSect, newsSect, rssFeedCard }) => {

    const currLangCode = currentLangCode();

    const newsDate = item?.published_date || item?.date

    return (
        rssFeedCard ?
            <Link href={item?.url}
                title='detail-page'
                target='_blank'
            >
                <div className="group relative overflow-hidden border borderColor commonRadius h-auto after:content-[''] after:absolute after:bottom-0 after:h-[300px] after:w-full after:textLinearBgStyleSix after:blur-[12px] after:transition-all after:duration-700 hover:after:h-full">

                    <Image src={item?.image_url} alt={item?.title} loading='lazy' height={0} width={0} className='h-[375px] md:h-[470px] w-auto commonRadius transition-all object-cover duration-500 group-hover:scale-[1.2]'
                        onError={placeholderImage} />
                    <div className='absolute bottom-0 z-[1] text-white p-3 flex flex-col gap-2 transition-all duration-300 group-hover:bottom-3'>
                        {
                            item?.published_at &&
                            <div className='flex items-center gap-[10px] font-medium text-[16px] lg:text-[18px]'>
                                <span> <LuCalendarDays size={20} /></span>
                                <span>{new Date(item?.published_at).toLocaleString('en-us', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}</span>
                            </div>
                        }
                        {/* <h6 className={`text-[18px] lg:text-[20px] font-[700] line-clamp-2 transition-all duration-500 group-hover:underline styleSixTitle`}> {truncateText(item?.title, 35)}</h6> */}
                        <h6 className={`text-[18px] lg:text-[20px] font-[700] line-clamp-2 transition-all duration-500 group-hover:underline styleSixTitle`}> {item?.title}</h6>
                    </div>
                </div>
            </Link >
            :
            <Link href={breakingNewsSect ? `/${currLangCode}/breaking-news/${item.slug}` : `/${currLangCode}/news/${item.slug}`}
                title='detail-page'
            >
                <div className="group relative overflow-hidden border borderColor commonRadius h-auto after:content-[''] after:absolute after:bottom-0 after:h-[300px] after:w-full after:textLinearBgStyleSix after:blur-[12px] after:transition-all after:duration-700 hover:after:h-full">
                    {
                        item?.category_name &&
                        <span className='categoryTag absolute top-4 left-4 z-[1]'> {truncateText(item?.category_name, 25)}</span>
                    }
                    <Image src={item?.image} alt={item?.title} loading='lazy' height={0} width={0} className='h-[375px] md:h-[470px] w-auto commonRadius transition-all object-cover duration-500 group-hover:scale-[1.2]'
                        onError={placeholderImage} />
                    <div className='absolute bottom-0 z-[1] text-white p-3 flex flex-col gap-2 transition-all duration-300 group-hover:bottom-3'>
                        {
                            newsDate &&
                            <div className='flex items-center gap-[10px] font-medium text-[16px] lg:text-[18px]'>
                                <span> <LuCalendarDays size={20} /></span>
                                <span>{new Date(newsDate).toLocaleString('en-us', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}</span>
                            </div>
                        }
                        {/* <h6 className={`text-[18px] lg:text-[20px] font-[700] line-clamp-2 transition-all duration-500 group-hover:underline styleSixTitle`}> {truncateText(item?.title, 35)}</h6> */}
                        <h6 className={`text-[18px] lg:text-[20px] font-[700] line-clamp-2 transition-all duration-500 group-hover:underline styleSixTitle`}> {item?.title}</h6>
                    </div>
                </div>
                {
                    !breakingNewsSect && !newsSect && item.content_value &&
                    <Link href={`/${currLangCode}/video-news/${item.slug}`} title='detail-page'>
                        <VideoPlayIcon videoSect={true} keyboard={false} url={item?.content_value} type_url={item.content_type} />
                    </Link>
                }
            </Link >
    );
};

export default StyleSixCard;
