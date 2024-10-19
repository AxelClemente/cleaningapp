import { WorkerProfile } from '@/types/interfaces'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export async function getWorkers(): Promise<WorkerProfile[]> {
  console.log('Fetching all workers from:', `${API_BASE_URL}/workers`);
  const response = await fetch(`${API_BASE_URL}/workers`, { 
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  if (!response.ok) {
    console.error('Failed to fetch workers. Status:', response.status);
    throw new Error('Failed to fetch workers')
  }
  
  const workers = await response.json();
  console.log('Workers fetched successfully:', workers);
  return workers;
}

export async function getWorkerById(id: string): Promise<WorkerProfile | null> {
  console.log('Fetching worker with ID:', id, 'from:', `${API_BASE_URL}/workers/${id}`);
  try {
    const response = await fetch(`${API_BASE_URL}/workers/${id}`);
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const worker = await response.json();
    console.log('Worker fetched successfully:', worker);
    return worker;
  } catch (error) {
    console.error('Error fetching worker:', error);
    throw error;
  }
}

export async function getWorkerByUserId(userId: string): Promise<WorkerProfile | null> {
  console.log('Fetching worker with User ID:', userId, 'from:', `${API_BASE_URL}/workers?userId=${userId}`);
  try {
    const response = await fetch(`${API_BASE_URL}/workers?userId=${userId}`);
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const worker = await response.json();
    console.log('Worker fetched successfully:', worker);
    return worker;
  } catch (error) {
    console.error('Error fetching worker by user ID:', error);
    return null;
  }
}
