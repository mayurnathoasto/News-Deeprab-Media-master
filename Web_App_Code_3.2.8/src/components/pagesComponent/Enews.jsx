'use client';
import { useEffect, useState } from 'react';
import Layout from '../layout/Layout';
import PdfViewer from '../commonComponents/PdfViewer';
import { getENewsApi } from '@/utils/api/api';
import { useSelector } from 'react-redux';
import { currentLanguageSelector } from '../store/reducers/languageReducer';
import { placeholderImage } from '@/utils/helpers';
import LoadMoreBtn from '../commonComponents/loadermoreBtn/LoadmoreBtn';
import CommonCardSkeleton from '../skeletons/CommonCardSkeleton';
import RichTextContent from '../commonComponents/RichTextContent';
import { FiCalendar } from 'react-icons/fi';
import Image from 'next/image';
import Breadcrumb from '../breadcrumb/Breadcrumb';
import { translate } from '@/utils/translation';
import NoDataFound from '../commonComponents/NoDataFound';

const Enews = () => {

    const currentLanguage = useSelector(currentLanguageSelector)

    const [selectedPdf, setSelectedPdf] = useState(null);

    const dataPerPage = 8 // number of posts per page
    const [isLoading, setIsLoading] = useState({
        loading: true,
        loadMoreLoading: false
    })
    const [loadMore, setLoadMore] = useState(false)
    const [eNewsData, setENewsData] = useState([])
    const [offset, setOffset] = useState(1)
    const [totalData, setTotalData] = useState('')


    const handleLoadMore = () => {
        setLoadMore(true)
        setOffset(offset + 1)
    }

    const fetchENews = async () => {

        if (currentLanguage?.code) {
            !loadMore ? setIsLoading({ loading: true }) : setIsLoading({ loadMoreLoading: true })
            try {
                const { data } = await getENewsApi.getENews({
                    page: offset,
                    per_page: dataPerPage,
                    language_code: currentLanguage?.code,
                })

                const newsData = data?.data?.data

                if (!data?.error && newsData && newsData.length > 0) {
                    newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setTotalData(data?.data?.total)
                    setIsLoading({ loading: false })
                    setIsLoading({ loadMoreLoading: false })
                    if (loadMore) {
                        setENewsData((prevData) => [...prevData, ...newsData])
                    }
                    else {
                        setENewsData(newsData);
                    }
                }
                else {
                    console.log('error =>', data?.message)
                    setENewsData([])
                    setTotalData(0)
                    setIsLoading({ loading: false, loadMoreLoading: false })
                }

            } catch (error) {
                console.log(error)
                setENewsData([])
                setTotalData(0)
                setIsLoading({ loading: false, loadMoreLoading: false })
            }
        }
    };

    useEffect(() => {
        fetchENews()
    }, [currentLanguage?.code, offset])

    useEffect(() => {
    }, [totalData, isLoading, eNewsData])

    useEffect(() => {
        setLoadMore(false)
        setOffset(1)
    }, [])

    return (
        <Layout>
            <Breadcrumb secondElement={translate('e_news')} />
            <section className="container py-6 commonMT">
                {/* Premium Header */}
                <div className="flex items-center mb-8 border-b-2 border-gray-900 pb-2">
                    <span className="bg-[#af2c2c] w-2 h-8 mr-3 block"></span>
                    <h1 className="text-2xl md:text-3xl font-[900] uppercase tracking-wider text-gray-900 dark:text-white" style={{ fontFamily: "var(--headline-font-family)" }}>
                        E-PAPER / E-NEWS
                    </h1>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {
                        isLoading.loading ? [...Array(4)].map((_, index) => (
                            <div key={index}>
                                <CommonCardSkeleton />
                            </div>
                        )) :
                            eNewsData?.map((item) => (
                                <div className="group flex flex-col h-full bg-white dark:bg-[#1a1a1a] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800" key={item?.title}>
                                    {/* Image Section */}
                                    <div className="relative overflow-hidden w-full aspect-[3/4] bg-gray-100 dark:bg-gray-800">
                                        <img
                                            src={item?.image || item?.thumbnail || ""}
                                            alt={item?.title}
                                            onError={placeholderImage}
                                            loading='lazy'
                                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute top-2 left-2 bg-[#af2c2c] text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded shadow z-10">
                                            Edition
                                        </div>
                                    </div>

                                    {/* Text Section */}
                                    <div className="p-5 flex-grow flex flex-col">
                                        <h4 className="text-[18px] sm:text-[20px] font-[800] mb-2 leading-snug line-clamp-2 text-gray-900 dark:text-white group-hover:text-[#af2c2c] transition-colors" style={{ fontFamily: "var(--headline-font-family)" }}>
                                            {item?.title}
                                        </h4>
                                        {
                                            item?.description &&
                                            <div className="line-clamp-2 text-sm text-gray-700 dark:text-gray-300 mb-4 flex-grow">
                                                <RichTextContent content={item?.description} />
                                            </div>
                                        }
                                        
                                        <div className='border-t border-gray-100 dark:border-gray-800 pt-4 mt-auto'>
                                            {
                                                item?.date &&
                                                <div className="flex items-center text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">
                                                    <FiCalendar className="mr-2" size={14} />
                                                    <span>{item?.date}</span>
                                                </div>
                                            }
                                            <button className="w-full bg-[#af2c2c] hover:bg-[#8e2121] text-white font-bold py-2 px-4 rounded transition-colors text-sm uppercase tracking-wider" onClick={() => setSelectedPdf(item?.attachment)}>
                                                {translate('viewPaper')}
                                            </button>
                                        </div>
                                    </div>
                                </div >
                            ))}
                </div>
                {
                    !isLoading.loading && eNewsData?.length < 1 &&
                    <NoDataFound />
                }

                {totalData > dataPerPage && totalData !== eNewsData.length ? (
                    <div className='mt-12'>
                        <LoadMoreBtn handleLoadMore={handleLoadMore} loadMoreLoading={isLoading.loadMoreLoading} />
                    </div>
                ) : null}
            </section>

            {/* PDF Modal */}
            {selectedPdf && (
                <PdfViewer
                    pdf={selectedPdf}
                    onClose={() => setSelectedPdf(null)}
                />
            )}
        </Layout>
    );
};

export default Enews;
