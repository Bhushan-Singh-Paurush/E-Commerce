import mongoose from "mongoose";
import Product from "./product.model";
import Media from "./media.model";
export interface IVariant {
  product: mongoose.Schema.Types.ObjectId;
  sku: string;
  color: string;
  size: string;
  mrp: number;
  sellingPrice: number;
  discount: number;
  description: string;
  media: mongoose.Schema.Types.ObjectId[];
  deletedAt: Date;
  stock: number;
}

const variantSchema = new mongoose.Schema<IVariant>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Product,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Media,
      },
    ],
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

const Variant =
  mongoose.models.Variant || mongoose.model("Variant", variantSchema);

export default Variant;
