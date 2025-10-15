import toastFunction from "@/lib/toastFunction";
import { WEBSITE_ORDER_DETAIL } from "@/routes/WebsiteRoutes";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
interface OrderResponse {
  order_id: string;
  total: number;
  items: number;
}
const UserOrderTable = ({
  limit,
  email,
}: {
  limit?: number;
  email?: string;
}) => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data: response } = await axios.get(
          `/api/user/get-orders?limit=${limit}&email=${email}`
        );

        if (!response.success) throw new Error(response.message);

        setOrders(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toastFunction({ type: "error", message: error.message });
        } else {
          toastFunction({
            type: "error",
            message: "An unknown error occurred",
          });
        }
      }
    }

    if (email) fetchOrders();
  }, [email, limit]);

  return (
    <table className=" max-h-screen overflow-auto text-muted-foreground border-separate border-spacing-y-2">
      <thead>
        <tr>
          <th className=" text-start">Sr.No</th>
          <th className=" text-start">Order id</th>
          <th className="  text-start">Total Items</th>
          <th className="  text-start">Amount</th>
        </tr>
      </thead>
      <tbody>
        {orders.length > 0 &&
          orders.map((order, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <Link
                  href={WEBSITE_ORDER_DETAIL(order?.order_id)}
                  className=" underline hover:text-primary transition-all duration-200"
                >
                  {order?.order_id}
                </Link>
              </td>
              <td>{order?.items}</td>
              <td>
                {order?.total.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default UserOrderTable;
