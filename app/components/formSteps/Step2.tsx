"use client";

import { Button } from "../Button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "../Textarea"

interface Step2Props {
  formData: {
    address?: string;
    instructions?: string;
  };
  updateFormData: (data: Partial<Step2Props['formData']>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export function Step2({ formData, updateFormData, nextStep, prevStep }: Step2Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">Step 2: Location Details</h2>
      <div className="mb-4">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address || ''}
          onChange={(e) => updateFormData({ address: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="instructions">Special Instructions</Label>
        <Textarea
          id="instructions"
          value={formData.instructions || ''}
          onChange={(e) => updateFormData({ instructions: e.target.value })}
        />
      </div>
      <div className="flex justify-between">
        <Button type="button" onClick={prevStep}>Previous</Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
