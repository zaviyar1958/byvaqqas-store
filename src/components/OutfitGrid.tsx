"use client";

import React from 'react';
import Masonry from 'react-masonry-css';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IOutfit } from '@/models/Outfit';

interface OutfitGridProps {
  outfits: (Omit<IOutfit, '_id' | 'createdAt'> & { _id: string })[];
}

export default function OutfitGrid({ outfits }: OutfitGridProps) {
  if (!outfits || outfits.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <h2 className="text-2xl font-light text-gray-500">There is no product.</h2>
      </div>
    );
  }

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex -ml-6 w-auto"
      columnClassName="pl-6 bg-clip-padding"
    >
      {outfits.map((outfit, index) => (
        <motion.div
          key={outfit._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="mb-6"
        >
          <Link href={`/outfit/${outfit._id}`}>
            <div className="bubble-card overflow-hidden group cursor-pointer relative block">
              <img
                src={outfit.coverImage}
                alt={outfit.title || "Outfit"}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>
          </Link>
        </motion.div>
      ))}
    </Masonry>
  );
}
