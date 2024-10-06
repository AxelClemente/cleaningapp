'use client';

import { CldUploadWidget } from 'next-cloudinary';
import {useCallback} from 'react';
import { TbPhotoPlus } from 'react-icons/tb';
import Image from 'next/image';

declare global {
  var cloudinary: any;
}

interface ImageUploadProps {
  onChange: (value: string) => void;
  value: string;
}


const ImageUpload: React.FC<ImageUploadProps> = ({
   onChange,
    value }) => {
  const handleUpload = useCallback((result: any) => {
    onChange(result.info.secure_url);
    }, [onChange]);

    return (
        <div>
            <CldUploadWidget
                onUpload={handleUpload}
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{
                    maxFiles: 1,
                    
                }}
            >
                {({open}) => {
                    return (
                        <div
                            onClick={() => open?.()}
                          >
                            <TbPhotoPlus size={50} />
                            <div>
                                Click to upload
                            </div>
                            {value && (
                                <div>
                                    <Image
                                        src={value}
                                        alt="Upload"
                                        width={100}
                                        height={100}
                                        style={{
                                            objectFit: 'cover',
                                            width: '100%',
                                            height: '100%',
                                        }}  
                                    />
                                </div>
                            )}
                        </div>
                    )
                }}
            </CldUploadWidget>
        </div>
    )
}

export default ImageUpload;
