'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Home, MapPin, Calendar, Sparkles } from 'lucide-react'
import { CardOrderModal } from './Card-order-modal'

interface Reservation {
  id: string;
  userId: string;
  userName: string;
  houseType: string;
  serviceType: string;
  location: string;
  duration: string;
  price: number;
  avatarUrl: string;
  status: "Open" | "Progress" | "Completed";
  calendarData: string;
  entryMethod: string;
  comment: string;
  images: string[];  // Add this line
}

interface CardOrderProps {
  clientName: string;
  clientId?: string;
  activeTab: string;
  isMainPage: boolean;
  filterByUserId?: boolean;
}

export function CardOrder({ clientName, clientId, activeTab, isMainPage, filterByUserId = false }: CardOrderProps) {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        if (filterByUserId && clientId) {
          setReservations(data.filter((reservation: Reservation) => reservation.userId === clientId))
        } else {
          setReservations(data)
        }
      }
    }
    fetchReservations()
  }, [clientId, filterByUserId])

  const truncateLocation = (location: string) => {
    const words = location.split(' ');
    return words.slice(0, 4).join(' ') + (words.length > 2 ? '...' : '');
  };

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

  const handleCancelOrder = (orderId: string) => {
    setReservations(prevReservations => prevReservations.filter(res => res.id !== orderId));
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: 'Open' | 'Progress' | 'Completed') => {
    setReservations(prevReservations => 
      prevReservations.map(res => 
        res.id === orderId ? { ...res, status: newStatus } : res
      )
    );
  };

  return (
    <div className="space-y-6">
      {clientName && (
        <div>
          <h2 className="text-2xl font-bold mb-1">Welcome back, {clientName}!</h2>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredReservations.map((reservation) => (
          <Card 
            key={reservation.id} 
            className="overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
            onClick={() => setSelectedReservation(reservation)}
          >
            <div className="relative">
              <img 
                src={reservation.images && reservation.images.length > 0 
                  ? reservation.images[0] 
                  : "/images/cuarto.jpg"}
                alt={`${reservation.houseType} image`}
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
                  <span className="text-sm text-gray-700">{reservation.userName}</span>
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
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium">{reservation.serviceType} Service</span>
                </div>
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
          isMainPage={isMainPage}
          onCancelOrder={handleCancelOrder}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      )}
    </div>
  )
}
