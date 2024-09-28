'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { WorkerProfile } from '@/types/interfaces'
import { Star, MapPin, Phone, Mail } from 'lucide-react'
import { Header } from '../components/Header'

export default function DashboardWorker() {
  const { data: session } = useSession()
  const [workerData, setWorkerData] = useState<WorkerProfile | null>(null)

  useEffect(() => {
    const fetchWorkerData = async () => {
      if (session?.user?.email) {
        const response = await fetch(`/api/worker?email=${session.user.email}`)
        if (response.ok) {
          const data = await response.json()
          setWorkerData(data)
        }
      }
    }
    fetchWorkerData()
  }, [session])

  if (!workerData) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <Header 
          doctorName={workerData.name || 'Worker Name'} 
          clinicName="CleaningApp"
        />
      </div>
      <main className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 p-6 bg-gray-50">
              <div className="text-center mb-6">
                <Image
                  src={workerData.profilePicture || '/default-avatar.png'}
                  alt={workerData.name}
                  width={120}
                  height={120}
                  className="rounded-full mx-auto"
                />
                <h2 className="text-xl font-semibold mt-2">{workerData.name}</h2>
                <p className="text-gray-600">Cleaning Professional</p>
                <div className="flex justify-center items-center mt-2">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} className="text-yellow-400 fill-current" size={16} />
                  ))}
                  <Star className="text-yellow-400" size={16} />
                  <span className="ml-2 text-red-500">128</span>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Contact Information</h3>
                <p className="flex items-center">
                  <Mail className="mr-2" size={16} /> {workerData.email}
                </p>
                <p className="flex items-center">
                  <Phone className="mr-2" size={16} /> {workerData.phoneNumber}
                </p>
                <p className="flex items-center">
                  <MapPin className="mr-2" size={16} /> {workerData.location}
                </p>
              </div>
              <div className="mt-6">
                <h3 className="font-semibold">Bank Information</h3>
                <p>Bank: {workerData.bankName}</p>
                <p>Account Holder: {workerData.accountHolder}</p>
                <p>Account Number: {workerData.accountNumber}</p>
              </div>
            </div>
            <div className="md:w-2/3 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Jobs (5)</h3>
                <button className="bg-blue-500 text-white px-3 py-1 rounded">+ Add</button>
              </div>
              <div className="space-y-4">
                {['KJ', 'Completed Job', 'RO', 'Pending Job', 'DJ'].map((initial, index) => (
                  <div key={index} className="flex items-start border-l-4 border-blue-500 pl-4 py-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                      index % 2 === 0 ? 'bg-green-500' : 'bg-yellow-500'
                    }`}>
                      {initial}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold">Job title would go here...</h4>
                      <p className="text-sm text-gray-600">Job description would go here if needed.</p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span>$150.00</span>
                        <span className="mx-2">•</span>
                        <span>2 days ago</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}