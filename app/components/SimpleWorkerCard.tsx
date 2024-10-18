"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { WorkerProfile } from '@/types/interfaces' // Asegúrate de que esta importación sea correcta
import { useWorkers } from '@/contexts/WorkerContext';
import { Star } from 'lucide-react';

interface SimpleWorkerCardProps {
  workerId: string;
}

export function SimpleWorkerCard({ workerId }: SimpleWorkerCardProps) {
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { getWorker } = useWorkers();

  useEffect(() => {
    console.log('workerId in SimpleWorkerCard:', workerId);
    if (!workerId) {
      setError('No worker ID provided');
      return;
    }
    const fetchWorker = async () => {
      try {
        const fetchedWorker = await getWorker(workerId);
        console.log('Fetched worker:', fetchedWorker);
        if (fetchedWorker) {
          setWorker(fetchedWorker);
        } else {
          setError('Worker not found');
        }
      } catch (error) {
        console.error('Error fetching worker:', error);
        setError('Error fetching worker');
      }
    };
    fetchWorker();
  }, [workerId, getWorker]);

  if (error) return <div className="w-full text-center">{error}</div>;
  if (!worker) return <div className="w-full text-center">Loading...</div>;

  const { name, hourlyRate, profilePicture, location, rating } = worker;
  const avatarSrc = profilePicture || '/images/default-avatar.jpg';

  return (
    <div className="w-full flex justify-center">
      <Card className="w-full max-w-[400px] overflow-hidden">
        <CardContent className="p-4 flex items-center">
          <Avatar className="w-16 h-16 mr-4">
            <AvatarImage 
              src={avatarSrc} 
              alt={`Profile picture of ${name}`}
            />
            <AvatarFallback>{name ? name[0] : 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <h2 className="text-lg font-bold">{name || 'Unknown'}</h2>
            <p className="text-sm text-gray-500">{location || 'Unknown location'}</p>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="text-sm">{rating?.toFixed(1) || '0.0'} ({rating ? '1' : '0'})</span>
              </div>
              <div className="text-sm">
                <span className="font-semibold">Hr/rate: </span>
                <span className="font-bold text-xs">€{hourlyRate?.toFixed(0) || 'N/A'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
