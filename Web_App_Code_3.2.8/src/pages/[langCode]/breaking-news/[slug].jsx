import Meta from '@/components/commonComponents/seo/Meta'
import JsonLd from '@/components/Schema/JsonLd'
import { GET_BREAKING_NEWS } from '@/utils/api/api'
import axios from 'axios'
import dynamic from 'next/dynamic'
const NewsDetails = dynamic(() => import('@/components/pagesComponent/NewsDetails'), { ssr: false })

// This is seo api
const fetchDataFromSeo = async (id, language_code) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_END_POINT}/${GET_BREAKING_NEWS}?language_code=${language_code}&slug=${id}`
    )
    const data = response.data
    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
}

const Index = ({ seoData, currentURL }) => {

  const metaData = seoData && seoData?.data?.data[0];

  return (
    <>
      <Meta
        title={metaData && metaData?.meta_title}
        description={metaData && metaData?.meta_description}
        keywords={metaData && metaData?.meta_keyword}
        ogImage={metaData && metaData?.image}
        pathName={currentURL}
      />
      <NewsDetails breakingNews={true} />
      <JsonLd data={metaData?.schema_markup} />
    </>
  )
}


let serverSidePropsFunction = null;
if (process.env.NEXT_PUBLIC_SEO === "true") {
  serverSidePropsFunction = async (context) => {
    const { req } = context; // Extract query and request object from context
    // console.log(req)
    const { params } = req[Symbol.for('NextInternalRequestMeta')].match;
    const language_code = params.langCode;
    const slugValue = params.slug;
    const currentURL = `${process.env.NEXT_PUBLIC_WEB_URL}/${params.langCode}/breaking-news/${slugValue}`;
    const seoData = await fetchDataFromSeo(slugValue, language_code);
    return {
      props: {
        seoData,
        currentURL,
      },
    };
  };
}


export default Index
