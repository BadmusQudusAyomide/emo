import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fadeInUp, float } from '../utils/animations'

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        className="text-center max-w-2xl mx-auto"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-pink-600 mb-6"
          animate={float.animate}
        >
          💖 Emo
        </motion.h1>

        <motion.h2
          className="text-2xl md:text-3xl text-gray-700 mb-8"
          variants={fadeInUp}
        >
          Create Emotional Moments That Matter
        </motion.h2>

        <motion.p
          className="text-lg text-gray-600 mb-12"
          variants={fadeInUp}
        >
          Craft personalized messages, memories, and confessions that touch hearts
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="space-y-4"
        >
          <Link
            to="/choose-type"
            className="btn-primary inline-block text-lg px-8 py-4"
          >
            Start Creating 💝
          </Link>

          <div className="text-sm text-gray-500 mt-4">
            No login required • Free forever • Share instantly
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 text-center text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>Made with ❤️ for couples everywhere</p>
      </motion.div>
    </div>
  )
}

export default Home
