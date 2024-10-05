'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { WorkerProfile } from '@/types/interfaces'
import { Star, MapPin, Phone, Mail } from 'lucide-react'
import { Header } from '../components/Header'
import { CardOrder } from '../components/Card-order'

export default function DashboardWorker() {
  const { data: session } = useSession()
  const [workerData, setWorkerData] = useState<WorkerProfile | null>(null)
  const [activeTab, setActiveTab] = useState('open')

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

  const renderJobs = () => {
    return <CardOrder 
      activeTab={activeTab} 
      clientName={workerData.name || 'Worker Name'}
      isMainPage={false} // This is not the main page
      filterByUserId={false}
    />
  }

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
                  src={workerData.profilePicture || '/images/profile.png'}
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
                <h3 className="text-xl font-semibold">Jobs</h3>
                <button className="bg-blue-500 text-white px-3 py-1 rounded">+ Add</button>
              </div>
              <div className="flex border-b mb-4">
                <button
                  className={`py-2 px-4 ${activeTab === 'open' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('open')}
                >
                  Open
                </button>
                <button
                  className={`py-2 px-4 ${activeTab === 'inProgress' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('inProgress')}
                >
                  In Progress
                </button>
                <button
                  className={`py-2 px-4 ${activeTab === 'completed' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('completed')}
                >
                  Completed
                </button>
              </div>
              <div className="space-y-4">
                {renderJobs()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}