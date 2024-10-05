'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react'
import { Header } from '../components/Header'
import { Calendar } from '../components/Calendar'
import { HouseAndServiceType } from '../components/House&ServiceType'
import { CardOrder } from '../components/Card-order'

const houseTypes = ['small', 'regular', 'chalet', 'finca'] as const
type HouseType = typeof houseTypes[number]

export default function Component() {
  const { data: session } = useSession()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [currentHouseTypeIndex, setCurrentHouseTypeIndex] = useState(0)
  const [selectedServices, setSelectedServices] = useState<Record<HouseType, string | null>>({
    small: null,
    regular: null,
    chalet: null,
    finca: null,
  })
  const [activeTab, setActiveTab] = useState('open')

  const currentHouseType = houseTypes[currentHouseTypeIndex]

  const handleSelectService = (service: string | null) => {
    setSelectedServices(prev => ({ ...prev, [currentHouseType]: service }))
  }

  const handleNextHouseType = () => {
    setCurrentHouseTypeIndex((prev) => (prev + 1) % houseTypes.length)
  }

  const handlePreviousHouseType = () => {
    setCurrentHouseTypeIndex((prev) => (prev - 1 + houseTypes.length) % houseTypes.length)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <Header 
          doctorName={session?.user?.name || "TidyTeam"} 
          clinicName="we connect expert cleaners with homes in your neighborhood" 
        />
        <div className="p-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Select your home type, cleaning service and pick your location!</span>
            
          </div>
          <h2 className="text-2xl font-bold mt-4 mb-6">Book Now</h2>
          <div className="flex space-x-4">
            <Calendar onSelectDate={setSelectedDate} />
            <div className="flex-1 space-y-6">
              <div className="relative">
                <HouseAndServiceType
                  houseType={currentHouseType}
                  onSelectService={handleSelectService}
                  onSelectHouse={() => {}}
                  selectedDate={selectedDate}
                />
                <div className="absolute top-1/2 -translate-y-1/2 left-0 -ml-4">
                  <button onClick={handlePreviousHouseType} className="p-1/2 bg-white rounded-full shadow">
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 right-0 -mr-4">
                  <button onClick={handleNextHouseType} className="p-1/2 bg-white rounded-full shadow">
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="bg-white shadow rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium flex items-center">
                    <span className="w-6 h-6 rounded-full border-2 border-gray-300 mr-2" />
                    Waiting list
                  </h3>
                  <button className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium">
                    Add to Wait List
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Conditionally render ClientSummary */}
        {session?.user && (
          <div className="mt-8 px-4 pb-4">
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
            <CardOrder 
              clientName={session.user.name || "Guest"}
              activeTab={activeTab}
              isMainPage={true} // This is the main page
            />
          </div>
        )}
      </div>
    </div>
  )
}