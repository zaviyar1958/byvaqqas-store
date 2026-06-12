import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IItem {
  image: string;
  url: string;
}

export interface IOutfit extends Document {
  title?: string;
  coverImage: string;
  items: IItem[];
  createdAt: Date;
}

const ItemSchema: Schema = new Schema({
  image: { type: String, required: true },
  url: { type: String, required: true },
});

const OutfitSchema: Schema = new Schema({
  title: { type: String },
  coverImage: { type: String, required: true },
  items: { type: [ItemSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

// Check if the model exists before creating a new one
export const Outfit: Model<IOutfit> = mongoose.models.Outfit || mongoose.model<IOutfit>('Outfit', OutfitSchema);
