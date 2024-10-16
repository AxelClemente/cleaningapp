export interface WorkerProfile {
    id?: string;
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
