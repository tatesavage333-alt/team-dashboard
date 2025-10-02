import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ApiResponse } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset,
      include: {
        knowledgeBaseEntry: true
      }
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: messages
    })

  } catch (error) {
    console.error('Messages API error:', error)
    
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch messages'
    }, { status: 500 })
  }
}
