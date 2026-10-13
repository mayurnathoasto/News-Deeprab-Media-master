import { GET_WEB_SEO_PAGES } from '@/utils/api/api';
import axios from 'axios';

/**
 * Fetch SEO data from API
 * @param {string} pageType - The page type (e.g., 'live_streaming_news', 'home', etc.)
 * @param {string} language_code - Language code (e.g., 'en', 'ar')
 * @returns {Promise<Object|null>} SEO data or null on error
 */
const fetchSeoData = async (pageType, language_code) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_END_POINT}/${GET_WEB_SEO_PAGES}?type=${pageType}&language_code=${language_code}`
    )
    const data = response.data
    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
}

/**
 * Generate metadata object for Meta component
 * Fetches SEO settings from the API and returns formatted metadata
 * @param {Object} params - Parameters for generating metadata
 * @param {string} params.pageType - Page type (e.g., 'live_streaming_news', 'home', 'breaking_news')
 * @param {string} params.langCode - Language code (default: 'en')
 * @param {string} params.currentURL - Current page URL
 * @param {string} params.fallbackTitle - Fallback title if no SEO data
 * @param {string} params.fallbackDescription - Fallback description if no SEO data
 * @param {string} params.fallbackKeywords - Fallback keywords if no SEO data
 * @returns {Promise<Object>} Metadata object with title, description, keywords, ogImage, pathName, schema
 * 
 * Example usage in getServerSideProps:
 * 
 * export const getServerSideProps = async (context) => {
 *   const { req } = context;
 *   const { language_code } = req[Symbol.for('NextInternalRequestMeta')].initQuery;
 *   const currentURL = process.env.NEXT_PUBLIC_WEB_URL + `/${language_code}/live-news/`;
 * 
 *   const metadata = await generateMetaInfo({ 
 *     pageType: 'live_streaming_news', 
 *     langCode: language_code,
 *     currentURL: currentURL
 *   });
 * 
 *   return {
 *     props: {
 *       metadata
 *     }
 *   };
 * };
 * 
 * // Then in your component:
 * const Index = ({ metadata }) => {
 *   return (
 *     <>
 *       <Meta
 *         title={metadata.title}
 *         description={metadata.description}
 *         keywords={metadata.keywords}
 *         ogImage={metadata.ogImage}
 *         pathName={metadata.pathName}
 *         schema={metadata.schema}
 *       />
 *       <LiveNews />
 *     </>
 *   );
 * };
 */
export async function fetchMetaInfo(params) {
  const {
    pageType,
    langCode = 'en',
    currentURL,
    fallbackTitle = process.env.NEXT_PUBLIC_TITLE || 'Default Title',
    fallbackDescription = process.env.NEXT_PUBLIC_DESCRIPTION || 'Default Description',
    fallbackKeywords = process.env.NEXT_PUBLIC_META_KEYWORD || 'default, keywords'
  } = params;

  try {
    // Fetch SEO data from API
    const seoData = await fetchSeoData(pageType, langCode);

    // Extract metadata from response
    const metaData = seoData && seoData?.data?.data[0];

    // Return metadata object (sanitize undefined → null for Next.js serialization)
    const metadata = {
      title: metaData?.meta_title || fallbackTitle,
      description: metaData?.meta_description || fallbackDescription,
      keywords: metaData?.meta_keyword || fallbackKeywords,
      ogImage: metaData?.og_image || null,
      pathName: currentURL,
      schema: metaData?.schema_markup
    };
    return Object.fromEntries(
      Object.entries(metadata).map(([k, v]) => [k, v === undefined ? null : v])
    );

  } catch (error) {
    console.error(`Error generating metadata for page type "${pageType}":`, error);

    // Return fallback metadata on error
    return {
      title: fallbackTitle,
      description: fallbackDescription,
      keywords: fallbackKeywords,
      ogImage: null,
      pathName: currentURL,
      schema: null
    };
  }
}

/**
 * Get schema markup (JSON-LD) for any page using SEO settings from API
 * Fetches SEO settings and parses the schema_markup string
 * Returns parsed schema markup that can be used with Meta component
 * @param {Object} params - Parameters for fetching schema markup
 * @param {string} params.pageType - Page type (e.g., 'live_streaming_news', 'home')
 * @param {string} params.langCode - Language code (default: 'en')
 * @returns {Promise<Object|null>} Parsed schema markup object or null
 * 
 * Example usage:
 * const schemaMarkup = await getSchemaMarkup({ pageType: 'live_streaming_news', langCode: 'en' });
 */
export async function getSchemaMarkup(params) {
  const {
    pageType,
    langCode = 'en'
  } = params;

  try {
    // Fetch SEO data from API
    const seoData = await fetchSeoData(pageType, langCode);

    // Extract metadata from response
    const metaData = seoData && seoData?.data?.data[0];

    // Parse schema markup if available
    if (metaData && metaData.schema_markup) {
      const schemaString = metaData.schema_markup;
      const schema = schemaString;
      return schema;
    }

    // No schema markup available
    return null;

  } catch (error) {
    console.error(`Error fetching schema markup for page type "${pageType}":`, error);
    return null;
  }
}
