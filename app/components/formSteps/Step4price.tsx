"use client";

import { useState, useEffect } from 'react';
import { Button } from "../Button"
import { Input } from "@/components/ui/input"
import { FormData } from '../../types/formData';

interface Step4PriceProps {
  formData: FormData;
  updateFormData: (newData: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  workerHourlyRate?: number;
}

export function Step4Price({ formData, updateFormData, nextStep, prevStep, workerHourlyRate }: Step4PriceProps) {
  const [hourlyRate, setHourlyRate] = useState(workerHourlyRate || formData.workerHourlyRate);

  useEffect(() => {
    const calculatedPrice = formData.hours * hourlyRate;
    updateFormData({ totalPrice: calculatedPrice });
  }, [formData.hours, hourlyRate, updateFormData]);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hours = parseInt(e.target.value, 10) || 0;
    updateFormData({ hours });
  };

  const handleHourlyRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(e.target.value) || 0;
    setHourlyRate(rate);
    updateFormData({ workerHourlyRate: rate });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Select Service Hours</h2>
      <div className="space-y-2">
        <div>
          <label htmlFor="hourlyRate">Hourly Rate:</label>
          <input
            type="number"
            id="hourlyRate"
            value={hourlyRate}
            onChange={handleHourlyRateChange}
            className="border rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="hours">Hours:</label>
          <input
            type="number"
            id="hours"
            value={formData.hours}
            onChange={handleHoursChange}
            className="border rounded p-2"
          />
        </div>
        <div className="flex items-center space-x-2">
          <p>Total Price: €{formData.totalPrice}</p>
        </div>
      </div>
      <div className="flex justify-between">
        <Button onClick={prevStep}>Back</Button>
        <Button onClick={nextStep}>Next</Button>
      </div>
    </div>
  );
}
