'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { FiBarChart2, FiCheckCircle } from 'react-icons/fi'
import { currentLanguageSelector } from '../store/reducers/languageReducer'
import { surveysApi } from '@/utils/api/api'

const getVoterKey = () => {
  const storageKey = 'iq-poll-voter-key'
  let key = window.localStorage.getItem(storageKey)
  if (!key) {
    key = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
    window.localStorage.setItem(storageKey, key)
  }
  return key
}

const PollCard = ({ compact = false }) => {
  const currentLanguage = useSelector(currentLanguageSelector)
  const [poll, setPoll] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState('')

  const voterKey = useMemo(() => (typeof window !== 'undefined' ? getVoterKey() : ''), [])

  const loadPoll = async () => {
    if (!currentLanguage?.code || !voterKey) return
    try {
      const { data } = await surveysApi.getQuestions({
        language_code: currentLanguage.code,
        voter_key: voterKey,
        limit: 1
      })
      const nextPoll = data?.data?.data?.[0] || null
      setPoll(nextPoll)
      setShowResults(Boolean(nextPoll?.has_voted))
    } catch (_) {
      setPoll(null)
    }
  }

  useEffect(() => {
    loadPoll()
  }, [currentLanguage?.code, voterKey])

  const submitVote = async () => {
    if (!selectedOption || !poll || submitting) {
      if (!selectedOption) setError('Choose an option before voting.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const { data } = await surveysApi.setQuestionsResultApi({
        language_code: currentLanguage.code,
        question_id: poll.id,
        option_id: selectedOption,
        voter_key: voterKey
      })
      if (data?.error) throw new Error(data.message)
      setPoll(data?.data || poll)
      setShowResults(true)
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.message || 'Unable to record your vote.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!poll) return null

  return (
    <aside className={`iq-poll-card ${compact ? 'compact' : ''}`} aria-label="Current poll">
      <div className="iq-poll-kicker"><FiBarChart2 aria-hidden="true" /> Deeprab Media Poll</div>
      <h3>{poll.question}</h3>
      <div className="iq-poll-options">
        {(poll.survey_options || []).map((option) => {
          const percentage = Number(option.percentage || 0)
          if (showResults) {
            return (
              <div className="iq-poll-result" key={option.id}>
                <div><span>{option.options}</span><strong>{percentage.toFixed(percentage % 1 ? 1 : 0)}%</strong></div>
                <span className="iq-poll-progress"><i style={{ width: `${Math.min(100, percentage)}%` }} /></span>
              </div>
            )
          }

          return (
            <label className={selectedOption === option.id ? 'selected' : ''} key={option.id}>
              <input
                type="radio"
                name={`poll-${poll.id}`}
                value={option.id}
                checked={selectedOption === option.id}
                onChange={() => setSelectedOption(option.id)}
              />
              <span>{option.options}</span>
            </label>
          )
        })}
      </div>
      {error && <p className="iq-poll-error">{error}</p>}
      {!showResults ? (
        <button type="button" className="iq-poll-submit" onClick={submitVote} disabled={submitting}>
          {submitting ? 'Submitting...' : 'Vote now'}
        </button>
      ) : (
        <div className="iq-poll-thanks"><FiCheckCircle aria-hidden="true" /> Vote recorded</div>
      )}
      <small>{Number(poll.total_votes || 0).toLocaleString('en-IN')} votes</small>
    </aside>
  )
}

export default PollCard
