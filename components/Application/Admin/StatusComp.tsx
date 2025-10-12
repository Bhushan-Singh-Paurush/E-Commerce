import React from 'react'
const statusStage = [
  { status: "Pending", fill: "#3b82f6" },
  { status: "Processing", fill: "#eab308" },
  { status: "Shipped", fill: "#06b6d4" },
  { status: "Delivered", fill: "#22c55e" },
  { status: "Cancelled", fill: "#ef4444" },
  { status: "Unverified", fill: "#f97316" },
];
const StatusComp = ({status}:{status:string}) => {
  const data=statusStage.filter((ele)=>ele.status===status)
  const color=data[0].fill
  return (
    <div className={` rounded-2xl text-white flex items-center justify-center`}  style={{ backgroundColor: color }}>{status}</div>
  )
}

export default StatusComp