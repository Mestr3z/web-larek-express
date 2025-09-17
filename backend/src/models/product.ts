import mongoose, { Schema, Document } from "mongoose";

export interface IImage {
  fileName: string;
  originalName: string;
}

export interface IProduct extends Document {
  title: string;
  image: IImage;
  category: string;
  description?: string;
  price: number | null;
}

const imageSchema = new Schema<IImage>(
  {
    fileName: { type: String, required: true },
    originalName: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      unique: true,
      required: [true, 'Поле "title" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "title" - 2'],
      maxlength: [30, 'Максимальная длина поля "title" - 30'],
      trim: true,
    },
    image: { type: imageSchema, required: true },
    category: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, default: null },
  },
  { versionKey: false }
);

export default mongoose.model<IProduct>("product", productSchema);
