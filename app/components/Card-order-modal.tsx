'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Home, MapPin, Calendar, Key, MessageSquare, User } from 'lucide-react'
import { Button } from "@/components/Button"
import { updateReservationStatus } from '@/lib/api';
import { useToast } from "./ui/use-toast";

interface Reservation {
  id: string;
  userName: string;
  houseType: string;
  serviceType: string;
  location: string;
  duration: string;
  price: number;
  avatarUrl: string;
  status: 'Open' | 'Progress' | 'Completed';
  calendarData: string;
  entryMethod: string; // New property
  comment: string; // New property
}

interface CardOrderModalProps {
  reservation: Reservation;
  onClose: () => void;
  isMainPage: boolean;
}

export function CardOrderModal({ reservation: initialReservation, onClose, isMainPage }: CardOrderModalProps) {
  const [reservation, setReservation] = useState(initialReservation);
  const { toast } = useToast();
  const statusSteps = ['Open', 'Progress', 'Completed'] as const;
  type StatusType = typeof statusSteps[number];

  const getStatusColor = (status: StatusType, currentStatus: StatusType) => {
    const index = statusSteps.indexOf(status);
    const currentIndex = statusSteps.indexOf(currentStatus);
    if (index === currentIndex) return 'bg-yellow-500';
    return index < currentIndex ? 'bg-green-500' : 'bg-gray-300';
  };

  const handleStatusUpdate = async () => {
    try {
      const newStatus = reservation.status === 'Open' ? 'Progress' : 'Completed';
      const result = await updateReservationStatus(reservation.id, newStatus);
      
      if (result.success) {
        setReservation({ ...reservation, status: newStatus });
        if (newStatus === 'Completed') {
          setTimeout(onClose, 500);
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error updating reservation status:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const showAcceptButton = !isMainPage && reservation.status === 'Open';
  const showCompleteButton = reservation.status === 'Progress';
  const showCancelButton = isMainPage && reservation.status === 'Open';

  const handleCancel = async () => {
    try {
      const response = await fetch(`/api/orders?orderId=${reservation.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel the order');
      }

      toast({
        title: "Cleaning request canceled",
        description: "Your cleaning request has been successfully canceled.",
        duration: 3000,
      });

      onClose();
    } catch (error) {
      console.error('Error canceling order:', error);
      toast({
        title: "Error",
        description: "Failed to cancel the cleaning request. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto my-4">
        <DialogHeader>
          <DialogTitle>Reservation Details</DialogTitle>
        </DialogHeader>
        <Card className="overflow-hidden">
          <div className="relative h-40">
            <img 
              src="/images/cuarto.jpg" 
              alt={reservation.houseType} 
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4 px-2">
              {statusSteps.map((status, index) => (
                <React.Fragment key={status}>
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(status, reservation.status)}`} />
                    <span className="text-xs mt-1">{status}</span>
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div className="flex-grow mx-2">
                      <div className={`w-full h-0.5 mt-1.5 ${getStatusColor(statusSteps[index + 1], reservation.status)} border-t-2 border-dashed`} style={{ width: '80%' }} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="space-y-2">
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
              <div className="flex items-center space-x-2">
                <Home className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{reservation.houseType} House</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{reservation.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{reservation.calendarData}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Key className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Entry Method: {reservation.entryMethod}</span>
              </div>
              {reservation.comment && (
                <div className="flex items-start space-x-2">
                  <MessageSquare className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Comment:</p>
                    <p className="text-sm text-gray-700">{reservation.comment}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">{reservation.userName}</span>
              </div>
              <span className="text-sm font-semibold">${reservation.price.toFixed(2)}</span>
            </div>
            <div className="mt-6 space-y-2">
              {(showAcceptButton || showCompleteButton) && (
                <Button 
                  className="w-full" 
                  onClick={handleStatusUpdate}
                  disabled={reservation.status === 'Completed'}
                >
                  {showAcceptButton ? 'Accept' : 'Complete'}
                </Button>
              )}
              {showCancelButton && (
                <Button 
                  className="w-full bg-red-500 hover:bg-red-600" 
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}