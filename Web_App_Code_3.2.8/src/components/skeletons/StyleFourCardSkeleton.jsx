import React from 'react'
import Skeleton from 'react-loading-skeleton'

const StyleFourCardSkeleton = () => {
    return (
        <div className='flex flex-col gap-3 commonRadius commonBg p-4 border borderColor'>
            <div className='relative w-full h-[250px] md:h-[300px]'>
                <Skeleton height={'100%'} width={'100%'} style={{ borderRadius: 8 }} />
                <div className='absolute top-4 left-4'>
                    <Skeleton height={24} width={96} style={{ borderRadius: 9999 }} />
                </div>
            </div>
            <div className='flex flex-wrap items-center gap-4'>
                <Skeleton height={20} width={128} />
                <Skeleton height={20} width={96} />
                <Skeleton height={20} width={64} />
            </div>
            <div className='flex flex-col gap-2'>
                <Skeleton height={24} width={'100%'} />
                <Skeleton height={24} width={'83%'} />
                <Skeleton height={16} width={'100%'} />
            </div>
            <Skeleton height={32} width={128} />
        </div>
    )
}

export default StyleFourCardSkeleton
