"use client";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CardContent } from "@/components/ui/card";
import useFetch from "@/hooks/useFetch";

export const description = "A donut chart with text";

const statusStage = [
  { status: "Pending", orders: 0, fill: "#3b82f6" },
  { status: "Processing", orders: 0, fill: "#eab308" },
  { status: "Shipped", orders: 0, fill: "#06b6d4" },
  { status: "Delivered", orders: 0, fill: "#22c55e" },
  { status: "Cancelled", orders: 0, fill: "#ef4444" },
  { status: "Unverified", orders: 0, fill: "#f97316" },
];

const chartConfig = {
  Pending: {
    label: "Pending",
    color: "#3b82f6",
  },
  Processing: {
    label: "Processing",
    color: "#eab308",
  },
  Shipped: {
    label: "Shipped",
    color: "#06b6d4",
  },
  Delivered: {
    label: "Delivered",
    color: "#22c55e",
  },
  Cancelled: {
    label: "Cancelled",
    color: "#ef4444",
  },
  Unverified: {
    label: "Unverified",
    color: "#f97316",
  },
} satisfies ChartConfig;

export function OrderPieChart() {
  const { file } = useFetch({ url: "/api/dashboard/admin/get-pie-chart-data" });
  const [chartData, setChartData] = React.useState<
    Array<{ status: string; orders: number; fill: string }>
  >([]);
  const [response, setResponse] = React.useState<
    Array<{ status: string; orders: number }>
  >([]);
  const [totalOrders, setTotalOrders] = React.useState<number>(0);
  React.useEffect(() => {
    if (file && file.success) setResponse(file.data);
  }, [file]);

  React.useEffect(() => {
    if (response.length > 0) {
      const statusData = statusStage.map((stage) => {
        const data = response.filter((item) => item.status === stage.status);

        if (data.length > 0)
          return {
            status: stage.status,
            orders: data[0].orders,
            fill: stage.fill,
          };
        else return stage;
      });
      setChartData(statusData);

      const total = response.reduce((acc, curr) => acc + curr.orders, 0);

      setTotalOrders(total);
    }
  }, [response]);

  return (
    <CardContent>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="orders"
            nameKey="status"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalOrders.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Orders
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <div>
        <ul className=" text-sm flex flex-col gap-2">
          {chartData.map((item, index) => (
            <li
              key={index}
              className=" flex items-center w-full justify-between"
            >
              <div>{item.status}</div>
              <div
                style={{ background: item.fill }}
                className={`w-6 h-6 flex items-center justify-center rounded-full text-white`}
              >
                {item.orders}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </CardContent>
  );
}
