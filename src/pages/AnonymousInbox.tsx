import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchPageBySlug, fetchResponsesByPageId } from '../services/supabase'

const AnonymousInbox: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState<any>(null)
  const [responses, setResponses] = useState<any[]>([])
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const publicUrl = slug ? `${window.location.origin}/anonymous/${slug}` : ''

  const loadData = async (silent = false) => {
    if (!slug) return
    if (!silent) setLoading(true)
    setError('')

    try {
      const pageData = await fetchPageBySlug(slug)
      const ownerToken = pageData?.content?.ownerToken || ''
      if (!ownerToken || ownerToken !== token) {
        setError('Unauthorized inbox access.')
        setPage(null)
        setResponses([])
        return
      }
      setPage(pageData)
      const responseData = await fetchResponsesByPageId(pageData.id)
      setResponses(responseData)
    } catch (err) {
      setError('Unable to load this inbox.')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [slug, token])

  useEffect(() => {
    if (!slug || !token) return
    const interval = setInterval(() => {
      loadData(true)
    }, 8000)
    return () => clearInterval(interval)
  }, [slug, token])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      setCopied(false)
    }
  }

  if (loading) {
    return (
      <div className="anon-theme min-h-screen bg-[#F7F2E8] flex items-center justify-center">
        <div className="text-sm text-[#5C5C5C]">Loading inbox...</div>
      </div>
    )
  }

  if (!page || error) {
    return (
      <div className="anon-theme min-h-screen bg-[#F7F2E8] flex items-center justify-center px-4">
        <div className="text-center text-[#5C5C5C]">
          <div className="anon-title text-3xl text-[#1B1B1B]">Inbox not found</div>
          <p className="mt-3">{error || 'This inbox might have expired or the link is wrong.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="anon-theme min-h-screen bg-[#F7F2E8] text-[#1B1B1B] px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE3C2] text-[#7A3E00] text-sm font-semibold">
              Your Anonymous Inbox
            </div>
            <h1 className="anon-title text-3xl sm:text-4xl mt-4">Messages collected</h1>
            <p className="text-[#3C3C3C] mt-2">Share the public link to receive messages.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-lg bg-[#1B1B1B] text-white text-sm font-semibold hover:bg-black"
            >
              {copied ? 'Copied' : 'Copy public link'}
            </button>
            <a
              href={`/anonymous/${slug}`}
              className="px-4 py-2 rounded-lg border border-[#1B1B1B] text-[#1B1B1B] text-sm font-semibold hover:bg-[#F2E6D8]"
            >
              Open public page
            </a>
            <button
              onClick={loadData}
              className="px-4 py-2 rounded-lg border border-[#7A3E00] text-[#7A3E00] text-sm font-semibold hover:bg-[#FFF1DE]"
            >
              Refresh inbox
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(122,62,0,0.12)] border border-[#F2D6B3]"
        >
          <div className="px-6 py-5 border-b border-[#F2D6B3] flex items-center justify-between">
            <div className="text-sm uppercase tracking-wide text-[#7A3E00] font-semibold">
              {responses.length} messages
            </div>
            <div className="text-xs text-[#7A3E00] font-mono">{publicUrl}</div>
          </div>

          <div className="p-6 space-y-4">
            {responses.length === 0 ? (
              <div className="text-center text-[#5C5C5C] py-12">
                <div className="anon-title text-2xl text-[#1B1B1B]">No messages yet</div>
                <p className="mt-2">Share your link to start collecting notes.</p>
              </div>
            ) : (
              responses.map((response) => (
                <div
                  key={response.id}
                  className="border border-[#F2D6B3] rounded-2xl p-5 bg-[#FFF8ED]"
                >
                  <div className="text-base text-[#2D2D2D] whitespace-pre-wrap">
                    {response.response}
                  </div>
                  <div className="text-xs text-[#7A3E00] mt-3">
                    {new Date(response.created_at).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AnonymousInbox
