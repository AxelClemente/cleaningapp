"use client";

import { Button } from "../Button";
import { Calendar } from "../Calendar";
import { useState } from "react";
import { FormData } from '../../types/formData'


interface Step3CalendarProps {
  formData: FormData;
  updateFormData: (newData: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export function Step3Calendar({ formData, updateFormData, nextStep, prevStep }: Step3CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(formData.selectedDate);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    updateFormData({ selectedDate: date });
    // Elimina la llamada a nextStep() aquí
  };

  const handleNext = () => {
    if (selectedDate) {
      nextStep();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Select a Date</h2>
      <div className="flex justify-center">
        <Calendar onSelectDate={handleDateSelect} />
      </div>
      {selectedDate && (
        <p className="text-center mt-4">
          Selected date: {selectedDate.toLocaleDateString()}
        </p>
      )}
      <div className="flex justify-between mt-4">
        <Button onClick={prevStep}>Anterior</Button>
        <Button onClick={handleNext} disabled={!selectedDate}>Siguiente</Button>
      </div>
    </div>
  );
}
