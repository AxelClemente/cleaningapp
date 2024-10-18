"use client";


import { useState } from 'react';
import { Step1 } from '../components/formSteps/Step1';
import { Step2 } from '../components/formSteps/Step2';
import { Step3 } from '../components/formSteps/Step3';
import { Summary } from '../components/formSteps/Summary';

interface FormData {
    serviceType: string;
    date: string;
    address: string;
    termsAccepted: boolean;
    newsletterOptIn: boolean;
    [key: string]: any; // Keep this for flexibility
  }

const initialFormData: FormData = {
  serviceType: '',
  date: '',
  address: '',
  termsAccepted: false,
  newsletterOptIn: false,
};

export function DynamicForm({ workerId }: { workerId: string }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 formData={formData} updateFormData={updateFormData} nextStep={nextStep} />;
      case 2:
        return <Step2 formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <Step3 formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 4:
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
