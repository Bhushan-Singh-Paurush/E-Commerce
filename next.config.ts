import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images:{
      remotePatterns:[
        {
          protocol:'https',
          port:'',
          hostname:'res.cloudinary.com',
          pathname:'/**',
          search:'' 
        },
        {
           protocol:'https',
          port:'',
          hostname:'lh3.googleusercontent.com',
          pathname:'/**',
          search:''
        }
      ]
 }
};

export default nextConfig;
