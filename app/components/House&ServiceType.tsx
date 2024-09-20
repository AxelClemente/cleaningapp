'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Location } from './Location'

interface HouseAndServiceTypeProps {
  houseType: 'small' | 'regular' | 'chalet' | 'finca'
  onSelectService: (service: string | null) => void
  onSelectHouse: (selected: boolean) => void
  selectedDate: Date | null
}

export function HouseAndServiceType({
  houseType,
  onSelectService,
  onSelectHouse,
  selectedDate
}: HouseAndServiceTypeProps) {
  const [isHouseSelected, setIsHouseSelected] = useState(false)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  const renderServiceOptions = () => {
    const services = [
      { id: 'express', name: 'Express, 1 Pers', duration: '4 hour' },
      { id: 'deep', name: 'Deep, 2 People', duration: '4 hours' },
      { id: 'custom', name: 'Custom, 2+', duration: 'Flexible' },
    ]

    return services.map((service) => (
      <button
        key={service.id}
        onClick={() => {
          setSelectedService(service.id)
          onSelectService(service.id)
        }}
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
    return selectedDate && isHouseSelected && selectedService;
  }

  const handleLocationClick = () => {
    if (!canOpenLocationDialog()) {
      toast({
        title: "Incomplete selection",
        description: "Please choose the day, house type and service type",
      })
    }
  }

  const handleSelectLocation = (location: string) => {
    setSelectedLocation(location)
    // Add additional logic if needed
  }

  const handleHouseSelection = (selected: boolean) => {
    setIsHouseSelected(selected)
    onSelectHouse(selected)
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium flex items-center">
          <input
            type="checkbox"
            id={`${houseType}House`}
            className="sr-only peer"
            onChange={(e) => handleHouseSelection(e.target.checked)}
          />
          <label
            htmlFor={`${houseType}House`}
            className="w-6 h-6 rounded-full bg-yellow-500 mr-2 cursor-pointer
               flex items-center justify-center
               peer-checked:bg-green-500 peer-checked:ring-2 ring-offset-2 ring-green-500"
          >
            <svg className="w-3 h-3 text-white hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </label>
          {houseType === 'small' ? 'Small House' : 
           houseType === 'regular' ? 'Regular House' :
           houseType === 'chalet' ? 'Chalet' : 'Finca'}
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
            <DialogContent className="sm:max-w-[425px]">
              <Location onSelectLocation={handleSelectLocation} />
            </DialogContent>
          )}
        </Dialog>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        {houseType === 'small' ? '1 room, 1 bathroom' : 
         houseType === 'regular' ? '2-3 rooms, 2 bathrooms' :
         houseType === 'chalet' ? '3-4 rooms, 2-3 bathrooms' : 
         '4+ rooms, 3+ bathrooms'}
      </p>
      <div className="grid grid-cols-1 gap-2">
        {renderServiceOptions()}
      </div>
    </div>
  )
}