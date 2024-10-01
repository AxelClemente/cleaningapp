'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { useSession } from 'next-auth/react'
import { Home, MapPin, Calendar } from 'lucide-react'
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

interface ClientSummaryProps {
  activeTab?: string;
  clientName?: string;
}

export function ClientSummary({ activeTab, clientName }: ClientSummaryProps) {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const { data: session } = useSession()
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  useEffect(() => {
    const fetchReservations = async () => {
      if (session?.user?.email) {
        const response = await fetch(`/api/orders?email=${session.user.email}`)
        if (response.ok) {
          const data = await response.json()
          setReservations(data)
        }
      }
    }
    fetchReservations()
  }, [session])

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
                <div className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300">
                  {reservation.status}
                </div>
              </div>
              <div className="flex items-center space-x-1 mb-1">
                <Home className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{reservation.houseType} House</span>
              </div>
              <div className="flex items-center space-x-1 mb-1">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{reservation.location}</span>
              </div>
              <div className="flex items-center space-x-1 mb-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{reservation.calendarData}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{reservation.duration}</span>
                <span className="font-semibold">${reservation.price.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedReservation && (
        <CardOrderModal 
          reservation={selectedReservation} 
          onClose={() => setSelectedReservation(null)}
        />
      )}
    </div>
  )
}