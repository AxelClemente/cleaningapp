'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { WorkerCard } from "@/components/Worker-card"
import { Header } from "@/components/Header"
import { WorkerProfile } from '@/types/interfaces'

export default function HirePage() {
  const [workers, setWorkers] = useState<WorkerProfile[]>([])
  const { data: session } = useSession()

  useEffect(() => {
    const fetchWorkers = async () => {
      const response = await fetch('/api/workers')
      if (response.ok) {
        const data = await response.json()
        setWorkers(data)
      }
    }
    fetchWorkers()
  }, [])

  return (
    <>
      <Header doctorName="Dr. Smith" clinicName="Remember everyone starts somewhere give new members a chance." className="font-montserrat font-medium text-[#002b34]" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 font-['Montserrat'] text-[#002b34]">
          New Members
        </h1>
        <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {workers.map((worker, index) => (
            <WorkerCard
              key={worker.id || index}
              name={worker.name ?? ''}
              description={worker.description ?? ''}
              hourlyRate={worker.hourlyRate}
              image={session?.user?.image || worker.image}
              profilePicture={worker.profilePicture}
              rating={Number(worker.rating) || 0}
              reviewCount={worker.reviewCount ?? 0}
              location={worker.location ?? 'Unknown location'}
            />
          ))}
        </div>
        <h2 className="text-3xl font-bold mb-6 font-['Montserrat'] text-[#002b34]">
          All the TidyTeam
        </h2>
        {/* Here you can add the content for "All the TidyTeam" */}
      </div>
    </>
  )
}
