'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WorkerProfile } from '@/types/interfaces';
import { getWorkers, getWorkerById } from '@/lib/worker';

interface WorkerContextType {
  workers: WorkerProfile[];
  isLoading: boolean;
  error: Error | null;
  refreshWorkers: () => Promise<void>;
  getWorker: (id: string) => Promise<WorkerProfile | null>;
}

const WorkerContext = createContext<WorkerContextType | undefined>(undefined);

export function WorkerProvider({ children }: { children: ReactNode }) {
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshWorkers = async () => {
    try {
      setIsLoading(true);
      const fetchedWorkers = await getWorkers();
      setWorkers(fetchedWorkers);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while fetching workers'));
    } finally {
      setIsLoading(false);
    }
  };

  const getWorker = async (id: string): Promise<WorkerProfile | null> => {
    console.log('Getting worker with ID:', id);
    const worker = workers.find(w => w.id === id);
    if (worker) {
      console.log('Worker found in context:', worker);
      return worker;
    }

    try {
      const fetchedWorker = await getWorkerById(id);
      console.log('Fetched worker from API:', fetchedWorker);
      if (fetchedWorker) {
        setWorkers(prevWorkers => [...prevWorkers, fetchedWorker]);
      }
      return fetchedWorker;
    } catch (err) {
      console.error('Error fetching individual worker:', err);
      return null;
    }
  };

  useEffect(() => {
    refreshWorkers();
  }, []);

  const value = {
    workers,
    isLoading,
    error,
    refreshWorkers,
    getWorker,
  };

  return <WorkerContext.Provider value={value}>{children}</WorkerContext.Provider>;
}

export function useWorkers() {
  const context = useContext(WorkerContext);
  if (context === undefined) {
    throw new Error('useWorkers must be used within a WorkerProvider');
  }
  return context;
}
