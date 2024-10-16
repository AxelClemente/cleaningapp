import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    console.log("Worker API - Session:", session)

    if (!session || !session.user) {
      console.log("Worker API - No session or user found")
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const body = await request.json()

    // Update required fields check
    if (!body.phoneNumber || !body.location || !body.bankName || !body.accountHolder || !body.accountNumber || !body.description || body.hourlyRate === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Busca el usuario existente
    const existingUser = await prisma.user.findUnique({
      where: { email: session.user.email ?? '' },
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Crea el nuevo trabajador y conéctalo con el usuario existente
    const newWorker = await prisma.worker.create({
      data: {
        ...body,
        hourlyRate: parseFloat(body.hourlyRate), // Ensure hourlyRate is stored as a float
        user: {
          connect: { id: existingUser.id }
        }
      },
    })

    console.log("Worker API - Worker created successfully:", newWorker)

    return NextResponse.json(newWorker)
  } catch (error) {
    console.error('Error in worker registration:', error)
    return NextResponse.json({ error: 'Failed to register worker' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  const checkWorkerStatus = searchParams.get('checkWorkerStatus')

  if (checkWorkerStatus === 'true' && email) {
    try {
      const worker = await prisma.worker.findFirst({
        where: { user: { email } },
      })

      return NextResponse.json({ isWorker: !!worker })
    } catch (error) {
      console.error('Error checking worker status:', error)
      return NextResponse.json({ error: 'Failed to check worker status' }, { status: 500 })
    } finally {
      await prisma.$disconnect()
    }
  }

  // Existing GET logic for fetching worker profile
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { worker: true },
    })

    if (!user || !user.worker) {
      return NextResponse.json({ error: 'Worker profile not found' }, { status: 404 })
    }

    const workerProfile = {
      ...(typeof user.worker === 'object' ? user.worker : {}),
      name: user.name,
      email: user.email,
    }

    return NextResponse.json(workerProfile)
  } catch (error) {
    console.error('Error fetching worker profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Worker ID is required' }, { status: 400 })
    }

    const body = await request.json()

    console.log('Updating worker with ID:', id)

    const updatedWorker = await prisma.worker.update({
      where: { id },
      data: body,
    })

    return NextResponse.json(updatedWorker)
  } catch (error) {
    console.error('Error updating worker:', error)
    return NextResponse.json({ error: 'Failed to update worker' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
