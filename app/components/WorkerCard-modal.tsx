"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Star, Heart } from 'lucide-react'
import { useState } from 'react'
import { Button } from "../components/Button"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface WorkerCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  description?: string;
  hourlyRate?: number;
  profilePicture?: string;
  rating?: number;
  reviewCount?: number;
  location?: string;
  id: string;
}

export function WorkerCardModal({ 
  isOpen,
  onClose,
  name, 
  description, 
  hourlyRate, 
  profilePicture,
  rating = 0,
  reviewCount = 0,
  location = 'Unknown location',
  id
}: WorkerCardModalProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const avatarSrc = profilePicture || '/images/default-avatar.jpg';
  const router = useRouter();

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // Aquí puedes agregar la lógica para guardar el favorito en el backend
  };

  const handleRequestService = () => {
    if (!id) {
      console.error('No worker ID available');
      return;
    }
    console.log('Requesting service for worker:', id);
    router.push(`/requestService/${id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[375px]">
        <DialogHeader className="relative">
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription>{location}</DialogDescription>
          <button 
            onClick={toggleFavorite}
            className="absolute top-2 right-2 p-2 bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 transition-all duration-200 group"
          >
            <Heart 
              className={`w-6 h-6 transition-all duration-200 group-hover:scale-110 ${
                isFavorite 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-gray-500 group-hover:text-red-400'
              }`} 
            />
          </button>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center">
            <Avatar className="w-32 h-32">
              <AvatarImage src={avatarSrc} alt={`Profile picture of ${name}`} />
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">{description || "Experienced professional"}</p>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Hourly rate</p>
              <span className="font-bold">€{hourlyRate || 'N/A'}</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Reviews</p>
              <span className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                {rating.toFixed(1)} ({reviewCount})
              </span>
            </div>
          </div>
          <Button 
            className="w-full bg-[#002a34] hover:bg-[#004963]"
            onClick={handleRequestService}
          >
            Request Service
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
