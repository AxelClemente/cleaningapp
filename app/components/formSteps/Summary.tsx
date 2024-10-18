"use client";

import { Button } from "../Button"
import { FormData } from '../../types/formData'
import Image from 'next/image'

interface SummaryProps {
  formData: FormData;
  workerId: string;
}

export function Summary({ formData, workerId }: SummaryProps) {
  console.log("FormData received in Summary:", formData);

  const handleSubmit = () => {
    // Aquí iría la lógica para enviar los datos al servidor
    console.log("Form submitted:", formData);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Summary</h2>
      <div className="space-y-2">
        {formData.selectedProperty && (
          <div className="space-y-2">
            <p><strong>Type:</strong> {formData.selectedProperty.propertyType || 'Not specified'}</p>
            <p><strong>Location:</strong> {formData.selectedProperty.location}</p>
            {formData.selectedProperty.imageUrl && (
              <div className="relative h-48 w-full">
                <Image 
                  src={formData.selectedProperty.imageUrl} 
                  alt="Property" 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-md"
                />
              </div>
            )}
            <p><strong>Entry Method:</strong> {formData.selectedProperty.entryMethod}</p>
            {formData.selectedProperty.lockboxPass && (
              <p><strong>Lockbox Pass:</strong> {formData.selectedProperty.lockboxPass}</p>
            )}
            {formData.selectedProperty.comment && (
              <p><strong>Comment:</strong> {formData.selectedProperty.comment}</p>
            )}
          </div>
        )}
        <p><strong>Selected Date:</strong> {formData.selectedDate?.toLocaleDateString() || 'Not selected'}</p>
        <p><strong>Service Duration:</strong> {formData.hours} hours</p>
        <p><strong>Price per Hour:</strong> ${formData.workerHourlyRate}</p>
        <p><strong>Total Price:</strong> ${formData.totalPrice}</p>
        {/*<p><strong>Worker ID:</strong> {workerId}</p>*/}
      </div>
      <Button onClick={handleSubmit} className="w-full">Request Service</Button>
    </div>
  );
}
