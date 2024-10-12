import { v2 as cloudinary } from 'cloudinary';

export async function GET(request: Request) {
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Perform Cloudinary operations here
  // For example:
  // const result = await cloudinary.uploader.upload(/* ... */);

  return Response.json({ message: 'Cloudinary operation successful' });
}