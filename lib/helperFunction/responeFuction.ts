import { NextResponse } from "next/server";

type ResponesProps = {
  success: boolean;
  status: number;
  message?: string;
  data?: Record<string, any>;
};

export const response = ({
  success,
  status,
  message,
  data = {},
}: ResponesProps) => {
  return NextResponse.json({
    success,
    status,
    message,
    data,
  });
};

export const catchError = ({error,customMessage}: {error: any,customMessage?: string}) => {
  let message: string;
  if(error.code===11000 && error.keyPattern)
  {
    const key=Object.keys(error.keyPattern).join(", ")
    message=`These are duplicate fields ${key}`
    error.code=400
  }
  else if (process.env.NODE_ENV == "development") {
    message = error.message || "Internal server error";
  } 
  else 
    message = customMessage || "Internal server error";

 return response({
  success:false,
  status:error.code || 500,
  message:message
 });
};
