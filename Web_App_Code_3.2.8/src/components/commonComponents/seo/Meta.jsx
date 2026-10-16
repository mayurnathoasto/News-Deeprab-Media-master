import { settingsSelector } from '@/components/store/reducers/settingsReducer'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'

const Meta = ({ title, description, keywords, ogImage, pathName }) => {
  const router = useRouter();

  const settingsData = useSelector(settingsSelector);
  const favicon = settingsData?.data?.web_setting?.favicon_icon;
  const webName = settingsData?.data?.web_setting?.web_name || 'Deeprab Media';

  const baseUrl = (process.env.NEXT_PUBLIC_WEB_URL || 'https://deeprab.com').replace(/\/$/, '');

  // Ensure ogImage is always an absolute, fully qualified URL for WhatsApp, FB, Twitter crawlers
  const getAbsoluteImageUrl = (img) => {
    if (!img || typeof img !== 'string' || img.trim() === '') {
      return `${baseUrl}/storage/logos/deeprab-logo.svg`;
    }
    const cleanImg = img.trim();
    if (cleanImg.startsWith('http://') || cleanImg.startsWith('https://')) {
      return cleanImg;
    }
    const leadingSlash = cleanImg.startsWith('/') ? '' : '/';
    return `${baseUrl}${leadingSlash}${cleanImg}`;
  };

  const finalOgImage = getAbsoluteImageUrl(ogImage || settingsData?.data?.web_setting?.web_header_logo);
  const finalTitle = title ? `${title} - ${webName}` : (process.env.NEXT_PUBLIC_TITLE || webName);
  const finalDescription = description ? description : (process.env.NEXT_PUBLIC_DESCRIPTION || 'Deeprab Media - Latest breaking news, live updates, and stories.');
  const finalUrl = pathName ? (pathName.startsWith('http') ? pathName : `${baseUrl}${pathName.startsWith('/') ? '' : '/'}${pathName}`) : `${baseUrl}${router?.asPath || ''}`;

  return (
    <>
      <Head>
        {/* title */}
        <title>{title ? title : process.env.NEXT_PUBLIC_TITLE}</title>

        {/*<!-- Google / Search Engine Tags -->*/}
        <meta name='name' content={webName} />
        <meta name='description' content={finalDescription} />
        <meta name='keywords' content={keywords ? keywords : process.env.NEXT_PUBLIC_kEYWORDS} />
        <meta name='image' content={finalOgImage} />

        {/*<!-- Facebook & WhatsApp Open Graph Tags -->*/}
        <meta property='og:title' content={finalTitle} />
        <meta property='og:description' content={finalDescription} />
        <meta property='og:image' content={finalOgImage} />
        <meta property='og:image:secure_url' content={finalOgImage} />
        <meta property='og:image:width' content="1200" />
        <meta property='og:image:height' content="630" />
        <meta property='og:image:alt' content={title || webName} />
        <meta property='og:url' content={finalUrl} />
        <meta property='og:type' content='website' />
        <meta property='og:locale' content='en_US' />
        <meta property='og:site_name' content={webName} />

        {/*<!-- Twitter Meta Tags -->*/}
        <meta name='twitter:title' content={finalTitle} />
        <meta name='twitter:description' content={finalDescription} />
        <meta name='twitter:image' content={finalOgImage} />
        <meta name='twitter:card' content='summary_large_image' />

        {/* robot and cononical */}
        <link rel='canonical' href={finalUrl} />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta name='robots' content='index, follow,max-snippet:-1,max-video-preview:-1,max-image-preview:large' />

        {
          process?.env?.NEXT_PUBLIC_SEO === 'false' &&
          <link rel="icon" href={favicon && favicon ? favicon : '/favicon.png'} sizes="32x32" type="image/png" />
        }
      </Head>
    </>
  )
}

export default Meta