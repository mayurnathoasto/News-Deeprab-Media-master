'use client'
import React from 'react'
import ReactPlayer from 'react-player'
import VideoPlayer from './videoplayer/HLSPlayer'
import DashPlayer from './videoplayer/DashPlayer'

export const getEmbeddableVideoUrl = url => {
  if (!url) return ''

  const trimmedUrl = String(url).trim()

  try {
    const parsedUrl = new URL(trimmedUrl)
    if (parsedUrl.hostname.includes('inqtube.com') && parsedUrl.pathname.includes('/watch/')) {
      parsedUrl.pathname = parsedUrl.pathname.replace('/watch/', '/embed/')
      return parsedUrl.toString()
    }
  } catch (error) {
    return trimmedUrl
  }

  if (trimmedUrl.includes('youtube.com/shorts/')) {
    const videoId = trimmedUrl.split('/shorts/')[1]?.split('?')[0]
    if (videoId) return `https://www.youtube.com/embed/${videoId}`
  }

  if (trimmedUrl.includes('youtube.com/watch')) {
    try {
      const videoId = new URL(trimmedUrl).searchParams.get('v')
      if (videoId) return `https://www.youtube.com/embed/${videoId}`
    } catch (error) {
      return trimmedUrl
    }
  }

  if (trimmedUrl.includes('youtu.be/')) {
    const videoId = trimmedUrl.split('youtu.be/')[1]?.split('?')[0]
    if (videoId) return `https://www.youtube.com/embed/${videoId}`
  }

  return trimmedUrl
}

const isHLSUrl = url => {
  if (!url) return false
  const clean = String(url).split('?')[0].split('#')[0].toLowerCase()
  return clean.endsWith('.m3u8')
}
const isDashUrl = url => {
  if (!url) return false
  const clean = String(url).split('?')[0].split('#')[0].toLowerCase()
  return clean.endsWith('.mpd') || clean.includes('manifest.mpd')
}
const isIframeUrl = (url, type) => {
  return type === 'video_other' ||
    type === 'url_other' ||
    url?.includes('youtube.com/embed') ||
    url?.includes('youtube-nocookie.com/embed') ||
    url?.includes('inqtube.com/embed')
}

const EmbeddedVideo = ({ url, type, height = '500px', className = '' }) => {
  const embedUrl = getEmbeddableVideoUrl(url)

  if (!embedUrl) return null

  if (isHLSUrl(embedUrl)) {
    return <VideoPlayer url={embedUrl} />
  }

  if (isDashUrl(embedUrl)) {
    return <DashPlayer url={embedUrl} className={className} />
  }

  if (isIframeUrl(embedUrl, type)) {
    return (
      <iframe
        className={className}
        src={embedUrl}
        width='100%'
        height={height}
        frameBorder='0'
        allowFullScreen
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      />
    )
  }

  return <ReactPlayer width='100%' height={height} url={embedUrl} controls={true} className={className} />
}

export default EmbeddedVideo
