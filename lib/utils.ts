import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sortingData=[
  {
    title:"Default Sorting",
    value:"default"
  },
  {
    title:"Ascending Order",
    value:"asc"
  },
  {
    title:"Descending Order",
    value:"desc"
  },
  {
    title:"Price: Low To High",
    value:"lowToHigh"
  },
  {
    title:"Price: High To Low",
    value:"highToLow"
  }
]
