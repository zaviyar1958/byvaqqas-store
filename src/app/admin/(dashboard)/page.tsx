import connectToDatabase from '@/lib/mongodb';
import { Outfit } from '@/models/Outfit';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { deleteOutfitAction } from '../actions';

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await connectToDatabase();
  const outfits = await Outfit.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div>
      {outfits.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-light tracking-widest">
          No outfits found. Add one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {outfits.map((outfit: any) => (
            <div key={outfit._id.toString()} className="bubble-card overflow-hidden group">
              <div className="aspect-[3/4] relative">
                <img 
                  src={outfit.coverImage} 
                  alt={outfit.title || "Cover"} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  {/* Edit functionality omitted for brevity, but easily added */}
                  <form action={deleteOutfitAction}>
                    <input type="hidden" name="id" value={outfit._id.toString()} />
                    <button type="submit" className="p-3 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-colors" title="Delete Outfit">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>
              <div className="p-4 text-center">
                <p className="text-sm font-medium">{outfit.items?.length || 0} Items</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
