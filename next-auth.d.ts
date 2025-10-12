import { DefaultSession, DefaultUser } from "next-auth";


declare module "next-auth"{
    interface Session{
        user:{
            id:string,
            role:string
        }& DefaultSession["user"]
    } 
}

declare module "next-auth"{
    interface User extends DefaultUser{
        role:"user" | "admin"
    }
}