"use client";


import { useState } from 'react';
import { Step1Property } from '../components/formSteps/Step1Property';
import { Step2CreateProperty } from '../components/formSteps/Step2CreateProperty';
import { Step2ChooseProperty } from '../components/formSteps/Step2ChooseProperty';
import { Step3 } from '../components/formSteps/Step3';
import { Summary } from '../components/formSteps/Summary';

interface FormData {
    serviceType: string;
    date: string;
    address: string;
    termsAccepted: boolean;
    newsletterOptIn: boolean;
    propertyOption?: string;
    propertyName?: string;
    propertyAddress?: string;
    selectedProperty?: string;
    [key: string]: any;
}

const initialFormData: FormData = {
  serviceType: '',
  date: '',
  address: '',
  termsAccepted: false,
  newsletterOptIn: false,
  propertyOption: '',
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
        return <Step1Property formData={formData} updateFormData={updateFormData} nextStep={nextStep} />;
      case 2:
        if (formData.propertyOption === 'create') {
          return <Step2CreateProperty formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
        } else if (formData.propertyOption === 'choose') {
          return <Step2ChooseProperty 
            selectedProperty={formData.selectedProperty}
            updateFormData={updateFormData} 
            nextStep={nextStep} 
            prevStep={prevStep} 
          />;
        }
        return null;
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
