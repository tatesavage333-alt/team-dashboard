import { NextRequest, NextResponse } from 'next/server'
import { getAssistantResponse } from '@/lib/openai'
import { prisma } from '@/lib/db'
import { moderateContent, sanitizeContent } from '@/lib/moderation'
import { ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Message is required and must be a string'
      }, { status: 400 })
    }

    // Moderate the input message
    const moderation = moderateContent(message)

    if (moderation.suggestedAction === 'block') {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: `Message blocked: ${moderation.reason}. Please keep conversations professional and appropriate.`
      }, { status: 400 })
    }

    // Sanitize the message if needed
    const sanitizedMessage = moderation.suggestedAction === 'warn'
      ? sanitizeContent(message)
      : message

    // Get response from OpenAI
    const aiResponse = await getAssistantResponse(sanitizedMessage)

    // Save the conversation to the database (save original message, not sanitized)
    const savedMessage = await prisma.message.create({
      data: {
        question: message,
        answer: aiResponse,
      }
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        id: savedMessage.id,
        question: savedMessage.question,
        answer: savedMessage.answer,
        createdAt: savedMessage.createdAt
      }
    })

  } catch (error) {
    console.error('Chat API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to process chat message'
    
    return NextResponse.json<ApiResponse>({
      success: false,
      error: errorMessage
    }, { status: 500 })
  }
}
