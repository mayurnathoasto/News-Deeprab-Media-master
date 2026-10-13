'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { getAdSpaceHomeSidebarApi } from '@/utils/api/api'
import { placeholderImage, currentLangCode } from '@/utils/helpers'
import { useSelector } from 'react-redux'
import { currentLanguageSelector } from '@/components/store/reducers/languageReducer'
import { settingsSelector } from '@/components/store/reducers/settingsReducer'

const HomeSidebarAds = () => {
    const [ads, setAds] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)

    const currentLanguage = useSelector(currentLanguageSelector)
    const settingsData    = useSelector(settingsSelector)
    const defaultLangCode = settingsData?.data?.web_setting?.default_language_code

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const langCode = currentLangCode(currentLanguage, defaultLangCode)
                const { data } = await getAdSpaceHomeSidebarApi.getAdSpaceHomeSidebar({
                    language_code: langCode,
                })
                if (data?.data?.sidebar_ads) {
                    setAds(data.data.sidebar_ads)
                }
            } catch (err) {
                // no ads found, silently ignore
            }
        }
        fetchAds()
    }, [currentLanguage, defaultLangCode])

    // Auto slide every 4 seconds if more than one ad
    useEffect(() => {
        if (ads.length <= 1) return
        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % ads.length)
        }, 4000)
        return () => clearInterval(timer)
    }, [ads])

    if (!ads || ads.length === 0) return null

    const currentAd = ads[currentIndex]

    const handleClick = () => {
        if (currentAd?.ad_url) {
            window.open(currentAd.ad_url, '_blank')
        }
    }

    return (
        <div className='w-full'>
            {/* Ad Banner */}
            <div
                className='relative w-full overflow-hidden rounded-xl shadow-md cursor-pointer'
                onClick={handleClick}
                style={{ aspectRatio: '4/3' }}
            >
                <Image
                    src={currentAd?.web_ad_image || ''}
                    alt='Advertisement'
                    fill
                    className='object-cover transition-transform duration-500 hover:scale-105'
                    onError={placeholderImage}
                    loading='lazy'
                />
                {/* Sponsored label */}
                <span className='absolute top-2 left-2 bg-black/50 text-white text-[9px] font-semibold px-2 py-0.5 rounded-sm uppercase tracking-wider'>
                    Sponsored
                </span>
            </div>

            {/* Dots indicator (if multiple ads) */}
            {ads.length > 1 && (
                <div className='flex justify-center gap-1.5 mt-2'>
                    {ads.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-[#af2c2c]' : 'bg-gray-300'}`}
                        />
                    ))}
                </div>
            )}

            {/* Prev / Next arrows (if multiple ads) */}
            {ads.length > 1 && (
                <div className='flex justify-between mt-1 px-1'>
                    <button
                        onClick={() => setCurrentIndex(prev => (prev - 1 + ads.length) % ads.length)}
                        className='text-gray-500 hover:text-[#af2c2c] text-lg font-bold transition-colors'
                    >‹</button>
                    <button
                        onClick={() => setCurrentIndex(prev => (prev + 1) % ads.length)}
                        className='text-gray-500 hover:text-[#af2c2c] text-lg font-bold transition-colors'
                    >›</button>
                </div>
            )}
        </div>
    )
}

export default HomeSidebarAds
