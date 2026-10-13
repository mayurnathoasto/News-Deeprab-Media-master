'use client'
import React, { useState } from 'react'
import LoadMoreSpinner from './LoaderSpinner'
import { translate } from '@/utils/translation'

const LoadMoreBtn = ({ handleLoadMore, loadMoreLoading, searchModal }) => {

    return (
        <div className='mt-2 flexCenter w-full'>
            {
                loadMoreLoading ? <LoadMoreSpinner /> :
                    <button onClick={handleLoadMore} className={`loadMoreBtn commonBtn ${searchModal ? 'text-sm' : ''}`} style={{ color: '#000000' }}>{translate('loadMore')}</button>
            }
        </div>
    )
}

export default LoadMoreBtn
