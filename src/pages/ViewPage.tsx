import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchPageBySlug, logView } from '../services/supabase'
import { containerVariants, itemVariants } from '../utils/animations'
import { BACKGROUND_STYLES, VALENTINE_WISH_TYPES } from '../utils/constants'

// Floating hearts component
const FloatingHearts = () => {
  const hearts = ['❤️', '💕', '💖', '💗', '💝', '💘']
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number, emoji: string, left: number, delay: number }>>([])

  useEffect(() => {
    const newHearts = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      emoji: hearts[Math.floor(Math.random() * hearts.length)],
      left: Math.random() * 100,
      delay: Math.random() * 5
    }))
    setFloatingHearts(newHearts)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {floatingHearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{
            y: '-100vh',
            opacity: [0, 1, 0],
            x: [0, heart.left - 50, heart.left - 50]
          }}
          transition={{
            duration: 8 + heart.delay,
            ease: 'easeOut',
            repeat: Infinity,
            delay: heart.delay
          }}
          className="absolute text-2xl"
          style={{ left: `${heart.left}%` }}
        >
          {heart.emoji}
        </motion.div>
      ))}
    </div>
  )
}

const ViewPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()

  const [page, setPage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [started, setStarted] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [showMessage, setShowMessage] = useState(false)
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 })
  const [noAttempts, setNoAttempts] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isValentineDay, setIsValentineDay] = useState(false)

  // Check if it's Valentine's Day
  useEffect(() => {
    const today = new Date()
    const isValentines = today.getMonth() === 1 && today.getDate() === 14 // February 14th
    setIsValentineDay(isValentines)
  }, [])

  // Countdown timer
  useEffect(() => {
    if (started && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (started && countdown === 0) {
      setShowMessage(true)
    }
  }, [started, countdown])

  // Auto-start countdown when page loads
  useEffect(() => {
    if (page && !started) {
      setStarted(true)
    }
  }, [page, started])

  useEffect(() => {
    if (!slug) return

    const fetchPage = async () => {
      try {
        const pageData = await fetchPageBySlug(slug)
        setPage(pageData)
        await logView(pageData.id)
      } catch (error) {
        console.error('Failed to fetch page:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [slug])

  const handleNoButtonClick = () => {
    const newAttempts = noAttempts + 1
    setNoAttempts(newAttempts)

    if (newAttempts >= 5) {
      setShowCelebration(true)
      return
    }

    const maxX = window.innerWidth - 200
    const maxY = window.innerHeight - 100
    const newX = Math.random() * maxX - maxX / 2
    const newY = Math.random() * maxY - maxY / 2

    setNoButtonPosition({ x: newX, y: newY })
  }

  const handleYesButtonClick = () => {
    setShowCelebration(true)
  }

  const getBackgroundClass = () => {
    if (!page?.content?.backgroundStyle) return 'bg-gradient-to-br from-pink-50 to-pink-100'

    const style = BACKGROUND_STYLES.find(s => s.id === page.content.backgroundStyle)
    return style ? style.class : 'bg-gradient-to-br from-pink-50 to-pink-100'
  }

  const renderValentineWishPage = () => {
    const wishType = VALENTINE_WISH_TYPES.find(w => w.id === page.content.wishType)
    const template = wishType?.template || 'Happy Valentine\'s Day!'
    const personalizedMessage = template.replace('{name}', page.content.receiverName || 'You')

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center px-4 relative"
      >
        {/* Floating hearts for Valentine's Day */}
        {isValentineDay && <FloatingHearts />}

        <div className="max-w-2xl w-full text-center z-10">
          <motion.div
            variants={itemVariants}
            className="text-6xl sm:text-8xl mb-8"
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            💝
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-pink-900 mb-8"
            animate={{ textShadow: ['0 0 20px rgba(236,72,153,0.5)', '0 0 40px rgba(236,72,153,0.3)', '0 0 20px rgba(236,72,153,0.5)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Happy Valentine's Day!
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl mb-8 border-4 border-pink-400"
            whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(236,72,153,0.3)' }}
          >
            <h2 className="text-xl sm:text-2xl text-pink-900 mb-6 font-bold">
              Dear {page.content.receiverName},
            </h2>

            <div className="text-base sm:text-lg text-black leading-relaxed space-y-4">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-black font-medium"
              >
                {personalizedMessage}
              </motion.p>
              {page.content.customMessage && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="italic text-pink-900 font-bold bg-pink-50 p-3 rounded-lg"
                >
                  "{page.content.customMessage}"
                </motion.p>
              )}
            </div>

            {page.content.signature && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-6 sm:mt-8 text-base sm:text-lg font-bold text-pink-900 border-t-4 border-pink-400 pt-4"
              >
                With all my love,<br />
                <span className="text-pink-800">{page.content.signature}</span>
                <div className="text-2xl mt-2">💕</div>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="text-4xl sm:text-6xl"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 5, -5, 0],
              filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)', 'hue-rotate(0deg)']
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            💕
          </motion.div>
        </div>
      </motion.div>
    )
  }

  const renderMessagePage = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`min-h-screen ${getBackgroundClass()} flex items-center justify-center px-4 relative`}
    >
      {/* Floating hearts for Valentine's Day */}
      {isValentineDay && <FloatingHearts />}

      <div className="max-w-2xl w-full text-center z-10">
        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-8"
          animate={{ textShadow: ['0 0 20px rgba(59,130,246,0.3)', '0 0 40px rgba(59,130,246,0.2)', '0 0 20px rgba(59,130,246,0.3)'] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {page.content.title}
        </motion.h1>

        <motion.h2
          variants={itemVariants}
          className="text-xl sm:text-2xl text-blue-700 mb-12"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Dear {page.content.receiverName},
        </motion.h2>

        <motion.div
          variants={itemVariants}
          className="bg-white/90 backdrop-blur rounded-2xl p-6 sm:p-8 shadow-xl"
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
            {page.content.message}
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-12"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-4xl sm:text-6xl">💕</div>
        </motion.div>
      </div>
    </motion.div>
  )

  const renderValentinePage = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`min-h-screen ${getBackgroundClass()} flex items-center justify-center px-4 relative`}
    >
      {/* Floating hearts for Valentine's Day */}
      {isValentineDay && <FloatingHearts />}

      <div className="max-w-2xl w-full text-center z-10">
        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-pink-700 mb-8"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Dear {page.content.receiverName},
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="bg-white/90 backdrop-blur rounded-2xl p-6 sm:p-8 shadow-xl mb-8 border-2 border-pink-200"
          whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(236,72,153,0.3)' }}
        >
          <h2 className="text-xl sm:text-2xl text-pink-600 mb-6">
            {page.content.questionText || 'Will you be my Valentine?'}
          </h2>

          <motion.div
            className="text-6xl sm:text-8xl mb-8"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            💘
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {!showCelebration && (
            <motion.div
              variants={itemVariants}
              className="flex gap-4 sm:gap-6 justify-center flex-wrap"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleYesButtonClick}
                className="btn-primary text-lg sm:text-xl px-6 sm:px-8 py-3 sm:py-4 relative overflow-hidden group"
              >
                <span className="relative z-10">{page.content.yesButtonText || 'Yes! 💕'}</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-400 to-red-400"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              <motion.button
                animate={{
                  x: noButtonPosition.x,
                  y: noButtonPosition.y,
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNoButtonClick}
                className="btn-secondary text-lg sm:text-xl px-6 sm:px-8 py-3 sm:py-4"
              >
                {page.content.noButtonText || 'No'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-center"
            >
              <motion.div
                className="text-4xl sm:text-6xl mb-4"
                animate={{ rotate: [0, 360, 720, 0] }}
                transition={{ duration: 2, ease: "easeInOut" }}
              >
                🎉
              </motion.div>
              <h2 className="text-2xl sm:text-3xl font-bold text-pink-600 mb-4">
                {noAttempts >= 5 ? 'I knew it! 💕' : 'Yay! 💕'}
              </h2>
              <p className="text-lg sm:text-xl text-gray-700">
                This is going to be amazing!
              </p>

              {/* Celebration hearts */}
              <motion.div
                className="flex justify-center gap-2 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {['💕', '💖', '💗', '💝'].map((heart, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className="text-2xl sm:text-3xl"
                  >
                    {heart}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )

  const renderAnonymousPage = () => {
    const [responses, setResponses] = useState<any[]>([])
    const [newResponse, setNewResponse] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showThankYou, setShowThankYou] = useState(false)
    const [showCreateOptions, setShowCreateOptions] = useState(false)

    // Handle anonymous response submission
    const handleSubmitResponse = async () => {
      if (!newResponse.trim()) return

      setIsSubmitting(true)
      try {
        // Save response to Supabase
        // await saveResponse(page.id, newResponse)

        setShowThankYou(true)
        setTimeout(() => {
          setShowCreateOptions(true)
        }, 2000)
      } catch (error) {
        console.error('Failed to submit response:', error)
      } finally {
        setIsSubmitting(false)
      }
    }

    // Check if this is the page owner (you'd implement proper auth)
    const isOwner = false // This would be based on authentication

    if (isOwner) {
      // Owner view - see all responses
      return (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`min-h-screen ${getBackgroundClass()} px-4 py-8 relative`}
        >
          {/* Floating hearts for Valentine's Day */}
          {isValentineDay && <FloatingHearts />}

          <div className="max-w-4xl mx-auto z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center mb-8"
            >
              <div className="text-6xl mb-4">🤐</div>
              <h1 className="text-3xl sm:text-4xl font-bold text-purple-700 mb-4">
                Anonymous Confessions
              </h1>
              <p className="text-lg text-gray-600">
                See what people have to say anonymously
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {responses.length} Anonymous Messages
                </h2>
                <div className="text-sm text-gray-500">
                  Share link: <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    {window.location.origin}/view/{slug}
                  </span>
                </div>
              </div>

              {responses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📭</div>
                  <p className="text-gray-500">No anonymous messages yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Share your link to start receiving messages!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {responses.map((response, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">🤫</div>
                        <div className="flex-1">
                          <p className="text-gray-700 leading-relaxed">
                            {response.response}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(response.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-8 text-center"
            >
              <button
                onClick={() => navigator.clipboard.writeText(`${window.location.origin}/view/${slug}`)}
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mr-4"
              >
                📋 Copy Link
              </button>
              <button
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Someone wants to tell you something anonymously! 🤫\n\n${window.location.origin}/view/${slug}`)}`, '_blank')}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                📱 Share on WhatsApp
              </button>
            </motion.div>
          </div>
        </motion.div>
      )
    }

    // Anonymous user view - submit response
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`min-h-screen ${getBackgroundClass()} flex items-center justify-center px-4 relative`}
      >
        {/* Floating hearts for Valentine's Day */}
        {isValentineDay && <FloatingHearts />}

        <div className="max-w-2xl w-full z-10">
          {!showThankYou ? (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center mb-8"
              >
                <div className="text-6xl mb-4 animate-bounce">🤫</div>
                <h1 className="text-3xl sm:text-4xl font-bold text-purple-700 mb-4">
                  Anonymous Confession
                </h1>
                <p className="text-lg text-gray-600">
                  Share your thoughts anonymously
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white/90 backdrop-blur rounded-2xl p-6 sm:p-8 shadow-xl"
              >
                <div className="mb-6">
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    {page.content.hint || "Tell me something you like about me..."}
                  </label>
                  <textarea
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-32"
                    placeholder="Type your anonymous message here..."
                    maxLength={500}
                  />
                  <div className="text-sm text-gray-500 mt-2 text-right">
                    {newResponse.length}/500
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitResponse}
                  disabled={!newResponse.trim() || isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </span>
                  ) : (
                    'Send Anonymously 🤫'
                  )}
                </motion.button>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    🔒 Your message is completely anonymous
                  </p>
                  {page.content.allowReply && (
                    <p className="text-sm text-purple-600 mt-2">
                      💬 The owner can reply to your message
                    </p>
                  )}
                </div>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-2xl font-bold text-purple-700 mb-4">
                Thank you! 🤫
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Your anonymous message has been sent successfully
              </p>
            </motion.div>
          )}

          {showCreateOptions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-4"
            >
              <div className="text-center text-sm text-gray-500 mb-4">
                Want to create your own anonymous link?
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/choose-type'}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Create Your Link 🤫
                </button>
                <button
                  onClick={() => {
                    setNewResponse('')
                    setShowThankYou(false)
                    setShowCreateOptions(false)
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Send Another Message
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Page not found</h1>
          <p className="text-gray-600">This page may have expired or doesn't exist</p>
        </div>
      </div>
    )
  }

  if (!started) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center px-4 relative"
      >
        {/* Floating hearts for Valentine's Day */}
        {isValentineDay && <FloatingHearts />}

        <div className="text-center max-w-md w-full z-10">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl sm:text-6xl mb-6"
          >
            💖
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold text-pink-600 mb-4">
            Someone made this just for you
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8">
            A special message is waiting to be discovered
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStarted(true)}
            className="btn-primary text-lg px-6 sm:px-8 py-3 sm:py-4 relative overflow-hidden w-full sm:w-auto"
          >
            <span className="relative z-10">Open Your Message 💝</span>
            {/* Animated background effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-400 to-red-400"
              initial={{ x: '-100%' }}
              whileHover={{ x: '0%' }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          {isValentineDay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center space-x-2 text-pink-500">
                <span className="text-sm">✨ Happy Valentine's Day! ✨</span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    )
  }

  // Countdown screen
  if (started && !showMessage) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center px-4 relative"
      >
        {/* Floating hearts for Valentine's Day */}
        {isValentineDay && <FloatingHearts />}

        <div className="text-center z-10">
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-6xl sm:text-8xl mb-8"
          >
            💝
          </motion.div>

          <h2 className="text-2xl sm:text-3xl font-bold text-pink-600 mb-4">
            Get ready for your surprise...
          </h2>

          <motion.div
            key={countdown}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-6xl sm:text-8xl font-bold text-pink-700"
          >
            {countdown}
          </motion.div>

          <div className="mt-8">
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className={`w-3 h-3 rounded-full ${num <= 5 - countdown ? 'bg-pink-400' : 'bg-pink-200'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  switch (page.type) {
    case 'message':
      return renderMessagePage()
    case 'valentine':
      return renderValentinePage()
    case 'valentine_wish':
      return renderValentineWishPage()
    case 'anonymous':
      return renderAnonymousPage()
    default:
      return <div>Page type not implemented yet</div>
  }
}

export default ViewPage
