'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react'
import { Header } from '../components/Header'
import { Calendar } from '../components/Calendar'
import { HouseAndServiceType } from '../components/House&ServiceType'
import { CardOrder } from '../components/Card-order'
import { ServiceSummary } from '../components/ServiceSummary'
import { ActionButtonCloudinary } from '@/components/ActionButtonCloudinary'

const houseTypes = ['small', 'regular', 'chalet', 'finca'] as const
type HouseType = typeof houseTypes[number]

interface Reservation {
  userId: string;
  // Add other properties as needed
}

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
  const [userReservations, setUserReservations] = useState([])
  const [isServiceSummaryOpen, setIsServiceSummaryOpen] = useState(false)
  const [location, setLocation] = useState('')
  const [entryMethods, setEntryMethods] = useState<string[]>([])
  const [price, setPrice] = useState<number | null>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [comment, setComment] = useState('')
  const [isWaitlisted, setIsWaitlisted] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserReservations = async () => {
      if (session?.user?.id) {
        const response = await fetch('/api/orders')
        if (response.ok) {
          const allReservations = await response.json()
          const filteredReservations = allReservations.filter(
            (reservation: Reservation) => reservation.userId === session.user.id
          )
          setUserReservations(filteredReservations)
        }
      }
    }

    fetchUserReservations()
  }, [session])

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

  const handleLocationConfirmed = (confirmedLocation: string) => {
    setLocation(confirmedLocation)
    setIsServiceSummaryOpen(true)
  }

  const handleUpload = (result: any) => {
    console.log('handleUpload called in page component', result);
    if (result && result.secure_url) {
      console.log('Image URL in page component:', result.secure_url);
      setUploadedImageUrl(result.secure_url);
      setIsWaitlisted(true);
      console.log('User added to waitlist');
    } else {
      console.error('Error uploading image in page component: No secure_url in result');
    }
  };

  useEffect(() => {
    console.log('uploadedImageUrl changed:', uploadedImageUrl);
  }, [uploadedImageUrl]);

  console.log('Component rendering, uploadedImageUrl:', uploadedImageUrl);

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
                  onLocationConfirmed={handleLocationConfirmed}
                  onPriceCalculated={setPrice} // Añade esta línea
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

                  <ActionButtonCloudinary
                    
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''}
                    onUpload={handleUpload}
                    text="Upload images"
                  />
                </div>
                {uploadedImageUrl ? (
                  <>
                    {console.log('Current uploadedImageUrl:', uploadedImageUrl)}
                    <img
                      src={uploadedImageUrl}
                      alt="Uploaded image"
                      className="w-full h-40 object-cover rounded-md"
                      onLoad={() => console.log('Image loaded successfully in page component')}
                      onError={(e) => console.error('Error loading image in page component:', e)}
                    />
                  </>
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md">
                    <span className="text-gray-500">No image uploaded</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Conditionally render ClientSummary */}
        {session?.user && userReservations.length > 0 && (
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
              clientId={session.user.id || ""}
              activeTab={activeTab}
              isMainPage={true}
              filterByUserId={true}
            />
          </div>
        )}
        
        <ServiceSummary
          isOpen={isServiceSummaryOpen}
          onClose={() => setIsServiceSummaryOpen(false)}
          calendarData={selectedDate ? selectedDate.toDateString() : ''}
          houseType={currentHouseType}
          serviceType={selectedServices[currentHouseType] || ''}
          location={location}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          entryMethods={entryMethods}
          setEntryMethods={setEntryMethods}
          price={price}
          comment={comment}
          setComment={setComment}
          userId={session?.user?.id || ''} // Añade esta línea
          image={uploadedImageUrl} // Asegúrate de que esta línea esté presente
        />
      </div>
    </div>
  )
}
