"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "../Button"
import { FormData } from '../../types/formData'
import Image from 'next/image'

interface SummaryProps {
  formData: FormData;
  workerId: string;
}

export function Summary({ formData, workerId }: SummaryProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (!formData.userId) {
        console.error("userId is undefined. Cannot submit order request.");
        // Puedes mostrar un mensaje de error al usuario aquí
        return;
      }

      console.log("Submitting order request with data:", {
        userId: formData.userId,
        workerId: workerId,
        propertyId: formData.selectedProperty?.id,
        propertyType: formData.selectedProperty?.propertyType,
        selectedDate: formData.selectedDate,
        serviceDuration: formData.hours,
        pricePerHour: formData.workerHourlyRate,
        totalPrice: formData.totalPrice,
        comment: formData.selectedProperty?.comment,
        imageUrl: formData.selectedProperty?.imageUrl,
        entryMethod: formData.selectedProperty?.entryMethod,
        location: formData.selectedProperty?.location,
        lockboxPass: formData.selectedProperty?.lockboxPass,
      });

      const response = await fetch('/api/orderRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: formData.userId,
          workerId: workerId,
          propertyId: formData.selectedProperty?.id,
          propertyType: formData.selectedProperty?.propertyType,
          selectedDate: formData.selectedDate,
          serviceDuration: formData.hours,
          pricePerHour: formData.workerHourlyRate,
          totalPrice: formData.totalPrice,
          comment: formData.selectedProperty?.comment,
          imageUrl: formData.selectedProperty?.imageUrl,
          entryMethod: formData.selectedProperty?.entryMethod,
          location: formData.selectedProperty?.location,
          lockboxPass: formData.selectedProperty?.lockboxPass,
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response OK:", response.ok);

      if (response.ok) {
        const responseData = await response.json();
        console.log("Order request created successfully:", responseData);
        router.push('/');
      } else {
        const errorData = await response.json();
        console.error("Failed to create order request:", errorData);
      }
    } catch (error) {
      console.error("Error creating order request:", error);
    } finally {
      setIsSubmitting(false);
    }
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
      </div>
      <Button 
        onClick={handleSubmit} 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Request Service'}
      </Button>
    </div>
  );
}
