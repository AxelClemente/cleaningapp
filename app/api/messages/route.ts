import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { prisma } from '@/lib/prisma';
import { authOptions } from '../../../pages/api/auth/[...nextauth]'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { receiverId, orderId, content } = await req.json()
  
  console.log('POST request for new message', { senderId: session.user.id, receiverId, orderId, content });

  try {
    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId,
        orderId,
        content,
      },
    })
    console.log('Created message:', message);
    return NextResponse.json(message)
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const orderId = searchParams.get('orderId')

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        orderId: orderId,
      },
      orderBy: {
        timestamp: 'asc',
      },
      include: {
        sender: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { messageId } = await req.json()

  try {
    const message = await prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    })
    return NextResponse.json(message)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to mark message as read' }, { status: 500 })
  }
}
