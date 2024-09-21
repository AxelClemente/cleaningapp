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
import { CheckoutButton } from "@/components/Checkout-button"
import { Home, Building, Castle, Warehouse, Bed, Bath, Phone, Key, MessageSquare, CalendarIcon, MapPinIcon } from 'lucide-react'

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

  const getHouseIcon = (type: string) => {
    const iconClass = "w-6 h-6 text-green-500"; // Añadimos la clase de color verde
    switch (type) {
      case 'small':
        return <Home className={iconClass} />;
      case 'regular':
        return <Warehouse className={iconClass} />;
      case 'chalet':
        return <Building className={iconClass} />;
      case 'finca':
        return <Castle className={iconClass} />;
      default:
        return <Home className={iconClass} />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Resumen de tu servicio</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-green-500 text-white p-4 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-white rounded-full p-2">
                {getHouseIcon(houseType)}
              </div>
              <span className="text-lg font-semibold ">
                {houseType === 'small' ? 'Small House' : 
                 houseType === 'regular' ? 'Regular House' :
                 houseType === 'chalet' ? 'Chalet' : 'Finca'}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm mb-2 ml-2">
              <span className="flex items-center"><Bed className="w-4 h-4 mr-1" /> 1</span>
              <span className="flex items-center"><Bath className="w-4 h-4 mr-1" /> 1</span>
            </div>
          </div>

          

          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4 text-gray-500" />
              <span>{calendarData}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPinIcon className="w-4 h-4 text-gray-500" />
              <span>{location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="h-8 text-sm border-gray-200 focus:border-gray-300 focus:ring-gray-300"
                placeholder="Número de teléfono"
              />
            </div>
            <div>
              <label className="flex items-center space-x-2 mb-1">
                <Key className="w-4 h-4 text-gray-500" />
                <span>Método de entrada</span>
              </label>
              <div className="space-y-1 ml-6">
                {['LockBox', 'InPerson', 'Other'].map((method) => (
                  <div key={method} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`entryMethod-${method}`}
                      checked={entryMethods.includes(method)}
                      onChange={() => handleEntryMethodChange(method)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`entryMethod-${method}`} className="ml-2 block text-sm text-gray-900">
                      {method === 'LockBox' ? 'LockBox' : method === 'InPerson' ? 'En persona' : 'Otro'}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="comment" className="flex items-center space-x-2 mb-1">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <span>Comentario (opcional)</span>
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1 h-16 text-sm border-gray-200 focus:border-gray-300 focus:ring-gray-300"
              />
            </div>
            
          </div>
          <div>
            
            <div className="bg-slate-700 text-white p-4 rounded-lg">
                
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium text-gray-200 mb-2">Type of service</h4>
                  <h3 className="text-xl font-bold">{serviceType[0]}</h3>
                  <p>{serviceType.length > 1 ? `+${serviceType.length - 1} servicios` : ''}</p>
                </div>
                {price !== null && (
                  <div className="text-right">
                    <p className="text-sm">Total:</p>
                    <p className="text-2xl font-bold">{price.toFixed(2)}€</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between items-center mt-4">
          <Button onClick={onClose} variant="outline" className="h-9 px-3 text-sm">Cerrar</Button>
          {price !== null && <CheckoutButton amount={price.toFixed(2)} />}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}