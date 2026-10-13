import Image from 'next/image';
import Link from 'next/link';
import { FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FiFacebook } from 'react-icons/fi';
import { MdList, MdOutlineGridView } from 'react-icons/md';
import { LiaTelegram } from "react-icons/lia";
import AuthorCardSkeleton from '@/components/skeletons/AuthorCardSkeleton';
import { translate } from '@/utils/translation';
import { placeholderImage } from '@/utils/helpers';

const AuthorCard = ({ authorDetails, viewType, setViewType, isLoading = false }) => {
    if (isLoading) {
        return <AuthorCardSkeleton />
    }

    return (
        <div className='flex flex-col gap-8'>
            <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-semibold textPrimary'>{translate('author')}</h2>
                <div className='flex gap-2.5'>
                    <button
                        className={`rounded p-3 ${viewType === "grid" ? "border bg-[#1B2D511A] dark:bg-white/10 dark:border-white dark:border-opacity-10 secondaryBorder border-opacity-10" : ""}`}
                        onClick={() => setViewType('grid')}
                    >
                        <MdOutlineGridView size={24} />
                    </button>
                    <button
                        className={`rounded p-3 ${viewType === "list" ? "border bg-[#1B2D511A] dark:bg-white/10 dark:border-white dark:border-opacity-10 secondaryBorder border-opacity-10" : ""}`}
                        onClick={() => setViewType('list')}
                    >
                        <MdList size={24} />
                    </button>
                </div>
            </div>
            <div className='commonBg rounded-2xl p-5 border borderColor flex flex-col gap-4'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full overflow-hidden'>
                        <img
                            src={authorDetails?.profile || ""}
                            alt={authorDetails?.name}
                            className='w-10 h-10 object-cover'
                            onError={placeholderImage}
                        />
                    </div>
                    <div className='flex flex-col justify-center gap-1'>
                        <h3 className='text-sm font-medium textPrimary opacity-[79%]'>{translate('author')}</h3>
                        <p className='text-base textPrimary font-semibold'>{authorDetails?.name}</p>
                    </div>
                </div>

                {
                    authorDetails?.author?.bio &&
                    <div className='secondaryText opacity-80 border-t borderColor pt-4'>
                        {authorDetails?.author?.bio}
                    </div>
                }
                {
                    authorDetails?.author?.telegram_link || authorDetails?.author?.facebook_link || authorDetails?.author?.whatsapp_link || authorDetails?.author?.linkedin_link ?
                        <div className='flex flex-col md:flex-row items-center gap-4 border-t borderColor pt-4'>
                            <div className="font-normal text-base secondaryText opacity-80">{translate('followMe')} :</div>
                            <div className='flex gap-2 items-center'>
                                {authorDetails?.author?.telegram_link && (
                                    <Link href={authorDetails?.author?.telegram_link} className="w-10 h-10 rounded-full bg-[#1B2D511A] dark:bg-white/10 flex items-center justify-center cursor-pointer" target='_blank'>
                                        <LiaTelegram size={22} />
                                    </Link>
                                )}
                                {authorDetails?.author?.facebook_link && (
                                    <Link href={authorDetails?.author?.facebook_link} className="w-10 h-10 rounded-full bg-[#1B2D511A] dark:bg-white/10 flex items-center justify-center cursor-pointer" target='_blank'>
                                        <FiFacebook size={22} />
                                    </Link>
                                )}
                                {authorDetails?.author?.whatsapp_link && (
                                    <Link href={authorDetails?.author?.whatsapp_link} className="w-10 h-10 rounded-full bg-[#1B2D511A] dark:bg-white/10 flex items-center justify-center cursor-pointer" target='_blank'>
                                        <FaWhatsapp size={22} />
                                    </Link>
                                )}
                                {authorDetails?.author?.linkedin_link && (
                                    <Link href={authorDetails?.author?.linkedin_link} className="w-10 h-10 rounded-full bg-[#1B2D511A] dark:bg-white/10 flex items-center justify-center cursor-pointer" target='_blank'>
                                        <FaLinkedin size={22} />
                                    </Link>
                                )}
                            </div>
                        </div>
                        : null
                }
            </div>
        </div>
    )
}

export default AuthorCard
