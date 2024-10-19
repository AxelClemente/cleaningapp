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
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    async function fetchWorker() {
      const fetchedWorker = await getWorker(params.workerId);
      setWorker(fetchedWorker);
    }
    fetchWorker();
  }, [params.workerId, getWorker]);

  if (!worker) {
    return <div>Loading...</div>;
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
