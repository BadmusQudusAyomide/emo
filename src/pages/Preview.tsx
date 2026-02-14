import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchPageBySlug } from '../services/supabase'
import { fadeInUp } from '../utils/animations'

const Preview: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [page, setPage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!slug) return

    const fetchPage = async () => {
      try {
        const pageData = await fetchPageBySlug(slug)
        setPage(pageData)
      } catch (error) {
        console.error('Failed to fetch page:', error)
        navigate('/')
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [slug, navigate])

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}/view/${slug}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const handleShareWhatsApp = () => {
    const shareUrl = `${window.location.origin}/view/${slug}`
    const text = `Someone made something special for you 💖 ${shareUrl}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-romantic-500"></div>
      </div>
    )
  }

  if (!page) {
    return <div>Page not found</div>
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-4">
            Your Page is Ready! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Share this link with your special someone
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={`${window.location.origin}/view/${slug}`}
                readOnly
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <button
                onClick={handleCopyLink}
                className="btn-primary"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleShareWhatsApp}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Share on WhatsApp
            </button>
            <button
              onClick={() => navigate(`/view/${slug}`)}
              className="btn-secondary"
            >
              Preview Page
            </button>
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="text-center"
        >
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-700 underline"
          >
            Create Another Page
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default Preview
