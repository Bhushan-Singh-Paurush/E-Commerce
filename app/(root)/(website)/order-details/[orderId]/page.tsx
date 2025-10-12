import WebsiteBreadCrumb from "@/components/Application/Website/WebsiteBreadCrumb";
import axios from "axios";
import React from "react";
import Image from "next/image";
import image_placeholder from "@/public/assets/images/img-placeholder.webp";
import Link from "next/link";
import { WEBSITE_PRODUCT_DETAILS } from "@/routes/WebsiteRoutes";
const breadCrumbData = {
  title: "Order Detail",
  data: [
    {
      title: "Order Detail",
      url: "",
    },
  ],
};
const OrderDetails = async ({ params }: { params: any }) => {
  const getParams = await params;

  const order_id = getParams.orderId;

  const { data: response } = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/api/order/get/${order_id}`
  );

  console.log(response);

  if (!response.success)
    return (
      <div className=" w-full h-screen flex items-center justify-center">
        Order Detail not found
      </div>
    );
  else
    return (
      <div>
        <section>
          <WebsiteBreadCrumb {...breadCrumbData} />
        </section>

        {response.success && (
          <section>
            <div className=" py-10 lg:px-32 md:24 px-4 flex flex-col gap-8">
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
                            <Link href={WEBSITE_PRODUCT_DETAILS(product?.slug)}>
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

              <div className=" w-full flex flex-col md:flex-row items-start border-[1px] border-border bg-muted">

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
                      <th className=" text-start font-semibold">Order Summary</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className=" font-semibold">SubTotal</td>
                      <td>{parseInt(response?.data?.subTotal).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td>
                    </tr>
                    <tr>
                      <td className=" font-semibold">Discount</td>
                      <td>{parseInt(response?.data?.discount).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td>
                    </tr>
                    <tr>
                      <td className=" font-semibold">Coupon Discount</td>
                      <td>{parseInt(response?.data?.couponDiscount).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td>
                    </tr>
                    <tr>
                      <td className=" font-semibold">Total</td>
                      <td>{parseInt(response?.data?.total).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td>
                    </tr>
                   
                  </tbody>
                </table>
               
              </div>
            </div>
          </section>
        )}
      </div>
    );
};

export default OrderDetails;
