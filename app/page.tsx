'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Header } from './components/Header'
import { Calendar } from './components/Calendar'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

export default function Component() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isSmallHouseSelected, setIsSmallHouseSelected] = useState(false)
  const [selectedSmallHouseService, setSelectedSmallHouseService] = useState<string | null>(null)
  const [selectedRegularHouseService, setSelectedRegularHouseService] = useState<string | null>(null)

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

  const canOpenLocationDialog = () => {
    return selectedDate && isSmallHouseSelected && selectedSmallHouseService;
  }

  const handleLocationClick = () => {
    if (!canOpenLocationDialog()) {
      toast({
        title: "Incomplete selection",
        description: "Please choose the day, house type and service type",
      })
    }
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
            <Calendar onSelectDate={setSelectedDate} />
            <div className="flex-1 space-y-6">
              <div className="bg-white shadow rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium flex items-center">
                    <input
                      type="checkbox"
                      id="smallHouse"
                      className="sr-only peer"
                      onChange={(e) => setIsSmallHouseSelected(e.target.checked)}
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        onClick={handleLocationClick}
                        className={`px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium
                          ${canOpenLocationDialog() ? '' : 'opacity-50 cursor-not-allowed'}`}
                        disabled={!canOpenLocationDialog()}
                      >
                        Location
                      </button>
                    </DialogTrigger>
                    {canOpenLocationDialog() && (
                      <DialogContent>
                        <p>Please select your location</p>
                      </DialogContent>
                    )}
                  </Dialog>
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
                    Location
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