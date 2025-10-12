"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import image_placeholder from "@/public/assets/images/img-placeholder.webp";
import Link from "next/link";
import { WEBSITE_PRODUCT_DETAILS } from "@/routes/WebsiteRoutes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toastFunction from "@/lib/toastFunction";
import { useParams } from "next/navigation";
import LoadingBtn from "@/components/Application/LoadingBtn";

const OrderDetails = () => {
  const getParams = useParams();
  const order_id=getParams.orderId
  const [status, setStatus] = useState<string>("");
  const [response, setResponse] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const { data: result } = await axios.get(
          `/api/order/get/${order_id}`
        );
        if (!result.success) throw new Error(response.message);

        setResponse(result);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  async function statusHandler() {
    if (!status) toastFunction({ type: "error", message: "No change found" });
    try {
      setLoading(true);
      const { data: response } = await axios.put("/api/order/update", {
        status,order_id
      });

      if (!response.success) throw new Error(response.message);

      toastFunction({ type: "success", message: response.message });

      response.data.status = status;
    } catch (error: any) {
      toastFunction({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }
  if (Object.keys(response).length===0)
    return (
      <div className=" w-full h-screen flex items-center justify-center">
        Order Detail not found
      </div>
    );
  else
    return (
      <div className=" pt-20 p-8">
        <Card>
          <CardHeader className=" border-b-[1px] border-border">
            <CardTitle className=" text-2xl font-semibold">
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {" "}
            {response.success && (
              <section>
                <div className="flex flex-col gap-8">
                  {/* order */}
                  <div>
                    <div>
                      <span className=" font-semibold">Order Id</span> :{" "}
                      <span>{response?.data?.order_id}</span>
                    </div>
                    <div>
                      <span className=" font-semibold">transaction Id</span> :{" "}
                      <span>{response?.data?.payment_id}</span>
                    </div>
                    <div>
                      <span className=" font-semibold">Status</span> :{" "}
                      <span>{response?.data?.status}</span>
                    </div>
                  </div>
                  <table className="border-separate border-spacing-y-4">
                    <thead className=" bg-muted p-0 m-0">
                      <tr>
                        <th className=" text-start py-2 pl-2">Product</th>
                        <th className=" text-start">Price</th>
                        <th className=" text-start">Quantity</th>
                        <th className=" text-start">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {response?.data?.products?.map(
                        (product: Record<string, any>, index: any) => (
                          <tr key={index}>
                            <td className=" flex items-center gap-2 pl-2">
                              <Image
                                src={product?.picture || image_placeholder}
                                width={50}
                                height={50}
                                alt="Img"
                              />
                              <div>
                                <Link
                                  href={WEBSITE_PRODUCT_DETAILS(product?.slug)}
                                >
                                  {product?.name.slice(0, 12)}
                                  {product?.name?.length > 12 ? "..." : ""}
                                </Link>

                                <div>
                                  <span>{product?.size}</span>/
                                  <span>{product?.color}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              {parseInt(product?.sellingPrice).toLocaleString(
                                "en-IN",
                                {
                                  style: "currency",
                                  currency: "INR",
                                }
                              )}
                            </td>
                            <td>{product?.qty}</td>
                            <td>
                              {(
                                product?.qty * product?.sellingPrice
                              ).toLocaleString("en-IN", {
                                style: "currency",
                                currency: "INR",
                              })}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>

                  <div className=" w-full flex items-start border-[1px] border-border bg-muted">
                    <table className=" bg-background w-full border-separate border-spacing-y-4  px-4">
                      <thead>
                        <tr>
                          <th className=" font-semibold">Shipping Address</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className=" font-semibold">Name</td>
                          <td>{response?.data?.name}</td>
                        </tr>
                        <tr>
                          <td className=" font-semibold">Email</td>
                          <td>{response?.data?.email}</td>
                        </tr>
                        <tr>
                          <td className=" font-semibold">Phone</td>
                          <td>{response?.data?.phone}</td>
                        </tr>
                        <tr>
                          <td className=" font-semibold">Country</td>
                          <td>{response?.data?.country}</td>
                        </tr>
                        <tr>
                          <td className=" font-semibold">State</td>
                          <td>{response?.data?.state}</td>
                        </tr>
                        <tr>
                          <td className=" font-semibold">City</td>
                          <td>{response?.data?.city}</td>
                        </tr>
                        <tr>
                          <td className=" font-semibold">Pin Code</td>
                          <td>{response?.data?.pinCode}</td>
                        </tr>
                        <tr>
                          <td className=" font-semibold">Land Mark</td>
                          <td>{response?.data?.landMark}</td>
                        </tr>
                        <tr>
                          <td className=" font-semibold">Order Note</td>
                          <td>{response?.data?.orderNote || "---"}</td>
                        </tr>
                      </tbody>
                    </table>

                    <table className=" w-full border-separate border-spacing-y-4  px-4">
                      <thead>
                        <tr>
                          <th className=" text-start font-semibold">
                            Order Summary
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className=" font-semibold">SubTotal</td>
                          <td>
                            {parseInt(response?.data?.subTotal).toLocaleString(
                              "en-IN",
                              { style: "currency", currency: "INR" }
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className=" font-semibold">Discount</td>
                          <td>
                            {parseInt(response?.data?.discount).toLocaleString(
                              "en-IN",
                              { style: "currency", currency: "INR" }
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className=" font-semibold">Coupon Discount</td>
                          <td>
                            {parseInt(
                              response?.data?.couponDiscount
                            ).toLocaleString("en-IN", {
                              style: "currency",
                              currency: "INR",
                            })}
                          </td>
                        </tr>
                        <tr>
                          <td className=" font-semibold">Total</td>
                          <td>
                            {parseInt(response?.data?.total).toLocaleString(
                              "en-IN",
                              { style: "currency", currency: "INR" }
                            )}
                          </td>
                        </tr>

                        <tr className=" border-t-[1px] border-border">
                          <td colSpan={2}>
                            <div className=" w-full flex flex-col gap-4">
                              <div className=" font-semibold">Order Status</div>
                              <Select
                                defaultValue={response?.data?.status}
                                onValueChange={(value) => setStatus(value)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="Processing">
                                    Processing
                                  </SelectItem>
                                  <SelectItem value="Shipped">
                                    Shipped
                                  </SelectItem>
                                  <SelectItem value="Delivered">
                                    Delivered
                                  </SelectItem>
                                  <SelectItem value="Cancelled">
                                    Cancelled
                                  </SelectItem>
                                  <SelectItem value="Unverified">
                                    Unverified
                                  </SelectItem>
                                </SelectContent>
                              </Select>

                              <LoadingBtn
                                text="Save Status"
                                disable={loading}
                                type="button"
                                onClick={statusHandler}
                                className=" w-fit"
                              />
                            </div>
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}
          </CardContent>
        </Card>
      </div>
    );
};

export default OrderDetails;
