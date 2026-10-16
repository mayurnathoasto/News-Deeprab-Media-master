'use client'
import React, { useState, useEffect, useRef } from 'react'
import Layout from '../layout/Layout'
import Breadcrumb from '../breadcrumb/Breadcrumb'
import { useRouter } from 'next/router'
import { FiCalendar } from 'react-icons/fi';
import { BsBookmark, BsFillBookmarkFill } from 'react-icons/bs';
import { AiOutlineLike, AiOutlineEye, AiFillLike } from 'react-icons/ai';
import { LuClock3 } from "react-icons/lu";
import Image from 'next/image'
import { Slider } from "@/components/ui/slider"
import RelatedNewSections from '../relatedNews/RelatedNewSections'
import TagSection from '../tag/TagSection'
import CommentSection from '../comments/CommentSection'
import { useSelector } from 'react-redux'
import { currentLanguageSelector } from '../store/reducers/languageReducer'
import { settingsSelector } from '../store/reducers/settingsReducer'
import { getBreaingNewsApi, getNewsApi, getWebStoriesApi, setBookmarkApi, setBreakingNewsViewApi, setLikeDisLikeApi, setNewsViewApi } from '@/utils/api/api'
import { calculateReadTime, currentLangCode, defaultLanguageCode, extractTextFromHTML, getDirection, isLogin, placeholderImage, } from '@/utils/helpers';
import { translate } from '@/utils/translation';
import { GoTag } from 'react-icons/go';
import toast from 'react-hot-toast'
import { userDataSelector } from '../store/reducers/userReducer'
import DetailPageSkeleton from '../skeletons/DetailPageSkeleton'
import OpenInAppPopUp from '../commonComponents/OpenInAppPopUp'
import { setLoginModalState } from '../store/reducers/helperReducer'
import MediaShare from '../SocialMediaShares/MediaShare'
import PhotoGallery from '../commonComponents/PhotoGallery'
import RichTextContent from '../commonComponents/RichTextContent'
import NoDataFound from '../commonComponents/NoDataFound'
import EmbeddedVideo from '../commonComponents/EmbeddedVideo'
import SidebarWebStories from '../webStories/SidebarWebStories'
import PollCard from '../polls/PollCard'
import InfiniteArticleItem from './InfiniteArticleItem'

