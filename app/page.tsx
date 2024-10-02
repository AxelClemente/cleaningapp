'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { SignInButton } from './components/SignInButton'
import { useState } from 'react'
import { Modal } from './components/About'

export default function HomePage() {
  const { data: session } = useSession()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="mx-8 sm:mx-16 md:mx-24 lg:mx-32">
        <Header 
          doctorName={session?.user?.name || "Express Cleaning Mallorca"}
          clinicName="A Local Small Business Dedicated To You!"
        />
      </div>
      <main className="flex-grow flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to TidyTeam </h1>
        <p className="text-xl mb-8">We connect expert cleaners with homes in your neighborhood!</p>
        <div className="flex space-x-4">
         
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