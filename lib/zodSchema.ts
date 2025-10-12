import * as z from "zod";

export const zSchema = z.object({
  email: z.email({ message: "Invaild email address" }),
  password: z.string().min(8, "Password must be greater the 8 characters"),
  name: z.string().min(3, "Name must greater then three characters"),
  otp: z
    .string()
    .regex(/^\d{6}$/, { message: "OTP must be exactly 6 digits." }),
  _id: z.string(),
  alt: z.string().min(3, "alt is required"),
  title: z.string().min(3, "alt is required"),
  slug: z.string().min(3, "slug is required"),
  mrp: z.union([
    z.number(),
    z.string().regex(/^\d+$/, "Must be a number string"),
  ]),
  sellingPrice: z.union([
    z.number(),
    z.string().regex(/^\d+$/, "Must be a number string"),
  ]),
  discount: z.union([
    z.number(),
    z.string().regex(/^\d+$/, "Must be a number string"),
  ]),
  media: z.array(z.string()),
  category: z.string().min(3, "Category is required"),
  description: z.string().min(3, "Description is required"),
  product: z.string().min(3, "Product is required"),
  sku: z.string().min(1, "SKU is required"),
  color: z.string().min(3, "Color is required"),
  size: z.string().min(1, "Size is required"),
  code: z.string().min(3, "coupon is required"),
  minShopingAmount: z.union([
    z.number(),
    z.string().regex(/^\d+$/, "Must be a number string"),
  ]),
  validity: z.date(),
  review: z.string().min(3, "review is required"),
  rating: z.union([
    z.string().regex(/^\d+$/, "Must be a number string"),
    z.number(),
  ]),
  user: z.string().min(3, "User is required"),
  phone: z.union([
    z.number(),
    z.string().regex(/^\d+$/, "Must be a number string"),
  ]),
  country: z.string().min(2, "Country is Required"),
  state: z.string().min(2, "state is Required"),
  city: z.string().min(2, "city is Required"),
  pinCode: z.string().min(5, "pin code is Required"),
  landMark: z.string().min(2, "land mark is Required"),
  orderNote: z.string().optional(),
  address: z.string().min(3, "address is required"),
});
