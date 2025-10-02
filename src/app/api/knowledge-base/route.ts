import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { moderateContent } from '@/lib/moderation'
import { ApiResponse } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const pinned = searchParams.get('pinned')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}

    if (search) {
      where.OR = [
        { question: { contains: search, mode: 'insensitive' } },
        { answer: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category) {
      where.category = category
    }

    if (pinned === 'true') {
      where.isPinned = true
    }

    const entries = await prisma.knowledgeBaseEntry.findMany({
      where,
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
      skip: offset,
      include: {
        message: true
      }
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: entries
    })

  } catch (error) {
    console.error('Knowledge base GET error:', error)
    
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch knowledge base entries'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { messageId, title, tags, category } = await request.json()

    if (!messageId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Message ID is required'
      }, { status: 400 })
    }

    // Moderate custom title if provided
    if (title) {
      const titleModeration = moderateContent(title)
      if (titleModeration.suggestedAction === 'block') {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: 'Title contains inappropriate content'
        }, { status: 400 })
      }
    }

    // Moderate tags if provided
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        const tagModeration = moderateContent(tag)
        if (tagModeration.suggestedAction === 'block') {
          return NextResponse.json<ApiResponse>({
            success: false,
            error: 'Tags contain inappropriate content'
          }, { status: 400 })
        }
      }
    }

    // Get the message
    const message = await prisma.message.findUnique({
      where: { id: messageId }
    })

    if (!message) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Message not found'
      }, { status: 404 })
    }

    // Check if already saved
    const existing = await prisma.knowledgeBaseEntry.findUnique({
      where: { messageId }
    })

    if (existing) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'This message is already saved to the knowledge base'
      }, { status: 400 })
    }

    // Create knowledge base entry
    const entry = await prisma.knowledgeBaseEntry.create({
      data: {
        question: message.question,
        answer: message.answer,
        title: title || null,
        tags: tags ? JSON.stringify(tags) : null,
        category: category || null,
        messageId: messageId
      },
      include: {
        message: true
      }
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: entry
    })

  } catch (error) {
    console.error('Knowledge base POST error:', error)
    
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to save to knowledge base'
    }, { status: 500 })
  }
}
