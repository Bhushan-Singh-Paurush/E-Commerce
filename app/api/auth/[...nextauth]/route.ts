import { nextOptions } from "@/lib/authOptions";
import NextAuth from "next-auth";

export const handler= NextAuth(nextOptions)


export {handler as GET , handler as POST}
