"use client";

import { useState, useEffect } from 'react';
import { Button } from "../Button"
import { Input } from "@/components/ui/input"
import { FormData } from '../../types/formData';

interface Step4PriceProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  workerHourlyRate: number;
}

export function Step4Price({ formData, updateFormData, nextStep, prevStep, workerHourlyRate }: Step4PriceProps) {
  const [hours, setHours] = useState(formData.hours || 3);

  useEffect(() => {
    const totalPrice = hours * (workerHourlyRate || 0);
    updateFormData({ hours, totalPrice });
  }, [hours, workerHourlyRate, updateFormData]);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = Math.max(3, parseInt(e.target.value) || 3);
    setHours(newHours);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Selecciona las horas de servicio</h2>
      <div className="flex items-center space-x-2">
        <Input
          type="number"
          min="3"
          value={hours}
          onChange={handleHoursChange}
          className="w-20"
        />
        <span>horas</span>
      </div>
      <p>Precio por hora: ${workerHourlyRate}</p>
      <p className="text-lg font-semibold">Total: ${formData.totalPrice}</p>
      <div className="flex justify-between">
        <Button onClick={prevStep}>Anterior</Button>
        <Button onClick={nextStep}>Siguiente</Button>
      </div>
    </div>
  );
}
