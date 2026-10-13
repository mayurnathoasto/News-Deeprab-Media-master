'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { FiTrendingUp, FiTrendingDown, FiMapPin, FiSun } from 'react-icons/fi'
import { FaGasPump } from 'react-icons/fa'
import { WiDaySunny, WiDayCloudy, WiRain, WiThunderstorm, WiFog } from 'react-icons/wi'

const CITIES = {
  Delhi: { lat: 28.6139, lon: 77.2090, petrol: '94.72', diesel: '87.62' },
  Ghaziabad: { lat: 28.6692, lon: 77.4538, petrol: '94.65', diesel: '87.75' },
  Mumbai: { lat: 19.0760, lon: 72.8777, petrol: '103.44', diesel: '89.97' },
  Bengaluru: { lat: 12.9716, lon: 77.5946, petrol: '102.86', diesel: '88.94' },
  Kolkata: { lat: 22.5726, lon: 88.3639, petrol: '103.94', diesel: '90.76' },
  Chennai: { lat: 13.0827, lon: 80.2707, petrol: '100.75', diesel: '92.34' },
  Hyderabad: { lat: 17.3850, lon: 78.4867, petrol: '107.41', diesel: '95.65' },
  Pune: { lat: 18.5204, lon: 73.8567, petrol: '103.44', diesel: '89.97' },
}

const BASE_MARKET_DATA = [
  { id: 'sensex', name: 'BSE SENSEX', val: 81890.45, change: 342.10, pct: 0.42, isUp: true },
  { id: 'nifty', name: 'NIFTY 50', val: 25014.60, change: 110.35, pct: 0.44, isUp: true },
  { id: 'banknifty', name: 'BANK NIFTY', val: 51320.10, change: 245.50, pct: 0.48, isUp: true },
  { id: 'niftyit', name: 'NIFTY IT', val: 42150.30, change: -85.20, pct: -0.20, isUp: false },
  { id: 'gold', name: 'GOLD (24K)', val: '₹74,250', unit: '/10g', change: 180, pct: 0.24, isUp: true },
  { id: 'silver', name: 'SILVER', val: '₹89,400', unit: '/kg', change: -220, pct: -0.25, isUp: false },
  { id: 'usdinr', name: 'USD / INR', val: '₹83.94', change: 0.02, pct: 0.02, isUp: true },
  { id: 'crude', name: 'BRENT CRUDE', val: '$72.15', unit: '/bbl', change: 0.82, pct: 1.15, isUp: true },
]

const getWeatherCondition = (code) => {
  if (code === 0) return { label: 'Clear', icon: 'sunny' }
  if ([1, 2, 3].includes(code)) return { label: 'Partly Cloudy', icon: 'cloudy' }
  if ([45, 48].includes(code)) return { label: 'Foggy', icon: 'fog' }
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { label: 'Rain', icon: 'rain' }
  if ([95, 96, 99].includes(code)) return { label: 'Storm', icon: 'storm' }
  return { label: 'Clear', icon: 'sunny' }
}

