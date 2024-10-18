import { SimpleWorkerCard } from '@/components/SimpleWorkerCard';
import { Header } from "@/components/Header";
import { DynamicForm } from "../../components/DynamicForm";

export default function RequestServicePage({ params }: { params: { workerId: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        doctorName="Dr. Example"
        clinicName="Request your Service"
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Request Service</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            {params.workerId ? (
              <SimpleWorkerCard workerId={params.workerId} />
            ) : (
              <div>No worker ID provided</div>
            )}
          </div>
          <div className="w-full md:w-2/3">
            <DynamicForm workerId={params.workerId} />
          </div>
        </div>
      </main>
    </div>
  );
}
