import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react'
import { fadeInUp, float } from '../utils/animations'

const Home: React.FC = () => {
  return (
    <div className="min-h-screen px-4 py-12 relative overflow-hidden">
      <div className="absolute -top-32 -right-24 w-80 h-80 bg-gradient-to-br from-amber-100 to-rose-100 rounded-full blur-3xl opacity-80" />
      <div className="absolute bottom-0 -left-20 w-72 h-72 bg-gradient-to-br from-slate-100 to-amber-100 rounded-full blur-3xl opacity-70" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight"
            animate={float.animate}
          >
            Emo
          </motion.h1>

          <motion.h2
            className="text-2xl md:text-3xl text-slate-700 mt-4"
            variants={fadeInUp}
          >
            Create messages people actually share.
          </motion.h2>

          <motion.p
            className="text-lg text-slate-600 mt-6 max-w-xl"
            variants={fadeInUp}
          >
            Build a page, get a link, and collect reactions. No login, no noise.
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/choose-type"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-black transition-colors"
            >
              Start creating
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/choose-type"
              className="inline-flex items-center gap-2 border border-slate-300 text-slate-800 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              See all formats
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
            <div className="inline-flex items-center gap-2 bg-white/80 border border-slate-200 rounded-full px-3 py-1">
              <Sparkles size={14} />
              Built for sharing
            </div>
            <div className="inline-flex items-center gap-2 bg-white/80 border border-slate-200 rounded-full px-3 py-1">
              <ShieldCheck size={14} />
              No login required
            </div>
            <div className="inline-flex items-center gap-2 bg-white/80 border border-slate-200 rounded-full px-3 py-1">
              <MessageCircle size={14} />
              Replies in seconds
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-[0_30px_80px_rgba(15,23,42,0.15)] border border-slate-100 p-6"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Preview</span>
            <span>Live link</span>
          </div>
          <div className="mt-4 rounded-2xl bg-gradient-to-br from-slate-50 to-white p-6 border border-slate-100">
            <div className="text-sm text-slate-500">Formats</div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">Pick a vibe, get a link.</div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Message Page', tone: 'Clean and heartfelt', accent: 'from-sky-100 to-slate-50' },
                { title: 'Memory Page', tone: 'Moments in pictures', accent: 'from-emerald-100 to-teal-50' },
                { title: 'Q&A Page', tone: 'Short answers, big feels', accent: 'from-violet-100 to-slate-50' },
                { title: 'Anonymous Inbox', tone: 'Say it without your name', accent: 'from-amber-100 to-rose-50' }
              ].map((card) => (
                <div
                  key={card.title}
                  className={`rounded-xl border border-slate-100 bg-gradient-to-br ${card.accent} p-4`}
                >
                  <div className="text-sm text-slate-600">{card.title}</div>
                  <div className="mt-2 text-base font-semibold text-slate-900">{card.tone}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-slate-600">
            {[
              { label: 'Pick type' },
              { label: 'Generate link' },
              { label: 'Share' }
            ].map((step, index) => (
              <div key={step.label} className="rounded-xl border border-slate-200 bg-slate-50 py-3">
                <div className="text-base font-semibold text-slate-900">{index + 1}</div>
                <div className="mt-1">{step.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Home
