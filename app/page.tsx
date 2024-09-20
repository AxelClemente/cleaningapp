'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Header } from './components/Header'
import { Calendar } from './components/Calendar'
import { HouseAndServiceType } from './components/House&ServiceType'

export default function Component() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isSmallHouseSelected, setIsSmallHouseSelected] = useState(false)
  const [isRegularHouseSelected, setIsRegularHouseSelected] = useState(false)
  const [selectedSmallHouseService, setSelectedSmallHouseService] = useState<string | null>(null)
  const [selectedRegularHouseService, setSelectedRegularHouseService] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <Header doctorName="Dr. Axel Clemente" clinicName="Kids Care Clinic" />
        <div className="p-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Home</span>
            <ChevronRight className="h-4 w-4" />
            <span>Appointments</span>
          </div>
          <h2 className="text-2xl font-bold mt-4 mb-6">Appointments</h2>
          <div className="flex space-x-4">
            <Calendar onSelectDate={setSelectedDate} />
            <div className="flex-1 space-y-6">
              <HouseAndServiceType
                houseType="small"
                onSelectService={setSelectedSmallHouseService}
                onSelectHouse={setIsSmallHouseSelected}
                selectedDate={selectedDate}
              />
              <HouseAndServiceType
                houseType="regular"
                onSelectService={setSelectedRegularHouseService}
                onSelectHouse={setIsRegularHouseSelected}
                selectedDate={selectedDate}
              />
              <HouseAndServiceType
                houseType="chalet"
                onSelectService={setSelectedRegularHouseService}
                onSelectHouse={setIsRegularHouseSelected}
                selectedDate={selectedDate}
              />
              <HouseAndServiceType
                houseType="finca"
                onSelectService={setSelectedRegularHouseService}
                onSelectHouse={setIsRegularHouseSelected}
                selectedDate={selectedDate}
              />
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