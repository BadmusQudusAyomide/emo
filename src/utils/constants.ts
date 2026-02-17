export const PAGE_TYPES = {
  MEMORY: 'memory',
  VALENTINE: 'valentine',
  VALENTINE_WISH: 'valentine_wish',
  ANONYMOUS: 'anonymous',
  BIRTHDAY: 'birthday',
  BIRTHDAY_ADVANCE: 'birthday_advance'
} as const

export const TONES = {
  ROMANTIC: 'romantic',
  PLAYFUL: 'playful',
  MIXED: 'mixed'
} as const

export const OCCASIONS = {
  VALENTINE: 'valentine',
  BIRTHDAY: 'birthday',
  OTHER: 'other'
} as const

export const PAGE_TYPE_CONFIG = {
  [PAGE_TYPES.MEMORY]: {
    title: 'Memory Page',
    description: 'Share memories with photos and captions',
    fields: ['receiverName', 'images', 'captions', 'closingMessage']
  },
  [PAGE_TYPES.VALENTINE]: {
    title: 'Will You Be My Valentine?',
    description: 'The classic proposal with a playful twist',
    fields: ['receiverName', 'questionText', 'yesButtonText', 'noButtonText']
  },
  [PAGE_TYPES.VALENTINE_WISH]: {
    title: "Valentine's Day Wish",
    description: 'Send beautiful Valentine\'s Day wishes',
    fields: ['receiverName', 'wishType', 'customMessage', 'signature']
  },
  [PAGE_TYPES.ANONYMOUS]: {
    title: 'Anonymous Inbox',
    description: 'Share feelings without revealing your identity',
    fields: ['message', 'hint', 'allowReply']
  },
  [PAGE_TYPES.BIRTHDAY]: {
    title: 'Birthday Page',
    description: 'A beautiful birthday page with a heartfelt note',
    fields: ['receiverName', 'birthdayDate', 'age', 'customMessage', 'signature', 'theme']
  },
  [PAGE_TYPES.BIRTHDAY_ADVANCE]: {
    title: 'Birthday In Advance',
    description: 'A premium birthday plan with countdown and surprises',
    fields: ['receiverName', 'birthdayDate', 'countdown', 'planHighlights', 'surpriseNote', 'giftIdeas', 'playlistLink', 'theme']
  }
} as const

export const BACKGROUND_STYLES = [
  { id: 'gradient-pink', name: 'Pink Gradient', class: 'bg-gradient-to-br from-pink-100 to-pink-200' },
  { id: 'gradient-purple', name: 'Purple Dream', class: 'bg-gradient-to-br from-purple-100 to-pink-200' },
  { id: 'gradient-sunset', name: 'Sunset', class: 'bg-gradient-to-br from-orange-100 to-pink-200' },
  { id: 'hearts', name: 'Hearts Pattern', class: 'bg-pink-50' },
  { id: 'stars', name: 'Starlight', class: 'bg-gradient-to-br from-blue-50 to-purple-100' }
] as const

export const VALENTINE_WISH_TYPES = [
  { id: 'romantic', name: 'Romantic', template: "My dearest {name}, on this Valentine's Day, I want you to know that you are my everything..." },
  { id: 'sweet', name: 'Sweet & Simple', template: "Happy Valentine's Day, {name}! You make every day brighter..." },
  { id: 'passionate', name: 'Passionate', template: '{name}, my love for you burns brighter than a thousand suns...' },
  { id: 'playful', name: 'Playful', template: "Hey {name}! Guess what? You're stuck with me on Valentine's Day..." },
  { id: 'poetic', name: 'Poetic', template: 'Like roses bloom in spring, my love for you, {name}, forever sings...' }
] as const

export const MAX_MESSAGE_LENGTH = 500
export const MAX_IMAGES = 6
export const MAX_ANSWERS = 5
export const DEFAULT_EXPIRY_HOURS = 72
