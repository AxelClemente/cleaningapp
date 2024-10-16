import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const workers = await prisma.worker.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    })

    const formattedWorkers = workers.map(worker => ({
      id: worker.id,
      name: worker.user.name,
      email: worker.user.email,
      description: worker.description,
      hourlyRate: worker.hourlyRate,
      profilePicture: worker.profilePicture,
      images: worker.images, // Incluimos las imágenes adicionales
      rating: worker.rating,
      reviewCount: worker.reviewCount,
      location: worker.location,
      phoneNumber: worker.phoneNumber,
    }))

    return NextResponse.json(formattedWorkers)
  } catch (error) {
    console.error('Error fetching workers:', error)
    return NextResponse.json({ error: 'Failed to fetch workers' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// Añadimos una nueva función POST para crear o actualizar un trabajador
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, ...workerData } = body

    const worker = await prisma.worker.upsert({
      where: { userId: userId },
      update: workerData,
      create: { userId, ...workerData },
    })

    return NextResponse.json(worker)
  } catch (error) {
    console.error('Error creating/updating worker:', error)
    return NextResponse.json({ error: 'Failed to create/update worker' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
