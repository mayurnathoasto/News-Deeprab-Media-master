'use client'
import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { morePagesSelector } from '../store/reducers/morePagesReducer';
import { usePathname } from 'next/navigation';
import { currentLangCode, } from '@/utils/helpers';
import { translate } from '@/utils/translation';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { settingsSelector } from '../store/reducers/settingsReducer';
import { checkNewsDataSelector } from '../store/reducers/CheckNewsDataReducer';

const MorePagesDropdown = ({ onClose, totalMorePages, morePagesOffset, setMorePagesOffset, setIsLoadMorePages, morePagesLimit }) => {

    const currLangCode = currentLangCode();
    const router = usePathname();

    const settingsData = useSelector(settingsSelector);
    const checkNewsData = useSelector(checkNewsDataSelector);
    const showLiveNewsPage = settingsData && settingsData?.data?.live_streaming_mode === '1' && checkNewsData && checkNewsData?.data?.isLiveNewsData;
    const showBreakingNewsPage = settingsData && settingsData?.data?.breaking_news_mode === '1' && checkNewsData && checkNewsData?.data?.isBreakingNewsData;

    const pageData = useSelector(morePagesSelector)
    // Filter out 'About Us' and 'Contact Us' titles
    const filteredData = pageData?.filter(page => page.page_type !== 'about-us' && page.page_type !== 'contact-us' && page.page_type !== 'terms-condition' && page.page_type !== 'privacy-policy');

    const showAboutContactUs = showBreakingNewsPage || showLiveNewsPage;
    const showMorePages = filteredData?.length > 0 || showAboutContactUs;

    const isMorePagesActive = router?.startsWith(`/${currLangCode}/more-pages`);

    const handleLoadMore = () => {
        setIsLoadMorePages(true)
        setMorePagesOffset(morePagesOffset + 1)
    }

    return (
        showMorePages &&
        <NavigationMenu className='relative z-50'>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className={`dropdownTrigg cursor-pointer bg-transparent p-0 h-max w-max ${isMorePagesActive ? 'activeLink after:!h-[84%]' : ''}  relative after:content-[""] after:absolute after:top-[2px] after:!-left-[8px] after:h-[0%] after:w-[4px] after:rounded-full after:primaryBg hover:!primaryColor transition-all duration-500 hover:after:h-[88%] hover:after:transition-all hover:after:duration-[0.3s]  !textPrimary !font-semibold text-base uppercase`}>{translate('More Pages')}</NavigationMenuTrigger>
                    <NavigationMenuContent className=''>
                        <div className='flex flex-col gap-1 !w-max max-w-full p-1 px-3 bg-white text-black'>

                            {
                                showAboutContactUs &&
                                <Link href={`/${currLangCode}/about-us`} title={translate('aboutus')} className={`${router === `/${currLangCode}/about-us` ? 'activeLink after:h-[88%]' : ''} relative after:content-[""] after:absolute after:top-[1px] after:!-left-[8px] after:h-[0%] after:w-[4px] after:rounded-full after:primaryBg hover:!primaryColor transition-all duration-500 hover:after:h-[88%] hover:after:transition-all hover:after:duration-[0.3s] text-black font-[500] my-1 text-[17px]`}>{translate('aboutus')}</Link>
                            }
                            {
                                showAboutContactUs &&

                                <Link href={`/${currLangCode}/contact-us`} className={`${router === `/${currLangCode}/contact-us` ? 'activeLink after:h-[88%]' : ''} relative after:content-[""] after:absolute after:top-[1px] after:!-left-[8px] after:h-[0%] after:w-[4px] after:rounded-full after:primaryBg hover:!primaryColor transition-all duration-500 hover:after:h-[88%] hover:after:transition-all hover:after:duration-[0.3s] text-black font-[500] my-1 text-[17px]`}
                                    title={translate('contactus')}>{translate('contactus')}</Link>
                            }

                            {
                                filteredData?.map((page, index) => {
                                    return <Link
                                        href={`/${currLangCode}/more-pages/${page?.slug}/`}
                                        className={`${router === `/${currLangCode}/more-pages/${page?.slug}` ? 'activeLink after:h-[88%]' : ''}  relative after:content-[""] after:absolute after:top-[1px] after:!-left-[8px] after:h-[0%] after:w-[4px] after:rounded-full after:primaryBg hover:!primaryColor transition-all duration-500 hover:after:h-[88%] hover:after:transition-all hover:after:duration-[0.3s] text-black font-[500] my-1 text-[17px]`}
                                        // onClick={handleClose}
                                        title={page.title}
                                        onClick={onClose}
                                        key={index}
                                    >
                                        {page.title || translate('defaultTitle')}
                                    </Link>
                                })
                            }
                            {
                                totalMorePages > morePagesLimit && totalMorePages !== pageData?.length &&
                                <span className='primaryColor font-[600] text-center w-max cursor-pointer' onClick={() => handleLoadMore()}>{translate('loadMore')}</span>
                            }
                        </div>

                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu >


    );
}
export default MorePagesDropdown;