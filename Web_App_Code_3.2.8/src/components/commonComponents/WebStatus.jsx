'use client'
import React from 'react'
import ThemeSvg from './ThemeSvg';
import somethingWentWrongImg from '@/assets/Images/somethingWrong.svg'
import maintenanceMode from '@/assets/Images/Maintenance_Mode.svg'

const WebStatus = ({ type, title, desc }) => {

    const noInternet = type === 'noInternet'
    const somethingWentWrong = type === 'somethingWentWrong'

    return (
        <div className='flexColumnCenter h-screen textPrimary text-xl md:text-2xl lg:text-3xl text-center'>
            <div>
                {
                    !noInternet &&
                    <ThemeSvg
                        src={somethingWentWrong ? somethingWentWrongImg : maintenanceMode}
                        alt="empty-course-img"
                        className='!w-[250px] md:!w-[500px]'
                    />
                }
            </div>
            <div className='mt-[30px]'>
                <h1 className='font-[700]'>
                    {title}
                </h1>
            </div>
            <div className='mt-[20px]'>
                <h2 className='font-[600] w-full sm:w-[62%] m-auto'>
                    {desc}
                </h2>
            </div>
        </div>
    )
}

export default WebStatus
