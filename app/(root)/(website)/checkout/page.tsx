"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { FaShippingFast } from "react-icons/fa";
import WebsiteBreadCrumb from "@/components/Application/Website/WebsiteBreadCrumb";
import {
  WEBSITE_CHECKOUT,
  WEBSITE_PRODUCT_DETAILS,
} from "@/routes/WebsiteRoutes";
import { useDispatch, useSelector } from "react-redux";
import useFetch from "@/hooks/useFetch";
import image_placeholder from "@/public/assets/images/img-placeholder.webp";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toastFunction from "@/lib/toastFunction";
import LoadingBtn from "@/components/Application/LoadingBtn";
import { clearCart } from "@/slices/cart";
import { useRouter } from "next/navigation";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
const breadCrumbData = {
  title: "Checkout",
  data: [
    {
      title: "Checkout",
      url: WEBSITE_CHECKOUT,
    },
  ],
};
const page = () => {
  const { data: Session } = useSession();
  const cart = useSelector((state: any) => state.cart);
  const [cartData, setCartData] = useState<Array<Record<string, any>>>([]);
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const route = useRouter();
  const { Razorpay } = useRazorpay();

  const dispatch = useDispatch();
  const { file } = useFetch({
    url: "/api/checkout/verify-cart",
    method: "POST",
    options: { data: cart.products },
  });

  useEffect(() => {
    if (file && file.success) setCartData(file.data);
  }, [file]);

  useEffect(() => {
    if (cartData.length > 0) {
      const totalPrice = cartData.reduce(
        (acc: number, product: Record<string, any>) =>
          acc + product.sellingPrice,
        0
      );
      setSubTotal(totalPrice);
      setTotal(totalPrice);
      couponForm.setValue("minShopingAmount", totalPrice);

      const totalDiscount = cartData.reduce(
        (acc: number, product: Record<string, any>) =>
          acc + (product.mrp - product.sellingPrice),
        0
      );

      setDiscount(totalDiscount);
    } else {
      setSubTotal(0);
      setDiscount(0);
      setTotal(0);
      couponForm.setValue("minShopingAmount", 0);
    }
  }, [cartData]);

  const shippingFormSchema = zSchema.pick({
    name: true,
    email: true,
    phone: true,
    country: true,
    state: true,
    city: true,
    pinCode: true,
    landMark: true,
    orderNote: true,
  });

  const couponSchema = zSchema.pick({
    code: true,
    minShopingAmount: true,
  });

  const couponForm = useForm<z.infer<typeof couponSchema>>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      minShopingAmount: "",
    },
  });

  const shippingForm = useForm<z.infer<typeof shippingFormSchema>>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      state: "",
      city: "",
      pinCode: "",
      landMark: "",
      orderNote: "",
    },
  });

  useEffect(() => {
    if (Session?.user)
      shippingForm.setValue("email", Session?.user.email || "");
    shippingForm.setValue("name", Session?.user.name || "");
  }, [Session]);

  async function shippingSubmit(values: z.infer<typeof shippingFormSchema>) {
    try {
      setLoading(true);
      const { data: orderResponse } = await axios.post(
        "/api/checkout/create-orderId",
        total
      );

      if (!orderResponse.success) throw new Error(orderResponse.message);

      const options: RazorpayOrderOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderResponse.data.amount,
        currency: "INR",
        name: "E commers",
        description: "Test Transaction",
        order_id: orderResponse.data.id,
        handler: async function (response: Record<string, any>) {
          try {
            const { data: verificationResponse } = await axios.post(
              "/api/checkout/verify-payment",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (!verificationResponse.success)
              throw new Error(verificationResponse.message);

            console.log("this is ",verificationResponse)

            const { data: generateOrder } = await axios.post(
              "/api/order/create",
              {
                ...values,
                products: cartData,
                subTotal,
                discount,
                couponDiscount,
                total,
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
              }
            );

            if (!generateOrder.success) throw new Error(generateOrder.message);

            shippingForm.reset();

            dispatch(clearCart());

            route.push(`/order-details/${generateOrder.data}`);
          } catch (error: any) {
            toastFunction({ type: "error", message: error.message });
          }
        },
        prefill: {
          name: shippingForm.getValues("name"),
          email: shippingForm.getValues("email"),
          contact: shippingForm.getValues("phone").toString(),
        },
        theme: {
          color: "#8e51ff",
        },
      };

      const razorpayInstance = new Razorpay(options);

      razorpayInstance.on("payment.failed", function (response) {
        toastFunction({ type: "error", message: response.error.reason });
      });
      
      razorpayInstance.open()

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  console.log(shippingForm.formState.errors);
  async function CouponSubmit(values: z.infer<typeof couponSchema>) {
    setCouponLoading(true)
    try {
      const { data: response } = await axios.post(
        "/api/checkout/verify-coupon",
        values
      );

      if (!response.success) throw new Error(response.message);

      const discountAmount = (subTotal * response.data.discount) / 100;

      setTotal(subTotal - discountAmount);

      setCouponDiscount(discountAmount);

      setIsCouponApplied(true);

      toastFunction({ type: "success", message: response.message });
    } catch (error: any) {
      toastFunction({ type: "error", message: error.message });
    }finally{
    setCouponLoading(false)
  }
  }

  console.log("redander")

  return (
    <div>
      <section>
        <WebsiteBreadCrumb {...breadCrumbData} />
      </section>

      <div className=" py-10 lg:px-32 md:px-24 px:4  w-full justify-between flex flex-col lg:flex-row gap-8 lg:gap-0 items-start ">
        {/* shipping section */}
        <section className=" mx-auto w-[80%] lg:w-[60%] flex flex-col gap-4">
          <h1 className=" flex items-center text-lg gap-2 font-semibold">
            <FaShippingFast size={30} /> Shipping Address:
          </h1>
          <Form {...shippingForm}>
            <form
              onSubmit={shippingForm.handleSubmit(shippingSubmit)}
              className="w-full grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              <div className=" w-full">
                <FormField
                  control={shippingForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=" w-full">
                <FormField
                  control={shippingForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=" w-full">
                <FormField
                  control={shippingForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={shippingForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=" w-full">
                <FormField
                  control={shippingForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=" w-full">
                <FormField
                  control={shippingForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=" w-full">
                <FormField
                  control={shippingForm.control}
                  name="pinCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pin Code</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Pin Code"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=" w-full">
                <FormField
                  control={shippingForm.control}
                  name="landMark"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Land Mark</FormLabel>
                      <FormControl>
                        <Input placeholder="Land Mark" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=" w-full col-span-2">
                <FormField
                  control={shippingForm.control}
                  name="orderNote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter Order note</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter Order note" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <LoadingBtn
                type="submit"
                disable={loading}
                text="Place Order"
                className=" w-fit bg-foreground text-white dark:text-black rounded-2xl py-1 px-10 mt-4 transition-all duration-200 hover:cursor-pointer "
              />
            </form>
          </Form>
        </section>

        {/* order section */}
        <section className=" mx-auto w-[80%] lg:w-[35%] bg-muted p-4">
          <div className=" text-lg mb-4 font-semibold">Order Summary</div>
          <div className=" flex flex-col items-center gap-4 p-2 border-[1px] border-border rounded-sm">
            {cartData.length > 0 &&
              cartData.map((product, index) => (
                <div
                  key={index}
                  className=" w-full flex items-center justify-between"
                >
                  <Image
                    src={product?.picture || image_placeholder}
                    alt="Img"
                    width={50}
                    height={50}
                  />
                  <div className=" min-w-[150px]">
                    <Link
                      href={WEBSITE_PRODUCT_DETAILS(product?.slug)}
                      className=" font-semibold"
                    >
                      {product.name.slice(0, 18)}
                      {product.name.length > 12 ? "..." : ""}
                    </Link>
                    <div>
                      <span>Color</span> : <span>{product?.color}</span>
                    </div>
                    <div>
                      <span>Size</span> : <span>{product?.size}</span>
                    </div>
                  </div>
                  <div>
                    <span>{product.qty}</span> X
                    <span>
                      {product?.sellingPrice.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </span>
                  </div>
                </div>
              ))}
          </div>
          <table className=" border-separate border-spacing-y-4">
            <tbody>
              <tr>
                <td className=" font-semibold">Subtotal</td>
                <td className=" w-full text-end">
                  {" "}
                  {subTotal.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </td>
              </tr>
              <tr>
                <td className=" font-semibold">Discount</td>
                <td className=" w-full text-end">
                  {"-"}
                  {discount.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </td>
              </tr>
              <tr>
                <td className="w-full font-semibold">Coupon Discount</td>
                <td className=" w-full text-end">
                  {"-"}
                  {couponDiscount.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </td>
              </tr>
              <tr>
                <td className=" font-semibold text-lg">Total</td>
                <td className=" w-full text-end">
                  {total.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </td>
              </tr>
            </tbody>
          </table>
          {!isCouponApplied ? (
            <Form {...couponForm}>
              <form
                onSubmit={couponForm.handleSubmit(CouponSubmit)}
                className="w-full flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-0 justify-between"
              >
                <FormField
                  control={couponForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input autoComplete="off" placeholder="Coupon Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <LoadingBtn
                  type="submit"
                  text="Add Coupon"
                  disable={couponLoading}
                />
              </form>
            </Form>
          ) : (
            <div className=" w-full p-2 flex bg-border rounded-sm items-center justify-between">
              <div>
                <p className=" text-xs text-muted-foreground">Coupon : </p>
                <h4 className=" font-semibold">
                  {couponForm.getValues("code")}
                </h4>
              </div>
              <Button
                variant="destructive"
                onClick={() => {
                  setCouponDiscount(0),
                    setTotal(subTotal),
                    setIsCouponApplied(false);
                }}
              >
                Remove
              </Button>
            </div>
          )}
        </section>
      </div>
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </div>
  );
};

export default page;
