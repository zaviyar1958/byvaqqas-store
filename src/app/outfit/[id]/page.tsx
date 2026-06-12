import connectToDatabase from '@/lib/mongodb';
import { Outfit } from '@/models/Outfit';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = "force-dynamic";

export default async function OutfitPage({ params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();

  const { id } = await params;
  const outfit = await Outfit.findById(id).lean();

  if (!outfit) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium hover:text-gray-500 transition-colors uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to feed
        </Link>
      </div>


      {outfit.items && outfit.items.length > 0 && (
        <div>
          <h2 className="text-xl font-light uppercase tracking-widest mb-8 text-center">Shop the Look</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {outfit.items.map((item: any, index: number) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
                aria-label="View product details"
              >
                <div className="bubble-card overflow-hidden aspect-[3/4] relative">
                  <img
                    src={item.image}
                    alt={`Outfit item ${index + 1}`}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
