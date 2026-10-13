'use client'
import VideoPlayIcon from '@/components/commonComponents/VideoPlayIcon';
import { currentLangCode, placeholderImage, stripHtmlTags, } from '@/utils/helpers';
import Image from 'next/image';
import Link from 'next/link';
import { LuCalendarDays } from 'react-icons/lu';
;

const StyleThreeCardOne = ({ Data, breakingNewsCard, videoNewsCard, rssFeedCard }) => {

    const currLangCode = currentLangCode();

    const newsDate = Data?.published_date || Data?.date

    return (
        rssFeedCard ?
            <Link href={Data?.url} title='detail-page' target={'_blank'}>
                <div className="group relative overflow-hidden commonRadius h-auto">
                    <Image src={Data?.image_url} height={0} width={0} alt='img' loading='lazy' className={`lg:h-[520px] w-full object-cover commonRadius`} onError={placeholderImage} />
                    <div className='text-white  mt-6 flex flex-col gap-0'>
                        {
                            Data?.published_at &&
                            <span className='flex items-center gap-2 textPrimary font-[500]'><LuCalendarDays size={20} />{new Date(Data?.published_at).toLocaleString('en-us', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}</span>
                        }
                        <h3 className={`text-[18px] md:text-[24px] lg:text-[30px] font-[700] line-clamp-2 textPrimary`}>{Data?.title}</h3>
                        {
                            (Data?.description) &&
                            <div className='mt-2 md:mt-4'>
                                {
                                    stripHtmlTags(Data.description).length > 0 &&
                                    <p className='font-[500] text-lg textSecondary line-clamp-3'>{stripHtmlTags(Data.description).substring(0, 200) + '...'}</p>
                                }
                            </div>
                        }
                    </div>
                </div>
            </Link>
            :
            Data && !videoNewsCard ? <Link href={breakingNewsCard ? `/${currLangCode}/breaking-news/${Data?.slug}` : `/${currLangCode}/news/${Data?.slug}`} title='detail-page'>
                <div className="group relative overflow-hidden commonRadius h-auto">
                    <Image src={Data?.image} height={0} width={0} alt='img' loading='lazy' className={`lg:h-[520px] w-full object-cover commonRadius`} onError={placeholderImage} />
                    <div className='text-white  mt-6 flex flex-col gap-0'>
                        <div className='absolute top-[20px] left-[20px]'>
                            {
                                Data?.category_name &&
                                <span className='categoryTag'>{Data?.category_name}</span>

                            }
                        </div>
                        {
                            newsDate &&
                            <span className='flex items-center gap-2 textPrimary font-[500]'><LuCalendarDays size={20} />{new Date(newsDate).toLocaleString('en-us', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}</span>
                        }
                        <h3 className={`text-[18px] md:text-[24px] lg:text-[30px] font-[700] line-clamp-2 textPrimary`}>{Data?.title}</h3>
                        {
                            (Data?.description || Data?.summarized_description) &&
                            <div className='mt-2 md:mt-4'>
                                {
                                    Data?.summarized_description ?
                                        <p className='font-[500] text-lg textSecondary line-clamp-3'>{Data?.summarized_description}</p>
                                        :
                                        stripHtmlTags(Data.description).length > 0 &&
                                        <p className='font-[500] text-lg textSecondary line-clamp-3'>{stripHtmlTags(Data.description).substring(0, 200) + '...'}</p>
                                }
                            </div>
                        }
                    </div>
                </div>
            </Link> :
                Data &&
                <div>
                    <div className="group relative overflow-hidden commonRadius h-auto">
                        <div className='relative'>
                            <Image src={Data?.image} height={0} width={0} alt='img' loading='lazy' className={`lg:h-[520px] w-full object-cover commonRadius`} onError={placeholderImage} />
                            {
                                videoNewsCard && Data?.content_value &&
                                <Link href={`/${currLangCode}/video-news/${Data?.slug}`} title='detail-page'>
                                    <VideoPlayIcon videoSect={videoNewsCard} keyboard={false} url={Data?.content_value} type_url={Data?.content_type} />
                                </Link>
                            }
                        </div>
                        <div className='text-white  mt-6 flex flex-col'>
                            {
                                Data?.category_name &&
                                <div className='absolute top-[20px] left-[20px]'>
                                    <span className='categoryTag'>{Data?.category_name}</span>
                                </div>
                            }
                            {
                                newsDate &&
                                <span className='flex items-center gap-2 textPrimary font-[500]'><LuCalendarDays size={20} />{new Date(newsDate).toLocaleString('en-us', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}</span>
                            }

                            <h3 className={`text-[18px] md:text-[24px] lg:text-[30px] font-[700] line-clamp-2 textPrimary`}>{Data?.title}</h3>
                        </div>

                    </div>
                </div>

    );
};

export default StyleThreeCardOne;
