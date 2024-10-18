"use client";

import { Button } from "../Button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { HouseIcon, CopyIcon } from "lucide-react"; // Asegúrate de tener lucide-react instalado

interface Step1PropertyProps {
  formData: {
    propertyOption?: string;
  };
  updateFormData: (data: Partial<Step1PropertyProps['formData']>) => void;
  nextStep: () => void;
}

export function Step1Property({ formData, updateFormData, nextStep }: Step1PropertyProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.propertyOption) {
      nextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Property</h2>
      <RadioGroup
        value={formData.propertyOption}
        onValueChange={(value) => updateFormData({ propertyOption: value })}
        className="space-y-2"
      >
        <div className="flex items-center space-x-2 border p-4 rounded-md">
          <RadioGroupItem value="create" id="create" />
          <Label htmlFor="create" className="flex items-center cursor-pointer w-full">
            <HouseIcon className="mr-2 h-4 w-4" />
            <span>Create new property</span>
          </Label>
          
        </div>
        <div className="flex items-center space-x-2 border p-4 rounded-md">
          <RadioGroupItem value="choose" id="choose" />
          <Label htmlFor="choose" className="flex items-center cursor-pointer w-full">
            <CopyIcon className="mr-2 h-4 w-4" />
            <span>Choose your properties</span>
          </Label>
          
        </div>
      </RadioGroup>
      <Button type="submit" className="w-full mt-4">Next</Button>
    </form>
  );
}
