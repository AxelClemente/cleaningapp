import React, { useCallback } from 'react';
import { Cloud } from 'lucide-react';

interface ActionButtonCloudinaryProps {
  onUpload: (result: any) => void;
  text: string;
}

export const ActionButtonCloudinary: React.FC<ActionButtonCloudinaryProps> = ({
  onUpload,
  text
}) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset as string);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log('Upload successful', data);
      onUpload(data);
    } catch (error) {
      console.error('Upload failed', error);
    }
  }, [onUpload, cloudName, uploadPreset]);

  return (
    <label className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-colors cursor-pointer">
      <Cloud className="w-5 h-5 mr-2" />
      {text}
      <input type="file" onChange={handleUpload} className="hidden" accept="image/*" />
    </label>
  );
};
