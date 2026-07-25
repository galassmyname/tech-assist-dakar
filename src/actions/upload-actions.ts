"use server";

import cloudinary from "@/lib/cloudinary";
import { auth } from "@/lib/auth";

export async function getUploadSignature() {
  const session = await auth();
  if (!session) throw new Error("Non autorise");

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "tech-assist-dakar/products";

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    timestamp,
    signature,
    folder,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  };
}

export async function deleteCloudinaryImage(publicId: string) {
  const session = await auth();
  if (!session) throw new Error("Non autorise");

  await cloudinary.uploader.destroy(publicId);
}
