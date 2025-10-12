import toastFunction from "@/lib/toastFunction";
import { WEBSITE_ORDER_DETAIL } from "@/routes/WebsiteRoutes";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const UserOrderTable = ({ limit, email }: { limit?: number; email?: string }) => {
  const [orders, setOrders] = useState<Array<Record<string, any>>>([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data: response } = await axios.get(
          `/api/user/get-orders?limit=${limit}&email=${email}`
        );

        if (!response.success) throw new Error(response.message);

        setOrders(response.data);
      } catch (error: any) {
        toastFunction({ type: "error", message: error.message });
      }
    }

    if (email) fetchOrders();
  }, [email]);

  console.log(orders);

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
              <td>{parseInt(order?.total).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default UserOrderTable;
