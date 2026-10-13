import dynamic from 'next/dynamic'
import Meta from '@/components/commonComponents/seo/Meta'

const WebStoriesPage = dynamic(() => import('@/components/pagesComponent/web-stories/WebStoriesPage'), { ssr: false })

const Index = () => {
  return (
    <>
      <Meta
        title="Web Stories"
        description="Explore the latest visual web stories."
        keywords="web stories, visual news, news stories"
      />
      <WebStoriesPage />
    </>
  )
}

export default Index
