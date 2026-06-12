"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { createOutfitAction } from "../../actions";

export default function NewOutfitPage() {
  const [items, setItems] = useState([{ id: Date.now() }]);
  const [loading, setLoading] = useState(false);

  const addItem = () => setItems([...items, { id: Date.now() }]);
  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // We let the native form submission handle it, but we can show a loading state
    setLoading(true);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-light tracking-widest uppercase mb-8">Add New Outfit</h2>
      
      <form action={createOutfitAction} onSubmit={handleSubmit} className="space-y-8">
        <div className="bubble-card p-6">
          <h3 className="text-lg font-medium mb-4">General</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Cover Image (Required)</label>
              <input type="file" name="coverImage" accept="image/*" required className="w-full" />
            </div>
          </div>
        </div>

        <div className="bubble-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Items</h3>
            <button type="button" onClick={addItem} className="px-4 py-2 bg-foreground/10 hover:bg-foreground/20 transition-colors rounded-sm text-sm flex items-center font-medium">
              <Plus className="w-4 h-4 mr-1" /> Add Item
            </button>
          </div>
          
          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={item.id} className="p-4 border border-color-beige-400 dark:border-dark-100 rounded-sm relative">
                <button type="button" onClick={() => removeItem(item.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
                <h4 className="text-sm font-medium mb-3">Item {index + 1}</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Item Image</label>
                    <input type="file" name={`items[${index}][image]`} accept="image/*" required className="w-full text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-foreground font-medium mb-1">Paste Item Link Here</label>
                    <input type="url" name={`items[${index}][url]`} placeholder="Paste link..." required className="w-full px-4 py-3 bg-white dark:bg-black border border-foreground/30 focus:border-foreground rounded-sm text-sm focus:outline-none shadow-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-4 bg-foreground text-background uppercase tracking-widest text-sm hover:bg-foreground/90 transition-colors rounded-sm flex justify-center items-center">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Outfit"}
        </button>
      </form>
    </div>
  );
}
