import { NextRequest, NextResponse } from "next/server";
import { WEBSITE_LOGIN } from "./routes/WebsiteRoutes";
import { getToken } from "next-auth/jwt";
import { ADMIN_DASHBOARD } from "./routes/AdminPanelRoutes";
import { USER_DASHBOARD } from "./routes/UserRoutes";

export async function middleware(request:NextRequest) {
    try {
        const token=await getToken({req:request})
       
        const pathName=request.nextUrl.pathname
        if(!token)
        {
            if(!pathName.startsWith("/auth"))
                return NextResponse.redirect(new URL(WEBSITE_LOGIN,request.nextUrl))
        }
        else
        {
            if(pathName.startsWith("/auth"))
                return NextResponse.redirect(new URL(token.role=="admin" ? ADMIN_DASHBOARD : USER_DASHBOARD ,request.nextUrl))
            
            else if(pathName.startsWith("/admin") && token.role!=="admin")
                return NextResponse.redirect(new URL(WEBSITE_LOGIN,request.nextUrl))
            
            else if(pathName.startsWith("/my-account") &&  token.role!=="user")
                return NextResponse.redirect(new URL(WEBSITE_LOGIN,request.nextUrl))
        }
    
        return NextResponse.next()
    } catch (error) {
        console.log(error)
        return NextResponse.redirect(new URL(WEBSITE_LOGIN,request.nextUrl))
    }
}

export const config = {
  matcher: ['/admin/:path*','/my-account/:path*','/auth/:path*']
}