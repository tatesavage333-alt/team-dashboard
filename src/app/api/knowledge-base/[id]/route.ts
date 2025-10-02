import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ApiResponse } from '@/types'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { title, tags, category, isPinned } = await request.json()
    const { id } = await params

    const entry = await prisma.knowledgeBaseEntry.update({
      where: { id },
      data: {
        title: title !== undefined ? title : undefined,
        tags: tags !== undefined ? JSON.stringify(tags) : undefined,
        category: category !== undefined ? category : undefined,
        isPinned: isPinned !== undefined ? isPinned : undefined,
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
    console.error('Knowledge base PUT error:', error)
    
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to update knowledge base entry'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.knowledgeBaseEntry.delete({
      where: { id }
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { id }
    })

  } catch (error) {
    console.error('Knowledge base DELETE error:', error)
    
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to delete knowledge base entry'
    }, { status: 500 })
  }
}
