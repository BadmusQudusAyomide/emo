import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Gift, Heart, Image, Inbox, Sparkles } from 'lucide-react'
import { PAGE_TYPES } from '../utils/constants'
import { fadeInUp, containerVariants, itemVariants } from '../utils/animations'

const cards = [
  {
    type: PAGE_TYPES.BIRTHDAY,
    title: 'Birthday Page',
    description: 'A beautiful birthday page with a personal note.',
    time: '1 min',
    icon: Gift,
    accent: 'from-amber-100 to-rose-50',
    border: 'border-amber-200',
    text: 'text-amber-900'
  },
  {
    type: PAGE_TYPES.BIRTHDAY_ADVANCE,
    title: 'Birthday In Advance',
    description: 'Premium birthday plan with countdown and surprises.',
    time: '2 min',
    icon: Calendar,
    accent: 'from-indigo-100 to-slate-50',
    border: 'border-indigo-200',
    text: 'text-slate-900'
  },
  {
    type: PAGE_TYPES.ANONYMOUS,
    title: 'Anonymous Inbox',
    description: 'Generate a link and collect messages in one place.',
    time: '30 sec',
    icon: Inbox,
    accent: 'from-amber-100 to-orange-50',
    border: 'border-amber-300',
    text: 'text-amber-900'
  },
  {
    type: PAGE_TYPES.MEMORY,
    title: 'Memory Page',
    description: 'Share memories and moments in a visual layout.',
    time: '2 min',
    icon: Image,
    accent: 'from-emerald-100 to-teal-50',
    border: 'border-emerald-200',
    text: 'text-emerald-900'
  },
  {
    type: PAGE_TYPES.VALENTINE,
    title: 'Valentine Page',
    description: 'Playful proposal card with a fun twist.',
    time: '1 min',
    icon: Heart,
    accent: 'from-rose-100 to-pink-50',
    border: 'border-rose-200',
    text: 'text-rose-900'
  },
  {
    type: PAGE_TYPES.VALENTINE_WISH,
    title: 'Valentine Wish',
    description: 'Send a beautiful wish with a personal note.',
    time: '1 min',
    icon: Sparkles,
    accent: 'from-violet-100 to-slate-50',
    border: 'border-violet-200',
    text: 'text-slate-900'
  }
]

const ChooseType: React.FC = () => {
  const navigate = useNavigate()

  const handleTypeSelect = (type: string) => {
    if (type === PAGE_TYPES.ANONYMOUS) {
      navigate('/anonymous')
      return
    }
    navigate(`/create/${type}`)
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold">
            <Sparkles size={14} />
            Choose a format
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4">
            Pick the page you want to create
          </h1>
          <p className="text-lg text-slate-600 mt-3">
            Each page creates a shareable link you can send instantly.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <motion.button
                key={card.type}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTypeSelect(card.type)}
                className={`text-left p-6 rounded-2xl border ${card.border} bg-gradient-to-br ${card.accent} shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition-all`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-white/90 border ${card.border} flex items-center justify-center ${card.text}`}>
                    <Icon size={22} />
                  </div>
                  <div className="text-xs font-semibold text-slate-600 bg-white/80 border border-slate-200 rounded-full px-2 py-1">
                    {card.time}
                  </div>
                </div>
                <div className="mt-5">
                  <h3 className={`text-xl font-semibold ${card.text}`}>{card.title}</h3>
                  <p className="text-sm text-slate-600 mt-2">{card.description}</p>
                </div>
              </motion.button>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            to="/"
            className="text-slate-500 hover:text-slate-700 underline"
          >
            Back to home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default ChooseType
