export interface WorkerProfile {
    id?: string;
    phoneNumber: string;
    location: string;
    bankName: string;
    accountHolder: string;
    accountNumber: string;
    profilePicture?: string;
    description: string; // New field
    hourlyRate: number; // New field
    name?: string;
    email?: string;
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
