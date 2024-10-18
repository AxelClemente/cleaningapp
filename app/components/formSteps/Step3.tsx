"use client";

import { Button } from "../Button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function Step3({ formData, updateFormData, nextStep, prevStep }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">Step 3: Confirmation</h2>
      <div className="mb-4">
        <Label className="flex items-center">
          <Checkbox
            checked={formData.termsAccepted || false}
            onCheckedChange={(checked) => updateFormData({ termsAccepted: checked })}
            required
          />
          <span className="ml-2">I accept the terms and conditions</span>
        </Label>
      </div>
      <div className="mb-4">
        <Label className="flex items-center">
          <Checkbox
            checked={formData.newsletterOptIn || false}
            onCheckedChange={(checked) => updateFormData({ newsletterOptIn: checked })}
          />
          <span className="ml-2">Subscribe to newsletter</span>
        </Label>
      </div>
      <div className="flex justify-between">
        <Button type="button" onClick={prevStep}>Previous</Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}