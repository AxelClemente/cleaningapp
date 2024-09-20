import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Textarea } from "@/components/Textarea"
import * as Select from '@radix-ui/react-select'
import { ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons'

interface ServiceSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  calendarData: string;
  houseType: string;
  serviceType: string[];
  location: string;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  entryMethods: string[];
  setEntryMethods: React.Dispatch<React.SetStateAction<string[]>>;
  comment: string;
  setComment: (value: string) => void;
  price: number | null;
}

export function ServiceSummary({
  isOpen,
  onClose,
  calendarData,
  houseType,
  serviceType,
  location,
  phoneNumber,
  setPhoneNumber,
  entryMethods,
  setEntryMethods,
  comment,
  setComment,
  price
}: ServiceSummaryProps) {
  const handleEntryMethodChange = (method: string) => {
    setEntryMethods(prevMethods => 
      prevMethods.includes(method)
        ? prevMethods.filter(m => m !== method)
        : [...prevMethods, method]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resumen de tu servicio</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p><strong>Fecha:</strong> {calendarData}</p>
          <p><strong>Tipo de vivienda:</strong> {houseType}</p>
          <p><strong>Servicios seleccionados:</strong></p>
          <ul className="list-disc pl-5">
            {serviceType.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
          <p><strong>Dirección:</strong> {location}</p>
          {price !== null && (
            <p><strong>Precio total:</strong> {price.toFixed(2)}€</p>
          )}
          
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Número de teléfono</label>
            <Input
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Método de entrada</label>
            <div className="mt-2 space-y-2">
              {['LockBox', 'InPerson', 'Other'].map((method) => (
                <div key={method} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`entryMethod-${method}`}
                    checked={entryMethods.includes(method)}
                    onChange={() => handleEntryMethodChange(method)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`entryMethod-${method}`} className="ml-2 block text-sm text-gray-900">
                    {method === 'LockBox' ? 'LockBox' : method === 'InPerson' ? 'En persona' : 'Otro'}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comentario (opcional)</label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}