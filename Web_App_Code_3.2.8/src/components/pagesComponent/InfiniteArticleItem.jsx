'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { BsBookmark, BsFillBookmarkFill } from 'react-icons/bs'
import { AiOutlineLike, AiFillLike } from 'react-icons/ai'
import MediaShare from '../SocialMediaShares/MediaShare'
import PhotoGallery from '../commonComponents/PhotoGallery'
import EmbeddedVideo from '../commonComponents/EmbeddedVideo'
import RichTextContent from '../commonComponents/RichTextContent'
import { calculateReadTime, extractTextFromHTML, isLogin, placeholderImage } from '@/utils/helpers'
import { translate } from '@/utils/translation'
import { setBookmarkApi, setLikeDisLikeApi } from '@/utils/api/api'
import { setLoginModalState } from '../store/reducers/helperReducer'
import toast from 'react-hot-toast'

const InfiniteArticleItem = ({
  article,
  index,
  currLangCode,
  settingsData,
  fontSize,
  onImageClick
}) => {
  const router = useRouter()
  const [like, setLike] = useState(article?.like !== 0)
  const [totalLikes, setTotalLikes] = useState(Number(article?.total_like) || 0)
  const [bookmark, setBookmark] = useState(article?.bookmark !== 0)

  const articleURL = typeof window !== 'undefined'
    ? `${window.location.origin}/${currLangCode}/news/${article?.slug}`
    : `${process.env.NEXT_PUBLIC_WEB_URL || ''}/${currLangCode}/news/${article?.slug}`

  const text = extractTextFromHTML(article?.description)
  const readTime = calculateReadTime(text)

  const hasEmbeddedVideo = article?.content_value && ['video_youtube', 'video_other', 'video_upload'].includes(article?.content_type)

  const handleLikeNews = async () => {
    if (!isLogin()) {
      setLoginModalState({ openModal: true })
      toast.error(translate('loginFirst'))
      setTimeout(() => setLoginModalState({ openModal: false }), 2000)
      return
    }
    try {
      const nextStatus = like ? 0 : 1
      const { data } = await setLikeDisLikeApi.setLikeDisLike({
        news_id: article?.id,
        status: nextStatus
      })
      if (!data?.error) {
        setLike(!like)
        setTotalLikes(prev => like ? Math.max(0, prev - 1) : prev + 1)
      }
    } catch (err) {
      console.error('Like error:', err)
    }
  }

  const handleBookmarkNews = async () => {
    if (!isLogin()) {
      setLoginModalState({ openModal: true })
      toast.error(translate('loginFirst'))
      setTimeout(() => setLoginModalState({ openModal: false }), 2000)
      return
    }
    try {
      const nextStatus = bookmark ? 0 : 1
      const { data } = await setBookmarkApi.setBookmark({
        news_id: article?.id,
        status: nextStatus
      })
      if (!data?.error) {
        setBookmark(!bookmark)
        toast.success(bookmark ? translate('bookmarkRemoved') : translate('bookmarkSuccess'))
      }
    } catch (err) {
      console.error('Bookmark error:', err)
    }
  }

  const handleViewAuthorDetails = (authorId) => {
    router.push(`/${currLangCode}/author-details/${authorId}`)
  }

  return (
    <article
      id={`article-${article.slug}`}
      data-slug={article.slug}
      data-title={article.title}
      data-id={article.id}
      className="iq-observed-article flex flex-col gap-6 pt-10 border-t-2 border-dashed border-red-200 dark:border-red-950/60"
    >
      {/* ── Transition Header (Up Next Indicator) ── */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-950/40 text-[#af2c2c] dark:text-red-400 font-bold text-xs uppercase tracking-wider rounded-full border border-red-200 dark:border-red-900/30">
            <span className="w-2 h-2 rounded-full bg-[#af2c2c] animate-pulse"></span>
            Up Next • Story #{index + 2}
          </span>
          {article?.category?.category_name && (
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              in {article.category.category_name}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400 font-medium">Continuous Reading</span>
      </div>

      {/* ── Headline & Category Badge ── */}
      <div className="flex flex-col gap-3 border-b border-gray-200 dark:border-gray-800 pb-5">
        {article?.category?.category_name && (
          <span className="inline-block bg-[#af2c2c] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm w-fit">
            {article.category.category_name}
          </span>
        )}
        <h2
          className="text-[28px] md:text-[38px] lg:text-[44px] font-[800] leading-tight text-gray-900 dark:text-white"
          style={{ fontFamily: "var(--headline-font-family)" }}
        >
          {article.title}
        </h2>
      </div>

      {/* ── Meta Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4 iq-article-meta-row">
        <div className="flex items-center gap-3 text-[13px] text-gray-700 dark:text-gray-300 font-medium flex-wrap">
          {article?.user?.name && <span className="text-[#af2c2c] font-bold">By {article.user.name}</span>}
          {article?.user?.name && <span className="text-gray-500 select-none iq-meta-separator">|</span>}
          <span>
            {(article?.published_date || article?.date) && !isNaN(new Date(article?.published_date || article?.date))
              ? new Date(article?.published_date || article?.date).toLocaleString('en-us', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : (article?.published_date || article?.date || 'Recently')}
          </span>
          <span className="text-gray-500 select-none iq-meta-separator">|</span>
          <span>{article?.total_views || 0} Views</span>
          <span className="text-gray-500 select-none iq-meta-separator">|</span>
          <span>{readTime} min read</span>
        </div>

        <div className="flex items-center gap-4 iq-article-actions">
          <div className="flex items-center gap-3">
            <button
              onClick={handleLikeNews}
              className="text-gray-500 hover:text-[#af2c2c] transition-colors flex items-center gap-1.5 text-sm font-semibold"
            >
              {like && isLogin() ? <AiFillLike size={20} className="text-[#af2c2c]" /> : <AiOutlineLike size={20} />}
              {totalLikes}
            </button>
            <button
              onClick={handleBookmarkNews}
              className="text-gray-500 hover:text-[#af2c2c] transition-colors"
            >
              {bookmark && isLogin() ? <BsFillBookmarkFill size={18} className="text-[#af2c2c]" /> : <BsBookmark size={18} />}
            </button>
          </div>
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>
          <MediaShare
            url={articleURL}
            title={`${article?.title} - ${settingsData?.data?.web_setting?.web_name || ''}`}
            hashtag={`${settingsData?.data?.web_setting?.web_name || ''}`}
          />
        </div>
      </div>

      {/* ── Featured Image & Video ── */}
      <div className="flex flex-col gap-2">
        <div className="relative rounded-xl overflow-hidden shadow-sm">
          <PhotoGallery
            galleryPhotos={article?.images}
            titleImage={article?.image}
            onImageClick={onImageClick}
          />
        </div>
        {hasEmbeddedVideo && (
          <div className="overflow-hidden rounded-xl bg-black mt-4">
            <EmbeddedVideo url={article?.content_value} type={article?.content_type} className="w-full max-[575px]:h-[300px]" />
          </div>
        )}
      </div>

      {/* ── Article Content ── */}
      <div
        className="text-gray-800 dark:text-gray-200 newsDesc mt-2"
        style={{ fontSize: `${fontSize}px`, lineHeight: '1.8', fontFamily: "var(--primary-font-family)" }}
      >
        <RichTextContent content={article?.description} />
      </div>

      {/* ── Tags ── */}
      {article?.tag?.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[13px] font-bold uppercase tracking-wider text-gray-500 mr-2">Tags:</span>
            {article.tag.map((tag, idx) => (
              <span
                key={idx}
                onClick={() => router.push(`/${currLangCode}/tag/${tag.slug || tag}`)}
                className="border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-[#af2c2c] hover:border-[#af2c2c] transition-colors text-[12px] font-medium px-2 py-1 rounded cursor-pointer uppercase"
              >
                {typeof tag === 'object' ? tag.tag_name : tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Author Profile & Share ── */}
      <div className="flex flex-wrap gap-4 items-center justify-between pb-8 border-b borderColor">
        {article?.user?.is_author === 1 ? (
          <div
            className="flexCenter gap-2 cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              if (article?.user?.id && article?.user?.is_author === 1) {
                handleViewAuthorDetails(article?.user?.id)
              }
            }}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={article?.user?.profile}
                alt={article?.user?.name || 'Author'}
                width={40}
                height={40}
                loading="lazy"
                className="w-full h-full rounded-full object-cover"
                onError={placeholderImage}
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="textPrimary opacity-[79%] font-medium text-sm">{translate("author")}</div>
              <div className="font-semibold text-base textPrimary">{article?.user?.name}</div>
            </div>
          </div>
        ) : null}
        <MediaShare
          url={articleURL}
          title={`${article?.title} - ${settingsData?.data?.web_setting?.web_name || ''}`}
          hashtag={`${settingsData?.data?.web_setting?.web_name || ''}`}
        />
      </div>
    </article>
  )
}

export default InfiniteArticleItem
