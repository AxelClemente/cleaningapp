'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Home, MapPin, Calendar, Key, MessageSquare } from 'lucide-react'

interface Reservation {
  id: string;
  userName: string;
  houseType: string;
  serviceType: string;
  location: string;
  duration: string;
  price: number;
  avatarUrl: string;
  status: string;
  calendarData: string;
  entryMethod: string; // New property
  comment: string; // New property
}

interface CardOrderModalProps {
  reservation: Reservation;
  onClose: () => void;
}

export function CardOrderModal({ reservation, onClose }: CardOrderModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reservation Details</DialogTitle>
        </DialogHeader>
        <Card className="overflow-hidden">
          <div className="relative">
            <img 
              src="/images/cuarto.jpg" 
              alt={reservation.houseType} 
              className="w-full h-40 object-cover"
            />
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={reservation.avatarUrl} alt={reservation.userName} />
                  <AvatarFallback>{reservation.userName[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {reservation.serviceType} Service
                  {((reservation.houseType === 'regular' && reservation.serviceType === 'Deep') ||
                    (reservation.houseType === 'small' && reservation.serviceType === 'Express')) && (
                    <span className="ml-1 text-xs text-gray-500">(4 hours)</span>
                  )}
                </span>
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
            <div className="flex items-center space-x-1 mt-4">
              <Key className="h-4 w-4 text-gray-500" />
              <p className="text-sm font-medium">Entry Method:</p>
            </div>
            <p className="text-sm text-gray-700 ml-5">{reservation.entryMethod}</p>
            {reservation.comment && (
              <>
                <div className="flex items-center space-x-1 mt-2">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <p className="text-sm font-medium">Comment:</p>
                </div>
                <p className="text-sm text-gray-700 ml-5">{reservation.comment}</p>
              </>
            )}
            <div className="flex justify-between text-sm mt-4">
              <span className="text-gray-500">{reservation.duration}</span>
              <span className="font-semibold">${reservation.price.toFixed(2)}</span>
            </div>

          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}