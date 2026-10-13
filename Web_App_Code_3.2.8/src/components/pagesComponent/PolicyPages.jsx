'use client'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getPolicyPagesApi } from '@/utils/api/api.js'
import Layout from '../layout/Layout'
import Breadcrumb from '../breadcrumb/Breadcrumb'
import { currentLanguageSelector } from '../store/reducers/languageReducer'
import { translate } from '@/utils/translation'
import DetailPageSkeleton from '../skeletons/DetailPageSkeleton'
import RichTextContent from '../commonComponents/RichTextContent'

const PolicyPages = ({ privacyPolicyPage }) => {

  const [loading, setLoading] = useState(true)

  const [data, setData] = useState([])

  const currentLanguage = useSelector(currentLanguageSelector)


  const fetchPolicyPages = async () => {
    try {
      setLoading(true)
      const { data } = await getPolicyPagesApi.getPolicyPages({
        language_code: currentLanguage?.code,
      });

      if (!data?.error) {
        setData(data?.data)
      }
      else {
        console.log('error =>', data?.message)
        setData([])
      }
    } catch (error) {
      console.error('Error:', error);
      setData([])
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (currentLanguage?.code) {
      fetchPolicyPages()
    }
  }, [currentLanguage?.code])

  return (
    <Layout>
      <Breadcrumb secondElement={translate('policyPages')} thirdElement={privacyPolicyPage ? translate('priPolicy') : translate('termsandcondition')}
      />

      {
        loading ? <DetailPageSkeleton /> :

          <section className='morePagesSect container mt-8 md:mt-12 pb-1'>
            <RichTextContent content={privacyPolicyPage ? data?.privacy_policy?.page_content : data?.terms_policy?.page_content} />
          </section>
      }
    </Layout>
  )
}

export default PolicyPages