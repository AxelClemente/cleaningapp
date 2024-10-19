'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Home, MapPin, Calendar, Key, MessageSquare, Clock, DollarSign } from 'lucide-react'
import { Button } from "@/components/Button"
import { useToast } from "./ui/use-toast"
import { useAuth } from '@/hooks/useAuth'

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
    image?: string;
  };
  property: {
    propertyName: string;
  };
  worker: {
    hourlyRate: number;
  };
}

interface CardOrderRequestModalProps {
  orderRequest: OrderRequest;
  onClose: () => void;
  onAcceptRequest: (orderId: string) => void;
  onRejectRequest: (orderId: string) => void;
}

export function CardOrderRequestModal({
  orderRequest: initialOrderRequest,
  onClose,
  onAcceptRequest,
  onRejectRequest
}: CardOrderRequestModalProps) {
  const [orderRequest, setOrderRequest] = useState(initialOrderRequest);
  const { toast } = useToast();
  const { getCurrentWorkerId } = useAuth();

  const handleAccept = async () => {
    try {
      // Here you would typically make an API call to accept the request
      // For now, we'll just call the onAcceptRequest function
      onAcceptRequest(orderRequest.id);
      toast({
        title: "Request Accepted",
        description: "You have successfully accepted this cleaning request.",
        duration: 3000,
      });
      onClose();
    } catch (error) {
      console.error('Error accepting request:', error);
      toast({
        title: "Error",
        description: "Failed to accept the request. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleReject = async () => {
    try {
      // Here you would typically make an API call to reject the request
      // For now, we'll just call the onRejectRequest function
      onRejectRequest(orderRequest.id);
      toast({
        title: "Request Rejected",
        description: "You have rejected this cleaning request.",
        duration: 3000,
      });
      onClose();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: "Error",
        description: "Failed to reject the request. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto my-4">
        <DialogHeader>
          <DialogTitle>Order Request Details</DialogTitle>
        </DialogHeader>
        <Card className="overflow-hidden">
          <div className="relative h-40">
            <img 
              src={orderRequest.imageUrl || "/images/default-property.jpg"}
              alt={`${orderRequest.property.propertyName} image`}
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={orderRequest.user.image} alt={orderRequest.user.name} />
                  <AvatarFallback>{orderRequest.user.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-700">{orderRequest.user.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Home className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{orderRequest.propertyType}</span>
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
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{orderRequest.serviceDuration} hours</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">${orderRequest.totalPrice.toFixed(2)} total</span>
              </div>
              <div className="flex items-center space-x-2">
                <Key className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Entry Method: {orderRequest.entryMethod}</span>
              </div>
              {orderRequest.comment && (
                <div className="flex items-start space-x-2">
                  <MessageSquare className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Comment:</p>
                    <p className="text-sm text-gray-700">{orderRequest.comment}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 space-y-4">
              <Button 
                className="w-full bg-green-500 hover:bg-green-600" 
                onClick={handleAccept}
              >
                Accept Request
              </Button>
              <Button 
                className="w-full bg-red-500 hover:bg-red-600" 
                onClick={handleReject}
              >
                Reject Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}