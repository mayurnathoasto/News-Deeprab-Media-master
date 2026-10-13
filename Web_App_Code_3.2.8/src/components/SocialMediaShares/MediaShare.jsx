import React from 'react'
import { FacebookIcon, FacebookShareButton, TwitterShareButton, WhatsappIcon, WhatsappShareButton, XIcon } from 'react-share';
import { BsLink45Deg } from 'react-icons/bs';
import { translate } from '@/utils/translation';
import toast from 'react-hot-toast';

const MediaShare = ({ url, title, hashtag }) => {

    const currentUrl = new URL(url);

    // Construct the final URL
    const finalUrl = `${currentUrl.origin}${currentUrl.pathname}?share=true`;


    const handleCopyUrl = async (e) => {
        e.preventDefault();
        // Get the current URL from the router
        try {
            // Use the Clipboard API to copy the URL to the clipboard
            await navigator.clipboard.writeText(title + "\n\nVisit Website for more details : " + decodeURI(finalUrl));

            //await navigator.clipboard.writeText(decodeURI(finalUrl));
            toast.success(translate('urlCopied'));
        } catch (error) {
            console.error("Error copying to clipboard:", error);
        }
    };

    return (
        <div className='iq-media-share flex items-center gap-4'>
            <span className='textPrimary font-[600] uppercase'>{translate('shareLbl')}  :</span>
            <FacebookShareButton
                url={decodeURI(finalUrl)}
                title={title}
                hashtag={hashtag}
            >
                <FacebookIcon size={40} round />
            </FacebookShareButton>
            <WhatsappShareButton
                url={decodeURI(finalUrl)}
                title={title}
                hashtag={hashtag}
            >
                <WhatsappIcon size={40} round />
            </WhatsappShareButton>
            <TwitterShareButton
                url={decodeURI(finalUrl)}
                title={title}
                hashtag={hashtag}
            >
                <XIcon size={40} round />
            </TwitterShareButton>
            <button onClick={handleCopyUrl} className='primaryBg w-[40px] h-[40px] flexCenter text-white rounded-full'>
                <BsLink45Deg size={30} />
            </button>

        </div>
    )
}

export default MediaShare
