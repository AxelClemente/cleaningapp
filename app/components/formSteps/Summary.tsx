"use client";

import { Button } from "../Button"

interface FormData {
  serviceType: string;
  date: string;
  address: string;
  instructions?: string;
  termsAccepted: boolean;
  newsletterOptIn: boolean;
}

interface SummaryProps {
  formData: FormData;
  workerId: string;
}

export function Summary({ formData, workerId }: SummaryProps) {
  const handleSubmit = () => {
    // Aquí iría la lógica para enviar los datos al servidor
    console.log("Form submitted:", formData);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Summary</h2>
      <div className="mb-4">
        <p><strong>Service Type:</strong> {formData.serviceType}</p>
        <p><strong>Date:</strong> {formData.date}</p>
        <p><strong>Address:</strong> {formData.address}</p>
        <p><strong>Special Instructions:</strong> {formData.instructions || 'None'}</p>
        <p><strong>Terms Accepted:</strong> {formData.termsAccepted ? 'Yes' : 'No'}</p>
        <p><strong>Newsletter Opt-in:</strong> {formData.newsletterOptIn ? 'Yes' : 'No'}</p>
        <p><strong>Worker ID:</strong> {workerId}</p>
      </div>
      <Button onClick={handleSubmit}>Confirm Booking</Button>
    </div>
  );
}
