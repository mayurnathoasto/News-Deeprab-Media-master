'use client'
import React, { useState, useEffect } from 'react'
import Layout from '../layout/Layout'
import Breadcrumb from '../breadcrumb/Breadcrumb'
import CommonCardSkeleton from '../skeletons/CommonCardSkeleton'
import NewsCardTwo from '../commonComponents/commonCards/NewsCardTwo'
import { useSelector } from 'react-redux'
import { currentLanguageSelector } from '../store/reducers/languageReducer'
import { getBreaingNewsApi } from '@/utils/api/api'
import { translate } from '@/utils/translation';
import LoadMoreBtn from '../commonComponents/loadermoreBtn/LoadmoreBtn'
import { useRouter } from 'next/router'
import { settingsSelector } from '../store/reducers/settingsReducer'
import NoDataFound from '../commonComponents/NoDataFound'

const AllBreakingNews = () => {

    const settingsData = useSelector(settingsSelector);
    const showBreakingNewsPage = settingsData && settingsData?.data?.breaking_news_mode === '1';

    const currentLanguage = useSelector(currentLanguageSelector)
    const dataPerPage = 6;

    const [isLoading, setIsLoading] = useState({
        loading: true,
        loadMoreLoading: false
    })
    const [loadMore, setLoadMore] = useState(false)
    const [breakingNewsData, setBreakingNewsData] = useState([])
    const [offset, setOffset] = useState(0)
    const [totalData, setTotalData] = useState('')

    const router = useRouter()

    useEffect(() => {
        if (!showBreakingNewsPage) {
            router.replace(`/${currentLanguage?.code}`)
            return
        }
    }, [showBreakingNewsPage])

    const handleLoadMore = () => {
        setLoadMore(true)
        setOffset(offset + 1)
    }


    // api call 
    const getBreakingNews = async () => {
        !loadMore ? setIsLoading({ loading: true }) : setIsLoading({ loadMoreLoading: true })
        try {
            const { data } = await getBreaingNewsApi.getBreakingNews({
                language_code: currentLanguage?.code,
                offset: offset * dataPerPage,
                limit: dataPerPage,
            })

            if (!data?.error && data?.data?.data && data?.data?.data.length > 0) {
                setTotalData(data?.data?.total)
                if (loadMore) {
                    setBreakingNewsData((prevData) => [...prevData, ...data?.data?.data])
                }
                else {
                    setBreakingNewsData(data?.data?.data);
                }
                setIsLoading({ loading: false })
                setIsLoading({ loadMoreLoading: false })
            }
            else {
                console.log('error =>', data?.message)
                setBreakingNewsData([])
                setTotalData(0)
                setIsLoading({ loading: false, loadMoreLoading: false })
            }

            return data?.data
        } catch (error) {
            console.log(error)
            setBreakingNewsData([])
            setTotalData(0)
            setIsLoading({ loading: false, loadMoreLoading: false })
        }
    }

    useEffect(() => {
        if (currentLanguage?.code) {
            getBreakingNews()
        }
    }, [currentLanguage?.code, offset])

    return (
        <Layout>
            <>
                <Breadcrumb secondElement={translate('breakingNewsLbl')} />

                <section className='allBreakingNews container mt-8 sm:mt-12'>
                    {/* Premium Header */}
                    <div className="flex items-center mb-8 border-b-2 border-gray-900 pb-2">
                        <span className="bg-[#af2c2c] w-2 h-8 mr-3 block"></span>
                        <h1 className="text-2xl md:text-3xl font-[900] uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2" style={{ fontFamily: "var(--headline-font-family)" }}>
                            BREAKING NEWS
                        </h1>
                    </div>
                    {
                        isLoading?.loading ? <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-10'>
                            {[...Array(3)].map((_, index) => (
                                <div key={index}>
                                    <CommonCardSkeleton />
                                </div>
                            ))}
                        </div>
                            : breakingNewsData && breakingNewsData?.length > 0 ? (
                                <div className="flex flex-col gap-8">
                                    {/* Magazine Top Section: 1 Featured on left (2 cols), 4 stacked on right (1 col) */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                                        {/* Featured News (Left) */}
                                        <div className="lg:col-span-2">
                                            {breakingNewsData[0] && (
                                                <div className="h-full">
                                                    <NewsCardTwo element={breakingNewsData[0]} breakingNews={true} />
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Sidebar News (Right) */}
                                        <div className="lg:col-span-1 flex flex-col gap-4">
                                            {breakingNewsData.slice(1, 5).map((element) => (
                                                <div className="h-28 md:h-32" key={element.id}>
                                                    {/* We can use NewsCardTwo but we want it compact, or just use it as is if it handles sizes well, but NewsCardTwo is vertical. Let's make a compact version inline or rely on its internal flex-col if we want. Actually, NewsCardTwo is a vertical card. Let's wrap it in a grid or use a smaller container. */}
                                                    {/* To make it a true magazine sidebar, let's use a horizontal layout for sidebar items */}
                                                    <a href={`/${currentLanguage?.code}/breaking-news/${element?.slug}`} className="group flex h-full bg-white dark:bg-[#1a1a1a] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                                                        <div className="w-1/3 h-full relative overflow-hidden shrink-0">
                                                            <img 
                                                                src={element?.image || ""} 
                                                                alt={element?.title} 
                                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                                            />
                                                            <div className="absolute top-2 left-2 bg-[#af2c2c] text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded">
                                                                Breaking
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
                                    {breakingNewsData.length > 5 && <div className="border-b border-gray-200 dark:border-gray-800 my-4"></div>}

                                    {/* Magazine Bottom Section: Grid for remaining news */}
                                    {breakingNewsData.length > 5 && (
                                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10'>
                                            {breakingNewsData.slice(5).map((element) => {
                                                return <NewsCardTwo element={element} breakingNews={true} key={element.id} />
                                            })}
                                        </div>
                                    )}
                                </div>
                            ) :
                                !isLoading.loading &&
                                <NoDataFound />

                    }
                    <div className='mt-12'>
                        {totalData > dataPerPage && totalData !== breakingNewsData.length ? (
                            <LoadMoreBtn handleLoadMore={handleLoadMore} loadMoreLoading={isLoading.loadMoreLoading} />
                        ) : null}
                    </div>

                </section>
            </>
        </Layout>
    )
}

export default AllBreakingNews