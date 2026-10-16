'use client'

import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { FiChevronDown, FiCheck } from 'react-icons/fi'
import { currentLangCode, defaultLanguageCode, isLogin } from '@/utils/helpers'
import { userDataSelector } from '../store/reducers/userReducer'
import LocationSelector from '../location/LocationSelector'

const ThemeToggler = dynamic(() => import('./ThemeToggler'), { ssr: false })
const LanguageDropdown = dynamic(() => import('../dropdowns/LanguageDropdown'), { ssr: false })
const LoginModal = dynamic(() => import('../auth/LoginModal'), { ssr: false })

const EDITIONS = [
  { code: 'IN', label: 'India Edition', region: 'National & Regional Coverage' },
  { code: 'GL', label: 'Global Edition', region: 'International Breaking News' },
  { code: 'US', label: 'US Edition', region: 'North America & World' },
]

const TopBar = ({ setMorePagesOffset, setIsLoadMorePages }) => {
  const currLangCode = currentLangCode() || defaultLanguageCode() || 'en'
  const userData = useSelector(userDataSelector)
  const [selectedEdition, setSelectedEdition] = useState('IN')
  const [isEditionOpen, setIsEditionOpen] = useState(false)
  const editionRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEdition = localStorage.getItem('iq_selected_edition')
      if (savedEdition) setSelectedEdition(savedEdition)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editionRef.current && !editionRef.current.contains(event.target)) {
        setIsEditionOpen(false)
      }
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsEditionOpen(false)
      }
    }

    if (isEditionOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isEditionOpen])

  const handleSelectEdition = (code) => {
    setSelectedEdition(code)
    setIsEditionOpen(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('iq_selected_edition', code)
    }
  }

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
          <div className="relative" ref={editionRef}>
            <button
              type="button"
              className="iq-utility-control"
              onClick={() => setIsEditionOpen(!isEditionOpen)}
              aria-expanded={isEditionOpen}
              aria-haspopup="listbox"
              aria-label="Select Edition"
            >
              <span>Edition</span>
              <strong>{selectedEdition}</strong>
              <FiChevronDown
                aria-hidden="true"
                className={`transition-transform duration-200 ${isEditionOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isEditionOpen && (
              <div
                role="listbox"
                className="absolute left-0 mt-2 w-64 rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                  Select Edition
                </div>
                {EDITIONS.map((item) => {
                  const isSelected = item.code === selectedEdition
                  return (
                    <button
                      key={item.code}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelectEdition(item.code)}
                      className={`w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors ${
                        isSelected ? 'bg-red-50/50 dark:bg-red-900/10' : ''
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${isSelected ? 'text-[#af2c2c]' : 'text-gray-900 dark:text-white'}`}>
                            {item.label}
                          </span>
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            {item.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                          {item.region}
                        </p>
                      </div>
                      {isSelected && <FiCheck className="text-[#af2c2c] shrink-0" size={16} />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

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
