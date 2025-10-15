import { nextOptions } from "@/lib/authOptions";
import NextAuth from "next-auth";

const handler= NextAuth(nextOptions)


export {handler as GET , handler as POST}
