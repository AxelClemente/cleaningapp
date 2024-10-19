"use client";

import { Button } from "../Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Property } from "@prisma/client";

interface SelectedProperty {
  id: string;
  propertyType: string;
  location: string;
  entryMethod: string;
  lockboxPass: string;
  comment: string;
  imageUrl: string;
}

interface FormData {
  selectedProperty: SelectedProperty | undefined;
  // ... other form fields ...
}

interface Step2ChoosePropertyProps {
  formData: FormData;
  updateFormData: (newData: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export function Step2ChooseProperty({ formData, updateFormData, nextStep, prevStep }: Step2ChoosePropertyProps) {
  const [userProperties, setUserProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/property');
        if (response.ok) {
          const properties = await response.json();
          setUserProperties(properties);
        } else {
          console.error('Failed to fetch properties');
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.selectedProperty) {
      nextStep();
    }
  };

  const handlePropertySelect = (property: Property) => {
    updateFormData({
      selectedProperty: {
        id: property.id,
        propertyType: property.propertyType,
        location: property.location,
        entryMethod: property.entryMethod,
        lockboxPass: property.lockboxPass,
        comment: property.comment,
        imageUrl: property.imageUrl
      }
    });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Choose Your Property</h2>
      <div>
        <Label htmlFor="propertySelect">Select a property</Label>
        <Select
          value={formData.selectedProperty?.id}
          onValueChange={(value) => {
            const selected = userProperties.find(p => p.id === value);
            if (selected) {
              handlePropertySelect(selected);
            }
          }}
          disabled={isLoading}
        >
          <SelectTrigger id="propertySelect">
            <SelectValue placeholder={isLoading ? "Loading properties..." : "Select a property"} />
          </SelectTrigger>
          <SelectContent>
            {userProperties.map((property) => (
              <SelectItem key={property.id} value={property.id}>
                {property.propertyName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-between">
        <Button type="button" onClick={prevStep}>Previous</Button>
        <Button type="submit" disabled={!formData.selectedProperty || isLoading}>Next</Button>
      </div>
    </form>
  );
}
