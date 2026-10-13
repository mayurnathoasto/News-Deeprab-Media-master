'use client'
import Link from 'next/link';
import { currentLangCode, placeholderImage, stripHtmlTags, truncateText } from '@/utils/helpers'
import { translate } from '@/utils/translation';
import VideoPlayIcon from '@/components/commonComponents/VideoPlayIcon';

const StyleOneCard = ({ item, videoSect, breakingNewsSect, rssFeedCard }) => {

    const currLangCode = currentLangCode();

    return (
        rssFeedCard ?
            <div className='grid grid-cols-12 items-center justify-center container pt-6' >
                <div className="content col-span-12 xl:col-span-7 flex flex-col gap-4 sm:gap-6 order-1 xl:order-none  bodyBgColor shadow-[0_0_20px_8px_#6c757d2b] justify-center p-4 sm:p-6 md:p-10  xl:p-12 h-full xl:h-[30rem] w-full xl:w-[55rem] rounded-b-[10px] xl:rounded-[10px] relative z-[1]">

                    <div>
                        <h3 className='text-[24px] md:text-[34px] font-[600] textPrimary'>{truncateText(item?.title, 60)}</h3>
                    </div>
                    {
                        item?.description &&
                        <div>
                            {
                                stripHtmlTags(item?.description).length > 0 &&
                                <p className='text-[18px] textSecondary font-[600] line-clamp-4'>{stripHtmlTags(item?.description).substring(0, 300) + '...'}</p>
                            }
                        </div>
                    }
                    {
                        <Link href={item?.url} target='_blank'
                            title={translate('readmore')}
                            className='commonBtn text-[18px] md:text-[24px] !w-max'
                        >
                            {translate('readmore')}
                        </Link>
                    }

                </div>
                <div className="img col-span-12 xl:col-span-5 relative">
                    <img src={item?.image_url} className='h-[18rem] md:h-[26rem] xl:h-[35rem] w-full rounded-t-[10px] xl:rounded-[10px] object-cover' alt={item?.title} onError={placeholderImage} />                  
                </div>
            </div>
            :
            <div className='grid grid-cols-12 items-center justify-center container pt-6' >
                <div className="content col-span-12 xl:col-span-7 flex flex-col gap-4 sm:gap-6 order-1 xl:order-none  bodyBgColor shadow-[0_0_20px_8px_#6c757d2b] justify-center p-4 sm:p-6 md:p-10  xl:p-12 h-full xl:h-[30rem] w-full xl:w-[55rem] rounded-b-[10px] xl:rounded-[10px] relative z-[1]">
                    {
                        item?.category_name &&
                        <div>
                            <span className='categoryTag'> {truncateText(item.category_name, 25)}</span>
                        </div>
                    }
                    <div>
                        <h3 className='text-[24px] md:text-[34px] font-[600] textPrimary'>{truncateText(item?.title, 60)}</h3>
                    </div>
                    {
                        (item?.description || item?.summarized_description) &&
                        <div>
                            {
                                item?.summarized_description ?
                                    <p className='text-[18px] textSecondary font-[600] line-clamp-4'>{item?.summarized_description}</p>
                                    :
                                    stripHtmlTags(item.description).length > 0 &&
                                    <p className='text-[18px] textSecondary font-[600] line-clamp-4'>{stripHtmlTags(item.description).substring(0, 300) + '...'}</p>
                            }
                        </div>
                    }
                    {
                        !videoSect && item?.slug &&
                        <Link href={`${breakingNewsSect ? `/${currLangCode}/breaking-news/${item.slug}` : `/${currLangCode}/news/${item.slug}`}`}
                            title={translate('readmore')}
                            className='commonBtn text-[18px] md:text-[24px] !w-max'
                        >
                            {translate('readmore')}
                        </Link>
                    }

                </div>
                <div className="img col-span-12 xl:col-span-5 relative">
                    <img src={item.image} className='h-[18rem] md:h-[26rem] xl:h-[35rem] w-full rounded-t-[10px] xl:rounded-[10px] object-cover' alt={item.title} onError={placeholderImage} />
                    {
                        item?.content_value && videoSect &&
                        <Link href={`/${currLangCode}/video-news/${item.slug}`} title='detail-page'>
                            <VideoPlayIcon videoSect={false} keyboard={false} url={item?.content_value} type_url={item.content_type} />
                        </Link>
                    }
                </div>
            </div>
    );
};

export default StyleOneCard;
