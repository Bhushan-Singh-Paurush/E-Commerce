"use client";
import WebsiteBreadCrumb from "@/components/Application/Website/WebsiteBreadCrumb";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { WEBSITE_CART, WEBSITE_SHOP } from "@/routes/WebsiteRoutes";
import { Table, Thead, Th, Tbody, Tr, Td } from "react-super-responsive-table";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import image_placeholder from "@/public/assets/images/img-placeholder.webp";
import { HiMinus, HiPlus } from "react-icons/hi";
import { decrementQty, incrementQty, removeProduct } from "@/slices/cart";
const breadCrumbData = {
  title: "Cart",
  data: [
    {
      title: "Cart",
      url: WEBSITE_CART,
    },
  ],
};
const page = () => {
  const cart = useSelector((state: any) => state.cart);
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (cart.products.length > 0) {
      const totalPrice = cart.products.reduce(
        (acc: number, product: Record<string, any>) =>
          acc + (product.qty*product.sellingPrice),
        0
      );
      setSubTotal(totalPrice);

      const totalDiscount = cart.products.reduce(
        (acc: number, product: Record<string, any>) =>
          acc + ((product.qty*product.mrp) - (product.qty*product.sellingPrice)),
        0
      );

      setDiscount(totalDiscount);
    } else {
      setSubTotal(0);
      setDiscount(0);
    }
  }, [cart]);

  useEffect(() => {
    setIsMuted(true);
  }, []);

  return (
    <div>
      <section>
        <WebsiteBreadCrumb {...breadCrumbData} />
      </section>

      {cart.products.length === 0 ? (
        <div className=" w-screen h-screen flex flex-col justify-center items-center gap-4 ">
          <div className=" text-2xl font-semibold">Your cart is empty!</div>
          <Button asChild>
            <Link href={WEBSITE_SHOP}>Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <section className=" w-full lg:px-32 md:px-24 px-4 py-20 flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-4">
          <Table className=" border-[1px] border-border rounded-sm">
            <Thead>
              <Tr className=" font-semibold bg-muted">
                <Th className="text-start py-2 pl-2">Product</Th>
                <Th className="text-start">Price</Th>
                <Th className="text-start">Quantity</Th>
                <Th className="text-start">Total</Th>
                <Th className="text-start">Action</Th>
              </Tr>
            </Thead>

            <Tbody>
              {cart.products.map((product: Record<string, any>, index: any) => (
                <Tr key={index}>
                  <Td className=" py-2 pl-2">
                    <div className=" w-fit flex items-center gap-2">
                      <Image
                        src={product.picture || image_placeholder}
                        width={60}
                        height={60}
                        alt={product.name}
                      />

                      <div>
                        <div className=" font-semibold">{product.name}</div>
                        <div>Color : {product.color}</div>
                        <div>Size : {product.size}</div>
                      </div>
                    </div>
                  </Td>

                  <Td>
                    {parseInt(product.sellingPrice).toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </Td>

                  <Td>
                    <div className=" border-border border-[1px] w-fit py-1 px-4 rounded-2xl flex gap-6">
                      <button
                        className=" text-muted-foreground hover:cursor-pointer"
                        onClick={() =>
                          dispatch(
                            decrementQty({
                              productId: product.productId,
                              variantId: product.variantId,
                            })
                          )
                        }
                      >
                        <HiMinus />
                      </button>
                      <div>{product.qty}</div>
                      <button
                        className=" text-muted-foreground hover:cursor-pointer"
                        onClick={() =>
                          dispatch(
                            incrementQty({
                              productId: product.productId,
                              variantId: product.variantId,
                            })
                          )
                        }
                      >
                        <HiPlus />
                      </button>
                    </div>
                  </Td>

                  <Td>
                    {(
                      parseInt(product.qty) * parseInt(product.sellingPrice)
                    ).toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </Td>
                  <Td>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        dispatch(
                          removeProduct({
                            productId: product.productId,
                            variantId: product.variantId,
                          })
                        )
                      }
                    >
                      Remove
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <div className=" p-4 flex flex-col gap-4 bg-muted w-full lg:w-[40%]">
            <div className="mt-2 text-2xl font-semibold">Order Summary</div>
            <div className=" flex items-center justify-between">
              <div className=" font-semibold">SubTotal</div>
              <div>
                {subTotal.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </div>
            </div>
            <div className=" flex items-center justify-between">
              <div className=" font-semibold">Discount</div>
              <div>
                {"-"}
                {discount.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </div>
            </div>

            <button className=" w-full bg-foreground text-white dark:text-black rounded-2xl py-1 mt-4 transition-all duration-200 hover:bg-primary hover:cursor-pointer ">
              Proceed to Checkout
            </button>

            <Button variant="outline" asChild>
              <Link href={WEBSITE_SHOP}>Continue Shopping</Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default page;
