import React from 'react';
import { CldUploadWidget } from "next-cloudinary";
import { Cloud } from 'lucide-react';

interface ActionButtonCloudinaryProps {
  uploadPreset: string;
  onUpload: (error: any, result: any, widget: any) => void;
  text: string;
}

export const ActionButtonCloudinary: React.FC<ActionButtonCloudinaryProps> = ({
  uploadPreset,
  onUpload,
  text
}) => {
  return (
    <CldUploadWidget 
      uploadPreset={uploadPreset}
      onUpload={onUpload}
    >
      {({ open }) => {
        function handleOnClick(e: React.MouseEvent<HTMLButtonElement>) {
          e.preventDefault()
          open()
        }
        return (
          <button 
            className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-colors"
            onClick={handleOnClick}
          >
            <Cloud className="w-5 h-5 mr-2" />
            {text}
          </button>
        )
      }}
    </CldUploadWidget>
  );
};
