import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchPageBySlug, logView } from '../services/supabase'
import { fadeInUp, fadeInScale, containerVariants, itemVariants } from '../utils/animations'
import { BACKGROUND_STYLES, VALENTINE_WISH_TYPES } from '../utils/constants'

// Floating hearts component
const FloatingHearts = () => {
  const hearts = ['❤️', '💕', '💖', '💗', '💝', '💘']
  const [floatingHearts, setFloatingHearts] = useState<Array<{id: number, emoji: string, left: number, delay: number}>>([])

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
    const template = wishType?.template || ''
    const personalizedMessage = template.replace('{name}', page.content.receiverName)
    
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`min-h-screen ${getBackgroundClass()} flex items-center justify-center px-4 relative`}
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
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-pink-700 mb-8"
            animate={{ textShadow: ['0 0 20px rgba(236,72,153,0.5)', '0 0 40px rgba(236,72,153,0.3)', '0 0 20px rgba(236,72,153,0.5)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Happy Valentine's Day!
          </motion.h1>
          
          <motion.div
            variants={itemVariants}
            className="bg-white/90 backdrop-blur rounded-2xl p-6 sm:p-8 shadow-xl mb-8 border-2 border-pink-200"
            whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(236,72,153,0.3)' }}
          >
            <h2 className="text-xl sm:text-2xl text-pink-600 mb-6">
              Dear {page.content.receiverName},
            </h2>
            
            <div className="text-base sm:text-lg text-gray-700 leading-relaxed space-y-4">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {personalizedMessage}
              </motion.p>
              {page.content.customMessage && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="italic text-pink-600"
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
                className="mt-6 sm:mt-8 text-base sm:text-lg font-medium text-pink-600 border-t-2 border-pink-200 pt-4"
              >
                With all my love,<br />
                {page.content.signature}
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
                  className={`w-3 h-3 rounded-full ${
                    num <= 5 - countdown ? 'bg-pink-400' : 'bg-pink-200'
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
    default:
      return <div>Page type not implemented yet</div>
  }
}

export default ViewPage
