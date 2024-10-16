import { WorkerProfile } from '@/types/interfaces'

export async function getWorkers(): Promise<WorkerProfile[]> {
  const response = await fetch('/api/workers', { cache: 'no-store' })
  if (!response.ok) {
    throw new Error('Failed to fetch workers')
  }
  return response.json()
}