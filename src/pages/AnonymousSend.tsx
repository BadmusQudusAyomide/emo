import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchPageBySlug, saveResponse } from '../services/supabase'
import { MAX_MESSAGE_LENGTH } from '../utils/constants'

const AnonymousSend: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [page, setPage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return

    const loadPage = async () => {
      try {
        const pageData = await fetchPageBySlug(slug)
        setPage(pageData)
      } catch (err) {
        setError('This link is invalid or has expired.')
      } finally {
        setLoading(false)
      }
    }

    loadPage()
  }, [slug])

  const handleSubmit = async () => {
    if (!page || !message.trim()) return

    setSubmitting(true)
    try {
      await saveResponse(page.id, message.trim())
      setSent(true)
      setMessage('')
    } catch (err) {
      setError('Failed to send your message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="anon-theme min-h-screen bg-[#F7F2E8] flex items-center justify-center">
        <div className="text-sm text-[#5C5C5C]">Loading...</div>
      </div>
    )
  }

  if (!page || error) {
    return (
      <div className="anon-theme min-h-screen bg-[#F7F2E8] flex items-center justify-center px-4">
        <div className="text-center text-[#5C5C5C]">
          <div className="anon-title text-3xl text-[#1B1B1B]">Page not found</div>
          <p className="mt-3">{error || 'This link might be wrong.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="anon-theme min-h-screen bg-[#F7F2E8] text-[#1B1B1B] px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE3C2] text-[#7A3E00] text-sm font-semibold">
            Anonymous Message
          </div>
          <h1 className="anon-title text-3xl sm:text-4xl mt-4">Say it without your name</h1>
          <p className="text-[#3C3C3C] mt-3">
            {page.content?.prompt || 'Drop a short, honest message.'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(122,62,0,0.12)] p-6 sm:p-10 border border-[#F2D6B3]"
        >
          {!sent ? (
            <div>
              <label className="block text-sm font-semibold text-[#3C3C3C]">Your message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                className="mt-3 w-full min-h-[160px] px-4 py-3 border border-[#E5CBA7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A3E00] bg-[#FFF8ED]"
                placeholder="Type your anonymous message here..."
              />
              <div className="mt-2 text-xs text-[#7A3E00] text-right">
                {message.length}/{MAX_MESSAGE_LENGTH}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={!message.trim() || submitting}
                  className="px-6 py-3 rounded-xl bg-[#1B1B1B] text-white text-sm font-semibold hover:bg-black disabled:bg-[#B8B8B8]"
                >
                  {submitting ? 'Sending...' : 'Send anonymously'}
                </button>
                <button
                  onClick={() => setMessage('')}
                  className="px-6 py-3 rounded-xl border border-[#1B1B1B] text-[#1B1B1B] text-sm font-semibold hover:bg-[#F2E6D8]"
                >
                  Clear
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="anon-title text-2xl text-[#1B1B1B]">Message sent</div>
              <p className="mt-3 text-[#3C3C3C]">Your note is in the inbox.</p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => setSent(false)}
                  className="px-6 py-3 rounded-xl border border-[#1B1B1B] text-[#1B1B1B] text-sm font-semibold hover:bg-[#F2E6D8]"
                >
                  Send another
                </button>
                <a
                  href="/anonymous"
                  className="px-6 py-3 rounded-xl bg-[#7A3E00] text-white text-sm font-semibold hover:bg-[#5E2E00]"
                >
                  Create your own link
                </a>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AnonymousSend
