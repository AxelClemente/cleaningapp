'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Location } from './Location'
import { ServiceSummary } from './ServiceSummary'
import { Home, Building, Castle, Warehouse, Bed, Bath } from 'lucide-react'

interface HouseAndServiceTypeProps {
  houseType: 'small' | 'regular' | 'chalet' | 'finca'
  onSelectService: (service: string | null) => void
  onSelectHouse: (selected: boolean) => void
  selectedDate: Date | null
}

interface PriceMap {
  [key: string]: {
    [key: string]: number | null;
  };
}

const priceMap: PriceMap = {
  small: { Express: 99.22, Deep: 150, Custom: null },
  regular: { Express: 135.22, Deep: 200, Custom: null },
  chalet: { Express: 198.44, Deep: 250, Custom: null },
  finca: { Express: 400, Deep: 500, Custom: null },
};

export function HouseAndServiceType({
  houseType,
  onSelectService,
  onSelectHouse,
  selectedDate
}: HouseAndServiceTypeProps) {
  const [isHouseSelected, setIsHouseSelected] = useState(false)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [isServiceSummaryOpen, setIsServiceSummaryOpen] = useState(false)
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [entryMethods, setEntryMethods] = useState<string[]>([])
  const [price, setPrice] = useState<number | null>(null)

  const calculatePrice = (house: string, service: string) => {
    return priceMap[house]?.[service] ?? null;
  };

  const renderServiceOptions = () => {
    const services = [
      { id: 'Express', name: 'Express, 1 Pers', duration: '4 hour' },
      { id: 'Deep', name: 'Deep, 2 People', duration: '4 hours' },
      { id: 'Custom', name: 'Custom, 2+', duration: 'Flexible' },
    ]

    return services.map((service) => (
      <button
        key={service.id}
        onClick={() => {
          setSelectedService(service.id)
          onSelectService(service.id)
          setPrice(calculatePrice(houseType, service.id))
        }}
        className={`w-full px-4 py-3 text-left text-sm font-medium rounded-md
          ${selectedService === service.id ? 'bg-green-500 text-white' : 'bg-white border border-gray-300 text-gray-700'}
          hover:bg-gray-50`}
      >
        <div className="font-semibold">{service.name}</div>
        <div className="text-xs opacity-75">{service.duration}</div>
        {service.id !== 'Custom' && (
          <div className="text-xs mt-1">
            {calculatePrice(houseType, service.id)?.toFixed(2)}€
          </div>
        )}
      </button>
    ))
  }

  const canOpenLocationDialog = () => {
    return selectedDate && isHouseSelected && selectedService;
  }

  const handleLocationClick = () => {
    if (canOpenLocationDialog()) {
      setIsLocationDialogOpen(true);
    } else {
      toast({
        title: "Incomplete selection",
        description: "Please choose the day, house type and service type",
      })
    }
  }

  const handleSelectLocation = (location: string) => {
    setSelectedLocation(location)
    setIsLocationDialogOpen(false)
    setIsServiceSummaryOpen(true)
  }

  const handleHouseSelection = (selected: boolean) => {
    setIsHouseSelected(selected)
    onSelectHouse(selected)
  }

  const getHouseIcon = (type: string) => {
    switch (type) {
      case 'small':
        return <Home className="w-5 h-5" />;
      case 'regular':
        return <Warehouse className="w-5 h-5" />;
      case 'chalet':
        return <Building className="w-5 h-5" />;
      case 'finca':
        return <Castle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  function HouseDetails({ rooms, bathrooms }: { rooms: string; bathrooms: string }) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2 mb-4 ml-2">
        <div className="flex items-center">
          <Bed className="w-4 h-4 mr-1" />
          <span>{rooms}</span>
        </div>
        <div className="flex items-center ml-4">
          <Bath className="w-4 h-4 mr-1" />
          <span>{bathrooms}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => handleHouseSelection(!isHouseSelected)}
          className={`flex items-center space-x-2 p-2 rounded-md transition-colors duration-200
            ${isHouseSelected 
              ? 'bg-green-100 text-green-700' 
              : 'bg-white text-gray-700 border border-gray-300 shadow-sm'}
            hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500`}
        >
          <div className={`p-2 rounded-full ${isHouseSelected ? 'bg-green-500 text-white' : 'bg-white text-gray-500'}`}>
            {getHouseIcon(houseType)}
          </div>
          <span className="text-sm font-medium">
            {houseType === 'small' ? 'Small House' : 
             houseType === 'regular' ? 'Regular House' :
             houseType === 'chalet' ? 'Chalet' : 'Finca'}
          </span>
        </button>
        <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
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
              <Location 
                onSelectLocation={setSelectedLocation} 
                onConfirm={handleSelectLocation}
              />
            </DialogContent>
          )}
        </Dialog>
      </div>
      <HouseDetails 
        rooms={
          houseType === 'small' ? '1' : 
          houseType === 'regular' ? '2' :
          houseType === 'chalet' ? '3' : 
          '4+'
        }
        bathrooms={
          houseType === 'small' ? '1' : 
          houseType === 'regular' ? '2' :
          houseType === 'chalet' ? '3' : 
          '3+'
        }
      />
      <div className="grid grid-cols-1 gap-2 mt-2">
        {renderServiceOptions()}
      </div>
      {price !== null && (
        <div className="mt-4 text-right text-sm font-medium">
          Total: {price.toFixed(2)}€
        </div>
      )}
      <ServiceSummary
        isOpen={isServiceSummaryOpen}
        onClose={() => setIsServiceSummaryOpen(false)}
        calendarData={selectedDate ? selectedDate.toDateString() : ''}
        houseType={houseType}
        serviceType={selectedService ? [selectedService] : []}
        location={selectedLocation || ''}
        phoneNumber=""
        setPhoneNumber={() => {}}
        entryMethods={entryMethods}
        setEntryMethods={setEntryMethods}
        comment={comment}
        setComment={setComment}
        price={price}  // Add this line
      />
    </div>
  )
}