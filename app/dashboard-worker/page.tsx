'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { WorkerProfile } from '@/types/interfaces'
import { Star, MapPin, Phone, Mail } from 'lucide-react'
import { Header } from '../components/Header'
import { CardOrder } from '../components/Card-order'
import { Avatar, AvatarImage, AvatarFallback } from '../components/avatar'
import { useWorkers } from '@/contexts/WorkerContext'
import { CardOrderRequest } from '@/components/Card-order-request'
//CAMBIO
export default function DashboardWorker() {
  const { data: session } = useSession()
  const { getWorkerByUserId } = useWorkers()
  const [workerData, setWorkerData] = useState<WorkerProfile | null>(null)
  const [activeTab, setActiveTab] = useState('pending')
  const [workerId, setWorkerId] = useState<string | null>(null)

  const fetchWorkerData = useCallback(async () => {
    if (session?.user?.email) {
      const response = await fetch(`/api/worker?email=${session.user.email}`)
      if (response.ok) {
        const data = await response.json()
        setWorkerData(data)
      }
    }
  }, [session?.user?.email])

  useEffect(() => {
    fetchWorkerData()
  }, [fetchWorkerData])

  useEffect(() => {
    async function fetchWorkerData() {
      if (session?.user?.id) {
        console.log("Fetching worker data for user ID:", session.user.id);
        const worker = await getWorkerByUserId(session.user.id);
        if (worker) {
          setWorkerData(worker);
          if (worker.id) {
            setWorkerId(worker.id);
            console.log("Worker data fetched successfully. Worker ID:", worker.id);
          } else {
            console.log("Worker found, but id is missing:", worker);
          }
        } else {
          console.log("No worker data found for this user ID");
        }
      } else {
        console.log("No user ID available in session");
      }
    }
    fetchWorkerData();
  }, [session?.user?.id, getWorkerByUserId]);

  // Agregar este log fuera del useEffect para ver el estado actual
  useEffect(() => {
    console.log("Current workerId state:", workerId);
  }, [workerId]);

  if (!workerData) return <div>Loading...</div>

  const renderJobs = () => {
    return <CardOrder 
      activeTab={activeTab} 
      clientName={workerData.name || 'Worker Name'}
      clientId={session?.user?.id}
      isMainPage={false}
      isWorkerPage={true}
      filterByUserId={false}
    />
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <Header 
          doctorName={workerData.name || 'Worker Name'} 
          clinicName={
            <span className="font-montserrat font-medium text-[#002b34]">
              Your hard work brings comfort and joy to every home you touch
            </span>
          }
        />
      </div>
      <main className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left column (worker info) */}
            <div className="md:w-1/3 p-6 bg-gray-50">
              <div className="text-center mb-6">
                <Avatar className="w-32 h-32 mx-auto">
                  <AvatarImage 
                    src={session?.user?.image || workerData?.profilePicture || '/images/profile.png'} 
                    alt={workerData?.name || 'Worker'} 
                  />
                  <AvatarFallback>{workerData?.name?.[0] || 'W'}</AvatarFallback>
                </Avatar>
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
            {/* Right column (jobs and order requests) */}
            <div className="md:w-2/3 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Jobs</h3>
                <button className="bg-[#eec33d] text-white px-3 py-1 rounded">Contact</button>
              </div>
              <div className="flex border-b mb-4">
                <button
                  className={`py-2 px-4 ${activeTab === 'pending' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('pending')}
                >
                  Pending
                </button>
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
              <div className="space-y-8">
                {activeTab !== 'open' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Requested Services by Clients</h3>
                    <CardOrderRequest workerId={workerId} activeTab={activeTab} />
                  </div>
                )}
                <div>
                  {renderJobs()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
