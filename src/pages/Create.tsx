import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PAGE_TYPES, PAGE_TYPE_CONFIG, TONES, OCCASIONS, BACKGROUND_STYLES, MAX_MESSAGE_LENGTH, VALENTINE_WISH_TYPES } from '../utils/constants'
import { fadeInUp, containerVariants, itemVariants } from '../utils/animations'
import { createPage } from '../services/supabase'

const Create: React.FC = () => {
  const { type } = useParams<{ type: string }>()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    type: type as keyof typeof PAGE_TYPES,
    tone: TONES.ROMANTIC,
    occasion: OCCASIONS.VALENTINE,
    content: {} as Record<string, any>
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (type === PAGE_TYPES.ANONYMOUS) {
      navigate('/anonymous')
    }
  }, [type, navigate])

  if (!type || !PAGE_TYPE_CONFIG[type as keyof typeof PAGE_TYPE_CONFIG]) {
    return <div>Invalid page type</div>
  }

  const config = PAGE_TYPE_CONFIG[type as keyof typeof PAGE_TYPE_CONFIG]

  const handleToneSelect = (tone: string) => {
    setFormData(prev => ({ ...prev, tone: tone as any }))
    setStep(2)
  }

  const handleContentChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, [field]: value }
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const slug = Math.random().toString(36).substring(2, 15)
      const pageData = {
        ...formData,
        slug,
        is_anonymous: type === PAGE_TYPES.ANONYMOUS
      }

      const result = await createPage(pageData)
      navigate(`/preview/${result.slug}`)
    } catch (err) {
      setError('Failed to create page. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderToneSelection = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto"
    >
      <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-8">
        Choose the Tone
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { value: TONES.ROMANTIC, label: '💕 Romantic', desc: 'Sweet and heartfelt' },
          { value: TONES.PLAYFUL, label: '😄 Playful', desc: 'Fun and lighthearted' },
          { value: TONES.MIXED, label: '🌈 Mixed', desc: 'A bit of everything' }
        ].map((tone) => (
          <motion.div
            key={tone.value}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleToneSelect(tone.value)}
            className={`p-6 rounded-xl cursor-pointer border-2 transition-all ${formData.tone === tone.value
              ? 'border-romantic-500 bg-romantic-50'
              : 'border-gray-200 hover:border-romantic-300'
              }`}
          >
            <div className="text-2xl font-semibold mb-2">{tone.label}</div>
            <div className="text-gray-600 text-sm">{tone.desc}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  const renderContentForm = () => {
    switch (type) {
      case PAGE_TYPES.MESSAGE:
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receiver's Name
              </label>
              <input
                type="text"
                value={formData.content.receiverName || ''}
                onChange={(e) => handleContentChange('receiverName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter their name..."
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.content.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="A title for your message..."
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message ({(formData.content.message || '').length}/{MAX_MESSAGE_LENGTH})
              </label>
              <textarea
                value={formData.content.message || ''}
                onChange={(e) => handleContentChange('message', e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-romantic-500 focus:border-transparent h-32"
                placeholder="Write your heartfelt message..."
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Style
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {BACKGROUND_STYLES.map((style) => (
                  <div
                    key={style.id}
                    onClick={() => handleContentChange('backgroundStyle', style.id)}
                    className={`p-3 rounded-lg cursor-pointer border-2 text-center ${formData.content.backgroundStyle === style.id
                      ? 'border-romantic-500'
                      : 'border-gray-200'
                      }`}
                  >
                    <div className={`h-8 rounded mb-2 ${style.class}`}></div>
                    <div className="text-xs">{style.name}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )

      case PAGE_TYPES.VALENTINE:
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receiver's Name
              </label>
              <input
                type="text"
                value={formData.content.receiverName || ''}
                onChange={(e) => handleContentChange('receiverName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter their name..."
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Text (Optional)
              </label>
              <input
                type="text"
                value={formData.content.questionText || ''}
                onChange={(e) => handleContentChange('questionText', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Will you be my Valentine?"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yes Button Text
              </label>
              <input
                type="text"
                value={formData.content.yesButtonText || ''}
                onChange={(e) => handleContentChange('yesButtonText', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Yes! 💕"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                No Button Text
              </label>
              <input
                type="text"
                value={formData.content.noButtonText || ''}
                onChange={(e) => handleContentChange('noButtonText', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="No"
              />
            </motion.div>
          </motion.div>
        )

      case PAGE_TYPES.VALENTINE_WISH:
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receiver's Name
              </label>
              <input
                type="text"
                value={formData.content.receiverName || ''}
                onChange={(e) => handleContentChange('receiverName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter their name..."
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wish Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {VALENTINE_WISH_TYPES.map((wishType) => (
                  <div
                    key={wishType.id}
                    onClick={() => handleContentChange('wishType', wishType.id)}
                    className={`p-3 rounded-lg cursor-pointer border-2 text-center ${formData.content.wishType === wishType.id
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-300'
                      }`}
                  >
                    <div className="font-medium">{wishType.name}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Message
              </label>
              <textarea
                value={formData.content.customMessage || ''}
                onChange={(e) => handleContentChange('customMessage', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent h-32"
                placeholder="Add your personal touch..."
                maxLength={MAX_MESSAGE_LENGTH}
              />
              <div className="text-sm text-gray-500 mt-1">
                {(formData.content.customMessage || '').length}/{MAX_MESSAGE_LENGTH}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Signature
              </label>
              <input
                type="text"
                value={formData.content.signature || ''}
                onChange={(e) => handleContentChange('signature', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="With love, Your Name"
              />
            </motion.div>
          </motion.div>
        )

      case PAGE_TYPES.ANONYMOUS:
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                value={formData.content.message || ''}
                onChange={(e) => handleContentChange('message', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent h-32"
                placeholder="Share your feelings anonymously..."
                maxLength={MAX_MESSAGE_LENGTH}
              />
              <div className="text-sm text-gray-500 mt-1">
                {(formData.content.message || '').length}/{MAX_MESSAGE_LENGTH}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Optional Hint (Optional)
              </label>
              <input
                type="text"
                value={formData.content.hint || ''}
                onChange={(e) => handleContentChange('hint', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="A subtle hint about who you are..."
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.content.allowReply || false}
                  onChange={(e) => handleContentChange('allowReply', e.target.checked)}
                  className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Allow replies from the receiver
                </span>
              </label>
            </motion.div>
          </motion.div>
        )

      case PAGE_TYPES.MEMORY:
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receiver's Name
              </label>
              <input
                type="text"
                value={formData.content.receiverName || ''}
                onChange={(e) => handleContentChange('receiverName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter their name..."
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Photos (Coming Soon)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="text-4xl mb-2">📸</div>
                <p className="text-gray-600">Photo upload will be available after setting up Cloudinary</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Closing Message
              </label>
              <textarea
                value={formData.content.closingMessage || ''}
                onChange={(e) => handleContentChange('closingMessage', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent h-24"
                placeholder="A final heartfelt message..."
              />
            </motion.div>
          </motion.div>
        )

      case PAGE_TYPES.QA:
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receiver's Name
              </label>
              <input
                type="text"
                value={formData.content.receiverName || ''}
                onChange={(e) => handleContentChange('receiverName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter their name..."
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Q&A Answers
              </label>
              <div className="space-y-3">
                {[
                  "What's your favorite memory together?",
                  "What do you love most about them?",
                  "What are you looking forward to?"
                ].map((question, index) => (
                  <div key={index} className="space-y-1">
                    <label className="text-sm text-gray-600">{question}</label>
                    <textarea
                      value={formData.content.answers?.[index] || ''}
                      onChange={(e) => {
                        const answers = [...(formData.content.answers || [])]
                        answers[index] = e.target.value
                        handleContentChange('answers', answers)
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent h-20"
                      placeholder="Your answer..."
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Final Note
              </label>
              <textarea
                value={formData.content.finalNote || ''}
                onChange={(e) => handleContentChange('finalNote', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent h-20"
                placeholder="A final heartfelt message..."
              />
            </motion.div>
          </motion.div>
        )

      default:
        return <div>Page type not implemented yet</div>
    }
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
          <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-2">
            Create Your {config.title.split(' ').slice(1).join(' ')}
          </h1>
          <div className="flex justify-center space-x-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full ${s <= step ? 'bg-pink-500' : 'bg-gray-300'
                  }`}
              />
            ))}
          </div>
        </motion.div>

        {step === 1 && renderToneSelection()}

        {step === 2 && renderContentForm()}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-between mt-8"
          >
            <button
              onClick={() => setStep(1)}
              className="btn-secondary"
            >
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Creating...' : 'Create Page →'}
            </button>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg text-center"
          >
            {error}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Create
