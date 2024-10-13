
'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Header } from './components/Header'
import { PlayIcon, CloudIcon } from 'lucide-react' // Añadimos CloudIcon
import { ActionButtonCloudinary } from './components/ActionButtonCloudinary'

export default function HomePage() {
  const { data: session } = useSession()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const handleUpload = (error: any, result: any, widget: any) => {
    if (error) {
      console.error("Upload error:", error);
      return;
    }
    console.log("Upload result:", result);
    console.log("Widget info:", widget);
  }

  // Obtener el valor del preset desde la variable de entorno
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="mx-8 sm:mx-16 md:mx-24 lg:mx-32">
        <Header 
          doctorName={`Hi again ${session?.user?.name || "Express Cleaning Mallorca"}`}
          clinicName="Building a community where cleaners and clients come together as a team!"
        />
      </div>
      <main className="flex-grow flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to TidyTeam</h1>
        <p className="text-xl mb-8">We connect expert cleaners with homes in your neighborhood!</p>
        <div className="flex items-center space-x-4">
          <Link 
            href="/HomeDashboard" 
            className="px-6 py-3 bg-[#724fff] text-white rounded-full font-semibold hover:bg-[#6240e3] transition-colors"
          >
            Schedule a Cleaning Service
          </Link>
          <button 
            className="flex items-center text-gray-700 font-semibold hover:text-[#724fff] transition-colors"
            onClick={handleOpenModal}
          >
            <span className="w-8 h-8 bg-[#724fff] text-white rounded-full flex items-center justify-center mr-2">
              <PlayIcon className="w-4 h-4" />
            </span>
            Watch demo
          </button>
          <span className="ml-2 text-gray-400 text-sm">2 min</span>

        </div>
      </main>
    </div>
  )
}
