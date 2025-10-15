import React, { useEffect, useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { removeProduct } from "@/slices/cart";
import Link from "next/link";
import { WEBSITE_CART, WEBSITE_CHECKOUT } from "@/routes/WebsiteRoutes";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { Product } from "@/app/api/checkout/verify-cart/route";
const Cart = () => {
  const cart = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  useEffect(() => {
    if (cart.products.length > 0) {
      const totalPrice = cart.products.reduce(
        (acc: number, product:{sellingPrice:number}) =>
          acc + product.sellingPrice,
        0
      );
      setSubTotal(totalPrice);

      const totalDiscount = cart.products.reduce(
        (acc: number, product:{mrp:number,sellingPrice:number}) =>
          acc + (product.mrp - product.sellingPrice),
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
    <Sheet>
      <SheetTrigger className=" relative">
        <IoCartOutline />
        {isMuted && cart.count > 0 && (
          <div className="bg-red-600 rounded-full text-white text-xs absolute w-4 h-4 -top-2 -right-2">
            {cart.count}
          </div>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className=" text-2xl font-semibold">My Cart</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <div className=" h-screen flex flex-col justify-between p-1">
          <div className=" h-[calc(100vh-210px)] overflow-auto flex flex-col gap-4">
            {cart && cart.products.length === 0 ? (
              <div className=" w-full text-center">Your Cart Was Empty</div>
            ) : (
              cart.products.map((item: Product, index: number) => (
                <div
                  key={index}
                  className=" flex items-center justify-between p-2 border-b-[1px] border-border"
                >
                  <div className=" flex items-center gap-2">
                    <Image
                      src={item.picture}
                      width={50}
                      height={50}
                      className=" border-[1px] border-border rounded-sm w-[80px] h-[80px]"
                      alt="Img"
                    />
                    <div className=" flex flex-col gap-2">
                      <div>{item.name}</div>
                      <div className=" text-muted-foreground">
                        <span>{item.size}</span>/<span>{item.color}</span>
                      </div>
                    </div>
                  </div>

                  <div className=" flex flex-col gap-2 ">
                    <Button
                      variant="destructive"
                      onClick={() =>
                        dispatch(
                          removeProduct({
                            productId: item.productId,
                            variantId: item.variantId,
                          })
                        )
                      }
                    >
                      Remove
                    </Button>
                    <div>
                      <span>{item.qty} </span>X
                      <span>
                        {" "}
                        {item.sellingPrice.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="w-full p-2 flex flex-col gap-2 border-t-[1px] border-border">
            <div className="w-full flex items-center justify-between font-semibold">
              <div>Sub-Total</div>
              <div>
                {subTotal.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </div>
            </div>
            <div className="w-full flex items-center justify-between font-semibold">
              <div>Discount</div>
              <div>
                {discount.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </div>
            </div>

            <div className="w-full flex items-center justify-between font-semibold">
              <Button variant="secondary" asChild>
                <Link href={WEBSITE_CART}>View Cart</Link>
              </Button>
              <Button asChild>
                <Link href={WEBSITE_CHECKOUT}>View Checkout</Link>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
