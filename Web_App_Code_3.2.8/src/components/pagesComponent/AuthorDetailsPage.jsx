import Layout from '../layout/Layout'
import Breadcrumb from '../breadcrumb/Breadcrumb'
import { translate } from '@/utils/translation'
import AuthorDetails from '../author/AuthorDetails'

const AuthorDetailsPage = () => {
    return (
        <Layout>
            <Breadcrumb secondElement={translate("author")} />
            <section className="container mt-8 sm:mt-12">
                <AuthorDetails />
            </section>
        </Layout>
    )
}

export default AuthorDetailsPage
