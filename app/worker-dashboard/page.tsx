import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../pages/api/auth/[...nextauth]'
import { redirect } from 'next/navigation'
import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()

export default async function WorkerDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    redirect('/api/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    redirect('/api/auth/signin')
  }

  // Check if the user is a worker
  const worker = await prisma.Worker.findUnique({
    where: { userId: user.id },
  })

  if (!worker) {
    redirect('/worker-form')
  }

  return (
    <div>
      <h1>Worker Dashboard</h1>
      <p>Welcome, {user.name}!</p>
      {/* Add more dashboard content here */}
    </div>
  )
}