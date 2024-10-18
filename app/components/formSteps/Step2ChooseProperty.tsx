"use client";

import { Button } from "../Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FormData {
  selectedProperty?: string;
  // ... other form fields ...
}

interface Step2ChoosePropertyProps {
  selectedProperty?: string;
  updateFormData: (newData: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export function Step2ChooseProperty({ selectedProperty, updateFormData, nextStep, prevStep }: Step2ChoosePropertyProps) {
  // Aquí deberías obtener la lista de propiedades del usuario, por ejemplo:
  const userProperties = [
    { id: '1', name: 'Property 1' },
    { id: '2', name: 'Property 2' },
    { id: '3', name: 'Property 3' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProperty) {
      nextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Choose Your Property</h2>
      <div>
        <Label htmlFor="propertySelect">Select a property</Label>
        <Select
          value={selectedProperty}
          onValueChange={(value) => updateFormData({ selectedProperty: value })}
        >
          <SelectTrigger id="propertySelect">
            <SelectValue placeholder="Select a property" />
          </SelectTrigger>
          <SelectContent>
            {userProperties.map((property) => (
              <SelectItem key={property.id} value={property.id}>
                {property.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-between">
        <Button type="button" onClick={prevStep}>Previous</Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
