import WorkerCard from "@/components/Worker-card"
import { Header } from "@/components/Header"

export default function HirePage() {
  return (
    <>
      <Header doctorName="Dr. Smith" clinicName="Remember everyone starts somewhere give new members a chance." className="font-montserrat font-medium text-[#002b34]" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 font-['Montserrat'] font-bold text-[#002b34]">
          New Members
        </h1>
        <div className="mb-12">
          <WorkerCard />
        </div>
        <h2 className="text-3xl font-bold mb-6 font-['Montserrat'] font-bold text-[#002b34]">
          All the TidyTeam
        </h2>
        {/* Aquí puedes agregar el contenido para "All the TidyTeam" */}
      </div>
    </>
  )
}
