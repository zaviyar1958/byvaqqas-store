import connectToDatabase from '@/lib/mongodb';
import { Outfit } from '@/models/Outfit';
import OutfitGrid from '@/components/OutfitGrid';

export const dynamic = "force-dynamic";

export default async function Home() {
  await connectToDatabase();
  
  // Fetch outfits and sort by newest
  const outfits = await Outfit.find({}).sort({ createdAt: -1 }).lean();
  
  // Serialize all MongoDB ObjectIds and Dates for the Client Component
  const serializedOutfits = JSON.parse(JSON.stringify(outfits));

  return (
    <div>
      <OutfitGrid outfits={serializedOutfits} />
    </div>
  );
}
