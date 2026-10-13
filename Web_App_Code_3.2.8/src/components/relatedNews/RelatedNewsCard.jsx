'use client'
import { currentLangCode, newsImageSrc, placeholderImage, truncateText } from '@/utils/helpers'
import Link from 'next/link'
import React from 'react'

const RelatedNewsCard = ({ element, videoNewsPage }) => {

    const currLangCode = currentLangCode();
    const categoryName = videoNewsPage ? element?.category_name : element?.category?.category_name;
    const newsTitle = element?.title || '';

    return (
        <Link href={`/${currLangCode}/${videoNewsPage ? 'video-news' : 'news'}/${element?.slug}`} title={newsTitle}>
            <div style={{
                display: 'flex',
                gap: '12px',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '12px',
                marginBottom: '12px',
                padding: '8px',
                borderRadius: '6px',
                cursor: 'pointer'
            }}>
                {/* Image Section */}
                <div style={{
                    flexShrink: 0,
                    width: '85px',
                    height: '65px',
                    borderRadius: '6px',
                    overflow: 'hidden'
                }}>
                    <img
                        src={newsImageSrc(element?.image)}
                        alt={newsTitle}
                        loading='lazy'
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={placeholderImage}
                    />
                </div>

                {/* Text Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
                    {categoryName && (
                        <span style={{
                            color: '#af2c2c',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            {categoryName}
                        </span>
                    )}
                    <h5 style={{
                        color: 'var(--text-primary-color)',
                        fontSize: '13px',
                        fontWeight: '700',
                        lineHeight: '1.4',
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        fontFamily: 'var(--headline-font-family, inherit)'
                    }}>
                        {newsTitle}
                    </h5>
                </div>
            </div>
        </Link>
    )
}

export default RelatedNewsCard
