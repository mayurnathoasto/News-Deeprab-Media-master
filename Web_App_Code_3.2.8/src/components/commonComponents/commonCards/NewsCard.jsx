'use client'
import Image from 'next/image';
import { FiCalendar } from 'react-icons/fi'
import { BsBookmark } from 'react-icons/bs';
import Link from 'next/link';
import { currentLangCode, formatDate, newsImageSrc, placeholderImage } from '@/utils/helpers';

const NewsCard = ({ subDropCard, bookmarkCard, element, tagCard, setbookmarkApi, categorySlug, subCateSlug }) => {

  const currLangCode = currentLangCode();

  const newsDate = element?.published_date || element?.date;

  const newsLink = `${categorySlug ? `/${currLangCode}/categories-news/${categorySlug}/${element?.slug}` : subCateSlug ? `/${currLangCode}/categories-news/sub-category/${subCateSlug}/${element?.slug}` : `/${currLangCode}/news/${element?.slug}`}`

  return (
    <div className={`group flex flex-col w-full h-full ${subDropCard ? 'bg-transparent' : 'bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow'}`} key={element?.title}>
      {/* Image Section */}
      <div className="relative overflow-hidden w-full">
        <Link href={newsLink} title={element?.title} className="block w-full">
          <img
            src={newsImageSrc(element?.image)}
            alt={element?.title}
            onError={placeholderImage}
            loading='lazy'
            className={`object-cover w-full ${subDropCard ? 'h-[194px] rounded-lg' : 'h-[200px] md:h-[220px]'} transition-transform duration-700 group-hover:scale-105`}
          />
        </Link>
        <div className="absolute top-3 left-3 bg-[#af2c2c] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm shadow-sm">
          {tagCard ? element?.tag_name : bookmarkCard ? element?.category_name : element?.category?.category_name}
        </div>
        {bookmarkCard && (
          <button 
            className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow hover:text-[#af2c2c] transition-colors"
            onClick={(e) => setbookmarkApi(element?.news_id)}
          >
            <BsBookmark size={16} className="text-gray-900" />
          </button>
        )}
      </div>

      {/* Text Section */}
      <div className={`${subDropCard ? 'pt-3' : 'p-4 md:p-5'} flex flex-col flex-grow relative text-start`}>
        <Link href={newsLink} title={element?.title} className="flex-grow block">
          <h4 className={`text-[18px] md:text-[20px] font-[800] leading-snug mb-3 text-gray-900 dark:text-white group-hover:text-[#af2c2c] transition-colors line-clamp-3`} style={{ fontFamily: "var(--headline-font-family)" }}>
            {element?.title}
          </h4>
        </Link>
        
        {!subDropCard && (
          <div className="flex items-center text-gray-500 text-[12px] font-medium mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
            <span>{formatDate(newsDate)}</span>
            {element?.total_views !== undefined && (
               <>
                 <span className="mx-2 text-gray-300">|</span>
                 <span>{element?.total_views} Views</span>
               </>
            )}
          </div>
        )}
      </div>
    </div >
  );
};

export default NewsCard;
