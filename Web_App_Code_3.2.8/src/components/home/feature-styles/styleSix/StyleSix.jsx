'use client'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
const StyleSixCard = dynamic(() => import('./StyleSixCard'), { ssr: false })
import StylesTitleDiv from '@/components/commonComponents/StylesTitleDiv';
import { getFeatureDataApi } from '@/utils/api/api';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { currentLanguageSelector } from '@/components/store/reducers/languageReducer';
import { settingsSelector } from '@/components/store/reducers/settingsReducer';
import AdSpace from '@/components/commonComponents/adSpace/AdSpace';
import dynamic from 'next/dynamic';
import { currentLangCode, getDirection } from '@/utils/helpers';

const StyleSix = ({ Data, setLoading }) => {

  const currLangCode = currentLangCode();

  const currentLanguage = useSelector(currentLanguageSelector)
  const settingsData = useSelector(settingsSelector)
  const storedLatitude = settingsData && settingsData?.lat
  const storedLongitude = settingsData && settingsData?.long
  const router = useRouter()

  const dataPerPage = 6;

  const [loadMore, setLoadMore] = useState(false)
  const [offset, setOffset] = useState(0)

  const [sliderData, setSliderData] = useState([])

  const [swiperNewsData, setSwiperNewsData] = useState([])
  const [totalData, setTotalData] = useState('')

  const [swiperVideoNewsData, setSwiperVideoNewsData] = useState([])
  const [swiperVideoNewType, setSwiperVideoNewType] = useState(null)
  const [totalVideoNewsData, setTotalVideoNewsData] = useState('')

  const [swiperBreakingNewsData, setSwiperBreakingNewsData] = useState([])
  const [totalBreakingNewsData, setTotalBreakingNewsData] = useState('')

  const [swiperRssFeedsNewsData, setSwiRssFeedsNewsData] = useState([])
  const [totalRssFeedsNewsData, setTotalRssFeedsNewsData] = useState('')

  const [swiperAuthorNewsData, setSwiperAuthorNewsData] = useState([])
  const [totalAuthorNewsData, setTotalAuthorNewsData] = useState('')

  // Add state variables to track current slide positions
  const [currentNewsSlide, setCurrentNewsSlide] = useState(0)
  const [currentVideoSlide, setCurrentVideoSlide] = useState(0)
  const [currentBreakingSlide, setCurrentBreakingSlide] = useState(0)
  const [currentRssFeedSlide, setCurrentRssFeedSlide] = useState(0)
  const [currentAuthorNewsSlide, setCurrentAuthorNewsSlide] = useState(0)

  // Add state to track window width for responsive slides per view
  const [windowWidth, setWindowWidth] = useState(1200)

  // Add refs for each swiper
  const newsSliderRef = useRef(null);
  const videoSliderRef = useRef(null);
  const breakingSliderRef = useRef(null);
  const rssFeedSliderRef = useRef(null);
  const authorNewsSliderRef = useRef(null);

  const Newbreakpoints = {
    320: {
      slidesPerView: 1.2
    },
    375: {
      slidesPerView: 1.5
    },
    576: {
      slidesPerView: 1.5
    },
    768: {
      slidesPerView: 2
    },
    992: {
      slidesPerView: 3
    },
    1200: {
      slidesPerView: 3
    },
    1400: {
      slidesPerView: 4
    }
  }

  const swiperOptionUpdate = {
    loop: false,
    speed: 750,
    spaceBetween: 20,
    slidesPerView: 4,
    navigation: false,
    breakpoints: Newbreakpoints,
    autoplay: {
      delay: 2000000,
      disableOnInteraction: false
    },
    onReachEnd: () => {
      if (totalData > dataPerPage && totalData !== swiperNewsData.length) {
        setLoadMore(true)
        setOffset(offset + 1)
      }
    },
    // Add slide change event handler
    onSlideChange: (swiper) => {
      setCurrentNewsSlide(swiper.activeIndex)
    }
    // pagination: { clickable: true },
  }

  const VideoNewsSwiperOptionUpdate = {
    loop: false,
    speed: 750,
    spaceBetween: 20,
    slidesPerView: 4,
    navigation: false,
    breakpoints: Newbreakpoints,
    autoplay: {
      delay: 2000000,
      disableOnInteraction: false
    },
    onReachEnd: () => {
      if (totalVideoNewsData > dataPerPage && totalVideoNewsData !== swiperVideoNewsData.length) {
        setLoadMore(true)
        setOffset(offset + 1)
      }
    },
    // Add slide change event handler
    onSlideChange: (swiper) => {
      setCurrentVideoSlide(swiper.activeIndex)
    }
    // pagination: { clickable: true },
  }

  const breakingNewsSwiperOptionUpdate = {
    loop: false,
    speed: 750,
    spaceBetween: 20,
    slidesPerView: 4,
    navigation: false,
    breakpoints: Newbreakpoints,
    autoplay: {
      delay: 2000000,
      disableOnInteraction: false
    },
    onReachEnd: () => {
      if (totalBreakingNewsData > dataPerPage && totalBreakingNewsData !== swiperBreakingNewsData.length) {
        setLoadMore(true)
        setOffset(offset + 1)
      }
    },
    // Add slide change event handler
    onSlideChange: (swiper) => {
      setCurrentBreakingSlide(swiper.activeIndex)
    }
    // pagination: { clickable: true },
  }

  const rssFeedsSwiperOptionUpdate = {
    loop: false,
    speed: 750,
    spaceBetween: 20,
    slidesPerView: 4,
    navigation: false,
    breakpoints: Newbreakpoints,
    autoplay: {
      delay: 2000000,
      disableOnInteraction: false
    },
    onReachEnd: () => {
      if (totalRssFeedsNewsData > dataPerPage && totalRssFeedsNewsData !== swiperRssFeedsNewsData.length) {
        setLoadMore(true)
        setOffset(offset + 1)
      }
    },
    // Add slide change event handler
    onSlideChange: (swiper) => {
      setCurrentRssFeedSlide(swiper.activeIndex)
    }
    // pagination: { clickable: true },
  }

  const authorNewsSwiperOptionUpdate = {
    loop: false,
    speed: 750,
    spaceBetween: 20,
    slidesPerView: 4,
    navigation: false,
    breakpoints: Newbreakpoints,
    autoplay: {
      delay: 2000000,
      disableOnInteraction: false
    },
    onReachEnd: () => {
      if (totalAuthorNewsData > dataPerPage && totalAuthorNewsData !== swiperAuthorNewsData.length) {
        setLoadMore(true)
        setOffset(offset + 1)
      }
    },
    // Add slide change event handler
    onSlideChange: (swiper) => {
      setCurrentAuthorNewsSlide(swiper.activeIndex)
    }
    // pagination: { clickable: true },
  }


  const fetchFeatureData = async () => {
    try {
      // !loadMore ? setLoading(true) : setLoading(false)
      const { data } = await getFeatureDataApi.getFeatureData({
        offset: offset * dataPerPage,
        limit: dataPerPage,
        section_id: Data?.id,
        language_code: currentLanguage?.code,
        latitude: storedLatitude,
        longitude: storedLongitude
      });
      setLoading(false)
      setSliderData(data?.data?.data)
      // console.log(response?.data?.data)
    } catch (error) {
      setSliderData([])
      console.error('Error:', error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (sliderData && sliderData[0]?.news?.length > 0) {
      loadMore ? setSwiperNewsData((prevData) => [...prevData, ...sliderData[0]?.news]) :
        setSwiperNewsData(sliderData[0]?.news);
      setTotalData(sliderData[0]?.news_total)
    }
    if (sliderData && sliderData[0]?.videos?.length > 0) {
      loadMore ? setSwiperVideoNewsData((prevData) => [...prevData, ...sliderData[0]?.videos]) :
        setSwiperVideoNewsData(sliderData[0]?.videos);
      setSwiperVideoNewType(sliderData[0]?.videos_type)
      setTotalVideoNewsData(sliderData[0]?.videos_total)
    }
    if (sliderData && sliderData[0]?.breaking_news?.length > 0) {
      loadMore ? setSwiperBreakingNewsData((prevData) => [...prevData, ...sliderData[0]?.breaking_news]) :
        setSwiperBreakingNewsData(sliderData[0]?.breaking_news);
      setTotalBreakingNewsData(sliderData[0]?.breaking_news_total)
    }
    if (sliderData && sliderData[0]?.rss_feeds_news?.length > 0) {
      loadMore ? setSwiRssFeedsNewsData((prevData) => [...prevData, ...sliderData[0]?.rss_feeds_news]) :
        setSwiRssFeedsNewsData(sliderData[0]?.rss_feeds_news);
      setTotalRssFeedsNewsData(sliderData[0]?.rss_feeds_news_total)
    }
    if (sliderData && sliderData[0]?.author_news?.length > 0) {
      loadMore ? setSwiperAuthorNewsData((prevData) => [...prevData, ...sliderData[0]?.author_news]) :
        setSwiperAuthorNewsData(sliderData[0]?.author_news);
      setTotalAuthorNewsData(sliderData[0]?.author_news_total)
    }
  }, [sliderData])


  useEffect(() => {
    if (Data?.id) {
      fetchFeatureData()
    }

  }, [storedLatitude, storedLongitude, Data?.id, offset])

  useEffect(() => {

  }, [swiperNewsData, sliderData]);

  // Handle window resize for responsive slides per view calculation
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
    }

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // console.log(Data);

  // Remove the old sliderRef and update navigation handlers
  const handleNewsPrev = useCallback(() => {
    if (!newsSliderRef.current) return;
    newsSliderRef.current.swiper.slidePrev();
  }, []);

  const handleNewsNext = useCallback(() => {
    if (!newsSliderRef.current) return;
    newsSliderRef.current.swiper.slideNext();
  }, []);

  const handleVideoPrev = useCallback(() => {
    if (!videoSliderRef.current) return;
    videoSliderRef.current.swiper.slidePrev();
  }, []);

  const handleVideoNext = useCallback(() => {
    if (!videoSliderRef.current) return;
    videoSliderRef.current.swiper.slideNext();
  }, []);

  const handleBreakingPrev = useCallback(() => {
    if (!breakingSliderRef.current) return;
    breakingSliderRef.current.swiper.slidePrev();
  }, []);

  const handleBreakingNext = useCallback(() => {
    if (!breakingSliderRef.current) return;
    breakingSliderRef.current.swiper.slideNext();
  }, []);

  const handleRssFeedPrev = useCallback(() => {
    if (!rssFeedSliderRef.current) return;
    rssFeedSliderRef.current.swiper.slidePrev();
  }, []);

  const handleRssFeedNext = useCallback(() => {
    if (!rssFeedSliderRef.current) return;
    rssFeedSliderRef.current.swiper.slideNext();
  }, []);

  const handleAuthorNewsPrev = useCallback(() => {
    if (!authorNewsSliderRef.current) return;
    authorNewsSliderRef.current.swiper.slidePrev();
  }, []);

  const handleAuthorNewsNext = useCallback(() => {
    if (!authorNewsSliderRef.current) return;
    authorNewsSliderRef.current.swiper.slideNext();
  }, []);

  // Helper functions to check if buttons should be disabled
  // Get current slides per view based on screen size
  const getCurrentSlidesPerView = () => {
    if (windowWidth >= 1400) return 4;
    if (windowWidth >= 1200) return 3;
    if (windowWidth >= 992) return 3;
    if (windowWidth >= 768) return 2;
    if (windowWidth >= 576) return 1.5;
    if (windowWidth >= 375) return 1.5;
    return 1.2;
  };

  const isNewsPrevDisabled = () => currentNewsSlide === 0;
  const isNewsNextDisabled = () => {
    const slidesPerView = getCurrentSlidesPerView();
    // Calculate the maximum slide index that can be reached
    const maxSlideIndex = Math.max(0, swiperNewsData.length - Math.ceil(slidesPerView));
    return currentNewsSlide >= maxSlideIndex;
  };

  const isVideoPrevDisabled = () => currentVideoSlide === 0;
  const isVideoNextDisabled = () => {
    const slidesPerView = getCurrentSlidesPerView();
    const maxSlideIndex = Math.max(0, swiperVideoNewsData.length - Math.ceil(slidesPerView));
    return currentVideoSlide >= maxSlideIndex;
  };

  const isBreakingPrevDisabled = () => currentBreakingSlide === 0;
  const isBreakingNextDisabled = () => {
    const slidesPerView = getCurrentSlidesPerView();
    const maxSlideIndex = Math.max(0, swiperBreakingNewsData.length - Math.ceil(slidesPerView));
    return currentBreakingSlide >= maxSlideIndex;
  };

  const isRssFeedPrevDisabled = () => currentRssFeedSlide === 0;
  const isRssFeedNextDisabled = () => {
    const slidesPerView = getCurrentSlidesPerView();
    const maxSlideIndex = Math.max(0, swiperRssFeedsNewsData.length - Math.ceil(slidesPerView));
    return currentRssFeedSlide >= maxSlideIndex;
  };

  const isAuthorNewsPrevDisabled = () => currentAuthorNewsSlide === 0;
  const isAuthorNewsNextDisabled = () => {
    const slidesPerView = getCurrentSlidesPerView();
    const maxSlideIndex = Math.max(0, swiperAuthorNewsData.length - Math.ceil(slidesPerView));
    return currentAuthorNewsSlide >= maxSlideIndex;
  };



  return (
    Data &&
    <>
      {/* ad spaces */}
      {Data.ad_spaces && Data.id == Data.ad_spaces.ad_featured_section_id ? (
        <div className='container'>
          <AdSpace ad_url={Data.ad_spaces.ad_url} ad_img={Data.ad_spaces.web_ad_image} style_web='six' />
        </div>
      ) : null}

      {/* video section start here  */}
      {swiperVideoNewsData?.length > 0 &&
        <div className="container styleSix">
          <StylesTitleDiv
            title={Data && Data.title}
            desc={Data && Data.short_description}
            link={`/${currLangCode}/view-all/${Data.slug}`}
            styleSix={true}
            handlePrev={handleVideoPrev}
            handleNext={handleVideoNext}
            isPrevDisabled={isVideoPrevDisabled()}
            isNextDisabled={isVideoNextDisabled()}
          />
          <Swiper
            ref={videoSliderRef}
            {...VideoNewsSwiperOptionUpdate}
            key={getDirection()}
            pagination={{
              clickable: false,
            }}
            className=""
          >

            {
              swiperVideoNewsData?.map((item, index) => (

                <SwiperSlide key={index}>
                  <StyleSixCard item={item} videoNewsCard={true} />
                </SwiperSlide>
              ))
            }
          </Swiper>

        </div>}
      {/* video section ends here  */}


      {/* news section start here  */}
      {swiperNewsData?.length > 0 &&
        <div className="container styleSix">
          <StylesTitleDiv
            title={Data && Data.title}
            desc={Data && Data.short_description}
            link={`/${currLangCode}/view-all/${Data.slug}`}
            styleSix={true}
            handlePrev={handleNewsPrev}
            handleNext={handleNewsNext}
            isPrevDisabled={isNewsPrevDisabled()}
            isNextDisabled={isNewsNextDisabled()}
          />
          <Swiper
            ref={newsSliderRef}
            {...swiperOptionUpdate}
            key={getDirection()}
            pagination={{
              clickable: false,
            }}
            className=""
          >

            {
              swiperNewsData?.map((item, index) => (

                <SwiperSlide key={index}>
                  <StyleSixCard item={item} newsSect={true} />
                </SwiperSlide>
              ))
            }
          </Swiper>

        </div>}
      {/* news section ends here  */}

      {/* breakingNews section start here  */}
      {swiperBreakingNewsData?.length > 0 &&
        <div className="container styleSix">
          <StylesTitleDiv
            title={Data && Data.title}
            desc={Data && Data.short_description}
            link={`/${currLangCode}/view-all/${Data.slug}`}
            styleSix={true}
            handlePrev={handleBreakingPrev}
            handleNext={handleBreakingNext}
            isPrevDisabled={isBreakingPrevDisabled()}
            isNextDisabled={isBreakingNextDisabled()}
          />
          <Swiper
            ref={breakingSliderRef}
            {...breakingNewsSwiperOptionUpdate}
            key={getDirection()}
            pagination={{
              clickable: false,
            }}
            className=""
          >

            {
              swiperBreakingNewsData?.map((item, index) => (

                <SwiperSlide key={index}>
                  <StyleSixCard item={item} breakingNewsSect={true} />
                </SwiperSlide>
              ))
            }
          </Swiper>

        </div>}
      {/* breakingNews section ends here  */}

      {/* rss-feed section start here  */}
      {swiperRssFeedsNewsData?.length > 0 &&
        <div className="container styleSix">
          <StylesTitleDiv
            title={Data && Data.title}
            desc={Data && Data.short_description}
            link={`/${currLangCode}/view-all/${Data.slug}`}
            styleSix={true}
            handlePrev={handleRssFeedPrev}
            handleNext={handleRssFeedNext}
            isPrevDisabled={isRssFeedPrevDisabled()}
            isNextDisabled={isRssFeedNextDisabled()}
          />
          <Swiper
            ref={rssFeedSliderRef}
            {...rssFeedsSwiperOptionUpdate}
            key={getDirection()}
            pagination={{
              clickable: false,
            }}
            className=""
          >

            {
              swiperRssFeedsNewsData?.map((item, index) => (

                <SwiperSlide key={index}>
                  <StyleSixCard item={item} rssFeedCard={true} />
                </SwiperSlide>
              ))
            }
          </Swiper>

        </div>}
      {/* rss-feed section ends here  */}

      {/* author-news section start here  */}
      {swiperAuthorNewsData?.length > 0 &&
        <div className="container styleSix">
          <StylesTitleDiv
            title={Data && Data.title}
            desc={Data && Data.short_description}
            link={`/${currLangCode}/view-all/${Data.slug}`}
            styleSix={true}
            handlePrev={handleAuthorNewsPrev}
            handleNext={handleAuthorNewsNext}
            isPrevDisabled={isAuthorNewsPrevDisabled()}
            isNextDisabled={isAuthorNewsNextDisabled()}
          />
          <Swiper
            ref={authorNewsSliderRef}
            {...swiperOptionUpdate}
            key={getDirection()}
            pagination={{
              clickable: false,
            }}
            className=""
          >

            {
              swiperAuthorNewsData?.map((item, index) => (

                <SwiperSlide key={index}>
                  <StyleSixCard item={item} newsSect={true} />
                </SwiperSlide>
              ))
            }
          </Swiper>

        </div>}
      {/* author-news section ends here  */}

    </>
  )
}

export default StyleSix