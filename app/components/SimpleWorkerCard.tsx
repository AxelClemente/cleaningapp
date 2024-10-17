"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { WorkerProfile } from '@/types/interfaces' // Asegúrate de que esta importación sea correcta
import { useWorkers } from '@/contexts/WorkerContext';

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

  if (error) return <div>{error}</div>;
  if (!worker) return <div>Loading...</div>;

  const { name, hourlyRate, profilePicture, location } = worker;
  const avatarSrc = profilePicture || '/images/default-avatar.jpg';

  return (
    <Card className="w-full max-w-[250px] overflow-hidden">
      <CardHeader className="p-4">
        <Avatar className="w-24 h-24 mx-auto">
          <AvatarImage 
            src={avatarSrc} 
            alt={`Profile picture of ${name}`}
          />
          <AvatarFallback>{name ? name[0] : 'U'}</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="p-4 text-center">
        <h2 className="text-lg font-bold mb-1">{name || 'Unknown'}</h2>
        <p className="text-sm text-gray-500 mb-2">{location || 'Unknown location'}</p>
        <p className="text-sm font-semibold">
          Hr/rate: €{hourlyRate?.toFixed(0) || 'N/A'}
        </p>
      </CardContent>
    </Card>
  )
}