const NewsDetails = ({ breakingNews }) => {

  const currLangCode = currentLangCode();
  const defaultLangCode = defaultLanguageCode();
  const [fontSize, setFontSize] = useState(18) // Set initial font size to 14px

  const router = useRouter();

  const slug = router?.query?.slug;
  const isShare = router?.query?.share;
  const routerLangCode = router?.query?.langCode;

  const cateSlug = router?.query?.cateSlug;
  const subCateSlug = router?.query?.subCateSlug;

  const settingsData = useSelector(settingsSelector)
  const currentLanguage = useSelector(currentLanguageSelector)

  const [like, setLike] = useState(false);

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [bookmark, setBookmark] = useState(false)

  const [newsViewsIncreament, setNewsViewsIncreament] = useState(false)
  const [breakingNewsViewsIncreament, setBreakingNewsViewsIncreament] = useState(false)

  const [likeNewsIncreament, setLikeNewIncreament] = useState(false)
  const [likeNews, setLikeNews] = useState(false)

  const [webStories, setWebStories] = useState([])

  const [IsOpenInApp, setIsOpenInApp] = useState(false);

  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const openLightbox = index => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  };

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  // ── Infinite Article Reading States & Refs ──
  const [infiniteArticles, setInfiniteArticles] = useState([])
  const [loadingNext, setLoadingNext] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [activeArticleTitle, setActiveArticleTitle] = useState('')

  const relatedQueueRef = useRef([])
  const queueIndexRef = useRef(0)
  const loadingNextRef = useRef(false)
  const hasMoreRef = useRef(true)
  const loadedSlugsRef = useRef(new Set())
  const viewedArticleIds = useRef(new Set())

  useEffect(() => {
    if (isShare && window.innerWidth <= 768) {
      setIsOpenInApp(true)
    }
    else {
      setIsOpenInApp(false)
    }
  }, [window.innerWidth, isShare])

  const userData = useSelector(userDataSelector)

  const currentUrL = `${process.env.NEXT_PUBLIC_WEB_URL}${router?.asPath}`;

  const decodedURL = decodeURI(currentUrL);

  const galleryPhotos = data && data;
  const hasEmbeddedVideo = data && data?.content_value && ['video_youtube', 'video_other', 'video_upload'].includes(data?.content_type)


  let userName = ''

  const checkUserData = userData => {
    if (userData?.data && userData?.data?.name !== '') {
      return (userName = userData?.data?.name)
    } else if (userData?.data && userData?.data?.email !== '') {
      return (userName = userData?.data?.email)
    } else if (userData?.data && (userData?.data?.mobile !== null || userData?.data?.mobile !== '')) {
      return (userName = userData?.data?.mobile)
    }
  }

  const getNewsDetails = async () => {
    try {
      setLoading(true)
      const { data } = await getNewsApi.getNews({
        slug: subCateSlug ? subCateSlug : cateSlug ? cateSlug : slug,
        language_code: routerLangCode
      });

      const newsData = data?.data?.data?.[0];

      if (!data?.error && newsData) {
        if (newsData.bookmark == 0) {
          setBookmark(false);
        } else {
          setBookmark(true);
        }

        if (newsData.like === 0) {
          setLike(false);
        } else {
          setLike(true);
        }

        setData(newsData)
        setLoading(false)
        setInfiniteArticles([])
        loadedSlugsRef.current = new Set([newsData.slug])
        viewedArticleIds.current = new Set([String(newsData.id)])
        setActiveArticleTitle(newsData.title)
        fetchRelatedQueue(newsData.category_id, newsData.slug)
      }
      else {
        console.log('error =>', data?.message)
        setData(null)
        setLoading(false)
      }

    } catch (error) {
      console.error('Error:', error);
      setData(null)
      setLoading(false)
    }
  };

  const getBreakingNewsDetails = async () => {
    try {
      setLoading(true)
      const { data } = await getBreaingNewsApi.getBreakingNews({
        slug: slug,
        language_code: routerLangCode
      });

      const breakingsData = data?.data?.data[0];

      if (!data?.error && breakingsData) {
        setData(breakingsData)
        setLoading(false)
        setInfiniteArticles([])
        loadedSlugsRef.current = new Set([breakingsData.slug])
        viewedArticleIds.current = new Set([String(breakingsData.id)])
        setActiveArticleTitle(breakingsData.title)
      }
      else {
        console.log('error =>', data?.message)
        setData(null)
        setLoading(false)
      }

    } catch (error) {
      console.error('Error:', error);
      setLoading(false)
      setData(null)
    }
  };

  // ── Fetch candidate related articles queue for infinite reading ──
  const fetchRelatedQueue = async (categoryId, currentSlug) => {
    if (!categoryId || breakingNews) return
    try {
      const { data: catData } = await getNewsApi.getNews({
        category_id: categoryId,
        language_code: routerLangCode || currLangCode,
        offset: '0',
        limit: '15',
        merge_tag: 1,
        latitude: settingsData?.lat,
        longitude: settingsData?.long
      })

      let list = catData?.data?.data || []
      let filtered = list.filter((item) => item.slug !== currentSlug)

      // If category has few articles, supplement with other news in the language
      if (filtered.length < 4) {
        try {
          const { data: latestData } = await getNewsApi.getNews({
            language_code: routerLangCode || currLangCode,
            offset: '0',
            limit: '12',
            latitude: settingsData?.lat,
            longitude: settingsData?.long
          })
          const extra = (latestData?.data?.data || []).filter(
            (item) => item.slug !== currentSlug && !filtered.some((f) => f.slug === item.slug)
          )
          filtered = [...filtered, ...extra]
        } catch (_) {}
      }

      relatedQueueRef.current = filtered
      queueIndexRef.current = 0
      setHasMore(filtered.length > 0)
      hasMoreRef.current = filtered.length > 0
    } catch (err) {
      console.error('Error fetching related queue:', err)
    }
  }

  // ── Load next article from queue ──
  const loadNextArticle = async () => {
    if (loadingNextRef.current || !hasMoreRef.current) return
    const queue = relatedQueueRef.current
    const nextIndex = queueIndexRef.current

    if (!queue || nextIndex >= queue.length) {
      setHasMore(false)
      hasMoreRef.current = false
      return
    }

    loadingNextRef.current = true
    setLoadingNext(true)

    try {
      const candidate = queue[nextIndex]
      queueIndexRef.current = nextIndex + 1

      // Fetch full details of the candidate article
      const { data: fullResp } = await getNewsApi.getNews({
        slug: candidate.slug,
        language_code: routerLangCode || currLangCode
      })

      const fullArticle = fullResp?.data?.data?.[0] || candidate

      if (fullArticle && !loadedSlugsRef.current.has(fullArticle.slug)) {
        loadedSlugsRef.current.add(fullArticle.slug)
        setInfiniteArticles((prev) => [...prev, fullArticle])
      }

      if (queueIndexRef.current >= queue.length) {
        setHasMore(false)
        hasMoreRef.current = false
      }
    } catch (err) {
      console.error('Error loading next article:', err)
    } finally {
      loadingNextRef.current = false
      setLoadingNext(false)
    }
  }

  // ── Sentinel Observer: triggers loadNextArticle before reaching bottom ──
  useEffect(() => {
    if (breakingNews || !data || !hasMore) return

    const sentinel = document.getElementById('infinite-scroll-sentinel')
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadNextArticle()
        }
      },
      {
        root: null,
        rootMargin: '600px 0px',
        threshold: 0
      }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [data, hasMore, infiniteArticles, breakingNews])

  // ── Smart URL & Tab Title Observer: updates browser address bar as user scrolls ──
  useEffect(() => {
    if (!data || breakingNews) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const articleSlug = entry.target.getAttribute('data-slug')
            const articleTitle = entry.target.getAttribute('data-title')
            const articleId = entry.target.getAttribute('data-id')

            if (articleSlug) {
              const targetPath = `/${currLangCode}/news/${articleSlug}`
              if (window.location.pathname !== targetPath) {
                window.history.replaceState(null, '', targetPath)
              }

              if (articleTitle) {
                setActiveArticleTitle(articleTitle)
                const webName = settingsData?.data?.web_setting?.web_name || ''
                document.title = webName ? `${articleTitle} - ${webName}` : articleTitle
              }

              if (articleId && !viewedArticleIds.current.has(String(articleId))) {
                viewedArticleIds.current.add(String(articleId))
                if (isLogin()) {
                  setNewsViewApi.setNewsView({ news_id: articleId }).catch(() => {})
                }
              }
            }
          }
        })
      },
      {
        root: null,
        rootMargin: '-15% 0px -55% 0px',
        threshold: 0
      }
    )

    const elements = document.querySelectorAll('.iq-observed-article')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [data, infiniteArticles, currLangCode, breakingNews, settingsData])

  useEffect(() => {

    if (routerLangCode) {
      if (breakingNews) {
        getBreakingNewsDetails()
      } else {
        getNewsDetails()
      }
    }
    else {
      console.log('routerLangCode not found =>', routerLangCode)
    }

  }, [currentLanguage, slug, cateSlug, subCateSlug, routerLangCode])

  const text = extractTextFromHTML(data && data?.data?.description);

  const readTime = calculateReadTime(text);


  useEffect(() => {
    if (!routerLangCode || !data?.category_id || breakingNews) {
      setWebStories([])
      return
    }

    const fetchCategoryStories = async () => {
      try {
        const { data: response } = await getWebStoriesApi.getWebStories({
          language_code: routerLangCode,
          category_id: data.category_id,
          offset: 0,
          limit: 4
        })
        setWebStories(response?.data?.data || [])
      } catch (_) {
        setWebStories([])
      }
    }

    fetchCategoryStories()
  }, [routerLangCode, data?.category_id, breakingNews])


  // News View api
  const setNewsView = async () => {
    if (!settingsData?.data) return
    if (!isLogin()) return

    if (data && data?.id && !breakingNews) {
      try {
        const response = await setNewsViewApi.setNewsView({
          news_id: data?.id
        });
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  // breakingNews View api
  const setBreakingNewsView = async () => {
    if (!settingsData?.data) return
    if (!isLogin()) return

    if (data && data?.id && breakingNews) {
      try {
        const response = await setBreakingNewsViewApi.setBreakingNewsView({
          breaking_news_id: data?.id
        });

        if (!response?.data?.error) {
          setBreakingNewsViewsIncreament(true)
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  useEffect(() => {
    if (breakingNews) {
      setBreakingNewsView()
    } else {
      setNewsView()
    }
  }, [data, settingsData?.data?.views_auth_mode])


  const handleBookamrkNews = () => {
    if (isLogin()) {
      setBookmarkNews(data && data?.id)
    }
    else {
      setLoginModalState({ openModal: true })
      toast.error(translate('loginFirst'))
      setTimeout(() => {
        setLoginModalState({ openModal: false })
      }, 2000);
    }
  }
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


  const setBookmarkNews = async (id) => {
    try {
      const { data } = await setBookmarkApi.setBookmark({
        news_id: id,
        status: bookmark ? 0 : 1,
      });

      if (!data?.error) {
        setBookmark(!bookmark)
        toast.success(bookmark ? translate('bookmarkRemoved') : translate('bookmarkSuccess'));
      }
      else {
        console.log('bookmark error =>', data?.message)
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const setLikeDislikeData = async (id) => {
    try {
      const { data } = await setLikeDisLikeApi.setLikeDisLike({
        news_id: id,
        status: like ? 0 : 1,
      });

      if (!data?.error) {
        setLikeNewIncreament(!likeNewsIncreament)
        setLike(!like)
      }
      else {
        console.log('like error =>', data?.message)
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
  }, [likeNews])

  const handleViewAuthorDetails = (authorId) => {
    router.push(`/${currLangCode}/author-details/${authorId}`)
  }


  return (
    <Layout>
      <section className='detailPage'>
        {
          loading ?
            <DetailPageSkeleton />
            :
            data && data ?
              <>
                {
                  cateSlug ?
                    <Breadcrumb secondElement={translate('catLbl')} thirdElement={slug} fourthElement={cateSlug} categorySlug={slug} />
                    :
                    subCateSlug ?
                      <Breadcrumb secondElement={translate('catLbl')} thirdElement={translate('subcatLbl')} fourthElement={slug} fifthElement={subCateSlug} subCateSlug={slug} />
                      :
                      <Breadcrumb secondElement={translate('newsDetails')} thirdElement={data && data?.title} />
                }
                <section className='container detailPage commonMT iq-article-container'>
                  <div className="grid grid-cols-12 gap-y-10 lg:gap-8 iq-article-layout">
                    <div className="col-span-12 lg:col-span-8 iq-article-main">
                      <div className='flex flex-col gap-6'>
                        
                        {/* ── Primary Article ── */}
                        <article
                          id={`article-${data?.slug}`}
                          data-slug={data?.slug}
                          data-title={data?.title}
                          data-id={data?.id}
                          className="iq-observed-article flex flex-col gap-6"
                        >
                          {/* ── Headline & Category ── */}
                          <div className="flex flex-col gap-3 border-b border-gray-200 pb-5">
                            {breakingNews ? (
                              <span className="inline-block bg-[#af2c2c] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm w-fit">{translate('breakingnews')}</span>
                            ) : data && data?.category?.category_name && (
                              <span className="inline-block bg-[#af2c2c] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm w-fit">{data?.category?.category_name}</span>
                            )}
                            <h1 className="text-[28px] md:text-[38px] lg:text-[44px] font-[800] leading-tight text-gray-900 dark:text-white" style={{ fontFamily: "var(--headline-font-family)" }}>
                              {data && data?.title}
                            </h1>
                          </div>

                          {/* ── Meta Data Row (Author, Date, Views, Share) ── */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4 iq-article-meta-row">
                            <div className="flex items-center gap-3 text-[13px] text-gray-700 font-medium flex-wrap">
                              {!breakingNews && (
                                <>
                                  {data?.user?.name && <span className="text-[#af2c2c] font-bold">By {data?.user?.name}</span>}
                                  {data?.user?.name && <span className="text-gray-500 select-none iq-meta-separator">|</span>}
                                  <span>{(data?.published_date || data?.date) && !isNaN(new Date(data?.published_date || data?.date)) ? new Date(data?.published_date || data?.date).toLocaleString('en-us', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : (data?.published_date || data?.date || 'Recently')}</span>
                                  <span className="text-gray-500 select-none iq-meta-separator">|</span>
                                  <span>{data?.total_views} Views</span>
                                  <span className="text-gray-500 select-none iq-meta-separator">|</span>
                                  <span>{readTime} min read</span>
                                </>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 iq-article-actions">
                              {!breakingNews && (
                                <div className="flex items-center gap-3">
                                  <button onClick={handleLikeNews} className="text-gray-500 hover:text-[#af2c2c] transition-colors flex items-center gap-1.5 text-sm font-semibold">
                                    {like && isLogin() ? <AiFillLike size={20} /> : <AiOutlineLike size={20} />}
                                    {likeNewsIncreament && likeNews && like ? data?.total_like + 1 : data?.total_like}
                                  </button>
                                  <button onClick={handleBookamrkNews} className="text-gray-500 hover:text-[#af2c2c] transition-colors">
                                    {bookmark && isLogin() ? <BsFillBookmarkFill size={18} /> : <BsBookmark size={18} />}
                                  </button>
                                </div>
                              )}
                              <div className="h-4 w-px bg-gray-300 mx-1"></div>
                              <MediaShare url={decodedURL} title={`${data?.title} - ${settingsData?.data?.web_setting?.web_name}`} hashtag={`${settingsData?.data?.web_setting?.web_name}`} />
                            </div>
                          </div>

                          {/* ── Featured Image & Video ── */}
                          <div className="flex flex-col gap-2">
                            <div className='relative rounded-xl overflow-hidden shadow-sm'>
                              {galleryPhotos && (
                                <PhotoGallery galleryPhotos={galleryPhotos?.images} titleImage={data && data?.image} onImageClick={openLightbox} />
                              )}
                            </div>
                            
                            {hasEmbeddedVideo && (
                              <div className='overflow-hidden rounded-xl bg-black mt-4'>
                                <EmbeddedVideo url={data?.content_value} type={data?.content_type} className='w-full max-[575px]:h-[300px]' />
                              </div>
                            )}
                          </div>

                          {/* ── Font Size Controls ── */}
                          <div className="flex justify-end items-center mt-2">
                            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                              <span className="text-xs text-gray-500 font-medium px-2">Font</span>
                              <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white dark:hover:bg-gray-700 text-sm font-bold text-gray-700 dark:text-gray-300">A-</button>
                              <button onClick={() => setFontSize(18)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white dark:hover:bg-gray-700 text-sm font-bold text-gray-700 dark:text-gray-300">A</button>
                              <button onClick={() => setFontSize(Math.min(24, fontSize + 2))} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white dark:hover:bg-gray-700 text-sm font-bold text-gray-700 dark:text-gray-300">A+</button>
                            </div>
                          </div>

                          {/* ── Article Content ── */}
                          <div className="text-gray-800 dark:text-gray-200 newsDesc mt-2" style={{ fontSize: `${fontSize}px`, lineHeight: '1.8', fontFamily: "var(--primary-font-family)" }}>
                            <RichTextContent content={data && data?.description} />
                          </div>

                          {/* ── Tags ── */}
                          {!breakingNews && data?.tag?.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-gray-200">
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-[13px] font-bold uppercase tracking-wider text-gray-500 mr-2">Tags:</span>
                                {data?.tag.map((tag, index) => (
                                  <span key={index} onClick={() => router.push(`/${currLangCode}/tag/${tag.slug || tag}`)} className="border border-gray-300 text-gray-600 hover:text-[#af2c2c] hover:border-[#af2c2c] transition-colors text-[12px] font-medium px-2 py-1 rounded cursor-pointer uppercase">
                                    {typeof tag === 'object' ? tag.tag_name : tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className='flex flex-wrap gap-4 items-center justify-between pb-8 border-b borderColor'>
                            {/* User/Author Profile */}
                            {data?.user?.is_author === 1 ? (
                              <div
                                className={`flexCenter gap-2 cursor-pointer`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (data?.user?.id && data?.user?.is_author === 1) {
                                    handleViewAuthorDetails(data?.user?.id)
                                  }
                                }}
                              >
                                <div className='w-10 h-10 rounded-full'>
                                  <Image
                                    src={data?.user?.profile}
                                    alt={data?.user?.name}
                                    width={40}
                                    height={40}
                                    loading='lazy'
                                    className='w-full h-full rounded-full object-cover'
                                    onError={placeholderImage}
                                  />
                                </div>
                                <div className='flex flex-col gap-1'>
                                  <div className='textPrimary opacity-[79%] font-medium text-sm'>{translate("author")}</div>
                                  <div className='font-semibold text-base textPrimary'>{data?.user?.name}</div>
                                </div>
                              </div>) :
                              null
                            }
                            <MediaShare url={decodedURL} title={`${data?.title} - ${settingsData && settingsData?.data?.web_setting?.web_name}`} hashtag={`${settingsData && settingsData?.data?.web_setting?.web_name}`} />
                          </div>
                        </article>

                        {
                          settingsData && settingsData?.data?.comments_mode === '1' && !breakingNews &&
                          <CommentSection newsId={data && data?.id} isCommentEnabled={data && data?.is_comment} />
                        }

                        {/* ── Continuous / Infinite Articles Stream ── */}
                        {!breakingNews && infiniteArticles && infiniteArticles.length > 0 && (
                          <div className="flex flex-col gap-10 mt-6">
                            {infiniteArticles.map((item, idx) => (
                              <InfiniteArticleItem
                                key={item.id || item.slug || idx}
                                article={item}
                                index={idx}
                                currLangCode={currLangCode}
                                settingsData={settingsData}
                                fontSize={fontSize}
                                onImageClick={openLightbox}
                              />
                            ))}
                          </div>
                        )}

                        {/* ── Infinite Scroll Sentinel & Loading Indicator ── */}
                        {!breakingNews && (
                          <div id="infinite-scroll-sentinel" className="py-6 min-h-[40px] flex flex-col items-center justify-center">
                            {loadingNext && (
                              <div className="w-full py-8 px-4 flex flex-col items-center justify-center gap-3 bg-gray-50 dark:bg-gray-800/40 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                                <div className="flex items-center gap-2 text-sm font-bold text-[#af2c2c] dark:text-red-400">
                                  <span className="w-5 h-5 border-2 border-[#af2c2c] dark:border-red-400 border-t-transparent rounded-full animate-spin"></span>
                                  <span>Loading next related story...</span>
                                </div>
                                <span className="text-xs text-gray-500 font-medium">Continuous article reading enabled</span>
                              </div>
                            )}
                            {!hasMore && infiniteArticles.length > 0 && (
                              <div className="w-full py-8 px-4 text-center bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-950/50 text-[#af2c2c] flex items-center justify-center font-bold text-sm">✓</div>
                                <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">You've caught up with all related stories</h4>
                                <p className="text-xs text-gray-500">Explore more categories or return to the top.</p>
                                <button
                                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                  className="mt-2 text-xs font-bold text-[#af2c2c] hover:underline"
                                >
                                  Back to top ↑
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {!breakingNews && data?.category_id && (
                          <RelatedNewSections
                            newsSlug={slug}
                            categorySlug={data?.category?.slug}
                            categoryId={data?.category_id}
                            variant="horizontal"
                          />
                        )}

                      </div>
                    </div>

                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 iq-article-sidebar">
                      {
                        !breakingNews &&
                        <>
                          <SidebarWebStories stories={webStories} langCode={currLangCode} title="Also Watch" />
                          <PollCard compact />
                          <TagSection />
                        </>
                      }
                    </div>
                  </div>
                </section>
              </>
              :
              // !loading && !data?.data &&
              <NoDataFound />
        }
        {/* ── Floating Continuous Reading Indicator ── */}
        {!breakingNews && infiniteArticles.length > 0 && (
          <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-4 py-2.5 rounded-full shadow-2xl border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-200 transition-all duration-300 animate-fade-in hover:scale-105">
            <span className="w-2.5 h-2.5 rounded-full bg-[#af2c2c] animate-pulse"></span>
            <span className="hidden sm:inline font-bold text-[#af2c2c]">Now Reading:</span>
            <span className="max-w-[180px] sm:max-w-[260px] truncate font-semibold">{activeArticleTitle || data?.title}</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="ml-1 w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-[#af2c2c] hover:text-white rounded-full transition-colors text-xs font-bold"
              title="Back to top"
            >
              ↑
            </button>
          </div>
        )}

        <OpenInAppPopUp IsOpenInApp={IsOpenInApp} OnHide={() => setIsOpenInApp(false)} />
      </section>
    </Layout>
  )
}

export default NewsDetails
