'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Header } from './components/Header'
import { SignInButton } from '@/components/SignInButton'

export default function HomePage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header 
        doctorName={session?.user?.name || "Express Cleaning Mallorca"}
        clinicName="A Local Small Business Dedicated To You!"
      />
      <main className="flex-grow flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Express Cleaning Mallorca</h1>
        <p className="text-xl mb-8">A Local Small Business Dedicated To You!</p>
        <div className="flex space-x-4">
          <SignInButton />
          <Link 
            href="/HomeDashboard" 
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}