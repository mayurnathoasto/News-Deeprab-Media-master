import React from 'react'
import Skeleton from 'react-loading-skeleton'

const NewsHorizontalCardSkeleton = () => {
    return (
        <div className='flex justify-between gap-4 max-h-[240px] rounded-2xl bg-white p-4 border borderColor'>
            <div className='w-1/2 max-w-[310px]'>
                <Skeleton height={200} width={'100%'} style={{ borderRadius: 8 }} />
            </div>
            <div className='w-1/2 flex flex-col gap-4'>
                <Skeleton height={20} width={160} />
                <Skeleton height={24} width={'100%'} />
                <Skeleton height={24} width={'75%'} />
                <Skeleton height={16} width={'100%'} />
                <div className='flex flex-wrap gap-4'>
                    <Skeleton height={16} width={96} />
                    <Skeleton height={16} width={96} />
                </div>
            </div>
        </div>
    )
}

export default NewsHorizontalCardSkeleton
