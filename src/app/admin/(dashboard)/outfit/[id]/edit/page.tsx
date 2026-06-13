import connectToDatabase from '@/lib/mongodb';
import { Outfit } from '@/models/Outfit';
import { notFound } from 'next/navigation';
import EditOutfitForm from '@/components/EditOutfitForm';

export const dynamic = "force-dynamic";

export default async function EditOutfitPage({ params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();

  const resolvedParams = await params;
  const outfit = await Outfit.findById(resolvedParams.id).lean();

  if (!outfit) {
    notFound();
  }

  // Serialize the ObjectId and ensure items are properly formatted
  const serializedOutfit = {
    _id: outfit._id.toString(),
    coverImage: outfit.coverImage,
    items: outfit.items.map((item: any) => ({
      image: item.image,
      url: item.url,
    })),
  };

  return <EditOutfitForm initialOutfit={serializedOutfit} />;
}
