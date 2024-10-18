"use client";

import { Button } from "../Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Location } from "@/components/Location";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ActionButtonCloudinary } from "@/components/ActionButtonCloudinary";
import { Textarea } from "../Textarea";
import { useRouter } from 'next/navigation';

interface Step2CreatePropertyProps {
  formData: {
    propertyName?: string;
    propertyType?: string;
    location?: string;
    imageUrl?: string;
    entryMethod?: string;
    lockboxPass?: string;
    comment?: string;
  };
  updateFormData: (data: Partial<Step2CreatePropertyProps['formData']>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export function Step2CreateProperty({ formData, updateFormData, prevStep }: Step2CreatePropertyProps) {
  const router = useRouter();
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.propertyName && formData.propertyType && formData.location && formData.entryMethod) {
      if (formData.entryMethod === "lockbox" && !formData.lockboxPass) {
        return; // Don't proceed if lockbox is selected but no pass is provided
      }
      
      try {
        const response = await fetch('/api/property', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert('Property created successfully!');
          prevStep(); // Go back to step 1
          // Eliminar la línea de redirección
        } else {
          // Handle error
          const error = await response.json();
          alert(`Error creating property: ${error.message}`);
        }
      } catch (error) {
        console.error('Error creating property:', error);
        alert('An error occurred while creating the property.');
      }
    }
  };

  const handleLocationSelect = (location: string) => {
    updateFormData({ location });
    setIsLocationDialogOpen(false);
  };

  const handleImageUpload = (result: any) => {
    if (result && result.secure_url) {
      updateFormData({ imageUrl: result.secure_url });
    }
  };

  const handleEntryMethodChange = (value: string) => {
    updateFormData({ entryMethod: value, lockboxPass: value === "lockbox" ? formData.lockboxPass : undefined });
  };

  return (
    <form onSubmit={handleCreate} className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Create New Property</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="propertyName">Property Name</Label>
          <Input
            id="propertyName"
            value={formData.propertyName || ''}
            onChange={(e) => updateFormData({ propertyName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="propertyType">Property Type</Label>
          <Select
            value={formData.propertyType}
            onValueChange={(value) => updateFormData({ propertyType: value })}
            required
          >
            <SelectTrigger id="propertyType">
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Small_house">Small House</SelectItem>
              <SelectItem value="Regular_house">Regular House</SelectItem>
              <SelectItem value="Chalet">Chalet</SelectItem>
              <SelectItem value="fFinca">Finca</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" className="w-full justify-start">
                {formData.location || "Select location"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <Location onSelectLocation={handleLocationSelect} onConfirm={handleLocationSelect} />
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <Label>Property Image</Label>
          <ActionButtonCloudinary
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''}
            onUpload={handleImageUpload}
            text="Upload property image"
          />
        </div>
        {formData.imageUrl && (
          <div className="mt-4">
            <img
              src={formData.imageUrl}
              alt="Uploaded property image"
              className="w-full h-40 object-cover rounded-md"
            />
          </div>
        )}
        <div>
          <Label htmlFor="entryMethod">Entry Method</Label>
          <Select
            value={formData.entryMethod}
            onValueChange={handleEntryMethodChange}
            required
          >
            <SelectTrigger id="entryMethod">
              <SelectValue placeholder="Select entry method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lockbox">Lockbox</SelectItem>
              <SelectItem value="In_Person">In Person</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {formData.entryMethod === "Lockbox" && (
          <div>
            <Label htmlFor="lockboxPass">Lockbox Pass</Label>
            <Input
              id="lockboxPass"
              value={formData.lockboxPass || ''}
              onChange={(e) => updateFormData({ lockboxPass: e.target.value })}
              required
            />
          </div>
        )}
        {/* New Comment field */}
        <div>
          <Label htmlFor="comment">Comment</Label>
          <Textarea
            id="comment"
            value={formData.comment || ''}
            onChange={(e) => updateFormData({ comment: e.target.value })}
            placeholder="Add any additional information or special instructions here"
            rows={4}
          />
        </div>
      </div>
      <div className="flex justify-between">
        <Button type="button" onClick={prevStep}>Previous</Button>
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
}
