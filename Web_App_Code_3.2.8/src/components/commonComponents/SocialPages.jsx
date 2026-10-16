'use client'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { morePagesSelector } from '../store/reducers/morePagesReducer'
import Layout from '../layout/Layout'
import Breadcrumb from '../breadcrumb/Breadcrumb'
import { useRouter } from 'next/router'
import DetailPageSkeleton from '../skeletons/DetailPageSkeleton'
import { translate } from '@/utils/translation';
import RichTextContent from './RichTextContent'
import NoDataFound from './NoDataFound'
import toast from 'react-hot-toast'

const SocialPages = () => {

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const router = useRouter();
    const slug = router?.query?.slug;
    const translatedSlug = slug && slug === 'about-us' ? translate('aboutus') : slug === 'contact-us' ? translate('contactus') : slug


    const pageData = useSelector(morePagesSelector)

    useEffect(() => {
        if (slug && pageData?.length > 0) {
            // Find the page object with matching slug
            const page = pageData.find(page => page.slug === slug)
            // If a matching page is found, set its data
            if (page) {
                setData([page])
                setLoading(false)
            } else {
                // If no matching page is found, handle accordingly (e.g., show a not found message)
                setLoading(false)
                setData([])
            }
        }
    }, [slug, pageData])

    useEffect(() => {
        // console.log('dataPagesMore =>', data)
    }, [data])

    const isAboutUs = slug === 'about-us' || (router && router.asPath && router.asPath.includes('about-us'))
    const isContactUs = slug === 'contact-us' || (router && router.asPath && router.asPath.includes('contact-us'))

    return (
        <Layout>
            <Breadcrumb secondElement={translatedSlug} />
            {
                loading ? <DetailPageSkeleton />
                    :
                    <section className='morePagesSect container mt-8 md:mt-12 pb-10'>
                        {
                            isAboutUs ? (
                                <div className="about-us-container">
                                    {/* Hero Section */}
                                    <div className="relative w-full h-[300px] md:h-[450px] rounded-xl overflow-hidden mb-12 shadow-md">
                                        <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop" alt="News Room" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-center p-6">
                                            <div>
                                                <h1 className="text-white text-3xl md:text-5xl font-[900] tracking-wider uppercase mb-4" style={{ fontFamily: "var(--headline-font-family)" }}>About Deeprab Media</h1>
                                                <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto">Delivering truth, integrity, and the latest news from around the world straight to your screen.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mission Statement */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                                        <div>
                                            <div className="flex items-center mb-4 border-b-2 border-gray-900 pb-2 inline-flex">
                                                <span className="bg-[#af2c2c] w-2 h-8 mr-3 block"></span>
                                                <h2 className="text-2xl md:text-3xl font-[800] uppercase tracking-wider text-gray-900 dark:text-white" style={{ fontFamily: "var(--headline-font-family)" }}>Our Mission</h2>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-4">
                                                At Deeprab Media, we believe that an informed society is a powerful society. Our mission is to provide accurate, unbiased, and timely news that matters to you.
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                                From breaking global events to local stories that shape our community, our dedicated team of journalists works round the clock to ensure you stay ahead of the curve.
                                            </p>
                                        </div>
                                        <div className="rounded-xl overflow-hidden shadow-sm h-[300px]">
                                            <img src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=800&auto=format&fit=crop" alt="Journalism" className="w-full h-full object-cover" />
                                        </div>
                                    </div>

                                    {/* Editorial Values Section */}
                                    <div className="mt-16">
                                        <div className="flex items-center mb-8 border-b-2 border-gray-900 pb-2">
                                            <span className="bg-[#af2c2c] w-2 h-8 mr-3 block"></span>
                                            <h2 className="text-2xl md:text-3xl font-[800] uppercase tracking-wider text-gray-900 dark:text-white" style={{ fontFamily: "var(--headline-font-family)" }}>Our Editorial Principles</h2>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                            {[
                                                { title: "Journalistic Integrity", desc: "Upholding the highest ethical standards of truth, balance, and independence in every story we publish.", icon: "⚖️" },
                                                { title: "Fact-Checked Accuracy", desc: "Rigorous verification procedures and multi-source confirmation before any report goes live.", icon: "🔍" },
                                                { title: "Public Interest Focus", desc: "Committed to highlighting matters that impact society, holding power accountable with transparency.", icon: "🌍" },
                                                { title: "Unbiased Coverage", desc: "Delivering objective news without political, commercial, or partisan influence.", icon: "📰" }
                                            ].map((value, i) => (
                                                <div key={i} className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
                                                    <div className="text-3xl mb-3">{value.icon}</div>
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "var(--headline-font-family)" }}>{value.title}</h3>
                                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{value.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Fallback to original content if it exists in DB */}
                                    {data[0]?.page_content && (
                                        <div className="mt-16 pt-8 border-t dark:border-gray-800">
                                            <RichTextContent content={data[0]?.page_content} />
                                        </div>
                                    )}
                                </div>

                            ) : isContactUs ? (
                                <div className="contact-us-container">

                                    {/* Hero Banner */}
                                    <div className="relative w-full h-[260px] md:h-[380px] rounded-2xl overflow-hidden mb-14 shadow-lg">
                                        <img
                                            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=1200&auto=format&fit=crop"
                                            alt="Contact Us"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center text-center p-6" style={{ background: 'linear-gradient(135deg, rgba(175,44,44,0.85) 0%, rgba(10,10,30,0.80) 100%)' }}>
                                            <div>
                                                <h1 className="text-white text-3xl md:text-5xl font-[900] tracking-wider uppercase mb-3" style={{ fontFamily: "var(--headline-font-family)" }}>Get In Touch</h1>
                                                <p className="text-gray-200 text-base md:text-xl max-w-xl mx-auto leading-relaxed">We&apos;d love to hear from you. Our team is always here to help.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Cards Row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
                                        {[
                                            {
                                                icon: (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                ),
                                                title: "Our Office",
                                                detail: "SIPS Meerut, Vedviyas Puri"
                                            },
                                            {
                                                icon: (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                ),
                                                title: "Email Us",
                                                detail: "info@deeprab.com"
                                            },
                                            {
                                                icon: (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                ),
                                                title: "Call Us",
                                                detail: "+91 98765 43210\nMon–Sat, 9am – 6pm IST"
                                            }
                                        ].map((card, idx) => (
                                            <div key={idx} className="group flex flex-col items-center text-center p-8 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                                                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-white" style={{ background: 'linear-gradient(135deg, #af2c2c, #d94040)' }}>
                                                    {card.icon}
                                                </div>
                                                <h3 className="text-lg font-[800] uppercase tracking-wide text-gray-900 dark:text-white mb-3" style={{ fontFamily: "var(--headline-font-family)" }}>{card.title}</h3>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-line">{card.detail}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Contact Form + Sidebar */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

                                        {/* Form */}
                                        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-10">
                                            <div className="flex items-center mb-6">
                                                <span className="bg-[#af2c2c] w-1.5 h-7 mr-3 block rounded"></span>
                                                <h2 className="text-2xl font-[800] uppercase tracking-wider text-gray-900 dark:text-white" style={{ fontFamily: "var(--headline-font-family)" }}>Send Us a Message</h2>
                                            </div>
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    const form = e.target;
                                                    const name = form.elements['name']?.value?.trim();
                                                    const email = form.elements['email']?.value?.trim();
                                                    const message = form.elements['message']?.value?.trim();
                                                    if (!name || !email || !message) {
                                                        toast.error('Please fill in your name, email, and message.');
                                                        return;
                                                    }
                                                    form.reset();
                                                    toast.success('Thank you for reaching out! Your message has been sent to the Deeprab Media editorial desk.', {
                                                        duration: 5000
                                                    });
                                                }}
                                                className="space-y-5"
                                            >
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
                                                        <input
                                                            name="name"
                                                            required
                                                            type="text"
                                                            placeholder="John Doe"
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#af2c2c] focus:border-transparent transition text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address *</label>
                                                        <input
                                                            name="email"
                                                            required
                                                            type="email"
                                                            placeholder="john@example.com"
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#af2c2c] focus:border-transparent transition text-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                                                    <input
                                                        name="subject"
                                                        type="text"
                                                        placeholder="How can we help?"
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#af2c2c] focus:border-transparent transition text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Message *</label>
                                                    <textarea
                                                        name="message"
                                                        required
                                                        rows="5"
                                                        placeholder="Write your message here..."
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#af2c2c] focus:border-transparent transition text-sm resize-none"
                                                    ></textarea>
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="w-full py-3.5 rounded-xl text-white font-[700] uppercase tracking-widest text-sm transition-all duration-300 hover:opacity-90 hover:shadow-lg cursor-pointer"
                                                    style={{ background: 'linear-gradient(135deg, #af2c2c, #d94040)' }}
                                                >
                                                    Send Message →
                                                </button>
                                            </form>
                                        </div>

                                        {/* Sidebar */}
                                        <div className="flex flex-col gap-6">
                                            {/* Working Hours */}
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-7">
                                                <div className="flex items-center mb-5">
                                                    <span className="bg-[#af2c2c] w-1.5 h-6 mr-3 block rounded"></span>
                                                    <h3 className="text-base font-[800] uppercase tracking-wider text-gray-900 dark:text-white" style={{ fontFamily: "var(--headline-font-family)" }}>Working Hours</h3>
                                                </div>
                                                <ul className="space-y-3 text-sm">
                                                    {[
                                                        { day: "Monday – Friday", time: "9:00am – 6:00pm" },
                                                        { day: "Saturday", time: "10:00am – 4:00pm" },
                                                        { day: "Sunday", time: "Closed" }
                                                    ].map((item, i) => (
                                                        <li key={i} className="flex justify-between text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0 last:pb-0">
                                                            <span className="font-medium">{item.day}</span>
                                                            <span className={item.time === 'Closed' ? 'text-[#af2c2c] font-semibold' : ''}>{item.time}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Follow Us */}
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-7">
                                                <div className="flex items-center mb-5">
                                                    <span className="bg-[#af2c2c] w-1.5 h-6 mr-3 block rounded"></span>
                                                    <h3 className="text-base font-[800] uppercase tracking-wider text-gray-900 dark:text-white" style={{ fontFamily: "var(--headline-font-family)" }}>Follow Us</h3>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {[
                                                        { name: "Facebook", color: "#1877F2", icon: "f", url: "https://facebook.com" },
                                                        { name: "Twitter", color: "#1DA1F2", icon: "𝕏", url: "https://twitter.com" },
                                                        { name: "Instagram", color: "#E1306C", icon: "📷", url: "https://instagram.com" },
                                                        { name: "YouTube", color: "#FF0000", icon: "▶", url: "https://youtube.com" }
                                                    ].map((social, i) => (
                                                        <a
                                                            key={i}
                                                            href={social.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-white text-xs font-semibold transition-all duration-200 hover:opacity-85 hover:scale-105"
                                                            style={{ background: social.color }}
                                                        >
                                                            <span className="text-base leading-none">{social.icon}</span>
                                                            <span>{social.name}</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            ) : data[0]?.page_content ? (
                                <RichTextContent content={data[0]?.page_content} />
                            ) : (
                                <div>
                                    <NoDataFound />
                                </div>
                            )
                        }
                    </section>
            }
        </Layout>
    )
}

export default SocialPages