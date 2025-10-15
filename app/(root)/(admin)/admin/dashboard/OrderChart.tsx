"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";

export const description = "A bar chart";

const monthData = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const chartConfig = {
  orders: {
    label: "Orders",
    color: "#8e51ff",
  },
} satisfies ChartConfig;
interface IOrderData {
  _id: {
    year: number;
    month: number;
  };
  count: number;
}
export function OrderBarChart() {
  const [response, setResponse] = useState<Array<IOrderData>>([]);
  const { file } = useFetch({ url: "/api/dashboard/admin/get-order-data" });
  const [chartData, setChartData] = useState<
    Array<{ month: string; orders: number }>
  >([]);

  useEffect(() => {
    if (file && file.success) setResponse(file.data);
  }, [file]);

  useEffect(() => {
    if (response.length > 0) {
      const year = new Date().getFullYear();

      const currentYearData = response.filter(
        (order) => order._id.year === year
      );

      const orders = monthData.flatMap((month, index) => {
        const data = currentYearData.filter(
          (order) => order._id.month == index + 1
        );

        if (data.length > 0) {
          return {
            month: month,
            orders: data[0].count,
          };
        } else {
          return {
            month: month,
            orders: 0,
          };
        }
      });

      setChartData(orders);
    }
  }, [response]);

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
        <Bar dataKey="orders" fill="#8e51ff" radius={8} />
      </BarChart>
    </ChartContainer>
  );
}
