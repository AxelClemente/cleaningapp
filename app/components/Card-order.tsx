'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { useSession } from 'next-auth/react'
import { Home, MapPin, Calendar, User } from 'lucide-react'
import { CardOrderModal } from '../components/Card-order-modal'

interface Reservation {
  id: string;
  userName: string;
  houseType: string;
  serviceType: string;
  location: string;
  duration: string;
  price: number;
  avatarUrl: string;
  status: "Open" | "Progress" | "Completed";
  calendarData: string;
  entryMethod: string; // New property
  comment: string; // New property
}

interface CardOrderProps {
  clientName: string;
  activeTab: string;
  isMainPage: boolean; // New prop
}

export function CardOrder({ clientName, activeTab, isMainPage }: CardOrderProps) {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const { data: session } = useSession()
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  const truncateLocation = (location: string) => {
    const words = location.split(' ');
    return words.slice(0, 4).join(' ') + (words.length > 2 ? '...' : '');
  };

  useEffect(() => {
    const fetchReservations = async () => {
      // Removed the check for session.user.email
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setReservations(data)
      }
    }
    fetchReservations()
  }, []) // Removed session from the dependency array

  const filteredReservations = activeTab
    ? reservations.filter(reservation => {
        switch (activeTab) {
          case 'open':
            return reservation.status === 'Open';
          case 'inProgress':
            return reservation.status === 'Progress';
          case 'completed':
            return reservation.status === 'Completed';
          default:
            return true;
        }
      })
    : reservations;

  return (
    <div className="space-y-6">
      {clientName && <h2 className="text-2xl font-bold mb-4">Welcome back, {clientName}!</h2>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredReservations.map((reservation) => (
          <Card 
            key={reservation.id} 
            className="overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
            onClick={() => setSelectedReservation(reservation)}
          >
            <div className="relative">
              <img 
                src="/images/cuarto.jpg" 
                alt={reservation.houseType} 
                className="w-full h-40 object-cover"
              />
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                <span className="text-xs">▶</span>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={reservation.avatarUrl} alt={reservation.userName} />
                    <AvatarFallback>{reservation.userName[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{reservation.serviceType} Service</span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  reservation.status === 'Open'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : reservation.status === 'Progress'
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}>
                  {reservation.status}
                </div>
              </div>
              <div className="flex items-center space-x-1 mb-1">
                <Home className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{reservation.houseType} House</span>
              </div>
              <div className="flex items-center space-x-1 mb-1">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700" title={reservation.location}>
                  {truncateLocation(reservation.location)}
                </span>
              </div>
              <div className="flex items-center space-x-1 mb-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{reservation.calendarData}</span>
              </div>
              <div className="flex items-center justify-between space-x-1 mb-1 mt-2">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{reservation.userName}</span>
                </div>
                <span className="text-sm font-semibold">${reservation.price.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedReservation && (
        <CardOrderModal 
          reservation={selectedReservation} 
          onClose={() => setSelectedReservation(null)}
          isMainPage={isMainPage} // Pass the prop to CardOrderModal
        />
      )}
    </div>
  )
}