import React from 'react'
import Skeleton from 'react-loading-skeleton'

const AuthorCardSkeleton = () => {
    return (
        <div className='flex flex-col gap-8'>
            <div className='flex justify-between items-center'>
                <Skeleton height={24} width={128} />
                <div className='flex gap-2.5'>
                    <Skeleton height={40} width={40} style={{ borderRadius: 12 }} />
                    <Skeleton height={40} width={40} style={{ borderRadius: 12 }} />
                </div>
            </div>
            <div className='bg-white rounded-2xl p-5 border borderColor flex flex-col gap-4'>
                <div className='flex items-center gap-3'>
                    <Skeleton circle height={40} width={40} />
                    <div className='flex flex-col gap-2'>
                        <Skeleton height={12} width={64} />
                        <Skeleton height={16} width={128} />
                    </div>
                </div>
                <Skeleton height={1} width={'100%'} />
                <div className='flex flex-col gap-2'>
                    <Skeleton height={16} width={'75%'} />
                    <Skeleton height={16} width={'100%'} />
                    <Skeleton height={16} width={'83%'} />
                </div>
                <Skeleton height={1} width={'100%'} />
                <div className='flex flex-col md:flex-row items-center gap-4'>
                    <Skeleton height={16} width={128} />
                    <div className='flex gap-2'>
                        {[...Array(4)].map((_, idx) => (
                            <Skeleton key={idx} circle height={40} width={40} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthorCardSkeleton
