'use client'

import Image from 'next/image'


import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Header } from './components/Header'

export default function Component() {
  const [selectedDate, setSelectedDate] = useState(2)
  const [selectedSmallHouseService, setSelectedSmallHouseService] = useState<string | null>(null)
  const [selectedRegularHouseService, setSelectedRegularHouseService] = useState<string | null>(null)

  const renderCalendarDays = () => {
    const days = []
    for (let i = 1; i <= 31; i++) {
      days.push(
        <div
          key={i}
          className={`flex items-center justify-center w-8 h-8 rounded-full cursor-pointer
            ${i === selectedDate ? 'bg-green-500 text-white' : ''}
            ${i === 11 || i === 15 || i === 16 ? 'text-blue-500' : ''}`}
          onClick={() => setSelectedDate(i)}
        >
          {i}
        </div>
      )
    }
    return days
  }

  const renderServiceOptions = (selectedService: string | null, setSelectedService: (id: string | null) => void) => {
    const services = [
      { id: 'express', name: 'Express', duration: '1 hour' },
      { id: 'deep', name: 'Deep', duration: '2 hours' },
      { id: 'custom', name: 'Custom', duration: 'Flexible' },
    ]

    return services.map((service) => (
      <button
        key={service.id}
        onClick={() => setSelectedService(service.id)}
        className={`w-full px-4 py-3 text-left text-sm font-medium rounded-md
          ${selectedService === service.id ? 'bg-green-500 text-white' : 'bg-white border border-gray-300 text-gray-700'}
          hover:bg-gray-50`}
      >
        <div className="font-semibold">{service.name}</div>
        <div className="text-xs opacity-75">{service.duration}</div>
      </button>
    ))
  }

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
            <div className="w-72 bg-white shadow rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium">AUG 2018</h3>
                <div className="flex space-x-1">
                  <button className="p-1 bg-white border border-gray-300 rounded-md">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button className="p-1 bg-white border border-gray-300 rounded-md">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center">
                <div>S</div>
                <div>M</div>
                <div>T</div>
                <div>W</div>
                <div>T</div>
                <div>F</div>
                <div>S</div>
                {renderCalendarDays()}
              </div>
            </div>
            <div className="flex-1 space-y-6">
              <div className="bg-white shadow rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium flex items-center">
                    <input
                      type="checkbox"
                      id="smallHouse"
                      className="sr-only peer"
                    />
                    <label
                      htmlFor="smallHouse"
                      className="w-6 h-6 rounded-full bg-yellow-500 mr-2 cursor-pointer
                         flex items-center justify-center
                         peer-checked:bg-green-500 peer-checked:ring-2 ring-offset-2 ring-green-500"
                    >
                      <svg className="w-3 h-3 text-white hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </label>
                    Small House
                  </h3>
                  <button className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium">
                    Add Slots
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-4">1 room, 1 bathroom</p>
                <div className="grid grid-cols-1 gap-2">
                  {renderServiceOptions(selectedSmallHouseService, setSelectedSmallHouseService)}
                </div>
              </div>
              <div className="bg-white shadow rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium flex items-center">
                    <span className="w-6 h-6 rounded-full bg-yellow-500 mr-2" />
                    Regular House
                  </h3>
                  <button className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium">
                    Add Slots
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-4">Select a service type</p>
                <div className="grid grid-cols-1 gap-2">
                  {renderServiceOptions(selectedRegularHouseService, setSelectedRegularHouseService)}
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