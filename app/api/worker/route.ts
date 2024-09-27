import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  console.log('Worker registration request received')

  try {
    const session = await getServerSession(authOptions)
    console.log('Session:', session)

    if (!session || !session.user?.email) {
      console.log('Unauthorized: No valid session')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    console.log('Form data received:', Object.fromEntries(formData))

    const phoneNumber = formData.get('phoneNumber') as string
    const location = formData.get('location') as string
    const bankName = formData.get('bankName') as string
    const accountHolder = formData.get('accountHolder') as string
    const accountNumber = formData.get('accountNumber') as string
    const profilePicture = formData.get('profilePicture') as File | null

    // Validación de campos requeridos
    if (!phoneNumber || !location || !bankName || !accountHolder || !accountNumber) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      console.log('User not found:', session.user.email)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('User found:', user.id)

    let profilePictureUrl = null
    if (profilePicture) {
      // Implement image upload logic here
      profilePictureUrl = '/placeholder-profile-picture.jpg'
    }

    const workerData = {
      userId: user.id,
      phoneNumber,
      location,
      bankName,
      accountHolder,
      accountNumber,
      profilePicture: profilePictureUrl,
    }

    console.log('Attempting to create worker with data:', workerData)

    const worker = await prisma.worker.create({
      data: workerData,
    })

    console.log('Worker created successfully:', worker)

    return NextResponse.json({ success: true, worker })
  } catch (error) {
    console.error('Error in worker registration:', error)
    return NextResponse.json({ error: 'Failed to register worker', details: error }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET(request: Request) {
  console.log('GET /api/worker called');
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', session);

    if (!session || !session.user?.email) {
      console.log('No session or email found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { worker: true },
    });
    console.log('User found:', user);

    if (!user || !user.worker) {
      console.log('No worker profile found for user');
      return NextResponse.json({ error: 'Worker profile not found' }, { status: 404 });
    }

    console.log('Worker profile found:', user.worker);
    return NextResponse.json(user.worker);
  } catch (error) {
    console.error('Error fetching worker profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}