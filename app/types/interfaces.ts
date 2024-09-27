export interface WorkerProfile {
    id: string; // Este será el ObjectId de MongoDB, mapeado desde _id
    name: string;
    email: string;
    phone: string;
    phoneNumber?: string;
    location?: string;
    bankName?: string;
    accountHolder?: string;
    accountNumber?: string;
    profilePicture?: string;
    // ... otros campos si los hay
}