'use client'
import VideoPlayIcon from '@/components/commonComponents/VideoPlayIcon';
import { currentLangCode, placeholderImage, stripHtmlTags, } from '@/utils/helpers';
import Image from 'next/image';
import Link from 'next/link';
import { LuCalendarDays } from 'react-icons/lu';
;

const StyleThreeCardTwo = ({ Data, breakingNewsCard, videoNewsCard, rssFeedCard }) => {

    const currLangCode = currentLangCode();

    const newsDate = Data?.published_date || Data?.date

    return (
        rssFeedCard ?
            <Link href={Data?.url} target={'_blank'} title='detail-page'>
                <div className="relative overflow-hidden commonRadius h-auto  after:content-[''] after:absolute after:bottom-0 after:h-[300px] after:w-full after:textLinearBg after:z-[1]">
                    <Image src={Data?.image_url} height={0} width={0} alt={Data?.title} loading='lazy' className={`lg:h-[340px] w-full object-cover commonRadius`} onError={placeholderImage} />
                    <div className='absolute bottom-0 text-white p-4 pb-2 flex flex-col gap-2 z-[4]'>
                        {
                            Data?.published_at &&
                            <span className='flex items-center gap-2 font-[500]'><LuCalendarDays size={20} />{new Date(Data?.published_at).toLocaleString('en-us', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}</span>
                        }
                        <h4 className={`text-[18px] lg:text-[20px] font-[700] line-clamp-2`}>{Data?.title}</h4>
                        {
                            Data?.description &&
                            <div>
                                {
                                    stripHtmlTags(Data.description).length > 0 &&
                                    <p className='font-[500] line-clamp-3'>{stripHtmlTags(Data.description).substring(0, 200) + '...'}</p>
                                }
                            </div>
                        }
                    </div>
                </div>
            </Link> :

            Data && !videoNewsCard ? <Link href={breakingNewsCard ? `/${currLangCode}/breaking-news/${Data?.slug}` : `/${currLangCode}/news/${Data?.slug}`} title='detail-page'>
                <div className="relative overflow-hidden commonRadius h-auto  after:content-[''] after:absolute after:bottom-0 after:h-[300px] after:w-full after:textLinearBg after:z-[1]">
                    <Image src={Data?.image} height={0} width={0} alt={Data?.title} loading='lazy' className={`lg:h-[340px] w-full object-cover commonRadius`} onError={placeholderImage} />
                    <div className='absolute top-[20px] left-[20px]'>
                        {
                            Data?.category_name &&
                            <span className='categoryTag'>{Data?.category_name}</span>
                        }
                    </div>
                    <div className='absolute bottom-0 text-white p-4 pb-2 flex flex-col gap-2 z-[4]'>
                        {
                            newsDate &&
                            <span className='flex items-center gap-2 font-[500]'><LuCalendarDays size={20} />{new Date(newsDate).toLocaleString('en-us', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}</span>
                        }
                        <h4 className={`text-[18px] lg:text-[20px] font-[700] line-clamp-2`}>{Data?.title}</h4>
                        {
                            (Data?.description || Data?.summarized_description) &&
                            <div>
                                {
                                    Data?.summarized_description ?
                                        <p className='font-[500] line-clamp-3'>{Data?.summarized_description}</p>
                                        :
                                        stripHtmlTags(Data.description).length > 0 &&
                                        <p className='font-[500] line-clamp-3'>{stripHtmlTags(Data.description).substring(0, 200) + '...'}</p>
                                }
                            </div>
                        }
                    </div>
                </div>
            </Link> :
                Data &&
                <div>
                    <div className="relative overflow-hidden commonRadius h-auto  after:content-[''] after:absolute after:bottom-0 after:h-[300px] after:w-full after:textLinearBg after:z-[1]">
                        <Image src={Data?.image} height={0} width={0} alt={Data?.title} loading='lazy' className={`lg:h-[340px] w-full object-cover commonRadius`} onError={placeholderImage} />
                        {
                            Data?.category_name &&
                            <div className='absolute top-[20px] left-[20px]'>
                                <span className='categoryTag'>{Data?.category_name}</span>
                            </div>
                        }

                        <div className='absolute bottom-0 text-white p-4 pb-2 flex flex-col gap-2 z-[4]'>
                            {
                                newsDate &&
                                <span className='flex items-center gap-2 font-[500]'><LuCalendarDays size={20} />{new Date(newsDate).toLocaleString('en-us', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}</span>
                            }

                            <h4 className={`text-[18px] lg:text-[20px] font-[700] line-clamp-2`}>{Data?.title}</h4>
                        </div>
                        {videoNewsCard && Data?.content_value &&
                            <Link href={`/${currLangCode}/video-news/${Data?.slug}`} title='detail-page'>
                                <VideoPlayIcon videoSect={videoNewsCard} keyboard={false} url={Data?.content_value} type_url={Data?.content_type} />
                            </Link>
                        }
                    </div>
                </div>
    );
};

export default StyleThreeCardTwo;
