import dynamic from 'next/dynamic'
import Meta from '@/components/commonComponents/seo/Meta'

const WebStoryDetails = dynamic(() => import('@/components/pagesComponent/web-stories/WebStoryDetails'), { ssr: false })

const Index = () => {
  return (
    <>
      <Meta
        title="Web Story"
        description="Read this visual web story."
        keywords="web story, visual news"
      />
      <WebStoryDetails />
    </>
  )
}

export default Index
