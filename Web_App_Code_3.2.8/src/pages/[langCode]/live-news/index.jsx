import Meta from '@/components/commonComponents/seo/Meta'
import JsonLd from '@/components/Schema/JsonLd.jsx'
import { fetchMetaInfo } from '@/utils/fetchMetaInfo.js'
import dynamic from 'next/dynamic'

const LiveNews = dynamic(() => import('../../../components/pagesComponent/LiveNews.jsx'), { ssr: false })

const Index = ({ metadata }) => {
  return (
    <>
      <Meta
        title={metadata && metadata?.title}
        description={metadata && metadata?.description}
        keywords={metadata && metadata?.keywords}
        ogImage={metadata && metadata?.image}
        pathName={metadata && metadata?.pathName}
      />
      <LiveNews />
      <JsonLd data={metadata && metadata?.schema} />
    </>
  )
}

let serverSidePropsFunction = null;

if (process.env.NEXT_PUBLIC_SEO === "true") {
  serverSidePropsFunction = async (context) => {
    const { req } = context;
    const { params } = req[Symbol.for('NextInternalRequestMeta')].match;
    const language_code = params.langCode

    const currentURL = process.env.NEXT_PUBLIC_WEB_URL + `/${language_code}/live-news/`;

    const metadata = await fetchMetaInfo({
      pageType: 'live_streaming_news',
      langCode: language_code,
      currentURL: currentURL
    });

    return {
      props: {
        metadata
      }
    };
  };
}


export default Index
