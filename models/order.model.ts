import mongoose from "mongoose";
import Product from "./product.model";

export interface IOrder {
  name: string;
  email: string;
  phone: number;
  country: string;
  state: string;
  city: string;
  pinCode: number;
  landMark: string;
  orderNote?: string;
  products: Array<{
    productId: mongoose.Schema.Types.ObjectId;
    variantId: mongoose.Schema.Types.ObjectId;
    name: string;
    slug: string;
    sellingPrice: number;
    mrp: number;
    discount: number;
    picture: string;
    size: string;
    color: string;
    qty: number;
  }>;
  discount: number;
  subTotal: number;
  couponDiscount: number;
  total: number;
  status:
    | "Pending"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Cancelled"
    | "Unverified";
  order_id: string;
  payment_id: string;
  deletedAt?: Date | null;
}

const orderSchema = new mongoose.Schema<IOrder>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  landMark: {
    type: String,
    required: true,
    trim: true,
  },
  orderNote: {
    type: String,
    trim: true,
  },
  order_id: {
    type: String,
    required: true,
    trim: true,
  },
  payment_id: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Unverified",
    ],
    required: true,
    default: "Pending",
  },
  phone: {
    type: Number,
    required: true,
  },
  pinCode: {
    type: Number,
    required: true,
  },
  subTotal: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  couponDiscount: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  deletedAt: {
    type: Date,
    default: null,
    index: 1,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Product,
        required: true,
      },
      variantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Product,
        required: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      slug: { type: String, required: true, trim: true },
      sellingPrice: {
        type: Number,
        required: true,
      },
      mrp: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        required: true,
      },
      picture: { type: String, required: true, trim: true },
      size: { type: String, required: true, trim: true },
      color: { type: String, required: true, trim: true },
      qty: {
        type: Number,
        required: true,
      },
    },
  ],
},{timestamps:true});


const Order=mongoose.models.Order || mongoose.model("Order",orderSchema)

export default Order