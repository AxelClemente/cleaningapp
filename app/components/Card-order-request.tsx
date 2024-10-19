'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Home, MapPin, Calendar, DollarSign } from 'lucide-react'

interface OrderRequest {
  id: string;
  userId: string;
  workerId: string;
  propertyId: string;
  propertyType: string;
  selectedDate: string;
  serviceDuration: number;
  pricePerHour: number;
  totalPrice: number;
  status: string;
  comment?: string;
  imageUrl?: string;
  entryMethod: string;
  lockboxPass?: string;
  location: string;
  user: {
    name: string;
    email: string;
  };
  property: {
    propertyName: string;
  };
}

interface CardOrderRequestProps {
  workerId: string;
}

export function CardOrderRequest({ workerId }: CardOrderRequestProps) {
  const [orderRequests, setOrderRequests] = useState<OrderRequest[]>([])

  useEffect(() => {
    const fetchOrderRequests = async () => {
      const response = await fetch(`/api/orderRequest?workerId=${workerId}`)
      if (response.ok) {
        const data = await response.json()
        setOrderRequests(data)
      }
    }
    fetchOrderRequests()
  }, [workerId])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orderRequests.map((request) => (
          <Card 
            key={request.id} 
            className="overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback>{request.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-700">{request.user.name}</span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  request.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                    : 'bg-green-100 text-green-800 border border-green-300'
                }`}>
                  {request.status}
                </div>
              </div>
              <div className="flex items-center space-x-1 mb-1">
                <Home className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{request.propertyType}</span>
              </div>
              <div className="flex items-center space-x-1 mb-1">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{request.location}</span>
              </div>
              <div className="flex items-center space-x-1 mb-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{new Date(request.selectedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1 mb-1">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">${request.totalPrice.toFixed(2)}</span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>Duration: {request.serviceDuration} hours</p>
                <p>Entry Method: {request.entryMethod}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}