'use client'
import React, { useState, useEffect } from 'react'
import { BsFillPlayFill, BsPlayCircle } from 'react-icons/bs'
import Loader from '../Loader'
import { translate } from '@/utils/translation';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FaPlay } from 'react-icons/fa'
import EmbeddedVideo from '../EmbeddedVideo'

const VideoPlayerModal = props => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [props.show])

  return (
    <Dialog className='!border-none relative'>
      {
        props.editNews ?
          <DialogTrigger className={`w-full border borderColor commonRadius px-4 py-2 my-2 flexCenter gap-1`}>
            <span> {translate('previewLbl')}</span>
            <span aria-label="Play video" className='textPrimary cursor-pointer'><BsFillPlayFill /></span>
          </DialogTrigger> :
          <DialogTrigger className={` ${props.styleOne ? 'unset' : 'absolute'} ${props?.styleFive ? 'top-[10%] left-[44%]' : 'top-0 bottom-0 left-0 right-0'} m-auto  h-[44px] w-[44px] flexCenter secondaryBg border-[4px] border-white rounded-full text-white`}>
            {
              props.videoSect ?
                <span aria-label="Play video">
                  <FaPlay className='' />
                </span>
                :
                <span className='textPrimary cursor-pointer'><BsPlayCircle size={40} color='white' /></span>
            }
          </DialogTrigger>
      }
      <DialogContent className='max-h-[600px] max-w-[90%] md:max-w-[60%] !bg-transparent  p-0 overflow-hidden !border !border-transparent videoPlayerModal'>
        {isLoading ? (
          <Loader />
        ) : (
          <EmbeddedVideo url={props.url} type={props.type_url} />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default VideoPlayerModal
