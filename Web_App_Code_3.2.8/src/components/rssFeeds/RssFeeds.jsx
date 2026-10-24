'use client'
import React, { useState, useEffect } from 'react'
import Layout from '../layout/Layout'
import { useSelector } from 'react-redux';
import { translate } from '@/utils/translation';
import { currentLanguageSelector } from '../store/reducers/languageReducer';
import { settingsSelector } from '../store/reducers/settingsReducer';
import { getRssFeedsApi } from '@/utils/api/api';
import RelatedNewSections from '../relatedNews/RelatedNewSections';
import FeedCardSkeleton from '../skeletons/FeedCardSkeleton';
import FeedCard from './FeedCard';
import LoadMoreBtn from '../commonComponents/loadermoreBtn/LoadmoreBtn';
import FeedsFilter from './FeedsFilter';
import Breadcrumb from '../breadcrumb/Breadcrumb';
import { rssFeedViewAllCateIds } from '../store/reducers/helperReducer';
import NoDataFound from '../commonComponents/NoDataFound';

const RssFeeds = () => {

    const currentLanguage = useSelector(currentLanguageSelector)
    const settings = useSelector(settingsSelector)
    const rssFeedsViewAllCateIdsData = useSelector(rssFeedViewAllCateIds);

    const dataPerPage = 20;

    const [data, setData] = useState([])

    const [isLoading, setIsLoading] = useState({
        loading: true,
        loadMoreLoading: false
    })
    const [loadMore, setLoadMore] = useState(false)
    const [offset, setOffset] = useState(1)
    const [totalData, setTotalData] = useState('')

    // Selected filter state (kept in parent)
    const [selectedFilters, setSelectedFilters] = useState({
        cateIds: [],
        subCateIds: [],
        feedsIds: [],
    });

    const handleLoadMore = () => {
        setLoadMore(true)
        setOffset(offset + 1)
    }

    // api call 
    const getAllRssFeeds = async () => {
        loadMore ? setIsLoading({ loadMoreLoading: true }) : setIsLoading({ loading: true })
        try {
            const { data } = await getRssFeedsApi.getAllRssFeeds({
                language_code: currentLanguage?.code,
                per_page: dataPerPage,
                page: offset,
                source_ids: selectedFilters.feedsIds?.length > 0 ? selectedFilters.feedsIds : undefined,
                category_ids: selectedFilters.cateIds?.length > 0 ? selectedFilters.cateIds.join(',') : rssFeedsViewAllCateIdsData ? rssFeedsViewAllCateIdsData : undefined,
                subcategory_ids: selectedFilters.subCateIds?.length > 0 ? selectedFilters.subCateIds.join(',') : undefined,
            })

            if (!data?.error && data?.data?.data && data?.data?.data.length > 0) {
                if (loadMore) {
                    setData((prevData) => [...prevData, ...data?.data?.data]);
                }
                else {
                    setData(data?.data?.data)
                }
                setTotalData(data?.data?.total)
                setIsLoading({ loading: false })
                setIsLoading({ loadMoreLoading: false })
            }
            else {
                if (data?.error) {
                    console.warn('RSS Feed error:', data?.message)
                }
                setData([])
                setTotalData(0)
                setIsLoading({ loading: false, loadMoreLoading: false })
            }
        } catch (error) {
            console.log(error)
            setData([])
            setTotalData(0)
            setIsLoading({ loading: false, loadMoreLoading: false })
        }
    }

    useEffect(() => {
        if (currentLanguage?.code) {
            getAllRssFeeds()
        }
    }, [currentLanguage, offset, selectedFilters, rssFeedsViewAllCateIdsData]);

    return (
        <Layout>
            <Breadcrumb secondElement={translate('rssFeed')} />
            <div className='container mt-6'>
                {
                    data && data?.length > 0 &&
                    <FeedsFilter
                        selectedFilters={selectedFilters}
                        setSelectedFilters={setSelectedFilters}
                        setOffset={setOffset}
                        setLoadMore={setLoadMore}
                    />
                }

                {/* Premium Header */}
                <div className="flex items-center mb-8 border-b-2 border-gray-900 pb-2">
                    <span className="bg-[#af2c2c] w-2 h-8 mr-3 block"></span>
                    <h1 className="text-2xl md:text-3xl font-[900] uppercase tracking-wider text-gray-900 dark:text-white" style={{ fontFamily: "var(--headline-font-family)" }}>
                        RSS FEEDS
                    </h1>
                </div>
                
                <div className='mt-6'>
                    {
                        isLoading.loading ? <div className={`grid gap-6 ${data && data?.length > 0 ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
                            {[...Array(4)].map((_, index) => (
                                <div key={index}>
                                    <FeedCardSkeleton index={index} />
                                </div>
                            ))}
                        </div>
                            :
                            data && data?.length > 0 ? (
                                <div className="flex flex-col gap-8">
                                    {/* Magazine Top Section */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                                        {/* Featured Feed (Left) */}
                                        <div className="lg:col-span-2">
                                            {data[0] && (
                                                <a href={data[0]?.url || '#'} target="_blank" rel="noreferrer" className="group block h-full">
                                                    <div className='relative flex flex-col h-full rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800 min-h-[300px] md:min-h-[400px]'>
                                                        <div className='absolute inset-0 w-full h-full overflow-hidden'>
                                                            <img 
                                                                src={data[0]?.image_url || data[0]?.image || ""} 
                                                                alt={data[0]?.title} 
                                                                className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105' 
                                                            />
                                                            {/* Dark gradient overlay so text pop */}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black transition-colors"></div>
                                                        </div>
                                                        
                                                        {/* Foreground Content */}
                                                        <div className="relative z-10 flex flex-col h-full p-6 justify-end">
                                                            <div className='flexCenter self-start bg-[#af2c2c] text-white rounded px-2 py-1 text-xs font-bold uppercase tracking-wide gap-1 mb-3 shadow'>
                                                                <span>{data[0]?.feed_name || data[0]?.source?.category?.category_name || 'RSS FEED'}</span>
                                                            </div>
                                                            <h2 className='text-white text-[24px] sm:text-[32px] font-[800] leading-snug line-clamp-3' style={{ fontFamily: "var(--headline-font-family)" }}>
                                                                {data[0]?.title}
                                                            </h2>
                                                            {data[0]?.description && (
                                                                <p className='text-gray-200 mt-2 line-clamp-2 text-sm sm:text-base'>
                                                                    {data[0]?.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </a>
                                            )}
                                        </div>
                                        
                                        {/* Sidebar Feeds (Right) */}
                                        <div className="lg:col-span-1 flex flex-col gap-4">
                                            {data.slice(1, 5).map((item, index) => (
                                                <div className="h-28 md:h-32" key={index}>
                                                    <a href={item.url || '#'} target="_blank" rel="noreferrer" className="group flex h-full bg-white dark:bg-[#1a1a1a] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                                                        <div className="w-1/3 h-full relative overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800">
                                                            <img 
                                                                src={item?.image_url || item?.image || ""} 
                                                                alt={item?.title} 
                                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                                            />
                                                            <div className="absolute top-2 left-2 bg-[#af2c2c] text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded shadow">
                                                                {item?.feed_name || item?.source?.category?.category_name || 'RSS'}
                                                            </div>
                                                        </div>
                                                        <div className="w-2/3 p-3 flex flex-col justify-center">
                                                            <h3 className="text-[14px] md:text-[15px] font-[800] leading-tight line-clamp-3 group-hover:text-[#af2c2c] transition-colors text-gray-900 dark:text-white" style={{ fontFamily: "var(--headline-font-family)" }}>
                                                                {item?.title}
                                                            </h3>
                                                        </div>
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    {data.length > 5 && <div className="border-b border-gray-200 dark:border-gray-800 my-4"></div>}

                                    {/* Magazine Bottom Section */}
                                    {data.length > 5 && (
                                        <div className={`grid gap-6 ${data && data?.length > 0 ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
                                            {data.slice(5).map((item, index) => {
                                                return <div key={index}><FeedCard data={item} selectedCate={selectedFilters.cateIds?.length > 0 || rssFeedsViewAllCateIdsData} /></div>
                                            })}
                                        </div>
                                    )}
                                </div>
                            ) :
                                !isLoading.loading &&
                                <div>
                                    <NoDataFound />
                                </div>
                    }
                    {
                        !isLoading.loading &&
                        <div className='my-12'>
                            {totalData > dataPerPage && totalData !== data?.length ? (
                                <LoadMoreBtn handleLoadMore={handleLoadMore} loadMoreLoading={isLoading.loadMoreLoading} />
                            ) : null}
                        </div>
                    }
                </div>
            </div>
        </Layout>
    )
}

export default RssFeeds