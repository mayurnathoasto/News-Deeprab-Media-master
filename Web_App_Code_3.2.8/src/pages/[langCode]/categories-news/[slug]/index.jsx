import Meta from '@/components/commonComponents/seo/Meta.jsx'
import JsonLd from '@/components/Schema/JsonLd.jsx'
import { GET_CATEGORIES } from '@/utils/api/api.js'
import axios from 'axios'
import dynamic from 'next/dynamic'
const CategoryNews = dynamic(() => import('../../../../components/pagesComponent/category/CategoryNews.jsx'), { ssr: false })

// This is seo api
const fetchDataFromSeo = async (id, language_code) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_END_POINT}/${GET_CATEGORIES}?language_code=${language_code}&slug=${id}`);
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
      <CategoryNews />
      <JsonLd data={metaData && metaData?.schema_markup} />
    </>
  )
}

let serverSidePropsFunction = null;
if (process.env.NEXT_PUBLIC_SEO === "true") {
  serverSidePropsFunction = async (context) => {
    const { req } = context; // Extract query and request object from context
    const { params } = req[Symbol.for('NextInternalRequestMeta')].match;
    const slugValue = params.slug;
    const language_code = params.langCode
    const currentURL = `${process.env.NEXT_PUBLIC_WEB_URL}/${params.langCode}/categories-news/${slugValue}`;
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
