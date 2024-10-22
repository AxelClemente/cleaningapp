'use client'
// CAMBIO
import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Home, MapPin, Calendar, DollarSign, Clock } from 'lucide-react'
import { CardOrderRequestModal } from './Card-order-request-modal'
import { useToast } from "./ui/use-toast"
import { useRouter } from 'next/navigation'; // Añade esta importación

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
  property?: {
    propertyName: string;
  };
  worker: {
    hourlyRate: number;
  };
}

interface CardOrderRequestProps {
  workerId: string;
  activeTab: string;
}

export function CardOrderRequest({ workerId, activeTab }: CardOrderRequestProps) {
  const [orderRequests, setOrderRequests] = useState<OrderRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<OrderRequest | null>(null);
  const { toast } = useToast();
  const router = useRouter(); // Añade esta línea

  useEffect(() => {
    const fetchOrderRequests = async () => {
      const response = await fetch(`/api/orderRequest?workerId=${workerId}`)
      if (response.ok) {
        const data = await response.json()
        setOrderRequests(data)
      }
    }
    fetchOrderRequests()
  }, [workerId, activeTab]) // Añadimos activeTab como dependencia

  const handleAcceptRequest = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orderRequest?id=${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Progress' }),
      });

      if (response.ok) {
        const updatedRequest = await response.json();
        setOrderRequests(prevRequests =>
          prevRequests.map(request =>
            request.id === orderId ? { ...request, ...updatedRequest } : request
          )
        );
        setSelectedRequest(null);
        toast({
          title: "Request Accepted",
          description: "The cleaning request has been accepted and is now in progress.",
          duration: 3000,
        });
        router.refresh();
      } else {
        throw new Error('Failed to update request status');
      }
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

  const handleRejectRequest = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orderRequest?id=${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Rejected' }),
      });

      if (response.ok) {
        setOrderRequests(prevRequests =>
          prevRequests.filter(request => request.id !== orderId)
        );
        toast({
          title: "Request Rejected",
          description: "You have rejected this cleaning request.",
          duration: 3000,
        });
      } else {
        throw new Error('Failed to update request status');
      }
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

  const filteredOrderRequests = orderRequests.filter(request => {
    switch (activeTab) {
      case 'pending':
        return request.status === 'pending';
      case 'open':
        return request.status === 'accepted';
      case 'inProgress':
        return request.status === 'Progress';
      case 'completed':
        return request.status === 'Completed';
      default:
        return true;
    }
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredOrderRequests.map((request) => (
          <Card 
            key={request.id} 
            className="overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
            onClick={() => setSelectedRequest(request)}
          >
            <div className="relative">
              <img 
                src={request.imageUrl || "/images/default-property.jpg"}
                alt={`${request.property?.propertyName || request.propertyType || 'Property'} image`}
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
                    <AvatarImage src={request.user.image ?? "/images/default-avatar.png"} alt={request.user.name} />
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
                <span className="text-sm text-gray-700">
                  {request.location.split(' ').slice(0, 3).join(' ')}
                  {request.location.split(' ').length > 3 ? '...' : ''}
                </span>
              </div>
              <div className="flex items-center space-x-1 mb-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{new Date(request.selectedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1 mb-1">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{request.serviceDuration} hours</span>
              </div>
              <div className="flex items-center space-x-1 mb-1">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">${request.totalPrice.toFixed(2)} total</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedRequest && (
        <CardOrderRequestModal
          orderRequest={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onAcceptRequest={handleAcceptRequest}
          onRejectRequest={handleRejectRequest}
        />
      )}
    </div>
  )
}
