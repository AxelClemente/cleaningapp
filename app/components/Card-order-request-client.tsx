"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Home, MapPin, Calendar, Clock, DollarSign, Key } from 'lucide-react';

interface OrderRequest {
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

interface CardOrderRequestClientProps {
  userId: string;
  activeTab: string;
}

export function CardOrderRequestClient({ userId, activeTab }: CardOrderRequestClientProps) {
  const [orderRequests, setOrderRequests] = useState<OrderRequest[]>([]);

  useEffect(() => {
    const fetchOrderRequests = async () => {
      console.log('Fetching order requests for userId:', userId);
      try {
        const response = await fetch(`/api/orderRequest?userId=${userId}`);
        console.log('Response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched order requests:', data);
          setOrderRequests(data);
        } else {
          console.error('Failed to fetch order requests');
        }
      } catch (error) {
        console.error('Error fetching order requests:', error);
      }
    };

    if (userId) {
      fetchOrderRequests();
    } else {
      console.log('No userId provided');
    }
  }, [userId]);

  const truncateLocation = (location: string) => {
    const words = location.split(' ');
    return words.slice(0, 4).join(' ') + (words.length > 4 ? '...' : '');
  };

  const filteredOrderRequests = orderRequests.filter(request => {
    switch (activeTab) {
      case 'pending':
        return request.status === 'pending';
      case 'progress':
        return request.status === 'Progress';
      case 'completed':
        return request.status === 'Completed';
      default:
        return true;
    }
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Order Requested</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredOrderRequests.map((request, index) => (
          <Card key={index} className="overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer">
            <div className="relative">
              <Image 
                src={request.imageUrl || "/images/cuarto.jpg"}
                alt={`${request.propertyType} image`}
                width={400}
                height={200}
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
                  request.status === 'Open'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : request.status === 'Progress'
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                    : 'bg-green-100 text-green-800 border border-green-300'
                }`}>
                  {request.status}
                </div>
              </div>
              <div className="flex items-center space-x-1 mb-1">
                <Home className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{request.propertyType} House</span>
              </div>
              <div className="flex items-center space-x-1 mb-1">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700" title={request.location}>
                  {truncateLocation(request.location)}
                </span>
              </div>
              <div className="flex items-center space-x-1 mb-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{new Date(request.selectedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1 mb-1">
                <Key className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{request.entryMethod}</span>
              </div>
              <div className="flex items-center space-x-1 mb-1 mt-2">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">{request.serviceDuration}</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{request.serviceType} </span>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold">${request.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
