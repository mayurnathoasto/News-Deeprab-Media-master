'use client'
import React, { useState, useEffect } from 'react'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb'
import { useRouter } from 'next/router'
import { FiCalendar } from 'react-icons/fi';
import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
import RelatedNewSections from '@/components/relatedNews/RelatedNewSections'
import { useSelector } from 'react-redux'
import { settingsSelector } from '@/components/store/reducers/settingsReducer'
import { getVideoNewsApi, setLikeDisLikeApi } from '@/utils/api/api'
import { isLogin, } from '@/utils/helpers';
import { translate } from '@/utils/translation';
import toast from 'react-hot-toast'
import { userDataSelector } from '@/components/store/reducers/userReducer'
import DetailPageSkeleton from '@/components/skeletons/DetailPageSkeleton'
import OpenInAppPopUp from '@/components/commonComponents/OpenInAppPopUp'
import { setLoginModalState } from '@/components/store/reducers/helperReducer'
import Layout from '@/components/layout/Layout'
import { currentLanguageSelector } from '@/components/store/reducers/languageReducer';
import MediaShare from '@/components/SocialMediaShares/MediaShare'
import NoDataFound from '@/components/commonComponents/NoDataFound.jsx';
import EmbeddedVideo from '@/components/commonComponents/EmbeddedVideo.jsx';


