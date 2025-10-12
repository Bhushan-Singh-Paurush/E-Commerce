import { connection } from "@/lib/DB_Connection";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Product from "@/models/product.model";
import Review from "@/models/review.model";
import Variant from "@/models/variant.model";
import { NextRequest } from "next/server";

export async function GET(request:NextRequest,{params}:{params:any})
{
          try {
            
              const getParams=await params
              const slug=getParams.slug

              if(!slug)
                return response({success:false,status:400,message:"slug not found"})
              
              
              const searchParams=request.nextUrl.searchParams

              const color=searchParams.get("color")

              const size=searchParams.get("size")

              let productFilter:{slug:string,deletedAt:Date | null}

              productFilter={
                  slug:slug,
                  deletedAt:null
              }
              
          
              await connection()
              
              const product=await Product.findOne(productFilter)
              
              if(!product)
                return response({success:false,status:404,message:"Product Not Found"})

              
              let sizes=await Variant.aggregate([
                    {
                        $match:{product:product._id,color:color}
                    },
                    {
                        $sort:{_id:1}
                    },
                    {
                        $group:{
                            _id:"$size",
                            first:{$first:"$_id"}
                        },
                       
                    },
                    {
                            $sort:{first:1}
                    },
                     {
                     $project:{_id:0,size:"$_id"}
                     }
              ])
              
              sizes=sizes.length>0 ? sizes.map((item)=>item.size) : []
              
              let variantFilter:Record<string,any>={}

              variantFilter.deletedAt=null
              
              variantFilter.product=product._id
              
              if(color)
              variantFilter.color=color

              if(sizes.includes(size))
                variantFilter.size=size

              
              const variant=await Variant.findOne(variantFilter).populate("media","secure_url _id")               

              const colors=await Variant.distinct("color",{product:product._id})
              

             
              

            const reviewData=await Review.aggregate([
              {
                $match:{product:product._id,deletedAt:null}
              },
              {
                $group:{
                  _id:null,average:{$avg:"$rating"},count:{$sum:1}
                }
              },
              {
                $project:{
                  _id:0,
                  average:1,
                  count:1
                }
              }
            ])

            const review=reviewData?.[0] || {average:0,count:0}

              return response({success:true,status:200,message:"Product Details",data:{
                product,
                variant,
                colors,
                sizes,
                review
              }})

          } catch (error:any) {
            catchError({error})
          }
}