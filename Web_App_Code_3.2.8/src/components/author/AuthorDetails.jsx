import React, { useEffect, useState } from 'react'
import AuthorCard from './AuthorCard'
import { useRouter } from 'next/router'
import { getAuthorProfileAndNewsApi } from '@/utils/api/api';
import StyleFourCard from '../home/feature-styles/styleFour/StyleFourCard';
import NewsHorizontalCard from '@/components/commonComponents/commonCards/NewsHorizontalCard';
import { translate } from '@/utils/translation';
import NoDataFound from '../commonComponents/NoDataFound';
import AuthorCardSkeleton from '../skeletons/AuthorCardSkeleton';

const AuthorDetails = () => {
    const router = useRouter();
    const userId = router?.query?.slug;
    const language_code = router?.query?.langCode;

    const [viewType, setViewType] = useState('grid')
    const [loading, setLoading] = useState(false)
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false)
    const [authorDetails, setAuthorDetails] = useState(null)
    const [authorNews, setAuthorNews] = useState([])
    const [paginationInfo, setPaginationInfo] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)


    const handleFetchAuthorDetails = async (pageToLoad = 1, append = false) => {
        if (!userId) return;
        try {
            if (append) {
                setIsLoadMoreLoading(true)
            } else {
                setLoading(true)
            }
            const { data } = await getAuthorProfileAndNewsApi.getAuthorProfileAndNews({
                user_id: userId,
                language_code: language_code,
                page: pageToLoad
            });
            const userDetails = data?.data?.user;
            const newsPayload = data?.data?.news;
            const newsData = newsPayload?.data ?? [];

            setAuthorDetails(userDetails);
            setPaginationInfo(newsPayload ?? null);
            setCurrentPage(pageToLoad);
            setAuthorNews((prevNews) => append ? [...prevNews, ...newsData] : newsData);
        } catch (error) {
            console.error("Error in fetching author details: ", error)
        } finally {
            if (append) {
                setIsLoadMoreLoading(false)
            } else {
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        if (userId) {
            setAuthorNews([])
            setPaginationInfo(null)
            setCurrentPage(1)
            handleFetchAuthorDetails(1, false);
        }
    }, [userId, language_code]);

    const hasMorePages = Boolean(
        paginationInfo && (
            paginationInfo?.next_page_url ||
            (paginationInfo?.current_page ?? 1) < (paginationInfo?.last_page ?? 1)
        )
    );

    const handleLoadMore = () => {
        if (!hasMorePages || isLoadMoreLoading) return;
        const nextPage = (paginationInfo?.current_page ?? currentPage) + 1;
        handleFetchAuthorDetails(nextPage, true);
    }

    const renderSkeletonCards = (count, keyPrefix) => (
        Array.from({ length: count }).map((_, index) => (
            viewType === 'grid'
                ? <StyleFourCard key={`${keyPrefix}-grid-${index}`} isLoading />
                : <NewsHorizontalCard key={`${keyPrefix}-list-${index}`} isLoading />
        ))
    )

    const initialSkeletonCount = viewType === 'grid' ? 6 : 4;
    const loadMoreSkeletonCount = viewType === 'grid' ? 3 : 2;
    const shouldShowInitialSkeletons = loading && authorNews.length === 0;

    return (
        loading ?
            <div>
                <AuthorCardSkeleton />
                <div className={`mt-6 grid gap-6 ${viewType === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                    {renderSkeletonCards(initialSkeletonCount, 'initial')}
                </div>
            </div>
            :
            authorDetails || authorNews ?
                <div>
                    {
                        authorDetails &&
                        <AuthorCard
                            authorDetails={authorDetails}
                            viewType={viewType}
                            setViewType={setViewType}
                        />
                    }
                    {
                        authorNews &&
                        <div className={`mt-6 grid gap-6 ${viewType === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                            {
                                viewType === 'grid'
                                    ? authorNews?.map((newsItem) => (
                                        <StyleFourCard
                                            key={newsItem.id}
                                            value={newsItem}
                                        />
                                    ))
                                    : authorNews?.map((newsItem) => (
                                        <NewsHorizontalCard
                                            key={newsItem.id}
                                            news={newsItem}
                                        />
                                    ))
                            }

                            {!shouldShowInitialSkeletons && isLoadMoreLoading && (
                                renderSkeletonCards(loadMoreSkeletonCount, 'loadmore')
                            )}
                        </div>
                    }

                    {hasMorePages && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={handleLoadMore}
                                disabled={isLoadMoreLoading}
                                className="commonBtn px-8 py-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoadMoreLoading ? translate('loading') : translate('loadMore')}
                            </button>
                        </div>
                    )}
                </div>
                :
                <NoDataFound />
    )
}

export default AuthorDetails