const VideoDetails = () => {

    const router = useRouter();

    const slug = router?.query?.slug;
    const isShare = router?.query?.share;
    const routerLanguageCode = router?.query?.langCode;

    const settingsData = useSelector(settingsSelector)
    const currentLanguage = useSelector(currentLanguageSelector)

    const [like, setLike] = useState(false);

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])

    const [likeNewsIncreament, setLikeNewIncreament] = useState(false)
    const [likeNews, setLikeNews] = useState(false)

    const [IsOpenInApp, setIsOpenInApp] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);

    // Safe window check
    useEffect(() => {
        // Only run on client side
        if (typeof window !== 'undefined') {
            // Set initial width
            setWindowWidth(window.innerWidth);

            // Add event listener to update width on resize
            const handleResize = () => {
                setWindowWidth(window.innerWidth);
            };

            window.addEventListener('resize', handleResize);

            // Clean up
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    // Now use windowWidth state instead of directly accessing window.innerWidth
    useEffect(() => {
        if (isShare && windowWidth <= 768) {
            setIsOpenInApp(true);
        } else {
            setIsOpenInApp(false);
        }
    }, [windowWidth, isShare]);

    const currentUrL = typeof window !== 'undefined'
        ? `${process.env.NEXT_PUBLIC_WEB_URL}${router?.asPath}`
        : '';

    const decodedURL = currentUrL ? decodeURI(currentUrL) : '';

    const getNewsDetails = async () => {
        try {
            setLoading(true)
            const { data } = await getVideoNewsApi.getVideoNews({
                slug: slug,
                language_code: routerLanguageCode
            });


            const newsData = data?.data?.data[0];

            if (!data?.error) {

                if (newsData.like === 0) {
                    setLike(false);
                } else {
                    setLike(true);
                }

                setData(newsData)
                setLoading(false)
            }
            else {
                console.log('error =>', data?.message)
                setData([])
                setLoading(false)
            }

        } catch (error) {
            console.error('Error:', error);
            setLoading(false)
            setData([])
        }
    };

    useEffect(() => {
        if (routerLanguageCode) {
            getNewsDetails()
        }
        // console.log('slug', slug);

    }, [currentLanguage, slug, routerLanguageCode]);


    const handleLikeNews = () => {
        if (isLogin()) {
            setLikeDislikeData(data && data?.id)
        }
        else {
            setLoginModalState({ openModal: true })
            toast.error(translate('loginFirst'))
            setTimeout(() => {
                setLoginModalState({ openModal: false })
            }, 2000);
        }
    }

    const setLikeDislikeData = async (id) => {
        try {
            const { data } = await setLikeDisLikeApi.setLikeDisLike({
                news_id: id,
                status: like ? 0 : 1,
            });

            if (!data?.error) {
                // getNewsDetails()
                setLikeNewIncreament(!likeNewsIncreament)
                setLike(!like)
            }
            else {
                console.log('like error =>', data?.message)
            }
            // toast.success(response?.data?.message);

        } catch (error) {
            console.error('Error:', error);
        }
    };


    useEffect(() => {
    }, [likeNews, data])

    return (
        <Layout>
            <section className='detailPage'>
                {
                    loading ?
                        <DetailPageSkeleton />
                        :
                        data ?
                            <>
                                {
                                    <Breadcrumb secondElement={translate('videoDetails')} thirdElement={data && data?.title} />
                                }

                                <section className='container detailPage commonMT'>
                                    <div className="grid grid-cols-12 gap-y-10 lg:gap-8">
                                        <div className="col-span-12 lg:col-span-8">
                                            <div className='flex flex-col gap-8'>

                                                <div className='relative'>
                                                    {
                                                        data && data?.content_value &&
                                                        <EmbeddedVideo
                                                            url={data?.content_value}
                                                            type={data?.content_type}
                                                            className='max-[575px]:h-[300px] rounded-2xl'
                                                        />
                                                    }
                                                </div>

                                                <div>
                                                    {
                                                        data && data?.category_name &&
                                                        <span className='categoryTag'>{data && data?.category_name}</span>
                                                    }
                                                    <h2 className='text-[22px] md:text-[34px] lg:text-[46px] font-[700] capitalize textPrimary mt-2'>
                                                        {data && data?.title}
                                                    </h2>
                                                </div>

                                                <div className='flex items-center justify-between flex-wrap gap-6 border-y borderColor py-4 sm:py-6'>
                                                    <div className='flex items-center gap-4 sm:gap-8 flex-wrap'>
                                                        {
                                                            <>
                                                                {
                                                                    data && data?.published_date &&
                                                                    <div className='flex items-center gap-1 textPrimary font-[600]'>
                                                                        <FiCalendar size={18} />
                                                                        <span>{new Date(data && data?.published_date || data && data?.date).toLocaleString('en-us', {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                            year: 'numeric'
                                                                        })}</span>
                                                                    </div>
                                                                }
                                                                {
                                                                    data && data?.source_type !== 'breaking_news' &&
                                                                    <div className='flex items-center gap-1 textPrimary font-[600]'>
                                                                        <span className='cursor-pointer font-[600]' onClick={() => handleLikeNews()}>
                                                                            {
                                                                                like && isLogin() ?
                                                                                    <span>
                                                                                        <AiFillLike size={23} onClick={() => setLikeNews(false)} />
                                                                                    </span>
                                                                                    :
                                                                                    <span>
                                                                                        <AiOutlineLike size={23} onClick={() => setLikeNews(true)} />
                                                                                    </span>
                                                                            }
                                                                        </span>
                                                                        {
                                                                            likeNewsIncreament && likeNews && like ?
                                                                                <span>{data && data?.total_like + 1} {translate('likes')}</span>
                                                                                :
                                                                                <span>{data && data?.total_like} {translate('likes')}</span>
                                                                        }
                                                                    </div>
                                                                }
                                                            </>
                                                        }
                                                    </div>

                                                    <MediaShare url={decodedURL} title={`${data?.title} - ${settingsData && settingsData?.data?.web_setting?.web_name}`} hashtag={`${settingsData && settingsData?.data?.web_setting?.web_name}`} />

                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                                            {
                                                <>
                                                    {
                                                        data && data?.category_id &&
                                                        <RelatedNewSections newsSlug={slug} categorySlug={data && data?.category_slug} categoryId={data && data?.category_id} videoNewsPage={true}
                                                        />
                                                    }
                                                </>
                                            }
                                        </div>
                                    </div>
                                </section>
                            </>
                            :
                            <NoDataFound />
                }
                <OpenInAppPopUp IsOpenInApp={IsOpenInApp} OnHide={() => setIsOpenInApp(false)} />
            </section>
        </Layout>
    )
}

export default VideoDetails
