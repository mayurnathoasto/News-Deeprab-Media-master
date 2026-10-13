'use client'
import { translate } from '@/utils/translation'
import React from 'react'
import ThemeSvg from './ThemeSvg'
import noDataImg from '@/assets/Images/NoDataFound.svg'

const NoDataFound = ({ catNav = false }) => {
    return (
        <div className='flexColumnCenter text-center my-5 font-[600] text-2xl textPrimary gap-12' style={{ height: catNav ? '250px' : '50vh' }}>
            <ThemeSvg
                src={noDataImg}
                alt="empty-course-img"
                className="w-full h-full object-contain"
            />
            {translate('nodatafound')}
        </div>
    )
}

export default NoDataFound
