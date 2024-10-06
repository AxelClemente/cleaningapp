'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Location } from './Location'
import { ServiceSummary } from './ServiceSummary'
import { Home, Building, Castle, Warehouse, Bed, Bath, User, Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/Button"

interface HouseAndServiceTypeProps {
  houseType: string;
  onSelectService: (service: string | null) => void;
  onSelectHouse: () => void;
  selectedDate: Date | null;
  onLocationConfirmed: (location: string) => void;
  onPriceCalculated: (price: number) => void; // Añade esta línea
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

const serviceDescriptions: Record<ServiceType, string> = {
  Express: "Quick cleaning focusing on essential areas.",
  Deep: "Thorough cleaning of all areas, including hard-to-reach spots.",
  Custom: "Tailored cleaning service based on your specific needs."
};

type ServiceType = 'Express' | 'Deep' | 'Custom';

// Define the valid house types
type HouseType = 'small' | 'regular' | 'chalet' | 'finca';

// Ensure houseType is of type HouseType
const houseType: HouseType = 'small'; // Replace with actual value or state

export function HouseAndServiceType({
  houseType,
  onSelectService,
  onSelectHouse,
  selectedDate,
  onLocationConfirmed,
  onPriceCalculated, // Añade esta línea
}: HouseAndServiceTypeProps) {
  const [isHouseSelected, setIsHouseSelected] = useState(false)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [isServiceSummaryOpen, setIsServiceSummaryOpen] = useState(false)
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [entryMethods, setEntryMethods] = useState<string[]>([])
  const [price, setPrice] = useState<number | null>(null)
  const [isServiceInfoOpen, setIsServiceInfoOpen] = useState(false);
  const [selectedServiceInfo, setSelectedServiceInfo] = useState<string | null>(null);

  useEffect(() => {
    if (houseType && selectedService) {
      const calculatedPrice = calculatePrice(houseType, selectedService);
      onPriceCalculated(calculatedPrice);
    }
  }, [houseType, selectedService, onPriceCalculated]);

  const calculatePrice = (house: string, service: string) => {
    const calculatedPrice = priceMap[house]?.[service] ?? 0;
    return calculatedPrice;
  };

  // Definir el tipo para serviceConfig
  interface ServiceConfig {
    [key: string]: {
      Express: { duration: string; people: number };
      Deep: { duration: string; people: number };
    };
  }

  // Asegurar que serviceConfig está tipado correctamente
  const serviceConfig: ServiceConfig = {
    small: { Express: { duration: '2h', people: 1 }, Deep: { duration: '4h', people: 2 } },
    regular: { Express: { duration: '3h', people: 2 }, Deep: { duration: '5h', people: 3 } },
    chalet: { Express: { duration: '4h', people: 3 }, Deep: { duration: '6h', people: 4 } },
    finca: { Express: { duration: '5h', people: 4 }, Deep: { duration: '7h', people: 5 } },
  };

  // Use a different name or prefix it with an underscore if it's intentionally unused
  const _houseType: keyof ServiceConfig = 'small'; // Replace with actual value or state

  const services = [
    { id: 'Express', name: 'Express', ...serviceConfig[_houseType].Express },
    { id: 'Deep', name: 'Deep', ...serviceConfig[_houseType].Deep },
    { id: 'Custom', name: 'Custom', duration: 'Flexible', people: null },
  ];

  const renderServiceOptions = () => {
    return services.map((service) => (
      <div key={service.id} className="relative">
        <button
          onClick={() => {
            setSelectedService(service.id)
            onSelectService(service.id)
            setPrice(calculatePrice(houseType, service.id))
          }}
          className={`w-full px-4 py-3 text-left text-sm font-medium rounded-md transition-colors duration-150
            ${selectedService === service.id 
              ? 'bg-[#724fff] text-white hover:bg-[#d7ceff]' 
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}
          `}
        >
          <div className="font-semibold">{service.name}</div>
          <div className="text-xs opacity-75 flex items-center">
            {service.duration}
            {service.people && (
              <span className="ml-2 flex items-center">
                {Array(service.people).fill(0).map((_, index) => (
                  <User key={index} className="w-3 h-3 inline-block ml-0.5" />
                ))}
              </span>
            )}
          </div>
          {service.id !== 'Custom' && (
            <div className="text-xs mt-1">
              {calculatePrice(houseType, service.id)?.toFixed(2)}€
            </div>
          )}
        </button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                className="absolute right-2 top-2 p-1" 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedServiceInfo(service.id as ServiceType);
                  setIsServiceInfoOpen(true);
                }}
              >
                <Info className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{serviceDescriptions[service.id as ServiceType]}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
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
    onLocationConfirmed(location) // This will trigger the opening of ServiceSummary
  }

  const handleHouseSelection = (selected: boolean) => {
    setIsHouseSelected(selected)
    onSelectHouse()
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
          className={`flex items-center space-x-2 p-2 rounded-md transition-colors duration-150
            ${isHouseSelected 
              ? 'bg-[#724fff] text-white hover:bg-[#d7ceff]' 
              : 'bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50'}
            focus:outline-none focus:ring-2 focus:ring-green-500`}
        >
          <div className={`p-2 rounded-full ${isHouseSelected ? 'bg-white text-[#724fff]' : 'bg-gray-100 text-gray-500'}`}>
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
        serviceType={selectedService || ''}
        location={selectedLocation || ''}
        phoneNumber=""
        setPhoneNumber={() => {}}
        entryMethods={entryMethods}
        setEntryMethods={setEntryMethods}
        comment={comment}
        setComment={setComment}
        price={price || 0}  // Aseguramos que price sea siempre un número
        userId=""  // Añade esta línea
        image=""   // Añade esta línea
        setImage={() => {}}  // Añade esta línea
      />
      <Dialog open={isServiceInfoOpen} onOpenChange={setIsServiceInfoOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <h2 className="text-lg font-semibold mb-4">{selectedServiceInfo} Service Details</h2>
          <p>{serviceDescriptions[selectedServiceInfo as ServiceType] ?? 'No description available.'}</p>
          {/* Aquí puedes añadir más detalles sobre el servicio seleccionado */}
        </DialogContent>
      </Dialog>
    </div>
  )
}