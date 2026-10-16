'use client'
import React, { useState, useEffect, useRef } from 'react'
import Layout from '../layout/Layout'
import Breadcrumb from '../breadcrumb/Breadcrumb'
import CommonCardSkeleton from '../skeletons/CommonCardSkeleton'
import VideoNewsCard from '../commonComponents/VideoNewsCard'
import EmbeddedVideo from '../commonComponents/EmbeddedVideo'
import { getLiveNewsApi } from '@/utils/api/api'
import { useSelector } from 'react-redux'
import { currentLanguageSelector } from '../store/reducers/languageReducer'
import { translate } from '@/utils/translation'
import LoadMoreBtn from '../commonComponents/loadermoreBtn/LoadmoreBtn'
import { settingsSelector } from '../store/reducers/settingsReducer'
import { useRouter } from 'next/router'
import NoDataFound from '../commonComponents/NoDataFound'

const LiveNews = () => {
    const settingsData = useSelector(settingsSelector)
    const showLiveNewsPage = settingsData && settingsData?.data?.live_streaming_mode === '1'
    const currentLanguage = useSelector(currentLanguageSelector)
    const dataPerPage = 6

    const [isLoading, setIsLoading] = useState({
        loading: true,
        loadMoreLoading: false
    })
    const [loadMore, setLoadMore] = useState(false)
    const [liveNewsData, setLiveNewsData] = useState([])
    const [activeStream, setActiveStream] = useState(null)
    const [offset, setOffset] = useState(0)
    const [totalData, setTotalData] = useState('')
    const router = useRouter()
    const playerContainerRef = useRef(null)

    useEffect(() => {
        if (!showLiveNewsPage) {
            router.replace(`/${currentLanguage?.code}`)
            return
        }
    }, [showLiveNewsPage])

    const handleSelectStream = (stream) => {
        setActiveStream(stream)
        if (playerContainerRef.current) {
            playerContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

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
                const list = data.data.data
                setTotalData(data?.data?.total)
                setIsLoading({ loading: false, loadMoreLoading: false })
                if (loadMore) {
                    setLiveNewsData((prevData) => [...prevData, ...list])
                } else {
                    setLiveNewsData(list)
                    if (!activeStream && list.length > 0) {
                        setActiveStream(list[0])
                    }
                }
            } else {
                console.log('error =>', data?.message)
                if (!loadMore) {
                    setLiveNewsData([])
                    setTotalData(0)
                }
                setIsLoading({ loading: false, loadMoreLoading: false })
            }
        } catch (error) {
            console.log(error)
            if (!loadMore) {
                setLiveNewsData([])
                setTotalData(0)
            }
            setIsLoading({ loading: false, loadMoreLoading: false })
        }
    }

    useEffect(() => {
        if (currentLanguage?.code) {
            getLiveNews()
        }
    }, [currentLanguage, offset])

    const currentFeatured = activeStream || liveNewsData[0]

    return (
        <Layout>
            <>
                <Breadcrumb secondElement={translate('livenews')} />

                <section className='allBreakingNews container mt-8 sm:mt-12'>
                    {/* Header */}
                    <div className="flex items-center mb-8 border-b-2 border-gray-900 pb-2">
                        <span className="bg-[#af2c2c] w-2 h-8 mr-3 block"></span>
                        <h1 className="text-2xl md:text-3xl font-[900] uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2" style={{ fontFamily: "var(--headline-font-family)" }}>
                            LIVE STREAMING <span className="h-3 w-3 bg-[#af2c2c] rounded-full animate-pulse ml-2"></span>
                        </h1>
                    </div>

                    {isLoading?.loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(3)].map((_, index) => (
                                <div key={index}>
                                    <CommonCardSkeleton />
                                </div>
                            ))}
                        </div>
                    ) : liveNewsData && liveNewsData?.length > 0 ? (
                        <div className="flex flex-col gap-8">
                            {/* Magazine Top Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                                {/* Featured Live Video Player (Left) */}
                                <div className="lg:col-span-2" ref={playerContainerRef}>
                                    {currentFeatured && (
                                        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 p-4 md:p-6 flex flex-col justify-between">
                                            <div className="rounded-xl overflow-hidden bg-black shadow-inner">
                                                <EmbeddedVideo
                                                    url={currentFeatured?.url}
                                                    type={currentFeatured?.type}
                                                    height="460px"
                                                />
                                            </div>
                                            <div className="mt-5">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="bg-[#af2c2c] text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded flex items-center gap-1.5 shadow-sm">
                                                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                                        NOW STREAMING
                                                    </span>
                                                </div>
                                                <h2 className="text-xl md:text-2xl lg:text-3xl font-[800] leading-snug text-gray-900 dark:text-white" style={{ fontFamily: "var(--headline-font-family)" }}>
                                                    {currentFeatured?.title}
                                                </h2>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Sidebar Live Videos (Right) */}
                                <div className="lg:col-span-1 flex flex-col gap-4">
                                    <div className="text-xs font-bold uppercase tracking-wider text-gray-500 pb-1 border-b border-gray-100 dark:border-gray-800">
                                        More Live Broadcasts
                                    </div>
                                    {liveNewsData.map((element) => {
                                        const isCurrent = currentFeatured?.id === element.id
                                        return (
                                            <div
                                                key={element.id}
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => handleSelectStream(element)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') handleSelectStream(element); }}
                                                className={`group flex h-24 md:h-28 bg-white dark:bg-[#1a1a1a] rounded-xl overflow-hidden shadow-sm border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                                                    isCurrent
                                                        ? 'border-[#af2c2c] ring-2 ring-[#af2c2c]/30'
                                                        : 'border-gray-100 dark:border-gray-800 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="w-1/3 h-full relative overflow-hidden shrink-0">
                                                    <img
                                                        src={element?.image || ""}
                                                        alt={element?.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                                                        <div className="w-8 h-8 rounded-full bg-[#af2c2c] flex items-center justify-center shadow">
                                                            <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z"/></svg>
                                                        </div>
                                                    </div>
                                                    <div className="absolute top-2 left-2 bg-[#af2c2c] text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded flex items-center gap-1 shadow">
                                                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> LIVE
                                                    </div>
                                                </div>
                                                <div className="w-2/3 p-3 flex flex-col justify-center">
                                                    <h3 className={`text-[13px] md:text-[14px] font-[700] leading-snug line-clamp-3 transition-colors ${
                                                        isCurrent ? 'text-[#af2c2c]' : 'text-gray-900 dark:text-white group-hover:text-[#af2c2c]'
                                                    }`} style={{ fontFamily: "var(--headline-font-family)" }}>
                                                        {element?.title}
                                                    </h3>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Divider */}
                            {liveNewsData.length > 4 && <div className="border-b border-gray-200 dark:border-gray-800 my-4"></div>}

                            {/* Bottom Grid for Additional Streams */}
                            {liveNewsData.length > 4 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {liveNewsData.slice(4).map((element) => (
                                        <VideoNewsCard
                                            element={element}
                                            liveNewsPage={true}
                                            onPlay={handleSelectStream}
                                            key={element.id}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div> <NoDataFound /></div>
                    )}

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