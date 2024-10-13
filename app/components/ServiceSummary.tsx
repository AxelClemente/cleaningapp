import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/Button"
import { CustomInput } from "./Input"
import { Textarea } from "@/components/Textarea"
import { CheckoutButton } from "@/components/Checkout-button"
import { Home, Building, Castle, Warehouse, Bed, Bath, Phone, Key, MessageSquare, CalendarIcon, MapPinIcon } from 'lucide-react'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import ImageUpload from './ImageUpload';
import { ActionButtonCloudinary } from './ActionButtonCloudinary';
import { CldUploadButton } from 'next-cloudinary';

interface ServiceSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  calendarData: string;
  houseType: string;
  serviceType: string; // Cambiamos de string[] a string
  location: string;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  entryMethods: string[];
  setEntryMethods: React.Dispatch<React.SetStateAction<string[]>>;
  comment: string;
  setComment: (value: string) => void;
  price: number;
  userId: string;
  image: string;
  setImage: (value: string) => void;
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
  entryMethods = [], // Provide a default empty array
  setEntryMethods,
  comment,
  setComment,
  price,
  userId,
  image,
  setImage
}: ServiceSummaryProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  console.log("Rendering ServiceSummary");
  console.log("Current phoneNumber:", phoneNumber);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [status, router]);

  console.log("Session status:", status);
  console.log("Session data:", session);

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

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      if (status !== "authenticated" || !session?.user?.email) {
        throw new Error("User not authenticated");
      }

      // Validación de datos
      if (!houseType || !serviceType || !calendarData || !location || !phoneNumber || entryMethods.length === 0 || price <= 0) {
        throw new Error("Please fill in all required fields and ensure price is calculated");
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: session.user.email,
          houseType,
          calendarData,
          location,
          phoneNumber,
          entryMethod: entryMethods.join(', '),
          comment,
          price: price.toFixed(2), // Ahora siempre será un número
          status: 'Open',
          serviceType,
          image: image, // Add this line
        }),
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("API error data:", errorData);
        throw new Error(errorData.error || 'Failed to create order');
      }

      const data = await response.json();
      console.log('Order created:', data);
      router.push('/');
    } catch (error) {
      console.error('Error creating order:', error);
      // Muestra el error al usuario
      alert(error.message || 'An error occurred while creating the order');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("Typed value:", value);
    
    // Allow only digits, '+', '-', '(', ')', and spaces
    const isValid = /^[0-9+\-() ]*$/.test(value);
    console.log("Is valid:", isValid);
  
    if (isValid) {
      setPhoneNumber(value);
      console.log("Phone number set:", value);
    }
  };

  const handleImageUpload = (result: any) => {
    console.log('handleImageUpload called with result:', result);
    if (result && result.secure_url) {
      console.log('Setting new image URL:', result.secure_url);
      setImage(result.secure_url);
    } else {
      console.error('Error: secure_url not found in upload result');
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
              <CustomInput
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                className="h-8 text-sm border-gray-200 focus:border-gray-300 focus:ring-gray-300"
                placeholder="Número de teléfono"
                type="tel"
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
                      checked={entryMethods?.includes(method) || false}
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
              <label className="flex items-center space-x-2 mb-1">
                <span>Imagen subida</span>
              </label>
              {image ? (
                <>
                  <img 
                    src={image} 
                    alt="Uploaded image" 
                    className="w-full h-40 object-cover rounded-md"
                    onError={(e) => console.error('Error loading image:', e)}
                  />
                  <p>Image URL: {image}</p>
                </>
              ) : (
                <CldUploadButton
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  onUpload={(result: any) => {
                    console.log('Upload result:', result);
                    if (result.info && result.info.secure_url) {
                      setImage(result.info.secure_url);
                    }
                  }}
                >
                  Upload Image
                </CldUploadButton>
              )}
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
                  <h3 className="text-xl font-bold">{serviceType}</h3>
                </div>
                {price !== null && price !== undefined && (
                  <div className="text-right">
                    <p className="text-sm">Total:</p>
                    <p className="text-2xl font-bold">{price.toFixed(2)}€</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-col items-stretch mt-4">
          <div className="flex justify-between mb-4">
            <Button onClick={onClose} variant="outline" className="h-9 px-3 text-sm">Cerrar</Button>
            <Button 
              onClick={handlePayment} 
              variant="outline" 
              className="h-9 px-3 text-sm"
              disabled={isLoading}
            >
              {isLoading ? 'Procesando...' : 'Pay'}
            </Button>
          </div>
          {price !== null && <CheckoutButton amount={price.toFixed(2)} />}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}