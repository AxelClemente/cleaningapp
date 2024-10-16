import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Star, Heart } from 'lucide-react'
import { useState } from 'react'

interface WorkerCardProps {
  name: string;
  description?: string;
  hourlyRate?: number;
  profilePicture?: string;
  rating?: number;
  reviewCount?: number;
  location?: string;
}

export default function WorkerCard({ 
  name, 
  description, 
  hourlyRate, 
  profilePicture,
  rating = 0,
  reviewCount = 0,
  location = 'Unknown location'
}: WorkerCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const avatarSrc = profilePicture || '/images/default-avatar.jpg';

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Aquí puedes agregar la lógica para guardar el favorito en el backend
  };

  return (
    <Card className="w-full max-w-[300px] overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative h-48 flex items-center justify-center">
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
          <Avatar className="w-40 h-40">
            <AvatarImage 
              src={avatarSrc} 
              alt={`Profile picture of ${name}`}
            />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent className="p-4 text-center">
        <h2 className="text-xl font-bold mb-1">{name}</h2>
        <p className="text-sm text-gray-500 mb-3">{location}</p>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {description || "Experienced professional"}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Hr/rate</p>
          <span className="font-bold">€{hourlyRate || 'N/A'}</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">Reviews</p>
          <span className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
            {rating.toFixed(2)} ({reviewCount})
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}
