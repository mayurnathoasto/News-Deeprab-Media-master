'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import playstore from '../../assets/Images/playStore.svg'
import appleStore from '../../assets/Images/appleStore.svg'
import { settingsSelector } from '../store/reducers/settingsReducer'
import { useSelector } from 'react-redux'
import { currentLanguageSelector } from '../store/reducers/languageReducer'
import { currentLangCode, decryptGeminiKey, defaultLanguageCode, placeholderImage, } from '@/utils/helpers';
import { translate } from '@/utils/translation';
import { checkNewsDataSelector } from '../store/reducers/CheckNewsDataReducer'
import moment from 'moment'
import { themeSelector } from '../store/reducers/CheckThemeReducer'
import { categoriesSelector } from '../store/reducers/CategoriesReducer'
import { translateFooterDescription } from '../../gemini-api/AiCreateNewsApi'
import NewsletterFooter from '../commonComponents/NewsletterFooter'
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaWhatsapp
} from 'react-icons/fa6'

const Footer = () => {

  const currLangCode = currentLangCode();
  const defaultLangCode = defaultLanguageCode();
  const darkThemeMode = useSelector(themeSelector);
  const settingsData = useSelector(settingsSelector)
  const categories = useSelector(categoriesSelector);

  const geminiApiKey = settingsData?.data?.google_gemini_api_key;

  const defaultLanguageName = settingsData?.data?.default_language?.language;
  // Test your specific key
  const decryptedGeminiKey = decryptGeminiKey(geminiApiKey);

  const darkLogo = settingsData?.data?.web_setting?.dark_footer_logo;
  const lightLogo = settingsData?.data?.web_setting?.light_footer_logo;

  // Fix internal server URL so browser can access logos from Next.js public folder
  const fixLogoUrl = (url) => {
    if (!url) return ''
    return url.replace(/https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?/g, '')
  }

  const catData = Math.ceil(categories && categories?.length / 2);

  const checkNewsData = useSelector(checkNewsDataSelector);
  const currentLanguage = useSelector(currentLanguageSelector);
  const socialMedias = settingsData.data?.social_media;

  // State for translated footer description
  const [translatedFooterDesc, setTranslatedFooterDesc] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  // Get original footer description from settings
  const originalFooterDesc = settingsData.data?.web_setting?.web_footer_description;

  // Effect to translate footer description when language changes
  useEffect(() => {
    const translateFooter = async () => {
      // If no original description, set empty string
      if (!originalFooterDesc) {
        setTranslatedFooterDesc('');
        return;
      }

      // If current language is English or not set, use original description (no translation needed)
      if (!currentLanguage?.name || currentLanguage?.name.toLowerCase() === defaultLanguageName || currentLanguage?.code === defaultLangCode) {
        setTranslatedFooterDesc(originalFooterDesc);
        return;
      }

      // Check if we already have a cached translation for this language and description
      // Use encodeURIComponent instead of btoa to handle Unicode characters safely
      const cacheKey = `footer_desc_${currentLanguage.code}_${encodeURIComponent(originalFooterDesc).substring(0, 30)}`;
      if (typeof window !== 'undefined') {
        const cachedTranslation = sessionStorage.getItem(cacheKey);
        if (cachedTranslation) {
          setTranslatedFooterDesc(cachedTranslation);
          return;
        }
      }
      setIsTranslating(true);
      try {
        const translatedText = await translateFooterDescription(
          decryptedGeminiKey,
          originalFooterDesc,
          currentLanguage.name,
          currentLanguage.code
        );
        setTranslatedFooterDesc(translatedText);
      } catch (error) {
        console.error('Error translating footer description:', error);
        // Fallback to original description if translation fails
        setTranslatedFooterDesc(originalFooterDesc);
      } finally {
        setIsTranslating(false);
      }
    };

    // Execute translation when dependencies change
    translateFooter();
  }, [originalFooterDesc, currentLanguage?.name, currentLanguage?.code]);

  const defaultSocialLinks = [
    {
      name: 'Facebook',
      link: 'https://facebook.com',
      icon: <FaFacebookF size={15} />,
      hoverClass: 'hover:bg-[#1877F2] hover:border-[#1877F2] hover:shadow-[0_4px_16px_rgba(24,119,242,0.45)]'
    },
    {
      name: 'X (Twitter)',
      link: 'https://twitter.com',
      icon: <FaXTwitter size={15} />,
      hoverClass: 'hover:bg-black hover:border-white/40 hover:shadow-[0_4px_16px_rgba(255,255,255,0.25)]'
    },
    {
      name: 'Instagram',
      link: 'https://instagram.com',
      icon: <FaInstagram size={16} />,
      hoverClass: 'hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent hover:shadow-[0_4px_16px_rgba(220,39,67,0.45)]'
    },
    {
      name: 'YouTube',
      link: 'https://youtube.com',
      icon: <FaYoutube size={16} />,
      hoverClass: 'hover:bg-[#FF0000] hover:border-[#FF0000] hover:shadow-[0_4px_16px_rgba(255,0,0,0.45)]'
    },
    {
      name: 'LinkedIn',
      link: 'https://linkedin.com',
      icon: <FaLinkedinIn size={15} />,
      hoverClass: 'hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:shadow-[0_4px_16px_rgba(10,102,194,0.45)]'
    },
    {
      name: 'WhatsApp',
      link: 'https://whatsapp.com',
      icon: <FaWhatsapp size={16} />,
      hoverClass: 'hover:bg-[#25D366] hover:border-[#25D366] hover:shadow-[0_4px_16px_rgba(37,211,102,0.45)]'
    }
  ]

  return (
    <footer className="bg-[#1b2a47] text-white pt-10 commonMT">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className='flex flex-col gap-8'>
            <Link href={`/${currLangCode ? currLangCode : defaultLangCode}`} className='inline-flex w-fit rounded-md bg-[#9aa3ae] px-5 py-4'>
              <img
                src={'/storage/logos/iq-news-main.png'}
                alt='logo'
                loading='lazy'
                className='w-[150px] h-[80px] object-contain'
              />
            </Link>
            <div className=''>
              <p className=' text-[14px]'>
                {isTranslating ? (
                  <span className="text-gray-400 italic">Translating...</span>
                ) : (
                  translatedFooterDesc || originalFooterDesc || ''
                )}
              </p>
            </div>

            <div>
              <span className='font-[700] text-[16px] capitalize tracking-wide text-white border-b border-white pb-1 inline-block'>
                {translate('followus') || 'Follow Us'}
              </span>
              <div className='flex items-center flex-wrap gap-2.5 mt-3.5'>
                {socialMedias && socialMedias.length > 0
                  ? socialMedias.map((item, index) => {
                      const lower = (item?.link || '').toLowerCase()
                      let IconComponent = null
                      let hoverStyle = 'hover:bg-white/30 hover:shadow-gray-500'

                      if (lower.includes('facebook')) {
                        IconComponent = <FaFacebookF size={15} />
                        hoverStyle = 'hover:bg-[#1877F2] hover:border-[#1877F2] hover:shadow-[0_4px_16px_rgba(24,119,242,0.45)]'
                      } else if (lower.includes('twitter') || lower.includes('x.com')) {
                        IconComponent = <FaXTwitter size={15} />
                        hoverStyle = 'hover:bg-black hover:border-white/40 hover:shadow-[0_4px_16px_rgba(255,255,255,0.25)]'
                      } else if (lower.includes('instagram')) {
                        IconComponent = <FaInstagram size={16} />
                        hoverStyle = 'hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent hover:shadow-[0_4px_16px_rgba(220,39,67,0.45)]'
                      } else if (lower.includes('youtube')) {
                        IconComponent = <FaYoutube size={16} />
                        hoverStyle = 'hover:bg-[#FF0000] hover:border-[#FF0000] hover:shadow-[0_4px_16px_rgba(255,0,0,0.45)]'
                      } else if (lower.includes('linkedin')) {
                        IconComponent = <FaLinkedinIn size={15} />
                        hoverStyle = 'hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:shadow-[0_4px_16px_rgba(10,102,194,0.45)]'
                      } else if (lower.includes('whatsapp') || lower.includes('wa.me')) {
                        IconComponent = <FaWhatsapp size={16} />
                        hoverStyle = 'hover:bg-[#25D366] hover:border-[#25D366] hover:shadow-[0_4px_16px_rgba(37,211,102,0.45)]'
                      }

                      return (
                        <Link
                          href={item?.link || '#'}
                          target='_blank'
                          rel='noopener noreferrer'
                          aria-label='Social Link'
                          className={`w-[36px] h-[36px] rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all duration-200 hover:-translate-y-1 ${hoverStyle}`}
                          key={index}
                        >
                          {IconComponent ? (
                            IconComponent
                          ) : item?.image ? (
                            <Image
                              src={item?.image}
                              height={16}
                              width={16}
                              alt='social-icon'
                              loading='lazy'
                              className='h-[16px] w-[16px] object-contain'
                              onError={placeholderImage}
                            />
                          ) : (
                            <FaFacebookF size={15} />
                          )}
                        </Link>
                      )
                    })
                  : defaultSocialLinks.map((item, index) => (
                      <Link
                        href={item.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label={item.name}
                        title={item.name}
                        className={`w-[36px] h-[36px] rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all duration-200 hover:-translate-y-1 ${item.hoverClass}`}
                        key={index}
                      >
                        {item.icon}
                      </Link>
                    ))}
              </div>
            </div>

          </div>

          <div className='lg:pl-12 flex flex-col gap-8'>
            <div>
              <span className='font-[700] text-[16px] capitalize tracking-wide text-white border-b border-white pb-1'>{translate('navigations')}</span>
            </div>
            <div className='flex flex-col gap-3'>
              <Link href={`/${currLangCode ? currLangCode : defaultLangCode}`} className='text-white text-sm transition-all duration-300 hover:text-gray-300 hover:pl-1' title={translate('home')}>{translate('home')}</Link>

              <Link href={`/${currLangCode}/about-us`} className='text-white text-sm transition-all duration-300 hover:text-gray-300 hover:pl-1' title={translate('aboutus')}>{translate('aboutus')}</Link>

              {
                settingsData && settingsData.data?.live_streaming_mode === '1' && checkNewsData && checkNewsData?.data?.isLiveNewsData &&
                <Link href={`/${currLangCode}/live-news`} className='text-white text-sm transition-all duration-300 hover:text-gray-300 hover:pl-1' title={translate('livenews')}>{translate('livenews')}</Link>
              }

              {
                settingsData && settingsData.data?.breaking_news_mode === '1' && checkNewsData && checkNewsData?.data?.isBreakingNewsData &&
                <Link href={`/${currLangCode}/all-breaking-news`} className='text-white text-sm transition-all duration-300 hover:text-gray-300 hover:pl-1' title={translate('breakingnews')}>{translate('breakingnews')}</Link>
              }

              <Link href={`/${currLangCode}/video-news`} className='text-white text-sm transition-all duration-300 hover:text-gray-300 hover:pl-1' title={translate('videosLbl')}>{translate('videosLbl')}</Link>

              <Link href={`/${currLangCode}/contact-us`} className='text-white text-sm transition-all duration-300 hover:text-gray-300 hover:pl-1' title={translate('contactus')}>{translate('contactus')}</Link>

              <Link href={`/${currLangCode}/rss-feed`} className='text-white text-sm transition-all duration-300 hover:text-gray-300 hover:pl-1' title={translate('rssFeed')}>{translate('rssFeed')}</Link>

              <Link href={`/${currLangCode}/enews`} className='text-white text-sm transition-all duration-300 hover:text-gray-300 hover:pl-1' title={translate('e_news')}>{translate('e_news')}</Link>
            </div>
          </div>

          {
            settingsData?.data?.category_mode === '1' && categories && categories?.length > 0 &&
            <div className='flex flex-col gap-8'>
              <div>
                <span className='font-[700] text-[16px] capitalize tracking-wide text-white border-b border-white pb-1'>{translate('categories')}</span>
              </div>

              <div className='flex items-center gap-16'>
                <div className='flex flex-col gap-3'>
                  {
                    categories.length > 10 ? categories.slice(0, catData).map((item, index) => {
                      return <Link href={`/${currLangCode}/categories-news/${item?.slug}`} title={item?.category_name} className='text-white text-sm transition-all duration-300 hover:text-gray-300 hover:pl-1 cursor-pointer' key={index}>{item?.category_name}</Link>
                    })
                      :
                      <div className='flex flex-col gap-3'>
                        {
                          categories.map((item, index) => {
                            return <Link href={`/${currLangCode}/categories-news/${item?.slug}`} title={item?.category_name} className='text-white text-sm transition-all duration-300 hover:text-gray-300 hover:pl-1 cursor-pointer' key={index}>{item?.category_name}</Link>
                          })
                        }
                      </div>
                  }

                </div>
                {
                  categories.length > 10 &&
                  <div className='flex flex-col gap-3'>
                    {
                      categories.slice(catData).map((item, index) => {
                        return <Link href={`/${currLangCode}/categories-news/${item?.slug}`} title={item?.category_name} className='text-white text-sm transition-all duration-300 hover:text-gray-300 hover:pl-1 cursor-pointer' key={index}>{item?.category_name}</Link>
                      })
                    }

                  </div>
                }
              </div>

            </div>
          }

          <div className='flex flex-col gap-8'>
            <NewsletterFooter settingsData={settingsData} />
          </div>

        </div>
      </div>

      <div className='border-t border-[#ffffff29] text-white font-[400] py-6 mt-8 md:mt-12'>
        <div className='container flex items-center justify-between flex-wrap gap-3 sm:flex-nowrap sm:gap-0'>
          <div className=''> {translate('copyright')} © {moment().year()} {translate('allrights')}{' '} <span className="font-[700]">{settingsData && settingsData.data?.web_setting?.web_name}</span></div>
          <div className='flex items-center gap-2'>
            <Link href={`/${currLangCode}/policy-page/terms-condition`} className='transition-all duration-300 hover:primaryColor' title={translate('termsandcondition')}>{translate('termsandcondition')}</Link>
            <span>|</span>
            <Link href={`/${currLangCode}/policy-page/privacy-policy`} className='transition-all duration-300 hover:primaryColor' title={translate('priPolicy')}>{translate('priPolicy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
