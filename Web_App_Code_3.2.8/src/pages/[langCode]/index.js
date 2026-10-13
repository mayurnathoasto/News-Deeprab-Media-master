import axios from "axios";
import dynamic from "next/dynamic";
import Meta from "@/components/commonComponents/seo/Meta.jsx";
import generateRssFeed from "../api/rss.js";
import { GET_SETTINGS, GET_RSS_FEED } from "@/utils/api/api.js";
import { fetchMetaInfo } from "@/utils/fetchMetaInfo.js";
import JsonLd from "@/components/Schema/JsonLd.jsx";
const HomePage = dynamic(() => import('../../components/home/HomePage.jsx'), { ssr: false })

// This is settings api
const fetchSettings = async () => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_END_POINT}/${GET_SETTINGS}`
    )
    const data = response.data
    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
}

const fetchFeeds = async (language_code) => {
  try {

    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_END_POINT}/${GET_RSS_FEED}?language_code=${language_code}`
    )
    const dataResponse = data?.data;
    if (dataResponse) {
      await generateRssFeed(dataResponse);
    }

    return dataResponse
  } catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
}

export default function Home({ metadata, adsenseUrl }) {

  const adsenseURL = adsenseUrl;

  return (
    <>
      <Meta
        title={metadata && metadata?.title}
        description={metadata && metadata?.description}
        keywords={metadata && metadata?.keywords}
        ogImage={metadata && metadata?.image}
        pathName={metadata && metadata?.pathName}
      />

      <HomePage />

      {
        adsenseURL && adsenseURL !== null || adsenseURL && adsenseURL !== undefined || adsenseURL && adsenseURL?.length > 0 ?
          <script async src={adsenseURL}
            crossOrigin="anonymous"></script> : null
      }
      <JsonLd data={metadata && metadata?.schema} />
    </>
  );

}


let serverSidePropsFunction = null
if (process.env.NEXT_PUBLIC_SEO === 'true') {
  serverSidePropsFunction = async context => {
    // Retrieve the slug from the URL query parameters
    const { req } = context // Extract query and request object from context

    const currentURL = req[Symbol.for('NextInternalRequestMeta')].initURL
    const settingsData = await fetchSettings()

    const metadata = await fetchMetaInfo({
      pageType: 'home',
      langCode: settingsData?.data?.default_language?.code,
      currentURL: currentURL
    });

    const adsenseUrl = settingsData?.data?.web_setting?.google_adsense ? settingsData?.data?.web_setting?.google_adsense : null;

    if (settingsData) {
      const feeds = await fetchFeeds(settingsData?.data?.default_language?.code);
    }

    // Pass the fetched data as props to the page component
    return {
      props: {
        adsenseUrl,
        metadata,
      }
    }
  }
}
