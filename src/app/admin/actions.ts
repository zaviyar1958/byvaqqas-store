"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import { Outfit } from "@/models/Outfit";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function deleteOutfitAction(formData: FormData) {
  const id = formData.get("id");
  if (!id) return;

  await connectToDatabase();
  await Outfit.findByIdAndDelete(id);
  
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createOutfitAction(formData: FormData) {
  await connectToDatabase();
  
  const coverImageFile = formData.get("coverImage") as File;
  
  if (!coverImageFile || coverImageFile.size === 0) {
    throw new Error("Cover image is required");
  }

  // Upload cover image
  const coverBuffer = Buffer.from(await coverImageFile.arrayBuffer());
  const coverUploadResult = await uploadToCloudinary(coverBuffer, "byvaqqas/covers");
  const coverImageUrl = coverUploadResult.secure_url;

  // Process items (dynamic fields)
  const items = [];
  let index = 0;
  
  while (true) {
    const itemImageFile = formData.get(`items[${index}][image]`) as File;
    const itemUrl = formData.get(`items[${index}][url]`) as string;
    
    if (!itemImageFile || itemImageFile.size === 0 || !itemUrl) {
      break; // No more items
    }
    
    const itemBuffer = Buffer.from(await itemImageFile.arrayBuffer());
    const itemUploadResult = await uploadToCloudinary(itemBuffer, "byvaqqas/items");
    
    items.push({
      image: itemUploadResult.secure_url,
      url: itemUrl,
    });
    
    index++;
  }

  // Save to DB
  await Outfit.create({
    coverImage: coverImageUrl,
    items,
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}
