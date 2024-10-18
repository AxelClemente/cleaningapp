export interface FormData {
  serviceType: string;
  propertyOption: string;
  selectedProperty?: any; // Consider replacing 'any' with a more specific type
  selectedDate?: Date;
  hours: number;
  workerHourlyRate: number;
  totalPrice: number;
  termsAccepted: boolean;
  newsletterOptIn: boolean;
  // Add these new properties
  propertyName?: string;
  propertyType?: string;
  location?: string;
  imageUrl?: string;
  entryMethod?: string;
  lockboxPass?: string;
  comment?: string;
}
