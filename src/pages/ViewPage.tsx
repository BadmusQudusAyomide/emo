
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchPageBySlug, logView } from '../services/supabase'
import { containerVariants, itemVariants } from '../utils/animations'
import { BACKGROUND_STYLES, VALENTINE_WISH_TYPES } from '../utils/constants'

// Floating hearts component
const FloatingHearts = () => {
  const hearts = ['?', '??', '??', '??', '??', '??']
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

const FloatingBubbles = () => {
  const bubbles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: 18 + Math.random() * 24,
    left: Math.random() * 100,
    delay: Math.random() * 6,
    duration: 10 + Math.random() * 6
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          initial={{ y: '110vh', opacity: 0 }}
          animate={{ y: '-20vh', opacity: [0, 0.6, 0], x: [0, bubble.left - 50, bubble.left - 50] }}
          transition={{
            duration: bubble.duration,
            ease: 'easeOut',
            repeat: Infinity,
            delay: bubble.delay
          }}
          className="absolute rounded-full border border-white/50 bg-white/40 backdrop-blur-sm"
          style={{ left: `${bubble.left}%`, width: bubble.size, height: bubble.size }}
        />
      ))}
    </div>
  )
}

const Confetti = () => {
  const confetti = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 6 + Math.random() * 4
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ y: '-10vh', opacity: 0 }}
          animate={{ y: '110vh', opacity: [0, 1, 0], rotate: [0, 180, 360] }}
          transition={{
            duration: piece.duration,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: piece.delay
          }}
          className="absolute w-2 h-4 rounded-sm bg-gradient-to-b from-amber-400 to-pink-400"
          style={{ left: `${piece.left}%` }}
        />
      ))}
    </div>
  )
}

