import axios from "axios";
import { GET_SETTINGS, getSettingsApi } from "@/utils/api/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Meta from "@/components/commonComponents/seo/Meta";
// import { useEffect } from "react";

// This is settings api
const fetchSettings = async () => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_END_POINT}/${GET_SETTINGS}`
    )

    // console.log('response =>', response)

    const data = response.data
    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
}

export default function Home({ defaultLangCode }) {

  const router = useRouter();
  const isRSS = router.asPath === "/rssfeed.xml";

  const [settingsData, setSettingsData] = useState(null);

  // console.log('defaultLangCode =>', defaultLangCode)

  const fetchSettings = async () => {
    try {
      const { data } = await getSettingsApi.getSettings({
        type: '',
      });
      if (!data?.error) {
        setSettingsData({ data: data?.data })
      }
      else {
        console.log("settings error =>", data?.message)
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const isSearchEngineBot = () => {
    if (typeof navigator === "undefined") return false;

    const botPatterns = [
      /googlebot/i,
      /bingbot/i,
      /slurp/i,
      /duckduckbot/i,
      /baiduspider/i,
      /yandexbot/i,
      /sogou/i,
      /exabot/i,
      /facebot/i,
      /ia_archiver/i,
    ];

    const ua = navigator.userAgent;
    return botPatterns.some(pattern => pattern.test(ua));
  };



  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SEO === 'false') {
      fetchSettings()
    }
  }, [])

  useEffect(() => {
    const defaultLanguageCode = settingsData && settingsData?.data?.default_language?.code;
    if (settingsData && process.env.NEXT_PUBLIC_SEO === 'false' && defaultLanguageCode !== null && defaultLanguageCode !== undefined) {
      router.replace(`/${defaultLanguageCode}`)
    }

    // console.log('settingsData =>', settingsData?.data?.default_language?.code)

  }, [settingsData])


  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SEO === 'true' && defaultLangCode && defaultLangCode !== null && defaultLangCode !== undefined) {
      router.replace(`/${defaultLangCode}`)
    }
  }, [defaultLangCode])

  return (
    <>
      <Meta
        title={process.env.NEXT_PUBLIC_TITLE}
        description={process.env.NEXT_PUBLIC_DESCRIPTION}
        keywords={process.env.NEXT_PUBLIC_kEYWORDS}
        pathName={`${process.env.NEXT_PUBLIC_WEB_URL}${router.asPath}`}
        schema={null}
      />
      <h1 className="sr-only hidden">{process.env.NEXT_PUBLIC_WEB_NAME}</h1>
    </>
  )

}


let serverSidePropsFunction = null
if (process.env.NEXT_PUBLIC_SEO === 'true') {
  serverSidePropsFunction = async context => {
    const { req } = context

    const settingsData = await fetchSettings();

    // Add fallback and validation
    let defaultLangCode = settingsData?.data?.default_language?.code;

    // For debugging - you can remove this later
    // console.log('defaultLangCode:', defaultLangCode);

    return {
      props: {
        defaultLangCode
      }
    }
  }
}
