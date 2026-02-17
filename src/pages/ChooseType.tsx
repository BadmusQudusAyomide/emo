import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PAGE_TYPE_CONFIG, PAGE_TYPES } from '../utils/constants'
import { fadeInUp, containerVariants, itemVariants } from '../utils/animations'

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
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-4">
            Choose Your Message Type
          </h1>
          <p className="text-xl text-gray-600">
            Select the perfect way to express your feelings
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {Object.entries(PAGE_TYPE_CONFIG).map(([type, config]) => {
            const isAnonymous = type === PAGE_TYPES.ANONYMOUS
            return (
              <motion.div
                key={type}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTypeSelect(type)}
                className={`p-6 rounded-xl cursor-pointer border-2 transition-all ${
                  isAnonymous
                    ? 'border-[#7A3E00] bg-[#FFF8ED] shadow-[0_10px_30px_rgba(122,62,0,0.15)]'
                    : 'border-gray-200 hover:border-pink-300'
                }`}
              >
                <div className="text-4xl mb-4 text-center">
                  {config.title.split(' ')[0]}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {isAnonymous ? 'Anonymous Inbox' : config.title.split(' ').slice(1).join(' ')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {isAnonymous ? 'Generate a link and collect messages in one place' : config.description}
                </p>
              </motion.div>
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
            className="text-gray-500 hover:text-gray-700 underline"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default ChooseType
