'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiMail, FiSend, FiCheckCircle, FiLock } from 'react-icons/fi'
import toast from 'react-hot-toast'
import playstore from '../../assets/Images/playStore.svg'
import appleStore from '../../assets/Images/appleStore.svg'
import { placeholderImage } from '@/utils/helpers'
import { translate } from '@/utils/translation'

const NewsletterFooter = ({ settingsData }) => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('iq_newsletter_subscribed_email')
      if (savedEmail) {
        setIsSubscribed(true)
        setEmail(savedEmail)
      }
    } catch (_) {}
  }, [])

  const handleSubscribe = (e) => {
    e.preventDefault()
    setErrorMsg('')

    const trimmed = email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!trimmed || !emailRegex.test(trimmed)) {
      setErrorMsg('Please enter a valid email address.')
      return
    }

    setLoading(true)

    // Simulate swift network verification
    setTimeout(() => {
      try {
        localStorage.setItem('iq_newsletter_subscribed_email', trimmed)
        const allSubscribers = JSON.parse(localStorage.getItem('iq_newsletter_subscribers') || '[]')
        if (!allSubscribers.includes(trimmed)) {
          allSubscribers.push(trimmed)
          localStorage.setItem('iq_newsletter_subscribers', JSON.stringify(allSubscribers))
        }
      } catch (_) {}

      setLoading(false)
      setIsSubscribed(true)
      toast.success('Thank you for subscribing to Deeprab Media briefing!', {
        duration: 4000,
        position: 'bottom-right'
      })
    }, 500)
  }

  const handleReset = () => {
    try {
      localStorage.removeItem('iq_newsletter_subscribed_email')
    } catch (_) {}
    setIsSubscribed(false)
    setEmail('')
    setErrorMsg('')
  }

  const androidLink = settingsData?.data?.web_setting?.android_app_link
  const iosLink = settingsData?.data?.web_setting?.ios_app_link

  return (
    <div className="flex flex-col gap-4">
      <div>
        <span className="font-[700] text-[16px] capitalize tracking-wide text-white border-b border-white pb-1 inline-block">
          Newsletter
        </span>
      </div>

      <p className="text-[13.5px] text-gray-300 leading-relaxed">
        Stay updated with our daily morning briefing, breaking news alerts, and exclusive stories right in your inbox.
      </p>

      {isSubscribed ? (
        <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-4 flex flex-col gap-2.5 transition-all">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[14px]">
            <FiCheckCircle className="text-emerald-400 text-lg flex-shrink-0" />
            <span>You're subscribed!</span>
          </div>
          <p className="text-[12.5px] text-gray-300 break-all">
            Morning updates will be delivered to <strong className="text-white">{email}</strong>.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="text-[11.5px] text-gray-400 hover:text-white underline self-start transition-colors pt-1"
          >
            Change email / Unsubscribe
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5" noValidate>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <FiMail className="text-[16px]" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errorMsg) setErrorMsg('')
              }}
              placeholder="Enter your email address..."
              disabled={loading}
              className="w-full pl-10 pr-3.5 py-2.5 bg-white/10 hover:bg-white/[0.14] focus:bg-white/[0.16] border border-white/20 focus:border-red-500 rounded-lg text-white text-[13.5px] placeholder-gray-400 outline-none transition-all duration-200"
              aria-label="Email address for newsletter"
            />
          </div>

          {errorMsg && (
            <span className="text-red-400 text-[12px] font-medium pl-1">
              {errorMsg}
            </span>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#ee2934] hover:bg-[#d61f2a] active:scale-[0.99] text-white font-semibold text-[13.5px] py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-red-500/20 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <span>Subscribing...</span>
            ) : (
              <>
                <span>Subscribe Now</span>
                <FiSend className="text-[14px]" />
              </>
            )}
          </button>

          <div className="flex items-center gap-1.5 text-[11.5px] text-gray-400 pt-0.5">
            <FiLock className="text-[12px] flex-shrink-0" />
            <span>Zero spam. You can unsubscribe at any time.</span>
          </div>
        </form>
      )}

      {/* App Download Links (if available) */}
      {(androidLink || iosLink) && (
        <div className="flex flex-col gap-2.5 pt-3 border-t border-white/10">
          <span className="text-[13px] font-semibold text-gray-200">
            {translate('downloadapp') || 'Download App'}
          </span>
          <div className="flex items-center flex-wrap gap-2">
            {androidLink && (
              <Link href={androidLink} target="_blank" title="Download Android App">
                <Image
                  src={playstore}
                  alt="Play Store"
                  loading="lazy"
                  className="w-[125px] h-auto object-contain"
                  onError={placeholderImage}
                />
              </Link>
            )}
            {iosLink && (
              <Link href={iosLink} target="_blank" title="Download iOS App">
                <Image
                  src={appleStore}
                  alt="Apple Store"
                  loading="lazy"
                  className="w-[125px] h-auto object-contain"
                  onError={placeholderImage}
                />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NewsletterFooter
