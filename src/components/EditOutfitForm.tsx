"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { updateOutfitActionJSON } from "../app/admin/actions";
import { useRouter } from "next/navigation";

interface OutfitItem {
  image: string;
  url: string;
}

interface Outfit {
  _id: string;
  coverImage: string;
  items: OutfitItem[];
}

export default function EditOutfitForm({ initialOutfit }: { initialOutfit: Outfit }) {
  const [items, setItems] = useState(() => 
    initialOutfit.items.map((item, i) => ({ 
      id: Date.now() + i, 
      existingImage: item.image,
      url: item.url 
    }))
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const addItem = () => setItems([...items, { id: Date.now(), existingImage: "", url: "" }]);
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
      
      let coverImageUrl = initialOutfit.coverImage;
      const coverImageFile = formData.get("coverImage") as File;
      if (coverImageFile && coverImageFile.size > 0) {
        coverImageUrl = await uploadFileToCloudinary(coverImageFile, "byvaqqas/covers");
      }

      const uploadedItems = [];
      for (let i = 0; i < items.length; i++) {
        const itemImageFile = formData.get(`items[${i}][image]`) as File;
        const itemUrl = formData.get(`items[${i}][url]`) as string;
        const itemState = items[i];
        
        let finalImageUrl = itemState.existingImage;
        
        if (itemImageFile && itemImageFile.size > 0) {
          finalImageUrl = await uploadFileToCloudinary(itemImageFile, "byvaqqas/items");
        }
        
        if (finalImageUrl && itemUrl) {
          uploadedItems.push({
            image: finalImageUrl,
            url: itemUrl
          });
        }
      }

      if (uploadedItems.length === 0) {
        throw new Error("You must have at least one valid item.");
      }

      await updateOutfitActionJSON(initialOutfit._id, {
        coverImage: coverImageUrl,
        items: uploadedItems
      });

      router.push("/admin");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "An error occurred while saving. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-light tracking-widest uppercase mb-8">Edit Outfit</h2>
      
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
        <div className="bubble-card p-6">
          <h3 className="text-lg font-medium mb-4">General</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-2">Cover Image</label>
              <div className="mb-3">
                <img src={initialOutfit.coverImage} alt="Current Cover" className="w-32 h-32 object-cover rounded-sm border border-color-beige-400 dark:border-dark-100" />
              </div>
              <p className="text-xs text-gray-400 mb-2">Upload a new image to replace the current one, or leave empty to keep it.</p>
              <input type="file" name="coverImage" accept="image/*" className="w-full text-sm" disabled={loading} />
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
                  {item.existingImage && (
                    <div className="mb-2 flex items-center gap-4">
                      <img src={item.existingImage} alt="Current Item" className="w-16 h-16 object-cover rounded-sm border border-color-beige-400 dark:border-dark-100" />
                      <span className="text-xs text-gray-400">Current Image</span>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Upload New Image (Optional)</label>
                    <input type="file" name={`items[${index}][image]`} accept="image/*" className="w-full text-sm" disabled={loading} required={!item.existingImage} />
                  </div>
                  <div>
                    <label className="block text-xs text-foreground font-medium mb-1">Paste Item Link Here</label>
                    <input type="url" name={`items[${index}][url]`} defaultValue={item.url} placeholder="Paste link..." required disabled={loading} className="w-full px-4 py-3 bg-white dark:bg-black border border-foreground/30 focus:border-foreground rounded-sm text-sm focus:outline-none shadow-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-4 bg-foreground text-background uppercase tracking-widest text-sm hover:bg-foreground/90 transition-colors rounded-sm flex justify-center items-center">
          {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Saving Outfit...</> : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
