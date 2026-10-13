import Meta from '@/components/commonComponents/seo/Meta'
import JsonLd from '@/components/Schema/JsonLd.jsx'
import { fetchMetaInfo } from '@/utils/fetchMetaInfo.js'
import dynamic from 'next/dynamic'

const AllBreakingNews = dynamic(() => import('../../../components/pagesComponent/AllBreakingNews.jsx'), { ssr: false })

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
      <AllBreakingNews />
      <JsonLd data={metadata && metadata?.schema} />
    </>
  )
}

let serverSidePropsFunction = null;
if (process.env.NEXT_PUBLIC_SEO === "true") {
  serverSidePropsFunction = async (context) => {
    const { req } = context; // Extract query and request object from context
    const { params } = req[Symbol.for('NextInternalRequestMeta')].match;
    const language_code = params.langCode

    const currentURL = process.env.NEXT_PUBLIC_WEB_URL + `/${language_code}/all-breaking-news/`;

    const metadata = await fetchMetaInfo({
      pageType: 'all_breaking_news',
      langCode: language_code,
      currentURL: currentURL
    });

    return {
      props: {
        metadata,
      },
    };
  };
}


export default Index
