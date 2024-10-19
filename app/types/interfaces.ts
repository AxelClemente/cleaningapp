export interface WorkerProfile {
    _id: string;  // Asegúrate de que este campo esté presente
    id: string;
    userId: string; // Añadimos el campo userId
    name: string;
    description?: string;
    hourlyRate?: number;
    profilePicture?: string;
    image?: string; // Ensure this is present
    rating?: number;
    reviewCount?: number;
    location?: string;
    email?: string;
    phoneNumber?: string;
    bankName?: string;
    accountHolder?: string;
    accountNumber?: string;
}

interface ActionButtonCloudinaryProps {
    onUpload: (result: any) => void;
    text: string;
    uploadPreset: string;
}

export interface Order {
    id: string
    workerId?: string
    // Add other relevant fields
}

interface FormData {
    serviceType: string;
    date: string;
    address: string;
    termsAccepted: boolean;
    newsletterOptIn: boolean;
    [key: string]: any; // Keep this for flexibility
}
  
