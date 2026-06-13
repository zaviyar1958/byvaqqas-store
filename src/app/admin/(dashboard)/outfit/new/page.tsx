"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { createOutfitActionJSON } from "../../../actions";
import { useRouter } from "next/navigation";

export default function NewOutfitPage() {
  const [items, setItems] = useState([{ id: Date.now() }]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const addItem = () => setItems([...items, { id: Date.now() }]);
  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const uploadFileToCloudinary = async (file: File, folder: string) => {
    const signRes = await fetch("/api/cloudinary-sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder }),
    });
    
    if (!signRes.ok) throw new Error("Failed to get upload signature");
    
    const { timestamp, signature, apiKey } = await signRes.json();
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("folder", folder);

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!uploadRes.ok) throw new Error("Failed to upload image to Cloudinary");

    const data = await uploadRes.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    setLoading(true);

    try {
      const formData = new FormData(formRef.current);
      
      const coverImageFile = formData.get("coverImage") as File;
      if (!coverImageFile || coverImageFile.size === 0) throw new Error("Cover image missing");
      const coverImageUrl = await uploadFileToCloudinary(coverImageFile, "byvaqqas/covers");

      const uploadedItems = [];
      for (let i = 0; i < items.length; i++) {
        const itemImageFile = formData.get(`items[${i}][image]`) as File;
        const itemUrl = formData.get(`items[${i}][url]`) as string;
        
        if (itemImageFile && itemImageFile.size > 0 && itemUrl) {
          const uploadedImageUrl = await uploadFileToCloudinary(itemImageFile, "byvaqqas/items");
          uploadedItems.push({
            image: uploadedImageUrl,
            url: itemUrl
          });
        }
      }

      await createOutfitActionJSON({
        coverImage: coverImageUrl,
        items: uploadedItems
      });

      router.push("/admin");
    } catch (error) {
      console.error(error);
      alert("An error occurred while uploading. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-light tracking-widest uppercase mb-8">Add New Outfit</h2>
      
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
        <div className="bubble-card p-6">
          <h3 className="text-lg font-medium mb-4">General</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Cover Image (Required)</label>
              <input type="file" name="coverImage" accept="image/*" required className="w-full" disabled={loading} />
            </div>
          </div>
        </div>

        <div className="bubble-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Items</h3>
            <button type="button" onClick={addItem} disabled={loading} className="px-4 py-2 bg-foreground/10 hover:bg-foreground/20 transition-colors rounded-sm text-sm flex items-center font-medium">
              <Plus className="w-4 h-4 mr-1" /> Add Item
            </button>
          </div>
          
          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={item.id} className="p-4 border border-color-beige-400 dark:border-dark-100 rounded-sm relative">
                <button type="button" onClick={() => removeItem(item.id)} disabled={loading} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
                <h4 className="text-sm font-medium mb-3">Item {index + 1}</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Item Image</label>
                    <input type="file" name={`items[${index}][image]`} accept="image/*" required className="w-full text-sm" disabled={loading} />
                  </div>
                  <div>
                    <label className="block text-xs text-foreground font-medium mb-1">Paste Item Link Here</label>
                    <input type="url" name={`items[${index}][url]`} placeholder="Paste link..." required disabled={loading} className="w-full px-4 py-3 bg-white dark:bg-black border border-foreground/30 focus:border-foreground rounded-sm text-sm focus:outline-none shadow-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-4 bg-foreground text-background uppercase tracking-widest text-sm hover:bg-foreground/90 transition-colors rounded-sm flex justify-center items-center">
          {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Uploading directly to Cloudinary...</> : "Save Outfit"}
        </button>
      </form>
    </div>
  );
}
