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