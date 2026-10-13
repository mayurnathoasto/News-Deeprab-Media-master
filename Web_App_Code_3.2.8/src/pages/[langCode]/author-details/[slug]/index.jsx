import Meta from '@/components/commonComponents/seo/Meta'
import dynamic from 'next/dynamic'
const AuthorDetailsPage = dynamic(() => import('@/components/pagesComponent/AuthorDetailsPage'), { ssr: false })

const index = () => {
    return (
        <>
            <Meta
                title={""}
                description={""}
                keywords={""}
                ogImage={""}
                pathName={""}
            />
            <AuthorDetailsPage />
        </>
    )
}

export default index
