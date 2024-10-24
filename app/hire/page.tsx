'use client'

import { useEffect, useState } from 'react';
import { WorkerCard } from "@/components/Worker-card";
import { Header } from "@/components/Header";
import { WorkerProfile } from '@/types/interfaces';
import { getWorkers } from '@/lib/worker';
import { useRouter } from 'next/navigation';

export default function HirePage() {
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchWorkers() {
      try {
        console.log('Fetching workers...');
        const fetchedWorkers = await getWorkers();
        console.log('Fetched workers:', fetchedWorkers);
        setWorkers(fetchedWorkers);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching workers:', err);
        setError(err instanceof Error ? err : new Error('An error occurred while fetching workers'));
        setIsLoading(false);
      }
    }
    fetchWorkers();
  }, []);

  console.log('Current state:', { workers, isLoading, error });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (workers.length === 0) return <div>No workers found.</div>;

  return (
    <>
      <Header 
        doctorName="Dr. Smith" 
        clinicName={
          <span className="font-montserrat font-medium text-[#002b34]">
            Remember everyone starts somewhere give new members a chance.
          </span>
        }
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 font-['Montserrat'] text-[#002b34]">
          Create an open request 
        </h1>

        <div 
          className="w-full max-w-[300px] mb-6 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push('/requestService/open')}
        >
          <div className="p-0">
            <div className="relative h-48 flex items-center justify-center">
              <div className="w-40 h-40 flex items-center justify-center bg-gray-200 rounded-full">
                <span className="text-6xl text-gray-500">+</span>
              </div>
            </div>
          </div>
          <div className="p-4 text-center">
            <h2 className="text-xl font-bold mb-1">New request</h2>
            <p className="text-sm text-gray-600 mb-4">
              Make your cleaning offer to all members
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-6 font-['Montserrat'] text-[#002b34]">
          Find a TidyTeam worker
        </h2>
        <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {workers.map((worker) => (
            <WorkerCard
              key={worker.id}
              id={worker.id ?? ''}
              name={worker.name ?? ''}
              description={worker.description ?? ''}
              hourlyRate={worker.hourlyRate}
              profilePicture={worker.profilePicture}
              rating={Number(worker.rating) || 0}
              reviewCount={worker.reviewCount ?? 0}
              location={worker.location ?? 'Unknown location'}
            />
          ))}
        </div>
      </div>
    </>
  );
}
