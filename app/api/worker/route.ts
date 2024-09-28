import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Asegúrate de que todos los campos necesarios estén presentes
    if (!body.phoneNumber || !body.location /* ... otros campos requeridos */) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Busca el usuario existente
    const existingUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Crea el nuevo trabajador y conéctalo con el usuario existente
    const newWorker = await prisma.worker.create({
      data: {
        ...body,
        user: {
          connect: { id: existingUser.id }
        }
      },
    })

    return NextResponse.json(newWorker)
  } catch (error) {
    console.error('Error in worker registration:', error)
    return NextResponse.json({ error: 'Failed to register worker' }, { status: 500 })
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

    // Combinar la información del usuario y del trabajador
    const workerProfile = {
      ...user.worker,
      name: user.name,
      email: user.email,
    };

    console.log('Worker profile found:', workerProfile);
    return NextResponse.json(workerProfile);
  } catch (error) {
    console.error('Error fetching worker profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
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