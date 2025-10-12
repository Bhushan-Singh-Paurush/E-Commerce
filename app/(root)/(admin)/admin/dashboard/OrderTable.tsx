"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useFetch from "@/hooks/useFetch";
import StatusComp from "@/components/Application/Admin/StatusComp";

const OrderTable = () => {
  const { file } = useFetch({ url: "/api/dashboard/admin/get-latest-order" });
  const [response, setResponse] = useState<Array<Record<string, any>>>([]);
  useEffect(() => {
    if (file && file.success) setResponse(file.data);
  }, [file]);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order Id</TableHead>
          <TableHead>Payment Id</TableHead>
          <TableHead>Total Item</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {response.length > 0 &&
          response.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item?.order_id}</TableCell>
              <TableCell>{item?.payment_id}</TableCell>
              <TableCell>{item?.totalItem}</TableCell>
              <TableCell><StatusComp status={item?.status}/></TableCell>
              <TableCell>{parseInt(item?.total).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default OrderTable;
