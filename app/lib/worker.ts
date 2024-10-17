import { WorkerProfile } from '@/types/interfaces'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export async function getWorkers(): Promise<WorkerProfile[]> {
  const response = await fetch(`${API_BASE_URL}/workers`, { 
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  if (!response.ok) {
    throw new Error('Failed to fetch workers')
  }
  
  return response.json()
}

export async function getWorkerById(id: string): Promise<WorkerProfile | null> {
  console.log('Fetching worker with ID:', id);
  try {
    const response = await fetch(`/api/workers/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const worker = await response.json();
    console.log('Worker fetched from API:', worker);
    return worker;
  } catch (error) {
    console.error('Error fetching worker:', error);
    throw error;
  }
}
