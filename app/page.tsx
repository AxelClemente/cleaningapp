'use client'

import Link from 'next/link'
import { useSession, signIn } from 'next-auth/react'
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Header } from './components/Header'
import { VideoModal } from './components/VideoModal'
import { Button } from "./components/Button"
import Footer from "./components/footer"

export default function HomePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const handleJoinAsCleanerClick = () => {
    if (session) {
      router.push('/dashboard')
    } else {
      signIn('google', { callbackUrl: '/dashboard' })
    }
  }

  const handleScheduleCleaningClick = () => {
    if (session) {
      router.push('/dashboard')
    } else {
      signIn('google', { callbackUrl: '/dashboard' })
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="mx-8 sm:mx-16 md:mx-24 lg:mx-32">
        <Header 
          doctorName={`Hi again ${session?.user?.name || "Welcome to TidyTeam"}`}
          clinicName="Building a community where cleaners and clients come together as a team!"
          className="font-montserrat-500 text-[#0a2935]"
        />
      </div>
      <div className="flex-grow flex flex-col lg:flex-row items-center justify-between p-4 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="lg:w-1/2 relative mb-8 lg:mb-0 lg:mr-8">
          <div className="relative rounded-3xl overflow-hidden">
            <Image
              src="/images/Homepage.webp"
              width={600}
              height={600}
              alt="Cleaning service illustration"
              className="rounded-2xl"
            />
          </div>
        </div>
        <div className="lg:w-1/2">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 font-montserrat-alternates text-[#002c3c]">
            We connect expert cleaners in your <span className="text-[#c83a3f]">neighborhood</span> with you.
          </h1>
          <h2 className="text-2xl lg:text-3xl font-bold text-[#002c3c] mb-8">
            <span className="text-[#f6c03f]">TidyTeam</span> is here to make life easier
          </h2>
          <div className="space-y-4">
            <Button 
              className="w-full lg:w-auto text-lg py-9 px-8 bg-[#002a34] hover:bg-[#004963] transition-colors duration-300 font-montserrat-700"
              onClick={handleScheduleCleaningClick}
            >
              Schedule a cleaning service
            </Button>
            <Button 
              variant="link" 
              className="w-full lg:w-auto text-lg text-[#002a34] hover:text-[#004963] underline transition-colors duration-300 font-montserrat-500" 
              onClick={handleJoinAsCleanerClick}
            >
              Or Join as a cleaner
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
      
      <VideoModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}
