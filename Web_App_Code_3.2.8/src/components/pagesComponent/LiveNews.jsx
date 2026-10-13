'use client'
import React, { useState, useEffect } from 'react'
import Layout from '../layout/Layout'
import Breadcrumb from '../breadcrumb/Breadcrumb'
import CommonCardSkeleton from '../skeletons/CommonCardSkeleton'
import VideoNewsCard from '../commonComponents/VideoNewsCard'
import { getLiveNewsApi } from '@/utils/api/api'
import { useSelector } from 'react-redux'
import { currentLanguageSelector } from '../store/reducers/languageReducer'
import { translate } from '@/utils/translation';
import LoadMoreBtn from '../commonComponents/loadermoreBtn/LoadmoreBtn'
import { settingsSelector } from '../store/reducers/settingsReducer'
import { useRouter } from 'next/router'
import NoDataFound from '../commonComponents/NoDataFound'

const LiveNews = () => {

    const settingsData = useSelector(settingsSelector);
    const showLiveNewsPage = settingsData && settingsData?.data?.live_streaming_mode === '1';
    const currentLanguage = useSelector(currentLanguageSelector)
    const dataPerPage = 6;

    const [isLoading, setIsLoading] = useState({
        loading: true,
        loadMoreLoading: false
    })
    const [loadMore, setLoadMore] = useState(false)
    const [liveNewsData, setLiveNewsData] = useState([])
    const [offset, setOffset] = useState(0)
    const [totalData, setTotalData] = useState('')
    const router = useRouter()

    useEffect(() => {
        if (!showLiveNewsPage) {
            router.replace(`/${currentLanguage?.code}`)
            return
        }

    }, [showLiveNewsPage])


    const handleLoadMore = () => {
        setLoadMore(true)
        setOffset(offset + 1)
    }
    // api call
    const getLiveNews = async () => {
        !loadMore ? setIsLoading({ loading: true }) : setIsLoading({ loadMoreLoading: true })
        try {
            const { data } = await getLiveNewsApi.getLiveNews({
                language_code: currentLanguage?.code,
                offset: offset * dataPerPage,
                limit: dataPerPage,
            })

            if (!data?.error && data?.data?.data && data?.data?.data.length > 0) {
                setTotalData(data?.data?.total)
                setIsLoading({ loading: false })
                setIsLoading({ loadMoreLoading: false })
                if (loadMore) {
                    setLiveNewsData((prevData) => [...prevData, ...data?.data?.data])
                }
                else {
                    setLiveNewsData(data?.data?.data);
                }
            }
            else {
                console.log('error =>', data?.message)
                setLiveNewsData([])
                setTotalData(0)
                setIsLoading({ loading: false, loadMoreLoading: false })
            }
        } catch (error) {
            console.log(error)
            setLiveNewsData([])
            setTotalData(0)
            setIsLoading({ loading: false, loadMoreLoading: false })
        }
    }

    useEffect(() => {
        if (currentLanguage?.code) {
            getLiveNews()
        }
    }, [currentLanguage, offset])


    return (
        <Layout>
            <>
                <Breadcrumb secondElement={translate('livenews')} />

                <section className='allBreakingNews container mt-8 sm:mt-12'>
                    {/* Premium Header */}
                    <div className="flex items-center mb-8 border-b-2 border-gray-900 pb-2">
                        <span className="bg-[#af2c2c] w-2 h-8 mr-3 block"></span>
                        <h1 className="text-2xl md:text-3xl font-[900] uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2" style={{ fontFamily: "var(--headline-font-family)" }}>
                            LIVE UPDATES <span className="h-3 w-3 bg-[#af2c2c] rounded-full animate-pulse ml-2"></span>
                        </h1>
                    </div>
                    {
                        isLoading?.loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(3)].map((_, index) => (
                                <div key={index}>
                                    <CommonCardSkeleton />
                                </div>
                            ))}
                        </div>
                            :
                            liveNewsData && liveNewsData?.length > 0 ? (
                                <div className="flex flex-col gap-8">
                                    {/* Magazine Top Section */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                                        {/* Featured Live Video (Left) */}
                                        <div className="lg:col-span-2">
                                            {liveNewsData[0] && (
                                                <div className="h-full">
                                                    <VideoNewsCard element={liveNewsData[0]} liveNewsPage={true} />
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Sidebar Live Videos (Right) */}
                                        <div className="lg:col-span-1 flex flex-col gap-4">
                                            {liveNewsData.slice(1, 5).map((element) => (
                                                <div className="h-28 md:h-32" key={element.id}>
                                                    <a href={`/${currentLanguage?.code}/live-news/${element?.slug}`} className="group flex h-full bg-white dark:bg-[#1a1a1a] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                                                        <div className="w-1/3 h-full relative overflow-hidden shrink-0">
                                                            <img 
                                                                src={element?.image || ""} 
                                                                alt={element?.title} 
                                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                                            />
                                                            {/* Play button overlay */}
                                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                                                                <div className="w-8 h-8 rounded-full bg-[#af2c2c] flex items-center justify-center">
                                                                    <svg className="w-3 h-3 text-white ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z"/></svg>
                                                                </div>
                                                            </div>
                                                            <div className="absolute top-2 left-2 bg-[#af2c2c] text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1">
                                                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> LIVE
                                                            </div>
                                                        </div>
                                                        <div className="w-2/3 p-3 flex flex-col justify-center">
                                                            <h3 className="text-[14px] md:text-[15px] font-[800] leading-tight line-clamp-3 group-hover:text-[#af2c2c] transition-colors text-gray-900 dark:text-white" style={{ fontFamily: "var(--headline-font-family)" }}>
                                                                {element?.title}
                                                            </h3>
                                                        </div>
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    {liveNewsData.length > 5 && <div className="border-b border-gray-200 dark:border-gray-800 my-4"></div>}

                                    {/* Magazine Bottom Section */}
                                    {liveNewsData.length > 5 && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {liveNewsData.slice(5).map((element) => {
                                                return <VideoNewsCard element={element} liveNewsPage={true} key={element.id} />
                                            })}
                                        </div>
                                    )}
                                </div>
                            ) :
                                <div> <NoDataFound /></div>
                    }
                    <div className='mt-12'>
                        {totalData > dataPerPage && totalData !== liveNewsData?.length ? (
                            <LoadMoreBtn handleLoadMore={handleLoadMore} loadMoreLoading={isLoading.loadMoreLoading} />
                        ) : null}
                    </div>

                </section>
            </>
        </Layout>
    )
}

export default LiveNews