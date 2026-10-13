'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { FiMapPin, FiSearch, FiX } from 'react-icons/fi'
import { WiDayCloudy } from 'react-icons/wi'
import { getLocationApi } from '@/utils/api/api'

const DEFAULT_LOCATION = { name: 'Delhi', temperature: '31°C' }
const FALLBACK_LOCATIONS = [
  'Delhi',
  'Ghaziabad',
  'Mumbai',
  'Bengaluru',
  'Kolkata',
  'Chennai',
  'Hyderabad',
  'Pune'
].map((name) => ({ id: `fallback-${name.toLowerCase()}`, name, temperature: DEFAULT_LOCATION.temperature }))

const normalizeLocation = (item) => ({
  id: item?.id || item?.place_id || item?.description,
  name: item?.location_name || item?.description || item?.name || 'Delhi',
  temperature: item?.temperature || DEFAULT_LOCATION.temperature
})

const LocationSelector = ({ compact = false, showWeather = true, className = '' }) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [locations, setLocations] = useState([])
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(DEFAULT_LOCATION)
  const inputRef = useRef(null)
  const googleServiceRef = useRef(null)

  useEffect(() => {
    const stored = window.localStorage.getItem('iq-selected-location')
    if (stored) {
      try {
        setSelected({ ...DEFAULT_LOCATION, ...JSON.parse(stored) })
      } catch (_) {
        window.localStorage.removeItem('iq-selected-location')
      }
    }

    const syncLocation = (event) => setSelected(event.detail || DEFAULT_LOCATION)
    window.addEventListener('iq:location-changed', syncLocation)
    return () => window.removeEventListener('iq:location-changed', syncLocation)
  }, [])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)

    const loadLocations = async () => {
      setLoading(true)
      try {
        const { data } = await getLocationApi.getLocation({ limit: 1000 })
        const configuredLocations = (data?.data?.data || []).map(normalizeLocation)
        setLocations(configuredLocations.length ? configuredLocations : FALLBACK_LOCATIONS)
      } catch (_) {
        setLocations(FALLBACK_LOCATIONS)
      } finally {
        setLoading(false)
      }
    }

    loadLocations()
    requestAnimationFrame(() => inputRef.current?.focus())

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!open || !apiKey || typeof window === 'undefined') return

    const initialisePlaces = () => {
      if (window.google?.maps?.places?.AutocompleteService) {
        googleServiceRef.current = new window.google.maps.places.AutocompleteService()
      }
    }

    if (window.google?.maps?.places) {
      initialisePlaces()
      return
    }

    const existing = document.querySelector('script[data-iq-google-maps]')
    if (existing) {
      existing.addEventListener('load', initialisePlaces, { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`
    script.async = true
    script.dataset.iqGoogleMaps = 'true'
    script.addEventListener('load', initialisePlaces, { once: true })
    document.head.appendChild(script)
  }, [open])

  useEffect(() => {
    if (!query.trim() || !googleServiceRef.current) {
      setPlaces([])
      return
    }

    const timer = setTimeout(() => {
      googleServiceRef.current.getPlacePredictions(
        { input: query, componentRestrictions: { country: 'in' } },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setPlaces((predictions || []).map(normalizeLocation))
          } else {
            setPlaces([])
          }
        }
      )
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  const filteredLocations = useMemo(() => {
    if (!query.trim()) return locations.slice(0, 8)
    const needle = query.trim().toLowerCase()
    return locations.filter((item) => item.name.toLowerCase().includes(needle)).slice(0, 8)
  }, [locations, query])

  const suggestions = places.length ? places.slice(0, 8) : filteredLocations

  const chooseLocation = (location) => {
    const nextLocation = { ...DEFAULT_LOCATION, ...location }
    setSelected(nextLocation)
    window.localStorage.setItem('iq-selected-location', JSON.stringify(nextLocation))
    window.dispatchEvent(new CustomEvent('iq:location-changed', { detail: nextLocation }))
    setOpen(false)
    setQuery('')
  }

  return (
    <>
      <button
        type="button"
        className={`iq-location-control ${compact ? 'compact' : ''} ${className}`}
        aria-label={`Change location, currently ${selected.name}`}
        onClick={() => setOpen(true)}
      >
        <FiMapPin aria-hidden="true" />
        <span>{selected.name}</span>
        {showWeather && <WiDayCloudy aria-hidden="true" />}
        {showWeather && <strong>{selected.temperature}</strong>}
      </button>

      {open && (
        <div className="iq-location-overlay" role="presentation" onMouseDown={() => setOpen(false)}>
          <div
            className="iq-location-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="iq-location-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="iq-location-dialog-header">
              <div>
                <span>Location</span>
                <h2 id="iq-location-title">Choose your city</h2>
              </div>
              <button type="button" aria-label="Close location selector" onClick={() => setOpen(false)}>
                <FiX aria-hidden="true" />
              </button>
            </div>
            <label className="iq-location-search">
              <FiSearch aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search city or area"
                autoComplete="off"
              />
            </label>
            <div className="iq-location-results">
              {loading && !suggestions.length ? (
                <p>Loading locations...</p>
              ) : suggestions.length ? (
                suggestions.map((location) => (
                  <button type="button" key={location.id || location.name} onClick={() => chooseLocation(location)}>
                    <FiMapPin aria-hidden="true" />
                    <span>{location.name}</span>
                  </button>
                ))
              ) : (
                <p>No matching location found.</p>
              )}
            </div>
            {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
              <small>Search uses the locations configured in the IQ News admin panel.</small>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default LocationSelector
