import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { createPage } from '../services/supabase'

const AnonymousCreate: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [slug, setSlug] = useState<string | null>(null)
  const [copied, setCopied] = useState<'public' | 'inbox' | null>(null)

  const handleCreate = async () => {
    setLoading(true)
    setError('')

    try {
      const newSlug = Math.random().toString(36).substring(2, 15)
      const pageData = {
        slug: newSlug,
        type: 'anonymous' as const,
        tone: 'mixed' as const,
        occasion: 'other' as const,
        content: {
          prompt: 'Say something real. Be kind.'
        },
        is_anonymous: true
      }

      await createPage(pageData)
      setSlug(newSlug)
    } catch (err) {
      setError('Failed to generate your link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (type: 'public' | 'inbox', value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      setCopied(null)
    }
  }

  const publicUrl = slug ? `${window.location.origin}/anonymous/${slug}` : ''
  const inboxUrl = slug ? `${window.location.origin}/anonymous/${slug}/inbox` : ''

  return (
    <div className="anon-theme min-h-screen bg-[#F7F2E8] text-[#1B1B1B] px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#FFE3C2] text-[#7A3E00] text-sm font-semibold tracking-wide">
            Anonymous Messages
          </div>
          <h1 className="anon-title text-4xl sm:text-5xl md:text-6xl mt-6">
            One link. Zero questions.
          </h1>
          <p className="mt-4 text-lg text-[#3C3C3C] max-w-2xl mx-auto">
            Generate a clean anonymous link and collect messages in one inbox.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(122,62,0,0.15)] p-6 sm:p-10 border border-[#F2D6B3]"
        >
          {!slug ? (
            <div className="text-center">
              <p className="text-base sm:text-lg text-[#3C3C3C]">
                Ready to collect anonymous messages?
              </p>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="mt-6 inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#1B1B1B] text-white text-lg font-semibold hover:bg-black transition-colors"
              >
                {loading ? 'Generating...' : 'Generate my link'}
              </button>
              {error && (
                <div className="mt-4 text-sm text-red-600">{error}</div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border border-[#EAD3B5] bg-[#FFF8ED] p-5">
                  <div className="text-sm uppercase tracking-wide text-[#7A3E00] font-semibold">Public Link</div>
                  <div className="mt-2 text-sm sm:text-base font-mono break-all">{publicUrl}</div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleCopy('public', publicUrl)}
                      className="px-4 py-2 rounded-lg bg-[#7A3E00] text-white text-sm font-semibold hover:bg-[#5E2E00]"
                    >
                      {copied === 'public' ? 'Copied' : 'Copy public link'}
                    </button>
                    <a
                      href={`/anonymous/${slug}`}
                      className="px-4 py-2 rounded-lg border border-[#7A3E00] text-[#7A3E00] text-sm font-semibold hover:bg-[#FFF1DE]"
                    >
                      Open public page
                    </a>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#EAD3B5] bg-[#FFF8ED] p-5">
                  <div className="text-sm uppercase tracking-wide text-[#7A3E00] font-semibold">Your Inbox</div>
                  <div className="mt-2 text-sm sm:text-base font-mono break-all">{inboxUrl}</div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleCopy('inbox', inboxUrl)}
                      className="px-4 py-2 rounded-lg bg-[#1B1B1B] text-white text-sm font-semibold hover:bg-black"
                    >
                      {copied === 'inbox' ? 'Copied' : 'Copy inbox link'}
                    </button>
                    <a
                      href={`/anonymous/${slug}/inbox`}
                      className="px-4 py-2 rounded-lg border border-[#1B1B1B] text-[#1B1B1B] text-sm font-semibold hover:bg-[#F2E6D8]"
                    >
                      Open inbox
                    </a>
                  </div>
                </div>
              </div>

              <div className="text-sm text-[#5C5C5C]">
                Share the public link. Keep the inbox link for yourself.
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AnonymousCreate
