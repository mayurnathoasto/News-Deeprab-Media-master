'use client'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { settingsSelector } from '../store/reducers/settingsReducer'
import { useRouter } from 'next/router'
import { currentLangCode, defaultLanguageCode, placeholderImage } from '@/utils/helpers'

const SocialMedias = () => {

    const currLangCode = currentLangCode();
    const defaultLangCode = defaultLanguageCode();
    const router = useRouter();
    const settings = useSelector(settingsSelector);
    const socialMedias = settings?.data?.social_media;

    return (
        socialMedias && socialMedias?.length > 0 ?
            <div className='flexCenter gap-2'>
                {
                    router.asPath === `/${currLangCode ? currLangCode : defaultLangCode}` &&
                    <span className='text-white text-2xl'>|</span>
                }
                {
                    socialMedias.map((item) => {
                        return <Link href={item?.link} key={item?.id} title='social-media-link' target='_blank' className='h-[28px] w-[28px] flexCenter commonRadius transition-all duration-300 hover:primaryBg'>
                            <Image src={item?.image} height={18} width={18} alt='socialMediaImg' onError={placeholderImage} loading='lazy' />
                        </Link>
                    })
                }
            </div>
            : null
    )
}

export default SocialMedias