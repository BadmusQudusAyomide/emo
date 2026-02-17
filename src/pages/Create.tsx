import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PAGE_TYPES, PAGE_TYPE_CONFIG, TONES, OCCASIONS, MAX_MESSAGE_LENGTH, VALENTINE_WISH_TYPES } from '../utils/constants'
import { fadeInUp, containerVariants, itemVariants } from '../utils/animations'
import { createPage } from '../services/supabase'

const birthdayThemes = [
  { id: 'gold', name: 'Gold Glow', class: 'bg-gradient-to-br from-amber-100 to-rose-100' },
  { id: 'sky', name: 'Sky Bright', class: 'bg-gradient-to-br from-sky-100 to-blue-50' },
  { id: 'garden', name: 'Garden Soft', class: 'bg-gradient-to-br from-emerald-100 to-teal-50' }
]

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
      const isBirthday = type === PAGE_TYPES.BIRTHDAY || type === PAGE_TYPES.BIRTHDAY_ADVANCE
      const pageData = {
        ...formData,
        occasion: isBirthday ? OCCASIONS.BIRTHDAY : formData.occasion,
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
          { value: TONES.ROMANTIC, label: 'Romantic', desc: 'Sweet and heartfelt' },
          { value: TONES.PLAYFUL, label: 'Playful', desc: 'Fun and lighthearted' },
          { value: TONES.MIXED, label: 'Mixed', desc: 'A bit of everything' }
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
                placeholder="Yes!"
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

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dedication Song (Optional)
              </label>
              <input
                type="text"
                value={formData.content.songLink || ''}
                onChange={(e) => handleContentChange('songLink', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Spotify or YouTube link"
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

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dedication Song (Optional)
              </label>
              <input
                type="text"
                value={formData.content.songLink || ''}
                onChange={(e) => handleContentChange('songLink', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Spotify or YouTube link"
              />
            </motion.div>
          </motion.div>
        )

      case PAGE_TYPES.BIRTHDAY:
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Birthday Person
              </label>
              <input
                type="text"
                value={formData.content.receiverName || ''}
                onChange={(e) => handleContentChange('receiverName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Their name..."
              />
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birthday Date
                </label>
                <input
                  type="date"
                  value={formData.content.birthdayDate || ''}
                  onChange={(e) => handleContentChange('birthdayDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age (Optional)
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.content.age || ''}
                  onChange={(e) => handleContentChange('age', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g. 21"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Birthday Message
              </label>
              <textarea
                value={formData.content.customMessage || ''}
                onChange={(e) => handleContentChange('customMessage', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-32"
                placeholder="Write a sweet birthday message..."
                maxLength={MAX_MESSAGE_LENGTH}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Signature
              </label>
              <input
                type="text"
                value={formData.content.signature || ''}
                onChange={(e) => handleContentChange('signature', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="From, Your Name"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dedication Song (Optional)
              </label>
              <input
                type="text"
                value={formData.content.songLink || ''}
                onChange={(e) => handleContentChange('songLink', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Spotify or YouTube link"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {birthdayThemes.map((theme) => (
                  <div
                    key={theme.id}
                    onClick={() => handleContentChange('theme', theme.id)}
                    className={`p-3 rounded-lg cursor-pointer border-2 text-center ${formData.content.theme === theme.id
                      ? 'border-amber-500'
                      : 'border-gray-200'
                      }`}
                  >
                    <div className={`h-8 rounded mb-2 ${theme.class}`}></div>
                    <div className="text-xs">{theme.name}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )

      case PAGE_TYPES.BIRTHDAY_ADVANCE:
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Birthday Person
              </label>
              <input
                type="text"
                value={formData.content.receiverName || ''}
                onChange={(e) => handleContentChange('receiverName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Their name..."
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Birthday Date
              </label>
              <input
                type="date"
                value={formData.content.birthdayDate || ''}
                onChange={(e) => handleContentChange('birthdayDate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Countdown Message
              </label>
              <input
                type="text"
                value={formData.content.countdownMessage || ''}
                onChange={(e) => handleContentChange('countdownMessage', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Only a few days to go..."
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Highlights (one per line)
              </label>
              <textarea
                value={formData.content.planHighlights || ''}
                onChange={(e) => handleContentChange('planHighlights', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-28"
                placeholder="Breakfast surprise\nPhoto session\nDinner date"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surprise Note
              </label>
              <textarea
                value={formData.content.surpriseNote || ''}
                onChange={(e) => handleContentChange('surpriseNote', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-24"
                placeholder="A little note about what's coming..."
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gift Ideas (optional)
              </label>
              <textarea
                value={formData.content.giftIdeas || ''}
                onChange={(e) => handleContentChange('giftIdeas', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-24"
                placeholder="Luxury flowers, hand-written letter..."
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Playlist Link (optional)
              </label>
              <input
                type="text"
                value={formData.content.playlistLink || ''}
                onChange={(e) => handleContentChange('playlistLink', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Spotify or YouTube link"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dedication Song (Optional)
              </label>
              <input
                type="text"
                value={formData.content.songLink || ''}
                onChange={(e) => handleContentChange('songLink', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Spotify or YouTube link"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {birthdayThemes.map((theme) => (
                  <div
                    key={theme.id}
                    onClick={() => handleContentChange('theme', theme.id)}
                    className={`p-3 rounded-lg cursor-pointer border-2 text-center ${formData.content.theme === theme.id
                      ? 'border-indigo-500'
                      : 'border-gray-200'
                      }`}
                  >
                    <div className={`h-8 rounded mb-2 ${theme.class}`}></div>
                    <div className="text-xs">{theme.name}</div>
                  </div>
                ))}
              </div>
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
                <div className="text-4xl mb-2">Photo</div>
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
            Create Your {config.title}
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
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Creating...' : 'Create Page'}
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