const birthdayThemes = {
  gold: 'bg-gradient-to-br from-amber-50 to-rose-50',
  sky: 'bg-gradient-to-br from-sky-50 to-blue-50',
  garden: 'bg-gradient-to-br from-emerald-50 to-teal-50'
} as const

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
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null)

  useEffect(() => {
    const today = new Date()
    const isValentines = today.getMonth() === 1 && today.getDate() === 14
    setIsValentineDay(isValentines)
  }, [])

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

  useEffect(() => {
    if (!page?.content?.birthdayDate) return

    const updateTime = () => {
      const target = new Date(page.content.birthdayDate)
      if (Number.isNaN(target.getTime())) {
        setTimeLeft(null)
        return
      }

      const diffMs = Math.max(target.getTime() - Date.now(), 0)
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [page?.content?.birthdayDate])

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

  const getBirthdayThemeClass = () => {
    const theme = page?.content?.theme || 'gold'
    return birthdayThemes[theme as keyof typeof birthdayThemes] || birthdayThemes.gold
  }

  const getDaysToBirthday = () => {
    if (!page?.content?.birthdayDate) return null
    const today = new Date()
    const target = new Date(page.content.birthdayDate)
    if (Number.isNaN(target.getTime())) return null
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }
  const renderValentineWishPage = () => {
    const wishType = VALENTINE_WISH_TYPES.find(w => w.id === page.content.wishType)
    const template = wishType?.template || "Happy Valentine's Day!"
    const personalizedMessage = template.replace('{name}', page.content.receiverName || 'You')

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center px-4 relative">
        {isValentineDay && <FloatingHearts />}

        <div className="max-w-2xl w-full text-center z-10">
          <div className="text-6xl sm:text-8xl mb-8">??</div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-pink-900 mb-8">
            Happy Valentine's Day!
          </h1>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl mb-8 border-4 border-pink-400">
            <h2 className="text-xl sm:text-2xl text-pink-900 mb-6 font-bold">
              Dear {page.content.receiverName},
            </h2>

            <div className="text-base sm:text-lg text-black leading-relaxed space-y-4">
              <p className="text-black font-medium">{personalizedMessage}</p>
              {page.content.customMessage && (
                <p className="italic text-pink-900 font-bold bg-pink-50 p-3 rounded-lg">
                  "{page.content.customMessage}"
                </p>
              )}
            </div>

            {page.content.signature && (
              <div className="mt-6 sm:mt-8 text-base sm:text-lg font-bold text-pink-900 border-t-4 border-pink-400 pt-4">
                With all my love,<br />
                <span className="text-pink-800">{page.content.signature}</span>
                <div className="text-2xl mt-2">??</div>
              </div>
            )}
          </div>

          {page.content.songLink && (
            <div className="mt-6">
              <a
                href={page.content.songLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-full"
              >
                Play our song
              </a>
            </div>
          )}

          <div className="text-4xl sm:text-6xl mt-6">??</div>
        </div>
      </div>
    )
  }

  const renderValentinePage = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`min-h-screen ${getBackgroundClass()} flex items-center justify-center px-4 relative`}
    >
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
            ??
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
                <span className="relative z-10">{page.content.yesButtonText || 'Yes!'}</span>
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

        {page.content.songLink && (
          <div className="mt-8">
            <a
              href={page.content.songLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-full"
            >
              Play our song
            </a>
          </div>
        )}

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
                transition={{ duration: 2, ease: 'easeInOut' }}
              >
                ??
              </motion.div>
              <h2 className="text-2xl sm:text-3xl font-bold text-pink-600 mb-4">
                {noAttempts >= 5 ? 'I knew it!' : 'Yay!'}
              </h2>
              <p className="text-lg sm:text-xl text-gray-700">
                This is going to be amazing!
              </p>

              <motion.div
                className="flex justify-center gap-2 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {['??', '??', '??', '??'].map((heart, index) => (
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
  const renderBirthdayPage = () => {
    const name = page.content.receiverName || 'you'
    const age = page.content.age ? `${page.content.age}` : null

    return (
      <div className={`min-h-screen ${getBirthdayThemeClass()} flex items-center justify-center px-4 py-12 relative overflow-hidden`}>
        <FloatingBubbles />
        <Confetti />
        <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-white/40 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-white/40 blur-3xl" />
        <div className="max-w-3xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/90 backdrop-blur rounded-3xl p-6 sm:p-10 shadow-2xl border border-white relative"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold uppercase tracking-wide">
              Birthday Celebration
            </div>

            <div className="mt-6 text-5xl sm:text-6xl">??</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-4">
              Happy Birthday, {name}!
            </h1>
            <p className="text-slate-600 mt-3">
              {age ? `Celebrating ${age} amazing years.` : 'Today is all about you.'}
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="text-xs uppercase tracking-wide text-slate-500">Message</div>
                <div className="mt-3 text-slate-700 text-base leading-relaxed">
                  {page.content.customMessage || 'Wishing you joy, laughter, and everything you love most.'}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="text-xs uppercase tracking-wide text-slate-500">Highlights</div>
                <div className="mt-3 space-y-2 text-slate-700 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
                    <span>{page.content.birthdayDate ? `Birthday: ${page.content.birthdayDate}` : 'Set the special date'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-rose-400" />
                    <span>{age ? `Turning ${age}` : 'New memories ahead'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Celebrate in style</span>
                  </div>
                </div>
              </div>
            </div>

            {page.content.signature && (
              <div className="mt-8 text-slate-700 font-semibold">
                With love, {page.content.signature}
              </div>
            )}

            {page.content.songLink && (
              <div className="mt-6">
                <a
                  href={page.content.songLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-5 py-3 rounded-full"
                >
                  Play the birthday song
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    )
  }

const renderBirthdayAdvancePage = () => {
    const daysLeft = getDaysToBirthday()
    const highlights = (page.content.planHighlights || '').split('\n').filter(Boolean)
    const displayTime = timeLeft || {
      days: typeof daysLeft === 'number' ? Math.max(daysLeft, 0) : 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    }

    return (
      <div className={`min-h-screen ${getBirthdayThemeClass()} px-4 py-12 relative`}>
        <FloatingBubbles />
        <Confetti />
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="text-5xl sm:text-6xl">??</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-4">
              Birthday Countdown for {page.content.receiverName || 'someone special'}
            </h1>
            <p className="text-slate-600 mt-2">
              {page.content.countdownMessage || 'Something special is on the way.'}
            </p>

            {typeof daysLeft === 'number' && (
              <div className="mt-6 inline-flex items-center gap-3 bg-white/90 border border-white rounded-full px-5 py-2 text-slate-700 font-semibold">
                <span className="text-2xl">{daysLeft > 0 ? daysLeft : 0}</span>
                <span className="text-sm">days to go</span>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {[
              { label: 'Days', value: displayTime.days },
              { label: 'Hours', value: displayTime.hours },
              { label: 'Minutes', value: displayTime.minutes },
              { label: 'Seconds', value: displayTime.seconds }
            ].map((item) => (
              <div key={item.label} className="bg-white/90 backdrop-blur rounded-2xl p-4 border border-white shadow-lg text-center">
                <motion.div
                  key={item.value}
                  initial={{ scale: 0.9, opacity: 0.4 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-2xl sm:text-3xl font-semibold text-slate-900"
                >
                  {String(item.value).padStart(2, '0')}
                </motion.div>
                <div className="text-xs uppercase tracking-wide text-slate-500 mt-1">{item.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white shadow-lg">
              <div className="text-xs uppercase tracking-wide text-slate-500">Countdown</div>
              <div className="mt-2 text-3xl font-semibold text-slate-900">{daysLeft ? Math.max(daysLeft, 0) : '--'}</div>
              <div className="text-sm text-slate-600">Days left</div>
            </div>
            <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white shadow-lg">
              <div className="text-xs uppercase tracking-wide text-slate-500">Theme</div>
              <div className="mt-2 text-xl font-semibold text-slate-900">{page.content.theme || 'Gold Glow'}</div>
              <div className="text-sm text-slate-600">Chosen mood</div>
            </div>
            <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white shadow-lg">
              <div className="text-xs uppercase tracking-wide text-slate-500">Special note</div>
              <div className="mt-2 text-sm text-slate-700">{page.content.surpriseNote || 'Something sweet is coming.'}</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white shadow-xl">
              <h2 className="text-lg font-semibold text-slate-900">Plan Highlights</h2>
              <ul className="mt-4 space-y-2 text-slate-700">
                {highlights.length === 0 ? (
                  <li>Surprise breakfast</li>
                ) : (
                  highlights.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-amber-500">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white shadow-xl">
              <h2 className="text-lg font-semibold text-slate-900">Surprise Note</h2>
              <p className="mt-4 text-slate-700 leading-relaxed">
                {page.content.surpriseNote || 'There is a special moment planned just for you.'}
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white shadow-xl">
              <h2 className="text-lg font-semibold text-slate-900">Extras</h2>
              <div className="mt-4 text-slate-700 space-y-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Gift ideas</div>
                  <div>{page.content.giftIdeas || 'A handwritten letter and flowers.'}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Playlist</div>
                  <div>{page.content.playlistLink || 'Add a link to the birthday playlist.'}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Birthday date</div>
                  <div>{page.content.birthdayDate || 'Set a date'}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {page.content.songLink && (
            <div className="mt-8 text-center">
              <a
                href={page.content.songLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-3 rounded-full"
              >
                Play the dedication song
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }
  const renderAnonymousPage = () => {
    const [responses, setResponses] = useState<any[]>([])
    const [newResponse, setNewResponse] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showThankYou, setShowThankYou] = useState(false)
    const [showCreateOptions, setShowCreateOptions] = useState(false)

    const handleSubmitResponse = async () => {
      if (!newResponse.trim()) return

      setIsSubmitting(true)
      try {
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

    const isOwner = false

    if (isOwner) {
      return (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`min-h-screen ${getBackgroundClass()} px-4 py-8 relative`}
        >
          {isValentineDay && <FloatingHearts />}

          <div className="max-w-4xl mx-auto z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center mb-8"
            >
              <div className="text-6xl mb-4">??</div>
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
                  <div className="text-4xl mb-4">??</div>
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
                        <div className="text-2xl">??</div>
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
                Copy Link
              </button>
              <button
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Someone wants to tell you something anonymously!\n\n${window.location.origin}/view/${slug}`)}`, '_blank')}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Share on WhatsApp
              </button>
            </motion.div>
          </div>
        </motion.div>
      )
    }

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`min-h-screen ${getBackgroundClass()} flex items-center justify-center px-4 relative`}
      >
        {isValentineDay && <FloatingHearts />}

        <div className="max-w-2xl w-full z-10">
          {!showThankYou ? (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center mb-8"
              >
                <div className="text-6xl mb-4 animate-bounce">??</div>
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
                    {page.content.hint || 'Tell me something you like about me...'}
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
                    'Send Anonymously'
                  )}
                </motion.button>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    Your message is completely anonymous
                  </p>
                  {page.content.allowReply && (
                    <p className="text-sm text-purple-600 mt-2">
                      The owner can reply to your message
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
              <div className="text-6xl mb-4">?</div>
              <h2 className="text-2xl font-bold text-purple-700 mb-4">
                Thank you!
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
                  Create Your Link
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
        {isValentineDay && <FloatingHearts />}

        <div className="text-center max-w-md w-full z-10">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl sm:text-6xl mb-6"
          >
            ??
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
            <span className="relative z-10">Open Your Message</span>
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
                <span className="text-sm">Happy Valentine's Day!</span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    )
  }

  if (started && !showMessage) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center px-4 relative"
      >
        {isValentineDay && <FloatingHearts />}

        <div className="text-center z-10">
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-6xl sm:text-8xl mb-8"
          >
            ??
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
                  className={`w-3 h-3 rounded-full ${num <= 5 - countdown ? 'bg-pink-400' : 'bg-pink-200'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  switch (page.type) {
    case 'valentine':
      return renderValentinePage()
    case 'valentine_wish':
      return renderValentineWishPage()
    case 'anonymous':
      return renderAnonymousPage()
    case 'birthday':
      return renderBirthdayPage()
    case 'birthday_advance':
      return renderBirthdayAdvancePage()
    default:
      return <div>Page type not implemented yet</div>
  }
}

export default ViewPage




