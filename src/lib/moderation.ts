// Basic content moderation utilities

// List of inappropriate words/phrases (basic example - in production, use a more comprehensive list)
const INAPPROPRIATE_WORDS = [
  // Profanity
  'fuck', 'shit', 'damn', 'bitch', 'asshole', 'bastard',
  // Hate speech indicators
  'hate', 'kill', 'die', 'murder', 'terrorist',
  // Spam indicators
  'click here', 'buy now', 'limited time', 'act now', 'free money',
  'make money fast', 'work from home', 'get rich quick'
]

// Patterns that might indicate spam or inappropriate content
const SPAM_PATTERNS = [
  /(.)\1{4,}/g, // Repeated characters (e.g., "aaaaa")
  /[A-Z]{10,}/g, // Excessive caps
  /\b\d{10,}\b/g, // Long numbers (phone numbers, etc.)
  /(https?:\/\/[^\s]+)/g, // URLs
  /[@#]\w+/g, // Social media handles/hashtags
]

export interface ModerationResult {
  isAppropriate: boolean
  reason?: string
  confidence: number
  flaggedWords?: string[]
  suggestedAction: 'allow' | 'warn' | 'block'
}

export function moderateContent(text: string): ModerationResult {
  const normalizedText = text.toLowerCase().trim()
  
  // Check for empty or very short content
  if (normalizedText.length < 2) {
    return {
      isAppropriate: false,
      reason: 'Content too short',
      confidence: 0.9,
      suggestedAction: 'block'
    }
  }

  // Check for excessive length (potential spam)
  if (text.length > 2000) {
    return {
      isAppropriate: false,
      reason: 'Content too long (potential spam)',
      confidence: 0.8,
      suggestedAction: 'block'
    }
  }

  const flaggedWords: string[] = []
  let inappropriateScore = 0

  // Check for inappropriate words
  INAPPROPRIATE_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi')
    const matches = normalizedText.match(regex)
    if (matches) {
      flaggedWords.push(word)
      inappropriateScore += matches.length * 0.3
    }
  })

  // Check for spam patterns
  let spamScore = 0
  SPAM_PATTERNS.forEach(pattern => {
    const matches = text.match(pattern)
    if (matches) {
      spamScore += matches.length * 0.2
    }
  })

  // Calculate total risk score
  const totalScore = inappropriateScore + spamScore

  // Determine action based on score
  let suggestedAction: 'allow' | 'warn' | 'block' = 'allow'
  let isAppropriate = true
  let reason = ''

  if (totalScore >= 1.0) {
    isAppropriate = false
    suggestedAction = 'block'
    reason = 'High risk content detected'
  } else if (totalScore >= 0.5) {
    isAppropriate = false
    suggestedAction = 'warn'
    reason = 'Potentially inappropriate content'
  } else if (flaggedWords.length > 0) {
    isAppropriate = false
    suggestedAction = 'warn'
    reason = 'Contains flagged words'
  }

  return {
    isAppropriate,
    reason,
    confidence: Math.min(totalScore, 1.0),
    flaggedWords: flaggedWords.length > 0 ? flaggedWords : undefined,
    suggestedAction
  }
}

export function sanitizeContent(text: string): string {
  // Remove or replace inappropriate content
  let sanitized = text

  // Replace flagged words with asterisks
  INAPPROPRIATE_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi')
    sanitized = sanitized.replace(regex, '*'.repeat(word.length))
  })

  // Remove excessive repeated characters
  sanitized = sanitized.replace(/(.)\1{3,}/g, '$1$1$1')

  // Limit consecutive uppercase letters
  sanitized = sanitized.replace(/[A-Z]{5,}/g, (match) => 
    match.charAt(0) + match.slice(1).toLowerCase()
  )

  return sanitized.trim()
}

export function isSpamLike(text: string): boolean {
  const moderation = moderateContent(text)
  return moderation.suggestedAction === 'block' && 
         moderation.reason?.includes('spam')
}

export function containsProfanity(text: string): boolean {
  const moderation = moderateContent(text)
  return moderation.flaggedWords && moderation.flaggedWords.length > 0
}
