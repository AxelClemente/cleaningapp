import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/Button"

interface ServiceSummaryProps {
    isOpen: boolean;
    onClose: () => void;
    calendarData: string;
    houseType: string;
    serviceType: string[]; // Add this line
    location: string;
  }

export function ServiceSummary({
  isOpen,
  onClose,
  calendarData,
  houseType,
  serviceType,
  location
}: ServiceSummaryProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resumen de tu servicio</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p><strong>Fecha:</strong> {calendarData}</p>
          <p>{"<strong>"}Tipo de vivienda:{"</strong>"} {houseType}</p>
          <p>{"<strong>"}Servicios seleccionados:{"</strong>"}</p>
          <ul className="list-disc pl-5">
            {serviceType.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
          <p><strong>Dirección:</strong> {location}</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}