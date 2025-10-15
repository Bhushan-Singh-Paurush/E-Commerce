"use client";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";
type LoadingPropes = {
  text: string;
  type: "button" | "submit";
  disable: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
function LoadingBtn({
  text,
  type,
  disable,
  onClick,
  className,
  ...props
}: LoadingPropes) {
  return (
    <Button className={cn("",className)} type={type} onClick={onClick} disabled={disable} {...props}>
    {disable && <Loader2Icon className="animate-spin" />} {text}
    </Button>
  );
}

export default LoadingBtn;
