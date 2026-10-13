import axios from 'axios'
import dynamic from 'next/dynamic'
import Meta from '@/components/commonComponents/seo/Meta.jsx'
import { GET_VIDEO } from '../../../utils/api/api.js'
import JsonLd from '@/components/Schema/JsonLd.jsx'
const VideoDetail = dynamic(() => import('@/components/pagesComponent/video-news/VideoDetail'), { ssr: false })

// This is seo api
const fetchDataFromSeo = async (id, language_code) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_END_POINT}/${GET_VIDEO}?language_code=${language_code}&slug=${id}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

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
      <VideoDetail />
      <JsonLd data={metaData && metaData?.schema_markup} />
    </>
  );
}

let serverSidePropsFunction = null;
if (process.env.NEXT_PUBLIC_SEO === "true") {
  serverSidePropsFunction = async (context) => {
    const { req } = context; // Extract query and request object from context
    // console.log(req)
    const { params } = req[Symbol.for('NextInternalRequestMeta')].match;
    // Accessing the slug property
    // const currentURL = req[Symbol.for('NextInternalRequestMeta')].__NEXT_INIT_URL;
    const slugValue = params.slug;
    const language_code = params.langCode
    const currentURL = `${process.env.NEXT_PUBLIC_WEB_URL}/${params.langCode}/video-news/${slugValue}`;
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
