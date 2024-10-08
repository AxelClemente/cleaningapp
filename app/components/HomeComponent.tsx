'use client'

import { useState } from 'react'
import { ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react'
import { Header } from './Header'
import { Calendar } from './Calendar'
import { HouseAndServiceType } from './House&ServiceType'

const houseTypes = ['small', 'regular', 'chalet', 'finca'] as const
type HouseType = typeof houseTypes[number]

export default function HomeComponent() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [currentHouseTypeIndex, setCurrentHouseTypeIndex] = useState(0)
  const [selectedServices, setSelectedServices] = useState<Record<HouseType, string | null>>({
    small: null,
    regular: null,
    chalet: null,
    finca: null,
  })

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
        <Header doctorName="Express Cleaning Mallorca" clinicName="A Local Small Business Dedicated To You!" />
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
      </div>
    </div>
  )
}