import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface WorkerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  // Agrega aquí otros campos relevantes para el perfil del trabajador
}

export async function getWorkerProfile(): Promise<WorkerProfile | null> {
  console.log('Fetching worker profile');
  try {
    const response = await fetch('/api/worker');
    console.log('Response status:', response.status);
    if (!response.ok) {
      if (response.status === 404) {
        console.log('Worker profile not found');
        return null;
      }
      throw new Error('Failed to fetch worker profile');
    }
    const data = await response.json();
    console.log('Worker profile data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching worker profile:', error);
    return null;
  }
}
