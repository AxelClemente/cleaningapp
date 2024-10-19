'use client';

import { SimpleWorkerCard } from '@/components/SimpleWorkerCard';
import { Header } from "@/components/Header";
import { DynamicForm } from "../../components/DynamicForm";
import { useWorkers } from '@/contexts/WorkerContext';
import { useEffect, useState } from 'react';
import { WorkerProfile } from '@/types/interfaces';
import { useSession } from "next-auth/react";

function RequestServicePage({ params }: { params: { workerId: string } }) {
  const { getWorker } = useWorkers();
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    async function fetchWorker() {
      if (!params.workerId) return;
      
      setIsLoading(true);
      try {
        const fetchedWorker = await getWorker(params.workerId);
        setWorker(fetchedWorker);
      } catch (err) {
        console.error('Error fetching worker:', err);
        setError('Failed to load worker data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchWorker();
  }, [params.workerId, getWorker]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!worker) {
    return <div>Worker not found.</div>;
  }

  if (!userId) {
    return <div>Please log in to request a service.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        doctorName="Dr. Example"
        clinicName="Request your Service"
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Request Service</h1>
        <div className="flex flex-col items-center gap-8">
          <div className="w-full max-w-[400px]">
            <SimpleWorkerCard workerId={params.workerId} />
          </div>
          <div className="w-full max-w-[400px]">
            <DynamicForm 
              workerId={params.workerId} 
              workerHourlyRate={worker.hourlyRate ?? 0} 
              userId={userId}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default RequestServicePage;
