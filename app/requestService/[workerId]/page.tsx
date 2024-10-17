import { SimpleWorkerCard } from '@/components/SimpleWorkerCard';
import { Header } from "@/components/Header";

export default function RequestServicePage({ params }: { params: { workerId: string } }) {
  console.log('Params in RequestServicePage:', params);
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        doctorName="Dr. Example"
        clinicName="Request your Service"
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Request Service</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {params.workerId ? (
            <SimpleWorkerCard workerId={params.workerId} />
          ) : (
            <div>No worker ID provided</div>
          )}
        </div>
      </main>
    </div>
  );
}
