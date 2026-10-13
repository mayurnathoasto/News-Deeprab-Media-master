'use client'
import { formatDate, placeholderImage, truncateText } from '@/utils/helpers'
import Link from 'next/link'
import React from 'react'
import { FiCalendar, FiClock } from 'react-icons/fi'

const FeedCard = ({ data, selectedCate }) => {

    return (
        <Link href={data?.url || '#'} title='detail-page' target='_blank'>
            <div className={`w-full h-max bg-white dark:secondaryBg p-4 rounded-[6px] grid grid-cols-12 gap-6`}>
                {
                    (data?.image_url || data?.image) &&
                    <div className='col-span-12 sm:col-span-3'>
                        <img src={data?.image_url || data?.image || ""} width={0} height={0} className='w-full h-auto sm:h-full sm:aspect-[153/140] commonRadius object-cover' alt={data?.title} loading='lazy' onError={placeholderImage} />
                    </div>
                }
                <div className={`flex flex-col gap-2 ${(data?.image_url || data?.image) ? 'col-span-12 sm:col-span-9' : 'col-span-12'}`}>
                    {
                        !selectedCate &&
                        <div className='flex items-center p-3.5 rounded-2xl w-max max-h-5 text-sm font-medium gap-1 secondaryBg text-white'>
                            <span className=''>
                                {data?.source?.category?.category_name}
                            </span>
                        </div>
                    }
                    <h1 className='textPrimary font-semibold text-base md:text-2xl line-clamp-1'>{data?.title}</h1>
                    {
                        data?.description &&
                        <h2 className='textSecondary line-clamp-2'>{truncateText(data?.description, 120)}</h2>
                    }
                    <div className='flex items-center justify-between w-full border-t-2 pt-2 flex-wrap gap-y-3 dark:borderColor'>
                        {
                            data?.author &&
                            <div className='flex items-center gap-1'>
                                <span className='textPrimary font-semibold'>
                                    {data?.author}
                                </span>
                            </div>
                        }
                        <div className="flex items-center gap-1 textPrimary font-semibold">
                            {
                                data?.published_at_human?.includes('hours ago') ?
                                    <FiClock className="" size={18} /> 
                                    :
                                    <FiCalendar className="" size={18} />

                            }
                            <span className=''>
                                {
                                    data?.published_at_human?.includes('hours ago') ?
                                        data?.published_at_human :
                                        formatDate(data?.published_at || data?.published_date || new Date().toISOString())
                                }
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </Link>
    )
}

export default FeedCard