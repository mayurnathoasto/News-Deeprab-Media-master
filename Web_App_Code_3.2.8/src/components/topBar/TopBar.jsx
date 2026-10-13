'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { FiChevronDown } from 'react-icons/fi'
import { currentLangCode, defaultLanguageCode, isLogin } from '@/utils/helpers'
import { userDataSelector } from '../store/reducers/userReducer'
import LocationSelector from '../location/LocationSelector'

const ThemeToggler = dynamic(() => import('./ThemeToggler'), { ssr: false })
const LanguageDropdown = dynamic(() => import('../dropdowns/LanguageDropdown'), { ssr: false })
const LoginModal = dynamic(() => import('../auth/LoginModal'), { ssr: false })

const TopBar = ({ setMorePagesOffset, setIsLoadMorePages }) => {
  const currLangCode = currentLangCode() || defaultLanguageCode() || 'en'
  const userData = useSelector(userDataSelector)
  const now = new Date()
  const dateLabel = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }).format(now)
  const timeLabel = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  }).format(now)
  const userLabel = userData?.data?.name || userData?.data?.email || 'My Account'

  const openSubscriptionPrompt = () => {
    window.dispatchEvent(new CustomEvent('iq:open-notification-prompt'))
  }

  return (
    <div className="iq-utility-bar">
      <div className="container iq-utility-inner">
        <div className="iq-utility-left">
          <button type="button" className="iq-utility-control">
            <span>Edition</span>
            <strong>IN</strong>
            <FiChevronDown aria-hidden="true" />
          </button>
          <div className="iq-language-control">
            <LanguageDropdown
              setMorePagesOffset={setMorePagesOffset}
              setIsLoadMorePages={setIsLoadMorePages}
            />
          </div>
          <span className="iq-date-time">{dateLabel} | Updated {timeLabel} IST</span>
          <LocationSelector />
        </div>

        <div className="iq-utility-actions">
          <ThemeToggler />
          <Link href={`/${currLangCode}/enews`} className="iq-outline-action">E News</Link>
          <button type="button" className="iq-solid-action" onClick={openSubscriptionPrompt}>Subscribe to Us</button>
          {isLogin() ? (
            <Link href={`/${currLangCode}/profile-update`} className="iq-signin-link">{userLabel}</Link>
          ) : (
            <div className="iq-top-login"><LoginModal /></div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TopBar
