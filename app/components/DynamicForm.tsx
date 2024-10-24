"use client";


import { useState } from 'react';
import { Step1Property } from './formSteps/Step1Property';
import { Step2CreateProperty } from './formSteps/Step2CreateProperty';
import { Step2ChooseProperty } from './formSteps/Step2ChooseProperty';
import { Step3Calendar } from './formSteps/Step3Calendar';
import { Step4Price } from './formSteps/Step4price';
import { Summary } from './formSteps/Summary';
import { FormData } from '../types/formData'

interface DynamicFormProps {
  workerId: string;
  workerHourlyRate: number;
  userId: string;
}

const initialFormData: FormData = {
  serviceType: '',
  propertyOption: '',
  selectedProperty: undefined,
  selectedDate: undefined,
  hours: 3,
  workerHourlyRate: 0,
  totalPrice: 0,
  termsAccepted: false,
  newsletterOptIn: false,
  userId: '',
};

export function DynamicForm({ workerId, workerHourlyRate, userId }: DynamicFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    ...initialFormData,
    workerHourlyRate: workerId ? workerHourlyRate : 0, // Inicializar con el valor recibido o 0 si es una solicitud abierta
    userId,
  });

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1Property formData={formData} updateFormData={updateFormData} nextStep={nextStep} />;
      case 2:
        if (formData.propertyOption === 'create') {
          return <Step2CreateProperty formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
        } else if (formData.propertyOption === 'choose') {
          return <Step2ChooseProperty formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
        }
        return null;
      case 3:
        return <Step3Calendar formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return (
          <Step4Price 
            formData={formData} 
            updateFormData={updateFormData} 
            nextStep={nextStep} 
            prevStep={prevStep}
            workerHourlyRate={workerId ? workerHourlyRate : undefined} // Pasar undefined si es una solicitud abierta
          />
        );
      case 5:
        console.log("FormData being passed to Summary:", formData);
        return <Summary formData={formData} workerId={workerId} />;
      default:
        return <div>Form completed</div>;
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      {renderStep()}
    </div>
  );
}
