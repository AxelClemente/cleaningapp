'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Home, MapPin, Calendar, Clock, DollarSign, Key } from 'lucide-react'
import Image from 'next/image'

interface OrderRequestClientModal {
  id: string;
  propertyType: string;
  selectedDate: string;
  pricePerHour: number;
  totalPrice: number;
  comment?: string;
  imageUrl?: string;
  entryMethod: string;
  location: string;
  lockboxPass?: string;
  status: string;
  workerId: string;
  serviceDuration: string;
  serviceType: string;
  user: {
    name: string;
    email: string;
    image?: string;
  };
}

interface CardOrderRequestClientModalProps {
  orderRequest: OrderRequestClientModal;
  onClose: () => void;
}

export function CardOrderRequestClientModal({ orderRequest, onClose }: CardOrderRequestClientModalProps) {
  console.log('CardOrderRequestClientModal rendered', { orderRequest });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto my-4">
        <DialogHeader>
          <DialogTitle>Order Request Details</DialogTitle>
        </DialogHeader>
        <Card className="overflow-hidden">
          <div className="relative h-40">
            <Image 
              src={orderRequest.imageUrl || "/images/cuarto.jpg"}
              alt={`${orderRequest.propertyType} image`}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={orderRequest.user.image ?? "/images/default-avatar.png"} alt={orderRequest.user.name} />
                  <AvatarFallback>{orderRequest.user.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-700">{orderRequest.user.name}</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                orderRequest.status === 'Open'
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : orderRequest.status === 'Progress'
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                  : 'bg-green-100 text-green-800 border border-green-300'
              }`}>
                {orderRequest.status}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Home className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{orderRequest.propertyType} House</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{orderRequest.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{new Date(orderRequest.selectedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Key className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{orderRequest.entryMethod}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{orderRequest.serviceDuration}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{orderRequest.serviceType}</span>
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-semibold">${orderRequest.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            {orderRequest.comment && (
              <div className="mt-4">
                <p className="text-sm font-medium">Comment:</p>
                <p className="text-sm text-gray-700">{orderRequest.comment}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