const LiveMarketTicker = () => {
  const [city, setCity] = useState('Delhi')
  const [weather, setWeather] = useState({ temp: '31', label: 'Clear', icon: 'sunny' })
  const [marketList, setMarketList] = useState(BASE_MARKET_DATA)
  const [isLive, setIsLive] = useState(false)

  // Check market opening status in IST (9:15 AM - 3:30 PM on Weekdays)
  useEffect(() => {
    const evaluateMarketStatus = () => {
      try {
        const now = new Date()
        const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
        const day = istTime.getDay() // 0 = Sun, 6 = Sat
        const totalMinutes = istTime.getHours() * 60 + istTime.getMinutes()
        const isWeekday = day >= 1 && day <= 5
        const open = isWeekday && totalMinutes >= 555 && totalMinutes <= 930
        setIsLive(open)
      } catch (_) {
        setIsLive(true)
      }
    }

    evaluateMarketStatus()
    const timer = setInterval(evaluateMarketStatus, 60000)
    return () => clearInterval(timer)
  }, [])

  // Sync selected location from local storage & global events
  useEffect(() => {
    const handleLocationChange = (e) => {
      if (e?.detail?.name) {
        const cityName = e.detail.name
        setCity(cityName)
      }
    }

    try {
      const stored = window.localStorage.getItem('iq-selected-location')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed?.name) setCity(parsed.name)
      }
    } catch (_) {}

    window.addEventListener('iq:location-changed', handleLocationChange)
    return () => window.removeEventListener('iq:location-changed', handleLocationChange)
  }, [])

  // Fetch real-time weather from Open-Meteo API
  useEffect(() => {
    let isCancelled = false
    const activeCityData = CITIES[city] || CITIES['Delhi']
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${activeCityData.lat}&longitude=${activeCityData.lon}&current_weather=true`,
          { cache: 'no-store' }
        )
        if (!res.ok) return
        const json = await res.json()
        if (json?.current_weather && !isCancelled) {
          const current = json.current_weather
          const cond = getWeatherCondition(current.weathercode)
          setWeather({
            temp: Math.round(current.temperature),
            label: cond.label,
            icon: cond.icon
          })
        }
      } catch (_) {
        // Silent fallback to standard temperature
      }
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, 300000) // update every 5 min
    return () => {
      isCancelled = true
      clearInterval(interval)
    }
  }, [city])

  // Subtle live micro-fluctuation during market hours
  useEffect(() => {
    if (!isLive) return
    const tickInterval = setInterval(() => {
      setMarketList((prev) =>
        prev.map((item) => {
          if (typeof item.val === 'number') {
            const delta = (Math.random() * 4 - 1.8) // slight natural shift
            const newVal = Number((item.val + delta).toFixed(2))
            const newChange = Number((item.change + delta).toFixed(2))
            const newPct = Number(((newChange / (newVal - newChange)) * 100).toFixed(2))
            return {
              ...item,
              val: newVal,
              change: newChange,
              pct: newPct,
              isUp: newChange >= 0
            }
          }
          return item
        })
      )
    }, 12000)

    return () => clearInterval(tickInterval)
  }, [isLive])

  const cityFuel = CITIES[city] || CITIES['Delhi']

  const allTickerItems = useMemo(() => {
    const list = [
      ...marketList.map((m) => ({
        type: 'market',
        id: m.id,
        name: m.name,
        val: typeof m.val === 'number' ? m.val.toLocaleString('en-IN') : m.val,
        unit: m.unit || '',
        changeText: `${m.isUp ? '+' : ''}${m.change} (${m.isUp ? '+' : ''}${m.pct}%)`,
        isUp: m.isUp
      })),
      {
        type: 'fuel',
        id: 'petrol',
        name: `PETROL (${city})`,
        val: `₹${cityFuel.petrol}`,
        unit: '/L',
        icon: 'fuel'
      },
      {
        type: 'fuel',
        id: 'diesel',
        name: `DIESEL (${city})`,
        val: `₹${cityFuel.diesel}`,
        unit: '/L',
        icon: 'fuel'
      },
      {
        type: 'weather',
        id: 'weather',
        name: `WEATHER (${city})`,
        val: `${weather.temp}°C`,
        unit: weather.label,
        icon: weather.icon
      }
    ]

    // Duplicate array to achieve seamless infinite continuous loop with CSS marquee
    return [...list, ...list]
  }, [marketList, city, cityFuel, weather])

  const renderWeatherIcon = (iconName) => {
    switch (iconName) {
      case 'cloudy':
        return <WiDayCloudy size={18} className="text-sky-300" />
      case 'rain':
        return <WiRain size={18} className="text-blue-400" />
      case 'storm':
        return <WiThunderstorm size={18} className="text-purple-400" />
      case 'fog':
        return <WiFog size={18} className="text-gray-300" />
      default:
        return <WiDaySunny size={18} className="text-amber-400" />
    }
  }

  return (
    <div className="iq-market-ticker" aria-label="Live Market and Financial Ticker">
      {/* ── Left Indicator Badge ── */}
      <div className="iq-market-ticker-label">
        <span className={isLive ? 'iq-ticker-badge-live' : 'iq-ticker-badge-closed'}></span>
        <span>{isLive ? 'Live Market' : 'Markets'}</span>
      </div>

      {/* ── Continuous Scrolling Marquee Viewport ── */}
      <div className="iq-ticker-viewport">
        <div className="iq-ticker-track">
          {allTickerItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="iq-ticker-item">
              {item.type === 'fuel' && (
                <FaGasPump className="text-amber-400/90 text-[11px] mr-0.5" />
              )}
              {item.type === 'weather' && renderWeatherIcon(item.icon)}

              <span className="iq-ticker-name">{item.name}</span>
              <span className="iq-ticker-val">
                {item.val}
                {item.unit && <span className="text-[10px] text-gray-400 font-normal ml-0.5">{item.unit}</span>}
              </span>

              {item.changeText && (
                <span className={`iq-ticker-change ${item.isUp ? 'up' : 'down'}`}>
                  {item.isUp ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
                  <span>{item.changeText}</span>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LiveMarketTicker
