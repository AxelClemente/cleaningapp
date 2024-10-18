"use client";

import { Button } from "../Button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from "@/components/ui/select"

interface Step1Props {
  formData: {
    serviceType?: string;
    date?: string;
  };
  updateFormData: (data: Partial<Step1Props['formData']>) => void;
  nextStep: () => void;
}

export function Step1({ formData, updateFormData, nextStep }: Step1Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">Step 1: Service Details</h2>
      <div className="mb-4">
        <Label htmlFor="serviceType">Service Type</Label>
        <Select
          value={formData.serviceType || ''}
          onValueChange={(value) => updateFormData({ serviceType: value })}
          required
        >
          <SelectTrigger id="serviceType">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cleaning">Cleaning</SelectItem>
            <SelectItem value="gardening">Gardening</SelectItem>
            <SelectItem value="plumbing">Plumbing</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <Label htmlFor="date">Preferred Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date || ''}
          onChange={(e) => updateFormData({ date: e.target.value })}
          required
        />
      </div>
      <Button type="submit">Next</Button>
    </form>
  );
}
