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
    <div className="min-h-screen bg-white">
      <header className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <span className="ml-2 font-bold text-xl">
              TidyTeam 
              <span className="text-[rgb(244,232,255)] text-2xl"> 24</span>
            </span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link href="#" className="text-gray-600 hover:text-gray-900">Hire Cleaner</Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">Jobs Available</Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900" onClick={handleOpenModal}>About</Link>
            <Link href="/HomeDashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
          </nav>
          <SignInButton />
        </div>
      </header>

      {/* Modal para About */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="text-2xl font-bold mb-4">About TidyTeam</h2>
        <p className="text-[20px] leading-[28px]">
          We believe that a clean space leads to a clear mind, and we know that finding trusted help for your home can be challenging. That’s why we created TidyTeam—a platform that connects freelance cleaners with homeowners and guests who need reliable cleaning services. Our name, TidyTeam, reflects our commitment to building a community where cleaners and clients come together as a team, sharing in the goal of creating sparkling, welcoming homes. Whether you’re a busy professional, a frequent traveler, or just in need of a helping hand, TidyTeam is here to make life easier—one clean home at a time.
        </p>
      </Modal>

      <main className="container mx-auto px-4 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-5xl font-bold mb-6">Easy home cleaning is just an appointment away!</h1>
            <p className="text-xl mb-8">We connect expert cleaners with homes in your neighborhood.</p>
            <button className="bg-black text-white px-6 py-3 rounded-full flex items-center">
              Get Started
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
              </svg>
            </button>
            <div className="flex mt-4">
              {/* Add small circular images here */}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <Image src="/person1.jpg" alt="Mike" width={100} height={100} className="rounded-full" />
              <p className="mt-2 font-semibold">Mike</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <p className="font-semibold">Quick and adaptable</p>
              <p className="mt-2 text-sm">Hire within a mere 72 hours. Team size from month to month as needed.</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <p className="font-semibold">Remote Talent Pool</p>
              <p className="mt-2 text-sm">Hire skilled remote developers, designers, and product managers with world-class technical and communication skills.</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <Image src="/person2.jpg" alt="Roger" width={100} height={100} className="rounded-full" />
              <p className="mt-2 font-semibold">Roger</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-16 p-4 border-t">
        <div className="flex justify-center space-x-8">
          <Image src="/logo1.png" alt="Company 1" width={80} height={30} />
          <Image src="/logo2.png" alt="Company 2" width={80} height={30} />
          <Image src="/logo3.png" alt="Company 3" width={80} height={30} />
          <Image src="/logo4.png" alt="Company 4" width={80} height={30} />
          <Image src="/logo5.png" alt="Company 5" width={80} height={30} />
          <Image src="/logo6.png" alt="Company 6" width={80} height={30} />
        </div>
      </footer>
    </div>
  )
}