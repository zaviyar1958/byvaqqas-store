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

export async function createOutfitActionJSON(payload: {
  coverImage: string;
  items: { image: string; url: string }[];
}) {
  await connectToDatabase();
  
  await Outfit.create({
    coverImage: payload.coverImage,
    items: payload.items,
  });

  revalidatePath("/");
  revalidatePath("/admin");
}
