import Meta from '@/components/commonComponents/seo/Meta.jsx';
import JsonLd from '@/components/Schema/JsonLd.jsx';
import { GET_FEATURE_SECTION } from '@/utils/api/api';
import axios from 'axios'
import dynamic from 'next/dynamic'

const ViewAll = dynamic(() => import('../../../components/pagesComponent/viewAll/ViewAll.jsx'), { ssr: false })

// This is seo api
const fetchDataFromSeo = async (slugValue, langCode) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_END_POINT}/${GET_FEATURE_SECTION}?language_code=${langCode}&slug=${slugValue}`);
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
        ogImage={metaData && metaData?.og_image}
        pathName={currentURL}
      />
      <ViewAll />
      <JsonLd data={metaData && metaData?.schema_markup} />
    </>
  )
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
    const langCode = params.langCode
    const currentURL = process.env.NEXT_PUBLIC_WEB_URL + `/${langCode}/view-all/` + slugValue + '/';
    const seoData = await fetchDataFromSeo(slugValue, langCode);

    return {
      props: {
        seoData,
        currentURL,
      },
    };
  };
}


export default Index
